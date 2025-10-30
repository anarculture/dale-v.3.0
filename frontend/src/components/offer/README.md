# OfferForm Component

## Descripción
Componente de formulario completo para crear ofertas de viaje en la aplicación Dale PWA.

## Características

### ✅ Funcionalidades Implementadas
- **Campos de origen y destino** con búsqueda de Google Places en tiempo real
- **Selector de fecha y hora** con validación de fechas futuras
- **Campo de asientos disponibles** (1-8 asientos)
- **Campo de precio opcional** con validación
- **Área de notas** con límite de 500 caracteres
- **Validación en tiempo real** para todos los campos
- **Vista previa de la ruta** con cálculo de distancia
- **Integración completa con API** usando api.createRide
- **Estados de envío** (loading, success, error)
- **Autenticación** integrada con Supabase

## Props

```typescript
interface OfferFormProps {
  onSuccess?: (ride: Ride) => void;  // Callback cuando se crea exitosamente
  onCancel?: () => void;             // Callback para cancelar
}
```

## Uso

```tsx
import { OfferForm } from '@/components/offer';

function CreateRidePage() {
  const handleSuccess = (ride: Ride) => {
    console.log('Oferta creada:', ride);
    // Navegar a otra página o mostrar mensaje de éxito
  };

  const handleCancel = () => {
    console.log('Formulario cancelado');
    // Navegar de vuelta
  };

  return (
    <OfferForm 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
```

## Validaciones

### Campos Obligatorios
- **Origen**: No puede estar vacío
- **Destino**: No puede estar vacío y debe ser diferente al origen
- **Fecha**: Debe ser hoy o posterior
- **Hora**: Debe estar en el futuro si es la fecha de hoy
- **Asientos**: Entre 1 y 8 asientos

### Validaciones Adicionales
- **Precio**: Entre 0 y 1000
- **Notas**: Máximo 500 caracteres
- **Distancia**: Se calcula automáticamente al cambiar origen/destino

## Integración con Google Maps

El componente utiliza:
- `@googlemaps/js-api-loader` para cargar la API de Google Maps
- Funciones de `maps.ts` para búsqueda de lugares y cálculo de distancia
- Sugerencias de lugares en tiempo real
- Cálculo automático de distancia de ruta

## Estados de Carga

- **Búsqueda de lugares**: Loading mientras busca sugerencias
- **Cálculo de distancia**: Loading al calcular ruta
- **Envío**: Loading mientras envía el formulario
- **Errores**: Manejo de errores de red, validación y autenticación

## Estilos

- Usa Tailwind CSS para el styling
- Diseño responsivo (grid que se adapta a mobile)
- Estados visuales para errores y validaciones
- Iconos de Lucide React

## Dependencias

- React 18+
- TypeScript
- Google Maps JavaScript API
- Supabase Auth
- Tailwind CSS
- Lucide React