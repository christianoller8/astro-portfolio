import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// The heavy part (three + rapier + R3F) lives in its own chunk, fetched only when needed.
const LanyardScene = lazy(() => import('./LanyardScene'));

interface LanyardProps {
  name: string;
  role: string;
  site: string;
  status: string;
  photoUrl: string;
}

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Decorative 3D lanyard. Renders nothing (so the static hero image stays) when the user prefers
 * reduced motion or WebGL is unavailable. The 3D chunk is only requested once the container is
 * close to the viewport, and the render loop is paused while it is offscreen or the tab is hidden.
 * The parent element must carry `data-lanyard`; it is set to "ready" once the scene is running.
 */
export default function Lanyard({ name, role, site, status, photoUrl }: LanyardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState(false);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  // The canvas spans the whole viewport width (so the card can be dragged anywhere) while the
  // card stays centered on its hero column: `originX` is that column's center inside the canvas.
  const [frame, setFrame] = useState({ left: 0, width: 0, originX: 0, extra: 0, baseHeight: 0 });

  const setMarker = useCallback((state: 'ready' | 'pending') => {
    document.querySelector('[data-lanyard]')?.setAttribute('data-lanyard', state);
  }, []);

  // Capability check (reduced motion + WebGL), kept live for the motion preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setCapable(!mq.matches && hasWebGL());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const enabled = capable && !failed;

  useEffect(() => {
    const el = rootRef.current;
    const column = el?.closest('[data-lanyard]');
    if (!enabled || !el || !column) return;
    const measure = () => {
      const rect = column.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      // Also reach down to the bottom of the viewport so the card is not cut under the hero
      const extra = Math.max(0, window.innerHeight - (rect.top + window.scrollY) - rect.height);
      setFrame({
        left: -rect.left,
        width,
        originX: rect.left + rect.width / 2,
        extra,
        baseHeight: rect.height,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    observer.observe(document.documentElement);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [enabled]);

  // Lazy load when near the viewport; track precise visibility to pause the loop.
  useEffect(() => {
    const el = rootRef.current;
    if (!enabled || !el) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      {
        rootMargin: '200px',
      },
    );
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    nearObserver.observe(el);
    viewObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [enabled]);

  // Whenever we stop being enabled, restore the static fallback.
  useEffect(() => {
    if (!enabled) setMarker('pending');
    return () => setMarker('pending');
  }, [enabled, setMarker]);

  const handleReady = useCallback(() => setMarker('ready'), [setMarker]);
  const handleFail = useCallback(() => setFailed(true), []);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        bottom: -frame.extra,
        left: frame.left,
        width: frame.width || '100%',
        overflow: 'hidden',
        touchAction: 'pan-y',
      }}
    >
      {near && frame.width > 0 && (
        <SceneBoundary onError={handleFail}>
          <Suspense fallback={null}>
            <LanyardScene
              content={{ name, role, site, status, photoUrl }}
              active={inView && tabVisible}
              originX={frame.originX}
              baseHeight={frame.baseHeight}
              onReady={handleReady}
              onFail={handleFail}
            />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
