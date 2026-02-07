import pytest
from unittest.mock import Mock
from fastapi.testclient import TestClient
from app.main import app
from app.utils.database import get_db

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Dale API" in response.json()["name"]

def test_search_rides():
    # Create mock supabase client
    mock_client = Mock()
    mock_response = Mock()
    # Include all fields required by RideResponse schema
    mock_response.data = [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "from_city": "Caracas",
            "to_city": "Valencia",
            "from_lat": 10.4806,
            "from_lon": -66.9036,
            "to_lat": 10.1800,
            "to_lon": -67.9900,
            "date_time": "2030-12-25T10:00:00",
            "price": 20.0,
            "seats_available": 3,
            "seats_total": 4,
            "driver_id": "123e4567-e89b-12d3-a456-426614174001",
            "driver": None,
            "created_at": "2024-01-01T00:00:00"
        }
    ]
    # Mock the chained query methods for search_rides endpoint
    mock_query = Mock()
    mock_query.gte.return_value = mock_query
    mock_query.gt.return_value = mock_query
    mock_query.order.return_value = mock_query
    mock_query.execute.return_value = mock_response
    mock_client.table.return_value.select.return_value = mock_query

    # Override the dependency
    async def override_get_db():
        return mock_client
    
    app.dependency_overrides[get_db] = override_get_db
    
    try:
        client = TestClient(app)
        response = client.get("/api/rides")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["from_city"] == "Caracas"
    finally:
        # Clean up the override
        app.dependency_overrides.clear()
