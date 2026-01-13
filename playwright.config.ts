import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // Configuración del servidor local
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  projects: [
    // Probamos en Chrome de escritorio
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Probamos en Móvil (Crítico para tu menú)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    // Probamos en Safari Móvil
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
