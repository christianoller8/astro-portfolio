# Guía de vídeos para la sección de proyectos

Cómo grabar, editar, exportar e integrar los vídeos de las tarjetas de proyecto del portfolio, al estilo de la sección de proyectos de [poulo.site](https://www.poulo.site/#work).

> Entorno de trabajo: Windows. Herramientas base: OBS Studio o Cap para grabar, ffmpeg para exportar y HyperFrames (opcional) para los vídeos con efecto 3D o motion graphics.

---

## 1. Qué estamos replicando

En cada tarjeta de la referencia **solo el rectángulo interior es vídeo**. El resto es HTML/CSS:

| Elemento | Cómo está hecho |
|---|---|
| Fondo de la tarjeta | Imagen (JPG/WebP) + degradado `from-black/35 to-transparent` |
| Barra de prompt ("Add the fetaUI Toast…") | HTML: un `<p>` con el texto truncado |
| Spinner junto al prompt | SVG girando con CSS (`animate-spin`, 1,8 s), se pausa al pasar el ratón |
| Vídeo | `<video muted loop playsinline preload="none">`. El `src` y el `poster` se añaden con JS cuando la tarjeta entra en pantalla, y el vídeo se pausa al salir |
| Contenedor del vídeo | `aspect-ratio` fijo + `object-fit: cover` + esquinas redondeadas |

**Consecuencia:** el vídeo no lleva fondo, ni prompt, ni marco. Solo la grabación de la app.

Datos de los vídeos de la referencia: MP4 sin audio, de 5 a 35 s, de 0,75 a 4,5 MB, entre 1280×720 y 1920×1200. El de fetaUI (1534×966) se exportó exactamente a la proporción del contenedor (511/322) para que no se recortara nada.

---

## 2. Especificaciones de nuestros vídeos

| Parámetro | Valor |
|---|---|
| Proporción | **La del contenedor.** Por defecto 16:10 |
| Resolución de exportación | 1600×1000 (16:10) o 1920×1080 (16:9) |
| Grabación | 60 fps, a la mayor resolución posible |
| Exportación | 30 fps (60 si hay mucha animación) |
| Duración | 8–30 s (estilos C y D: 6–10 s) |
| Peso | ≤ 4 MB por vídeo (ideal 1–3 MB) |
| Formato | MP4, H.264, `yuv420p`, `+faststart`, **sin pista de audio** |
| Póster | JPG del mismo tamaño, un fotograma representativo |
| Bucle | Que termine donde empieza o con fundido, para que el loop no dé un salto |

### Estructura de carpetas

```
videos-raw/                  ← grabaciones originales (NO se suben al repo)
  <slug>.mp4
public/videos/
  <slug>.mp4                 ← vídeo final optimizado
  posters/
    <slug>.jpg               ← póster
```

Añadir a `.gitignore`:

```gitignore
videos-raw/
```

Convención de nombres: `slug` en minúsculas y con guiones, igual que la ruta del proyecto (p. ej. `mi-app-crm.mp4`).

---

## 3. Los 4 estilos de vídeo

| Estilo | Qué es | Referencia | Herramienta | Dificultad |
|---|---|---|---|---|
| **A. Scroll limpio** | Grabación de la web bajando por secciones y navegando entre páginas. Sin cursor ni barra del navegador | fetaUI | OBS + script de scroll | Baja |
| **B. Walkthrough** | Uso real de la app: escribir, hacer clic, ver el resultado, cambiar de tema… Con zoom y cursor suave | Weldica | Cap o FocuSee | Media |
| **C. Cinemático 3D** | La grabación dentro de un marco inclinado en 3D sobre un degradado, con movimientos de cámara y fundido final | NexScale | HyperFrames / Remotion | Alta |
| **D. Motion graphics** | Texto animado + ventanas de la app en 3D + cierre con logo | QPage | HyperFrames / Remotion | Alta |

**Recomendación:** empezar con A o B en todos los proyectos y reservar C/D para uno o dos destacados.

---

## 4. Herramientas (Windows)

| Herramienta | Para qué | Coste (nov. 2026) |
|---|---|---|
| **OBS Studio** | Grabación limpia (estilo A) | Gratis |
| **Cap** (cap.so) | Grabación con zoom automático y cursor suave (estilo B). Código abierto | Gratis para uso personal. **Uso comercial: Desktop License 29 $/año.** Un portfolio con el que buscas clientes probablemente cuenta como comercial |
| **FocuSee** | Alternativa a Cap con auto-zoom, Win/Mac | 19,99 $/mes o 69,99 $ en pago único |
| **HyperFrames** | Estilos C y D con HTML/CSS/GSAP → MP4. Apache 2.0, uso comercial libre | Gratis |
| **Remotion** | Igual que HyperFrames pero con React | Gratis para personas y empresas de hasta 3 personas |
| **DaVinci Resolve** | Editor visual si se prefiere no usar código | Gratis |
| **ffmpeg** | Recorte, aceleración, exportación final y pósters | Gratis |

Instalar ffmpeg:

```powershell
winget install Gyan.FFmpeg
# o, con scoop:
scoop install ffmpeg
```

> Screen Studio (la referencia del sector para este tipo de vídeos) solo existe para macOS.

---

## 5. Antes de grabar (checklist)

- [ ] **Proporción decidida** y ventana del navegador ajustada a ella (ver 5.1).
- [ ] **Interfaz ampliada al 125–150 %.** En la tarjeta el vídeo se verá a unos 500 px de ancho, unas 3 veces más pequeño que la grabación. Si no se amplía, los textos no se leen.
- [ ] **Datos de demo realistas y bonitos** (nombres, cifras, gráficas con contenido). Nada de "test", "asdf" ni tablas vacías.
- [ ] **Nada sensible:** sin emails reales, claves de API, tokens ni datos de clientes.
- [ ] **Notificaciones desactivadas** (Windows: activar "No molestar").
- [ ] Navegador con un **perfil limpio**: sin barra de marcadores ni iconos de extensiones.
- [ ] **Tema (claro/oscuro) coherente** con el diseño de la web.
- [ ] **Guion escrito** (sección 10) y ensayado un par de veces.
- [ ] Estado inicial preparado: la app abierta exactamente donde empieza el vídeo.

### 5.1 Ajustar el tamaño de la ventana

Opción 1, DevTools (la más precisa):
1. `F12` → icono de dispositivo (`Ctrl+Shift+M`) → **Dimensiones: Edit…** → añadir un dispositivo a medida, p. ej. `1600 × 1000`, DPR 1 o 2.
2. En OBS, recortar la captura para quedarse solo con el viewport.

Opción 2, ventana tipo app sin barra de direcciones:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000 --window-size=1600,1040 --user-data-dir="$env:TEMP\chrome-demo"
```

(La altura incluye la barra de título: se recorta en OBS.)

Opción 3: pantalla completa con `F11` en un monitor 1920×1080 si el vídeo es 16:9.

---

## 6. Grabar

### Estilo A: scroll limpio con OBS

**Configuración de OBS:**
- *Ajustes → Vídeo:* resolución base y de salida = tamaño de la grabación (p. ej. 1600×1000). FPS: 60.
- *Ajustes → Salida → Grabación:* formato **MKV** (luego *Archivo → Remux* a MP4); codificador por hardware (NVENC/AMF/QuickSync) o x264; control de calidad CQP/CRF **16–18** (grabación de alta calidad, se comprime después).
- *Fuente:* **Captura de ventana** del navegador, con **"Capturar cursor" desactivado**. Recortar con `Alt` + arrastrar, o con el filtro *Recortar/Rellenar*.

**Scroll suave a velocidad constante.** Hacer scroll con la rueda del ratón queda a tirones. Pega esto en la consola de DevTools, empieza a grabar y pulsa `Enter`:

```js
// Scroll suave de arriba abajo. speed = píxeles por segundo
(async (speed = 500) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  let last = performance.now();
  while (scrollY < max - 1) {
    await new Promise(requestAnimationFrame);
    const now = performance.now();
    scrollBy({ top: (speed * (now - last)) / 1000, behavior: 'instant' });
    last = now;
  }
})();
```

Para hacer pausas en secciones concretas, graba varios tramos y júntalos en la edición.

### Estilo B: walkthrough con Cap o FocuSee

1. Modo de grabación de ventana o área, a 60 fps (Cap: **Studio Mode**, que graba en local y permite editar después).
2. **Zoom automático en clics** activado. Después se revisa cada zoom en el editor y se quitan los que sobran.
3. Cursor: tamaño grande y suavizado activado. Clics con un efecto discreto.
4. Moverse **despacio y con intención**: llevar el ratón al botón, esperar medio segundo y hacer clic. Escribir a velocidad normal (o pegar el texto y acelerarlo en la edición).
5. Fondo y marco del editor: **desactivados o transparentes.** El fondo lo pone la tarjeta en HTML.

### Estilos C y D: ver sección 9

Se graba primero un clip limpio (estilo A o B) y después se compone encima.

---

## 7. Editar

Objetivo: un vídeo corto, sin tiempos muertos y que haga bucle sin saltos.

- **Recortar** el principio y el final, y quitar las esperas (cargas, pensar dónde hacer clic).
- **Acelerar 1,5–2×** los scrolls largos, las cargas y la escritura lenta.
- **Bucle:** terminar en la misma pantalla en la que empieza o añadir un fundido de 0,3–0,5 s al principio y al final.
- **Sin audio.** El vídeo se reproduce silenciado.

Con ffmpeg, para lo básico:

```bash
# Recortar del segundo 2 al 20 (con -c copy corta en fotogramas clave; quítalo si necesitas precisión)
ffmpeg -ss 2 -to 20 -i videos-raw/app.mp4 -c copy videos-raw/app-recortado.mp4

