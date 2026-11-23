import { existsSync } from 'node:fs';
import { chromium, defineConfig, devices } from '@playwright/test';

// Las pruebas recorren lo construido (pnpm build + pnpm preview), no el servidor de desarrollo: es lo
// que se publica, y así el CSS, los módulos y las rutas son los de verdad. Nunca apuntan a la web en vivo.
const PORT = 4400;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const CI = !!process.env.CI;

// Se usa el Chromium que descarga Playwright (pnpm exec playwright install chromium) siempre que esté
// instalado, que es lo que pasa en CI y en cualquier equipo que lo haya instalado. Si no está (el PC de
// Christian no tiene navegadores descargados), se cae al Edge que trae Windows.
const hasBundledChromium = (() => {
  try {
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
})();
const channel = hasBundledChromium ? undefined : 'msedge';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // Seis navegadores a la vez saturan la CPU y los goto se pasan del tiempo; cuatro en local y dos en CI
  workers: CI ? 2 : 4,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  // Construye y sirve lo publicable. En local, si ya hay un "preview" en el 4400, se reutiliza tal cual
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT} --host 127.0.0.1`,
    url: BASE_URL,
    reuseExistingServer: !CI,
    timeout: 180 * 1000,
  },

  use: {
    baseURL: BASE_URL,
    channel,
    trace: 'on-first-retry',
    navigationTimeout: 30_000,
    // En CI no hay GPU: WebGL tiene que salir por software (SwiftShader) para que la escena 3D se pruebe
    launchOptions: { args: CI ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [] },
    // Tema del sistema claro y sin preferencias raras: cada prueba parte del mismo sitio
    colorScheme: 'light',
    locale: 'es-ES',
  },

  projects: [
    // Escritorio: el ancho en el que se diseñó la web (apilado de tarjetas, lienzo con cámara)
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1440, height: 900 } },
    },
    // Móvil: Chromium con pantalla táctil de 390 px (menú de móvil, rejilla del lienzo, tarjetas en lista)
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], channel, viewport: { width: 390, height: 844 } },
    },
  ],
});
