# Guía de Testing - Proyecto Dale

Esta guía explica cómo configurar y ejecutar tests tanto para el backend (Python/Pytest) como para el frontend (TypeScript/Playwright).

## 🏗️ Estructura de Testing

```
/workspace/dale/
├── backend/
│   ├── pytest.ini          # Configuración de pytest
│   ├── requirements.txt     # Dependencias incluyendo pytest
│   └── tests/
│       └── conftest.py      # Fixtures globales de pytest
├── frontend/
│   ├── playwright.config.ts # Configuración de Playwright
│   ├── package.json         # Scripts de testing
│   └── tests/
│       ├── utils.ts         # Utilidades para tests
│       ├── global-setup.ts  # Setup global de Playwright
│       ├── global-teardown.ts # Teardown global
│       ├── e2e/             # Tests End-to-End
│       ├── ui/              # Tests de interfaz
│       └── api/             # Tests de API
```

## 🐍 Testing Backend (Python/Pytest)

### Instalación de Dependencias

```bash
cd /workspace/dale/backend
pip install -r requirements.txt
```

### Ejecución de Tests

```bash
# Ejecutar todos los tests
pytest

# Ejecutar con coverage
pytest --cov=main --cov-report=html

# Ejecutar tests específicos por marcador
pytest -m unit           # Solo tests unitarios
pytest -m "not slow"     # Excluir tests lentos
pytest -m api           # Solo tests de API

# Ejecutar con reporte HTML
pytest --html=report.html --self-contained-html

# Ejecutar tests en paralelo
pytest -n auto

# Ejecutar tests con más verbosidad
pytest -v -s
```

### Marcadores Disponibles

- `unit`: Tests unitarios
- `integration`: Tests de integración
- `e2e`: Tests end-to-end
- `slow`: Tests lentos (por ejemplo, que requieren base de datos)
- `api`: Tests que involucran APIs
- `database`: Tests que requieren base de datos

### Ejemplo de Test

```python
import pytest
from unittest.mock import Mock

@pytest.mark.unit
def test_sample_function():
    """Test unitario de ejemplo"""
    # Arrange
    expected_result = "test"
    
    # Act
    result = "test"
    
    # Assert
    assert result == expected_result

@pytest.mark.api
def test_api_endpoint(client):
    """Test de API con cliente"""
    response = client.get("/health")
    assert response.status_code == 200
```

## 🎭 Testing Frontend (TypeScript/Playwright)

### Instalación de Dependencias

```bash
cd /workspace/dale/frontend
npm install
npx playwright install
```

### Ejecución de Tests

```bash
# Instalar navegadores de Playwright
npm run test:install

# Ejecutar todos los tests E2E
npm run test

# Ejecutar tests específicos
npm run test:e2e          # Solo tests E2E
npm run test:ui           # Solo tests de UI
npm run test:api          # Solo tests de API

# Ejecutar en modo UI interactivo
npm run test:ui

# Ejecutar con navegador visible
npm run test:headed

# Debug tests
npm run test:debug

# Ver reporte
npm run test:report

# Tests en dispositivos móviles
npm run test:mobile
npm run test:mobile-safari

# Tests cross-browser
npm run test:cross-browser

# Tests rápidos (sin videos/screenshots)
npm run test:fast

# Para CI/CD
npm run test:ci
```

### Configuración de Proyectos

El archivo `playwright.config.ts` define varios proyectos:

- **Chromium**: Google Chrome
- **Firefox**: Mozilla Firefox
- **Safari**: WebKit/Safari
- **Mobile Chrome**: Chrome en Pixel 5
- **Mobile Safari**: Safari en iPhone 12
- **Microsoft Edge**: Edge browser
- **Dark Mode**: Chrome en modo oscuro

### Ejemplo de Test E2E

```typescript
import { test, expect } from '@playwright/test';
import { login, navigateToPage } from '../utils';

test.describe('Tests E2E', () => {
  test('debería permitir login', async ({ page }) => {
    await login(page, 'test@example.com', 'password123');
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });
});
```

## 🚀 Scripts de Conveniencia

### Ejecutar Ambos Backends y Frontends

```bash
# Desde la raíz del proyecto
./dev.sh  # O script que tengas configurado
```

### Ejecutar Solo Tests

```bash
# Backend
cd backend && pytest

# Frontend (en otra terminal)
cd frontend && npm run test
```

## 📊 Coverage y Reportes

### Backend

Los reportes de coverage se generan en `backend/htmlcov/index.html` cuando ejecutas:

```bash
pytest --cov=main --cov-report=html
```

### Frontend

Los reportes de Playwright se pueden ver con:

```bash
npm run test:report
```

Esto abre un reporte HTML interactivo con screenshots y videos de tests fallidos.

## 🛠️ Configuración de Variables de Entorno

### Para Tests de Backend

Crea `.env.test` en `/workspace/dale/backend/`:

```env
ENVIRONMENT=test
SUPABASE_URL=https://test.supabase.co
SUPABASE_ANON_KEY=test-key
JWT_SECRET=test-secret
DATABASE_URL=postgresql://user:pass@localhost:5432/test_db
```

### Para Tests de Frontend

Establece variables de entorno:

```bash
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export API_BASE_URL=http://localhost:8000
export CI=true  # Para CI/CD
```

## 🔧 Troubleshooting

### Playwright no encuentra elementos

- Usa `data-testid` en componentes para selectores más robustos
- Espera a que los elementos sean visibles: `await expect(locator).toBeVisible()`
- Usa `page.waitForLoadState('networkidle')` después de navegación

### Tests de API fallan

- Verifica que el backend esté corriendo en `localhost:8000`
- Revisa CORS headers en el backend
- Usa mocks para tests independientes

### Coverage bajo

- Añade más tests unitarios
- Usa `@covers` para marcar funciones específicas
- Excluye código de configuración: `pragma: no cover`

## 📝 Buenas Prácticas

### Tests de Backend

1. **Usa fixtures**: Reutiliza configuración con `@pytest.fixture`
2. **Mock servicios externos**: Usa `unittest.mock` para APIs
3. **Tests independientes**: No dependas del orden de ejecución
4. **Asegersiones claras**: Usa mensajes descriptivos

### Tests de Frontend

1. **Tests específicos**: Un test debe probar una sola funcionalidad
2. **Espera explícita**: Usa `await` con expect()
3. **Selectores robustos**: Prefiere `data-testid` sobre selectores CSS
4. **Cleanup**: Limpia estado entre tests

## 🚨 CI/CD

Para integrar en CI/CD, usa:

```yaml
# Ejemplo para GitHub Actions
- name: Run Backend Tests
  run: |
    cd backend
    pip install -r requirements.txt
    pytest
    
- name: Run Frontend Tests
  run: |
    cd frontend
    npm install
    npx playwright install
    npm run test:ci
```

## 📚 Recursos Adicionales

- [Documentación de Pytest](https://docs.pytest.org/)
- [Documentación de Playwright](https://playwright.dev/)
- [Mejores prácticas de testing](https://testing-playground.com/)

---

¡Happy Testing! 🧪✨