# Acelerar 2× todo el clip
ffmpeg -i videos-raw/app.mp4 -vf "setpts=0.5*PTS" -an videos-raw/app-2x.mp4

# Unir varios tramos (lista.txt con líneas: file 'tramo1.mp4')
ffmpeg -f concat -safe 0 -i lista.txt -c copy videos-raw/app-unido.mp4

# Fundido de entrada y salida (clip de 18 s → la salida empieza en 17.6)
ffmpeg -i videos-raw/app.mp4 -vf "fade=t=in:st=0:d=0.4,fade=t=out:st=17.6:d=0.4" -an videos-raw/app-fade.mp4
```

Para una edición más fina (rampas de velocidad, fundidos cruzados), usa el editor de Cap/FocuSee o DaVinci Resolve.

---

## 8. Exportar para la web

### Un vídeo

```bash
# Vídeo final: 1600 de ancho, 30 fps, H.264, sin audio, faststart
ffmpeg -y -i videos-raw/<slug>.mp4 \
  -vf "scale=1600:-2,fps=30" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
  -movflags +faststart -an public/videos/<slug>.mp4

# Póster (fotograma del segundo 0.5)
ffmpeg -y -ss 0.5 -i public/videos/<slug>.mp4 -frames:v 1 -q:v 3 public/videos/posters/<slug>.jpg
```

Si la grabación no tiene exactamente la proporción del contenedor, **escala y recorta** a la medida exacta:

```bash
-vf "scale=1600:1000:force_original_aspect_ratio=increase,crop=1600:1000,fps=30"
```

### Todos a la vez (PowerShell)

```powershell
New-Item -ItemType Directory -Force public/videos/posters | Out-Null
Get-ChildItem .\videos-raw\*.mp4 | ForEach-Object {
  $out = "public/videos/$($_.BaseName).mp4"
  ffmpeg -y -i $_.FullName -vf "scale=1600:-2,fps=30" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an $out
  ffmpeg -y -ss 0.5 -i $out -frames:v 1 -q:v 3 "public/videos/posters/$($_.BaseName).jpg"
}
```

### Comprobar duración y peso

```bash
ffprobe -v error -show_entries format=duration,size -of default=nw=1 public/videos/<slug>.mp4
```

**Si pesa más de 4 MB**, por orden: subir `-crf` a 28–30 → bajar a 1280 de ancho → recortar duración.

### (Opcional) WebM además del MP4

```bash
ffmpeg -y -i videos-raw/<slug>.mp4 -vf "scale=1600:-2,fps=30" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an public/videos/<slug>.webm
```

---

## 9. Estilos C y D con HyperFrames

HyperFrames convierte una página HTML (CSS + GSAP + vídeos) en un MP4. Requisitos: **Node ≥ 22 y ffmpeg**.

```bash
npx hyperframes init video-<slug>
cd video-<slug>
npx hyperframes preview      # vista previa con recarga en vivo
npx hyperframes render       # exporta a MP4
```

Lo más cómodo es que lo monte un agente de código con las skills de HyperFrames instaladas (`npx skills add heygen-com/hyperframes`), pasándole un encargo concreto.

### Prompt plantilla: estilo C (cinemático 3D, tipo NexScale)

```text
Crea una composición HyperFrames de 1600×1000, 30 fps, 8 segundos.
- Fondo: degradado radial de <color oscuro> a <color de marca>, con un grano sutil.
- Usa el clip videos-raw/<slug>.mp4 dentro de un marco con esquinas redondeadas de 20 px y sombra suave.
- 0–1,5 s: el marco entra inclinado en 3D (perspective 1600px, rotateX 14°, rotateY -20°, scale 0.85) y se endereza con ease-out.
- 1,5–5 s: movimiento de cámara lento; zoom suave a 1.25× sobre <zona/botón> hacia el segundo 3,5.
- 5–7 s: vuelve a inclinarse ligeramente hacia el otro lado.
- 7–8 s: fundido a negro.
Exporta a public/videos/<slug>.mp4 (H.264, sin audio) y genera el póster en public/videos/posters/<slug>.jpg.
```

### Prompt plantilla: estilo D (motion graphics, tipo QPage)

```text
Crea una composición HyperFrames de 1920×1080, 30 fps, 8 segundos, fondo oscuro.
- 4 escenas de 1,5 s, cada una con una palabra grande animada a la izquierda (<funcionalidad 1>, <funcionalidad 2>, <funcionalidad 3>, <funcionalidad 4>)
  y a la derecha una ventana de la app inclinada en 3D con el clip correspondiente (videos-raw/<slug>-1.mp4 … -4.mp4).
