/**
 * Utilidad para trabajar con Google Maps API
 * Maneja búsqueda de lugares y obtención de coordenadas
 */

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
  city?: string;
}

interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

interface GeometryLocation {
  lat: number;
  lng: number;
}

interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: {
    location?: GeometryLocation;
  };
}

interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  place_id: string;
  formatted_address: string;
  geometry?: {
    location?: GeometryLocation;
  };
  address_components?: GeocodeAddressComponent[];
}

/**
 * Buscar lugares usando Google Places Autocomplete API
 */
export async function searchPlaces(input: string): Promise<PlaceSuggestion[]> {
  if (!input || input.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&language=es&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Error al buscar lugares');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.predictions) {
      return (data.predictions as AutocompletePrediction[]).map((prediction) => ({
        place_id: prediction.place_id,
        description: prediction.description,
        main_text: prediction.structured_formatting?.main_text || '',
        secondary_text: prediction.structured_formatting?.secondary_text || '',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

/**
 * Obtener detalles de un lugar usando place_id
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,geometry&language=es&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Error al obtener detalles del lugar');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      const result = data.result as PlaceDetailsResult;
      const location = result.geometry?.location;

      if (!location) {
        throw new Error('No se encontraron coordenadas');
      }

      // Extraer nombre de ciudad del formatted_address
      const addressParts = result.formatted_address.split(',');
      const city = addressParts[0]?.trim() || result.name;

      return {
        place_id: result.place_id,
        name: result.name,
        formatted_address: result.formatted_address,
        lat: location.lat,
        lng: location.lng,
        city,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

/**
 * Geocodificar una dirección (obtener coordenadas)
 */
export async function geocodeAddress(address: string): Promise<PlaceDetails | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&language=es&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Error al geocodificar dirección');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0] as GeocodeResult;
      const location = result.geometry?.location;

      if (!location) {
        throw new Error('No se encontraron coordenadas');
      }

      // Extraer ciudad de los componentes de dirección
      const cityComponent = result.address_components?.find(
        (component: GeocodeAddressComponent) =>
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_2')
      );

      const city = cityComponent?.long_name || result.formatted_address.split(',')[0]?.trim();

      return {
        place_id: result.place_id,
        name: city,
        formatted_address: result.formatted_address,
        lat: location.lat,
        lng: location.lng,
        city,
      };
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}
