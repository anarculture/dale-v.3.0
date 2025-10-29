"""
Configuración global de fixtures para pytest
Contiene fixtures reutilizables para testing del backend
"""

import pytest
import asyncio
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
import os
import sys

# Añadir el directorio padre al path para imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from main import app


@pytest.fixture(scope="session")
def event_loop():
    """Crear un event loop para toda la sesión de tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def client():
    """Cliente de test para FastAPI"""
    return TestClient(app)


@pytest.fixture
def mock_supabase_client():
    """Mock del cliente de Supabase"""
    with patch('main.supabase') as mock:
        mock_client = Mock()
        mock_client.auth.get_user.return_value = {"user": None}
        mock_client.table.return_value.select.return_value.execute.return_value = {
            "data": [],
            "error": None
        }
        yield mock_client


@pytest.fixture
def auth_headers():
    """Headers de autenticación para requests"""
    return {
        "Authorization": "Bearer test-token",
        "Content-Type": "application/json"
    }


@pytest.fixture
def sample_user_data():
    """Datos de ejemplo para usuario"""
    return {
        "id": "test-user-123",
        "email": "test@example.com",
        "name": "Usuario Test",
        "role": "user"
    }


@pytest.fixture
def sample_project_data():
    """Datos de ejemplo para proyecto"""
    return {
        "id": "test-project-123",
        "name": "Proyecto Test",
        "description": "Descripción del proyecto de prueba",
        "user_id": "test-user-123",
        "status": "active"
    }


@pytest.fixture
def mock_environment_variables():
    """Variables de entorno de prueba"""
    test_env = {
        "SUPABASE_URL": "https://test.supabase.co",
        "SUPABASE_ANON_KEY": "test-key",
        "JWT_SECRET": "test-secret",
        "ENVIRONMENT": "test"
    }
    
    with patch.dict(os.environ, test_env):
        yield test_env


@pytest.fixture
def cleanup_database():
    """Fixture para limpiar la base de datos después de cada test"""
    yield
    # Aquí se pueden agregar funciones de limpieza si es necesario


# Fixtures específicas para diferentes tipos de tests
@pytest.fixture
def unit_test_client():
    """Cliente para tests unitarios (sin autenticación)"""
    return TestClient(app)


@pytest.fixture
def integration_test_client(mock_supabase_client):
    """Cliente para tests de integración con mocks"""
    with patch('main.supabase', mock_supabase_client):
        return TestClient(app)


# Marcadores personalizados
def pytest_configure(config):
    """Configurar marcadores personalizados"""
    config.addinivalue_line(
        "markers", "unit: marcar test como unit test"
    )
    config.addinivalue_line(
        "markers", "integration: marcar test como integration test"
    )
    config.addinivalue_line(
        "markers", "e2e: marcar test como end-to-end test"
    )
    config.addinivalue_line(
        "markers", "slow: marcar test como lento"
    )
    config.addinivalue_line(
        "markers", "api: marcar test como de API"
    )
    config.addinivalue_line(
        "markers", "database: marcar test que requiere base de datos"
    )


# Hooks para setup/teardown global
def pytest_sessionstart(session):
    """Hook ejecutado al inicio de la sesión de tests"""
    print("\n🚀 Iniciando suite de tests...")
    print("📁 Directorio de tests:", os.path.dirname(__file__))


def pytest_sessionfinish(session, exitstatus):
    """Hook ejecutado al final de la sesión de tests"""
    print(f"\n✅ Tests completados con código de salida: {exitstatus}")
    
    if exitstatus == 0:
        print("🎉 Todos los tests pasaron exitosamente!")
    else:
        print("❌ Algunos tests fallaron. Revisa la salida arriba.")