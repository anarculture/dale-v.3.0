# Tests del Frontend (TypeScript/Playwright)

Este directorio contiene los tests end-to-end para el frontend de la aplicación Dale.

## 📁 Estructura

```
tests/
├── utils.ts                 # Utilidades y helpers
├── global-setup.ts          # Setup global de Playwright
├── global-teardown.ts       # Teardown global
├── e2e/                     # Tests End-to-End
│   └── home.spec.ts        # Ejemplo de tests E2E
├── ui/                      # Tests de Interfaz
│   └── ui-components.spec.ts # Tests de componentes UI
├── api/                     # Tests de API
│   └── api-endpoints.spec.ts # Tests de endpoints
└── README.md               # Esta documentación
```

## 🚀 Ejecutar Tests

### Instalación
```bash
cd frontend
npm install
npx playwright install
```

### Comandos de Ejecución
```bash
# Todos los tests
npm run test

# Tests específicos por tipo
npm run test:e2e            # Solo tests E2E
npm run test:ui            # Solo tests de UI
npm run test:api           # Solo tests de API

# Tests en diferentes navegadores
npm run test:cross-browser  # Chrome, Firefox, Safari
npm run test:mobile         # Chrome móvil
npm run test:mobile-safari  # Safari móvil

# Modos especiales
npm run test:ui            # Modo UI interactivo
npm run test:headed        # Con navegador visible
npm run test:debug         # Modo debug
npm run test:fast          # Tests rápidos (sin videos)

# Ver reportes
npm run test:report        # Abrir reporte HTML

# Para CI
npm run test:ci            # Configurado para CI/CD
```

## 📝 Tipos de Tests

### E2E (End-to-End)
Tests que simulan flujos completos de usuario:
- Navegación entre páginas
- Login/logout
- Flujos de negocio completos
- Autenticación

### UI (Interfaz de Usuario)
Tests que verifican elementos específicos de la UI:
- Componentes individuales
- Estados de hover/focus
- Accesibilidad básica
- Responsive design

### API
Tests que verifican endpoints:
- Respuestas de API
- Manejo de errores
- Validación de datos
- Autenticación de API

## 🛠️ Utilidades Disponibles

El archivo `utils.ts` proporciona funciones útiles:

```typescript
import { 
  navigateToPage, 
  login, 
  fillForm, 
  expectElementToContainText 
} from '../utils';

// Ejemplo de uso
test('test example', async ({ page }) => {
  await navigateToPage(page, '/');
  await login(page, 'user@example.com', 'password');
  await expectElementToContainText(page, 'h1', 'Dashboard');
});
```

### Funciones Principales

- `navigateToPage(page, url)`: Navegar a una página
- `login(page, email, password)`: Simular login
- `fillForm(page, data)`: Llenar formularios
- `expectElementToContainText(page, selector, text)`: Verificar texto
- `takeElementScreenshot(page, selector, name)`: Tomar screenshot

## 🔧 Configuración

El archivo `playwright.config.ts` define:

### Proyectos de Navegadores
- **Chromium**: Google Chrome
- **Firefox**: Mozilla Firefox  
- **Safari**: WebKit/Safari
- **Mobile Chrome**: Chrome en Pixel 5
- **Mobile Safari**: Safari en iPhone 12
- **Microsoft Edge**: Edge browser
- **Dark Mode**: Chrome en modo oscuro

### Configuración de Servidor
El test automáticamente:
1. Inicia la aplicación con `npm run dev`
2. Espera a que esté disponible en `localhost:3000`
3. Ejecuta los tests
4. Limpia recursos

## 📱 Testing Responsivo

Los tests incluyen verificación en diferentes tamaños de pantalla:

```typescript
test('responsive design', async ({ page }) => {
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page.locator('.desktop-layout')).toBeVisible();
  
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('.mobile-menu')).toBeVisible();
});
```

## 🎯 Mejores Prácticas

### Selectores
- Usar `data-testid` para selectores robustos
- Evitar selectores frágiles como `.class:nth-child(2)`

### Espera
- Usar `await expect()` en lugar de `page.waitFor()`
- Esperar por estado, no por tiempo

### Organización
- Un test por funcionalidad específica
- Usar `test.describe()` para agrupar tests relacionados
- Variables descriptivas en el `test.describe()`

### Ejemplo de Test Bien Estructurado

```typescript
test.describe('Login Flow', () => {
  test('debería permitir login con credenciales válidas', async ({ page }) => {
    // 1. Ir a página de login
    await page.goto('/login');
    
    // 2. Llenar formulario
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    
    // 3. Enviar formulario
    await page.click('[type="submit"]');
    
    // 4. Verificar redirección
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Bienvenido')).toBeVisible();
  });
});
```

## 📊 Reportes

Después de ejecutar tests, puedes ver:

### Reporte HTML
```bash
npm run test:report
```

Contiene:
- ✅/❌ Status de cada test
- 📷 Screenshots de failures
- 🎥 Videos de ejecución (en failure)
- 📋 Logs detallados

### Resultados en Terminal
Los tests muestran:
- Tiempo de ejecución
- Marcadores de progreso
- Detalles de failures

## 🔍 Debug

### Modo Interactivo
```bash
npm run test:ui
```

### Modo Debug
```bash
npm run test:debug
```

### Con Head (navegador visible)
```bash
npm run test:headed
```

## 🌐 Variables de Entorno

Configurar antes de ejecutar tests:

```bash
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export API_BASE_URL=http://localhost:8000
export CI=true  # Para CI/CD
```

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/test-pom)
- [API Reference](https://playwright.dev/docs/api/class-playwright)