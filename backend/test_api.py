#!/usr/bin/env python3
"""
Script de prueba para la API de Dale.
Verifica que los endpoints estén funcionando correctamente.
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"


def test_health():
    """Prueba el endpoint de health"""
    print("🔍 Probando /health...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_info():
    """Prueba el endpoint de información"""
    print("\n🔍 Probando /api/info...")
    response = requests.get(f"{BASE_URL}/api/info")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Endpoints disponibles: {len(data.get('endpoints', {}))}")
    return response.status_code == 200


def test_search_rides():
    """Prueba la búsqueda de viajes"""
    print("\n🔍 Probando GET /api/rides (búsqueda)...")
    response = requests.get(f"{BASE_URL}/api/rides")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        rides = response.json()
        print(f"   Viajes encontrados: {len(rides)}")
        if rides:
            print(f"   Primer viaje: {rides[0]['from_city']} → {rides[0]['to_city']}")
    else:
        print(f"   Error: {response.text}")
    return response.status_code == 200


def test_search_rides_with_filter():
    """Prueba la búsqueda con filtros"""
    print("\n🔍 Probando GET /api/rides?from_city=Madrid...")
    response = requests.get(f"{BASE_URL}/api/rides", params={"from_city": "Madrid"})
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        rides = response.json()
        print(f"   Viajes desde Madrid: {len(rides)}")
    else:
        print(f"   Error: {response.text}")
    return response.status_code == 200


def test_get_ride():
    """Prueba obtener un viaje específico"""
    print("\n🔍 Probando GET /api/rides/{id}...")
    # Primero obtener un viaje
    rides_response = requests.get(f"{BASE_URL}/api/rides")
    if rides_response.status_code == 200 and rides_response.json():
        ride_id = rides_response.json()[0]["id"]
        response = requests.get(f"{BASE_URL}/api/rides/{ride_id}")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            ride = response.json()
            print(f"   Viaje: {ride['from_city']} → {ride['to_city']}")
        return response.status_code == 200
    else:
        print("   ⚠️  No hay viajes para probar")
        return False


def main():
    print("=" * 60)
    print("🧪 PRUEBAS DE LA API DE DALE")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health),
        ("API Info", test_info),
        ("Búsqueda de viajes", test_search_rides),
        ("Búsqueda con filtro", test_search_rides_with_filter),
        ("Obtener viaje específico", test_get_ride),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"\n   ❌ Error en {name}: {str(e)}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE PRUEBAS")
    print("=" * 60)
    
    for name, success in results:
        status = "✅" if success else "❌"
        print(f"{status} {name}")
    
    total = len(results)
    passed = sum(1 for _, success in results if success)
    print(f"\nTotal: {passed}/{total} pruebas exitosas")


if __name__ == "__main__":
    main()
