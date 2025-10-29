import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Fallar en CI si hay tests marcados como test.only */
  forbidOnly: !!process.env.CI,
  /* Reintentar en CI */
  retries: process.env.CI ? 2 : 0,
  /* Workers en paralelo */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter de test results */
  reporter: 'html',
  /* Configuración compartida para todos los tests */
  use: {
    /* Base URL para usar en métodos como page.goto('/') */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    /* Recopilar trazas cuando un test falla */
    trace: 'on-first-retry',
    
    /* Tomar screenshot solo en failure */
    screenshot: 'only-on-failure',
    
    /* Grabar video solo en failure */
    video: 'retain-on-failure',
  },

  /* Configurar proyectos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Pruebas en móvil con Chrome */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    /* Pruebas en móvil con Safari */
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Pruebas con Microsoft Edge */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },

    /* Pruebas de interfaz oscura */
    {
      name: 'chromium-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
  ],

  /* Ejecutar servidor local para tests antes de ejecutar tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Configuración global para todos los tests */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  /* Configuración específica para testing */
  testTimeout: 30 * 1000, // 30 segundos
  expect: {
    /* Timeout para expect() assertions */
    timeout: 5 * 1000,
    
    /* Screenshots de comparación visual */
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
});

/**
 * Configuración personalizada para diferentes entornos
 */

// Configuración para CI
if (process.env.CI) {
  export default defineConfig({
    ...config,
    // Más retries en CI
    retries: 3,
    // Menos workers en CI para evitar resource contention
    workers: 1,
    // Screenshots y videos siempre en CI para debugging
    use: {
      ...config.use,
      screenshot: 'on',
      video: 'on',
    },
  });
}

// Configuración para testing rápido (sin videos/screenshots)
export const fastConfig = defineConfig({
  ...config,
  use: {
    ...config.use,
    screenshot: 'off',
    video: 'off',
    trace: 'off',
  },
});