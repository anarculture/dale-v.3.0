# Tests del Backend (Python/Pytest)

Este directorio contiene los tests para el backend de la aplicación Dale.

## 📁 Estructura

```
tests/
├── conftest.py          # Configuración global y fixtures
├── test_examples.py     # Ejemplos de diferentes tipos de tests
└── [otros archivos de test]
```

## 🚀 Ejecutar Tests

### Instalación de Dependencias
```bash
cd backend
pip install -r requirements.txt
```

### Comandos de Ejecución
```bash
# Todos los tests
pytest

# Tests con coverage
pytest --cov=main --cov-report=html

# Tests específicos por marcador
pytest -m unit           # Solo tests unitarios
pytest -m "not slow"     # Excluir tests lentos
pytest -m api           # Solo tests de API
pytest -m integration   # Solo tests de integración

# Tests en paralelo
pytest -n auto

# Tests con reporte HTML
pytest --html=report.html --self-contained-html

# Modo verbose
pytest -v -s

# Solo tests que fallaron previamente
pytest --lf

# Ejecutar tests específicos
pytest test_examples.py::test_example_unit
```

## 🏷️ Marcadores Disponibles

- `@pytest.mark.unit`: Tests unitarios rápidos
- `@pytest.mark.integration`: Tests de integración
- `@pytest.mark.api`: Tests de API
- `@pytest.mark.slow`: Tests lentos
- `@pytest.mark.database`: Tests que requieren base de datos

## 🔧 Fixtures Disponibles

El archivo `conftest.py` proporciona las siguientes fixtures:

- `client`: Cliente de test para FastAPI
- `mock_supabase_client`: Mock del cliente de Supabase
- `auth_headers`: Headers de autenticación
- `sample_user_data`: Datos de ejemplo para usuario
- `sample_project_data`: Datos de ejemplo para proyecto
- `mock_environment_variables`: Variables de entorno de prueba
- `event_loop`: Event loop para tests asíncronos

## 📝 Ejemplo de Test

```python
import pytest

@pytest.mark.api
def test_health_endpoint(client):
    """Test del endpoint de health"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data
```

## 🛠️ Configuración

Ver `pytest.ini` en el directorio raíz del backend para configuración detallada.

## 📊 Coverage

Para generar reporte de coverage:

```bash
pytest --cov=main --cov-report=html --cov-report=term
```

El reporte HTML se genera en `htmlcov/index.html`.