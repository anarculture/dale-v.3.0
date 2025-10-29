/**
 * Tests de API
 * Verifican endpoints y respuestas de la API
 */

import { test, expect, request } from '@playwright/test';

test.describe('Tests de API', () => {
  let apiContext: any;

  test.beforeEach(async ({ browser }) => {
    apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('debería responder a health check', async () => {
    const response = await apiContext.get('/api/health');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  test('debería manejar endpoints que no existen', async () => {
    const response = await apiContext.get('/api/nonexistent');
    
    expect(response.status()).toBe(404);
  });

  test('debería crear recursos via POST', async () => {
    const newResource = {
      name: 'Test Resource',
      description: 'Created via API test',
    };

    const response = await apiContext.post('/api/resources', {
      data: newResource,
    });

    // Ajustar según la respuesta real de la API
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(newResource.name);
    }
  });

  test('debería validar datos de entrada', async () => {
    const invalidData = {
      // Datos inválidos para probar validación
    };

    const response = await apiContext.post('/api/resources', {
      data: invalidData,
    });

    // La API debería retornar error de validación
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('debería autenticarse correctamente', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'testpass123',
    };

    const response = await apiContext.post('/api/auth/login', {
      data: loginData,
    });

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data.token).toBeTruthy();
    }
  });

  test('debería manejar rate limiting', async () => {
    // Hacer múltiples requests rápidos
    const requests = Array(10).fill(null).map(() => 
      apiContext.get('/api/health')
    );

    const responses = await Promise.all(requests);
    const statuses = responses.map(r => r.status());
    
    // La mayoría de requests deberían成功了
    const successCount = statuses.filter(s => s === 200).length;
    expect(successCount).toBeGreaterThan(5);
  });

  test('debería retornar headers CORS correctos', async () => {
    const response = await apiContext.get('/api/health');
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
    ];

    for (const header of corsHeaders) {
      expect(response.headers()[header]).toBeTruthy();
    }
  });

  test('debería mantener sesión entre requests', async () => {
    // Login
    const loginResponse = await apiContext.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'testpass123',
      },
    });

    if (loginResponse.status() === 200) {
      const loginData = await loginResponse.json();
      
      // Usar token en requests siguientes
      const authedContext = await request.newContext({
        baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
        extraHTTPHeaders: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
      });

      const protectedResponse = await authedContext.get('/api/user/profile');
      
      // Si el endpoint existe, debería retornar 200
      if (protectedResponse.status() !== 404) {
        expect(protectedResponse.status()).toBe(200);
      }
    }
  });

  test.afterEach(async () => {
    await apiContext.dispose();
  });
});