- Transiciones entre escenas: deslizamiento + desenfoque breve.
- Cierre de 2 s: fondo claro, logo centrado, eslogan "<eslogan>" y la URL debajo.
Exporta a public/videos/<slug>.mp4 (H.264, sin audio) y el póster.
```

**Alternativa:** Remotion (lo mismo en React) o DaVinci Resolve/Fusion (visual).

---

## 10. Plantilla de guion por proyecto

Copiar este bloque una vez por app:

```markdown
### <Nombre de la app>
- **Slug:** <slug>
- **Estilo:** A / B / C / D
- **Proporción y resolución:** 16:10 · 1600×1000
- **Texto del prompt de la tarjeta:** "<frase que describe lo que pasa en el vídeo>"
- **Duración objetivo:** <n> s
- **Datos de demo:** <qué cuenta o qué dataset usar>
- **Guion:**
  1. 0–3 s · <pantalla inicial y qué se ve>
  2. 3–8 s · <acción principal>
  3. 8–15 s · <resultado / momento "wow">
  4. 15–18 s · <vuelta al estado inicial para el bucle>
- **Estado:** [ ] guion · [ ] grabado · [ ] editado · [ ] exportado · [ ] integrado
```

> Truco: el texto del prompt de la tarjeta funciona mejor si es la petición que "provoca" lo que se ve en el vídeo (p. ej. *"¿Qué clientes no han reservado en 3 semanas?"* → el vídeo muestra esa consulta y su resultado).

### Proyectos

Escrito el 24 nov y corregido el mismo día. **Tempora, Víbora y Learnish son aplicaciones de
escritorio con versión responsive para móvil** (ninguna es una app de móvil); **Vístalo es la web de
la agencia creativa que Christian ha fundado con Eloi Cotonat** (webs, fotos, vídeo y Google para
negocios pequeños). Cada vídeo enseña lo que su caso cuenta: las tres decisiones de diseño de la
página del proyecto. Van en la caja grande de cada proyecto de la página de Proyectos, que mide
16:10 (693 × 433 px en escritorio), y la llenan entera: los cuatro se graban en escritorio a 16:10.

| App | Slug | Formato de grabación | Estilo | Duración | Estado |
|---|---|---|---|---|---|
| Tempora | `tempora` | Escritorio, 1600 × 1000 | B | 12 s | Guion |
| Víbora | `vibora` | Escritorio, 1600 × 1000 | B | 12 s | Guion |
| Learnish | `learnish` | Escritorio, 1600 × 1000 | B | 10 s | Guion |
| Vístalo | `vistalo` | Escritorio, 1600 × 1000 | A | 15 s | Guion |

Estilo B con OBS (gratis) vale: son vídeos de una sola acción, así que basta con mover el ratón
despacio y con intención. Cap añade el zoom automático en los clics, pero para un portfolio con el
que buscas trabajo probablemente cuenta como uso comercial (29 $/año).

**El responsive, aparte.** El vídeo de la caja es el de escritorio. Si se quiere enseñar cómo se
adapta cada app al móvil, mejor un clip corto aparte (5–8 s, la misma acción a 390 px de ancho con el
modo dispositivo de DevTools) para la página del caso, cuando estén los de escritorio.

### Tempora
- **Slug:** `tempora`
- **Estilo:** B (un clic, un resultado)
- **Proporción y resolución:** 16:10 · 1600×1000, interfaz al 125 %
- **Duración objetivo:** 12 s
- **Datos de demo:** un día de un servicio (por ejemplo Urgencias, un jueves): 6–8 personas con
  nombres realistas, turnos de mañana, tarde y noche, alguien fichado ahora mismo y un hueco sin cubrir.
- **Guion:**
  1. 0–2 s · "Turnos de hoy": el día entero en una pantalla, y quién está trabajando ahora (el estado
     con color y con texto).
  2. 2–6 s · El ratón va a **"+ Nuevo turno"**, espera medio segundo y lo pulsa; se elige persona y
     hora para el hueco.
  3. 6–10 s · El turno nuevo aparece en el día con su estado ("Pendiente") y el hueco queda cubierto.
  4. 10–12 s · Pausa sobre el resultado y fundido al estado inicial para el bucle.
- **Estado:** [x] guion · [ ] grabado · [ ] editado · [ ] exportado · [ ] integrado

### Víbora
- **Slug:** `vibora`
- **Estilo:** B
- **Proporción y resolución:** 16:10 · 1600×1000, interfaz al 125 %
- **Duración objetivo:** 12 s
- **Datos de demo:** un club con 3–4 pistas, un jueves por la tarde, más o menos la mitad de las horas
  ocupadas.
- **Guion:**
  1. 0–3 s · Los horarios del día, con lo libre destacado ("Primero, qué está libre").
  2. 3–7 s · Clic en una hora libre y en **"Confirmar"**: la reserva en dos pasos.
  3. 7–10 s · La reserva queda marcada como "Tu reserva" y a la vista ("Tu reserva no se pierde de vista").
  4. 10–12 s · Pausa sobre el resultado y fundido al inicio para el bucle.
- **Estado:** [x] guion · [ ] grabado · [ ] editado · [ ] exportado · [ ] integrado

### Learnish
- **Slug:** `learnish`
- **Estilo:** B
- **Proporción y resolución:** 16:10 · 1600×1000, interfaz al 125 %
- **Duración objetivo:** 10 s
- **Datos de demo:** Lección 12 · Viajes, racha de 9 días, tarjeta 7 de 10.
- **Guion:**
  1. 0–2 s · Una tarjeta con una sola frase ("Una tarjeta, una frase").
  2. 2–5 s · **"Ver respuesta"**: aparece la traducción.
  3. 5–8 s · **"Lo sabía"** ("Tú decides si lo sabías"): el avance pasa a 8 de 10 y se ve la racha
     ("El avance, a la vista").
  4. 8–10 s · Entra la siguiente tarjeta, que sirve de vuelta al bucle.
- **Estado:** [x] guion · [ ] grabado · [ ] editado · [ ] exportado · [ ] integrado

### Vístalo
- **Slug:** `vistalo`
- **Estilo:** A (scroll limpio con OBS y el script de scroll de la sección 6)
- **Proporción y resolución:** 16:10 · 1600×1000
- **Duración objetivo:** 15 s
- **Datos de demo:** la web publicada de la agencia, <https://vistalo-sl.vercel.app/> (aún en
  construcción con Eloi: grabar la versión más reciente).
- **Guion:**
  1. 0–3 s · La portada, con la animación que sale del nombre ("Todo sale del nombre").
  2. 3–11 s · Scroll suave por lo que hace la agencia (webs, fotos, vídeo y Google), con sus
     animaciones hechas a mano ("Sin librerías de animación").
  3. 11–14 s · Llega al contacto en forma de carta ("El contacto es una carta").
  4. 14–15 s · Fundido al principio para el bucle.
- **Estado:** [x] guion · [ ] grabado · [ ] editado · [ ] exportado · [ ] integrado

---

## 11. Integración en la web

### HTML puro

```html
<div style="aspect-ratio:16/10;overflow:hidden;border-radius:24px;background:#0a0a0a">
  <video class="lazy-video" aria-label="<Nombre del proyecto>"
         muted loop playsinline preload="none"
         data-src="/videos/<slug>.mp4" poster="/videos/posters/<slug>.jpg"
         style="width:100%;height:100%;object-fit:cover"></video>
