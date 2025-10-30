"""
Ejemplos de tests para el backend
Demuestra diferentes tipos de tests usando pytest
"""

import pytest
from unittest.mock import Mock, patch
import json

# Asumiendo que tienes una función main en tu aplicación
try:
    from main import app
except ImportError:
    app = None


@pytest.mark.unit
def test_example_unit():
    """Test unitario básico - sin dependencias externas"""
    # Arrange (preparar)
    expected = "hello world"
    
    # Act (actuar)
    result = "hello world"
    
    # Assert (verificar)
    assert result == expected
    assert len(result) > 0


@pytest.mark.api
def test_health_endpoint(client):
    """Test de endpoint de health"""
    response = client.get("/health")
    
    # Verificar status code
    assert response.status_code == 200
    
    # Verificar estructura de respuesta
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"


@pytest.mark.api
def test_api_with_query_params(client):
    """Test de endpoint con parámetros de query"""
    response = client.get("/items?limit=10&offset=0")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.integration
def test_create_item_integration(client, mock_supabase_client):
    """Test de integración con mock de Supabase"""
    # Datos de prueba
    item_data = {
        "name": "Test Item",
        "description": "Test Description",
        "price": 99.99
    }
    
    # Mock del response de Supabase
    mock_supabase_client.table.return_value.insert.return_value.execute.return_value = {
        "data": [{"id": 1, **item_data}],
        "error": None
    }
    
    # Hacer request
    response = client.post("/items", json=item_data)
    
    # Verificar respuesta
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["name"] == item_data["name"]


@pytest.mark.database
def test_database_operations():
    """Test que requiere base de datos real"""
    # Este test solo se ejecutaría con una DB de test real
    # Por ahora es solo un ejemplo de marcador
    assert True


@pytest.mark.slow
def test_slow_operation():
    """Test que simula operación lenta"""
    import time
    time.sleep(0.1)  # Simular operación lenta
    assert True


@pytest.mark.parametrize("email,password,expected_status", [
    ("user@example.com", "correct", 200),
    ("invalid@example.com", "wrong", 401),
    ("", "password", 422),
    ("user@example.com", "", 422),
])
def test_login_validation(client, email, password, expected_status):
    """Test parametrizado para validación de login"""
    response = client.post("/auth/login", json={
        "email": email,
        "password": password
    })
    
    assert response.status_code == expected_status


@pytest.mark.unit
def test_validation_error_response(client):
    """Test de manejo de errores de validación"""
    # Enviar datos inválidos
    response = client.post("/items", json={})
    
    # Debería retornar 422 para validación
    assert response.status_code == 422
    
    data = response.json()
    assert "errors" in data


@pytest.mark.integration
def test_with_mock_environment(mock_environment_variables):
    """Test usando variables de entorno mockeadas"""
    import os
    
    # Verificar que las variables de entorno estén configuradas
    assert os.getenv("ENVIRONMENT") == "test"
    assert os.getenv("SUPABASE_URL") == "https://test.supabase.co"


class TestExampleClass:
    """Ejemplo de tests organizados en una clase"""
    
    @pytest.mark.unit
    def test_method_one(self):
        """Primer test del ejemplo"""
        assert 1 + 1 == 2
    
    @pytest.mark.unit  
    def test_method_two(self):
        """Segundo test del ejemplo"""
        assert "hello".upper() == "HELLO"
    
    @pytest.mark.api
    def test_api_method(self, client):
        """Test de API en una clase"""
        response = client.get("/")
        assert response.status_code in [200, 404]  # Puede que la ruta no exista


@pytest.mark.skipif(not app, reason="App not available")
def test_app_creation():
    """Test que se salta si la app no está disponible"""
    assert app is not None


@pytest.mark.xfail(reason="Known issue to be fixed")
def test_known_failure():
    """Test que se espera que falle"""
    assert False, "Este test está marcado para fallar"


# Ejemplo de test con setup y teardown
@pytest.mark.integration
def test_with_setup_and_teardown(client):
    """Test que demuestra uso de setup/teardown"""
    # Setup
    initial_count = 0  # Aquí podrías consultar BD
    
    # Act
    response = client.get("/items")
    
    # Teardown
    # Aquí podrías limpiar datos de prueba
    
    # Assert
    assert response.status_code == 200


# Test que demuestra error handling
@pytest.mark.unit
def test_error_handling():
    """Test para manejar errores específicos"""
    def divide(a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    
    # Test caso normal
    assert divide(10, 2) == 5.0
    
    # Test caso de error
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)


# Test que demuestra fixtures personalizadas
@pytest.mark.unit
def test_with_custom_fixture(client, sample_user_data):
    """Test usando fixture personalizada"""
    # Usar datos de ejemplo
    assert sample_user_data["email"] == "test@example.com"
    assert sample_user_data["id"] == "test-user-123"


# Test que demuestra testing de funciones asíncronas
@pytest.mark.unit
async def test_async_function():
    """Test de función asíncrona"""
    import asyncio
    
    async def async_function():
        await asyncio.sleep(0.01)
        return "done"
    
    result = await async_function()
    assert result == "done"


# Test que demuestra verificación de tipos
@pytest.mark.unit
def test_type_validation():
    """Test que verifica tipos"""
    def add_numbers(a: int, b: int) -> int:
        return a + b
    
    assert add_numbers(1, 2) == 3
    assert isinstance(add_numbers(1, 2), int)


# Test que demuestra uso de mocks
@pytest.mark.unit
@patch('builtins.open')
@patch('json.load')
def test_with_mocks(mock_json_load, mock_open):
    """Test que usa mocks para funciones externas"""
    # Configurar mocks
    mock_json_load.return_value = {"key": "value"}
    mock_open.return_value.__enter__.return_value = mock_open.return_value
    
    # Código que usa las funciones mockeadas
    import json
    
    with open('test.json') as f:
        data = json.load(f)
    
    assert data == {"key": "value"}
    mock_json_load.assert_called_once()
    mock_open.assert_called_once_with('test.json')