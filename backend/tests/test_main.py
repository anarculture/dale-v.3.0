import pytest
from unittest.mock import Mock, patch

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Dale API" in response.json()["name"]

@patch("app.routes.rides.get_supabase_client")
def test_search_rides(mock_get_client, client):
    # Mock supabase response
    mock_client = Mock()
    mock_response = Mock()
    mock_response.data = [
        {
            "id": "1",
            "from_city": "Caracas",
            "to_city": "Valencia",
            "date_time": "2023-12-25T10:00:00",
            "price": 20.0,
            "seats_available": 3
        }
    ]
    mock_client.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value = mock_response
    mock_get_client.return_value = mock_client

    response = client.get("/api/rides")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["from_city"] == "Caracas"