</div>

<script>
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.lazy-video').forEach((v) => io.observe(v));
  }
</script>
```

### React / Next.js: componente `LazyVideo`

```tsx
'use client';
import { useEffect, useRef } from 'react';

type LazyVideoProps = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

export function LazyVideo({ src, poster, label, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // necesario para que el navegador permita play()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute('src')) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      aria-label={label}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
```

### Tarjeta completa (Tailwind), misma estructura que la referencia

```tsx
import type { SVGProps } from 'react';
import { LazyVideo } from './LazyVideo';

function PromptSpinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx="8" cy="2" r="1.3" opacity={(i + 1) / 8} transform={`rotate(${i * 45} 8 8)`} />
      ))}
    </svg>
  );
}

export function ProjectShowcase({ slug, title, subtitle, year, prompt, backdrop }: {
  slug: string; title: string; subtitle: string; year: string; prompt: string; backdrop: string;
}) {
  return (
    <div className="relative flex flex-col justify-between gap-7 overflow-hidden rounded-3xl bg-neutral-900 pb-8 lg:h-[568px]">
      {/* Fondo */}
      <img src={backdrop} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

      {/* Panel con vídeo + prompt */}
      <div className="relative ml-7 rounded-bl-[20px] bg-neutral-900">
        <div className="px-[30px] py-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-neutral-950">
            <LazyVideo
              src={`/videos/${slug}.mp4`}
              poster={`/videos/posters/${slug}.jpg`}
              label={title}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
        <div className="mr-9 flex gap-2 border-t border-white/10 px-4 pb-4 pt-7">
          <p className="flex h-9 min-w-0 max-w-[320px] flex-1 items-center rounded-lg bg-neutral-950 px-3 text-sm text-neutral-400">
            <span className="truncate">{prompt}</span>
          </p>
          <span aria-hidden className="group flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-950">
            <PromptSpinner className="size-4 animate-spin text-neutral-300 [animation-duration:1.8s] group-hover:[animation-play-state:paused] motion-reduce:animate-none" />
          </span>
        </div>
      </div>

      {/* Pie */}
      <div className="relative flex flex-col gap-4 px-7">
        <p className="font-semibold text-white/80">{title}</p>
        <p className="flex justify-between text-sm text-white">
          <span>{subtitle}</span>
          <span>Año: {year}</span>
        </p>
      </div>
    </div>
  );
}
```

> Si cambias la proporción del contenedor (`aspect-[16/10]`), exporta el vídeo con esa misma proporción (sección 8).

---

## 12. Checklist final por vídeo

- [ ] Proporción del vídeo = proporción del contenedor.
- [ ] Textos legibles cuando el vídeo se ve a unos 500 px de ancho.
- [ ] Sin datos personales, claves ni notificaciones a la vista.
- [ ] Sin tiempos muertos. El bucle no da un salto.
- [ ] MP4 H.264, sin audio, `faststart`, ≤ 4 MB.
- [ ] Póster generado y enlazado.
- [ ] Carga diferida + pausa fuera de pantalla + respeta `prefers-reduced-motion`.
- [ ] `aria-label` con el nombre del proyecto.
- [ ] Probado en móvil (iOS necesita `playsinline` y `muted` para reproducirse solo).
