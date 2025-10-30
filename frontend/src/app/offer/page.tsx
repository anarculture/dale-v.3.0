'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { maps } from '@/lib/maps';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  FileText,
  ArrowLeft,
  Route,
  Navigation,
  AlertCircle,
  CheckCircle,
  Loader2,
  Car
} from 'lucide-react';

interface PlaceData {
  name: string;
  lat: number;
  lng: number;
}

interface FormData {
  origin: string;
  destination: string;
  originCoords: PlaceData | null;
  destinationCoords: PlaceData | null;
  date: string;
  time: string;
  seats: string;
  price: string;
  notes: string;
}

interface FormErrors {
  origin?: string;
  destination?: string;
  date?: string;
  time?: string;
  seats?: string;
  price?: string;
  general?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function OfferPage() {
  const router = useRouter();
  const { user, loading: authLoading, token } = useAuth();
  
  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    origin: '',
    destination: '',
    originCoords: null,
    destinationCoords: null,
    date: '',
    time: '',
    seats: '',
    price: '',
    notes: ''
  });

  // Estados de validación y errores
  const [errors, setErrors] = useState<FormErrors>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de autocompletado
  const [originSuggestions, setOriginSuggestions] = useState<PlaceData[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlaceData[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [originInputFocus, setOriginInputFocus] = useState(false);
  const [destinationInputFocus, setDestinationInputFocus] = useState(false);
  
  // Estado de vista previa
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Validación en tiempo real
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'origin':
        if (!value.trim()) return 'El origen es obligatorio';
        break;
      case 'destination':
        if (!value.trim()) return 'El destino es obligatorio';
        if (value.toLowerCase() === formData.origin.toLowerCase()) {
          return 'El destino debe ser diferente al origen';
        }
        break;
      case 'date':
        if (!value) return 'La fecha es obligatoria';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'La fecha no puede ser anterior a hoy';
        break;
      case 'time':
        if (!value) return 'La hora es obligatoria';
        break;
      case 'seats':
        const seats = parseInt(value);
        if (!value) return 'El número de asientos es obligatorio';
        if (isNaN(seats) || seats < 1 || seats > 8) {
          return 'El número de asientos debe estar entre 1 y 8';
        }
        break;
      case 'price':
        const price = parseFloat(value);
        if (!value) return 'El precio es obligatorio';
        if (isNaN(price) || price < 0) {
          return 'El precio debe ser un número positivo';
        }
        if (price > 1000) {
          return 'El precio no puede exceder los 1000€';
        }
        break;
    }
    return undefined;
  }, [formData.origin]);

  // Manejar cambios en el formulario
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));

    // Calcular distancia cuando cambien origen y destino
    if ((name === 'origin' || name === 'destination') && formData.originCoords && formData.destinationCoords) {
      calculateRouteDistance();
    }
  };

  // Buscar lugares con Google Places API
  const searchPlaces = async (query: string, type: 'origin' | 'destination') => {
    if (query.length < 2) {
      if (type === 'origin') {
        setOriginSuggestions([]);
        setShowOriginSuggestions(false);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
      return;
    }

    try {
      const places = await maps.searchPlaces(query);
      if (type === 'origin') {
        setOriginSuggestions(places);
        setShowOriginSuggestions(true);
      } else {
        setDestinationSuggestions(places);
        setShowDestinationSuggestions(true);
      }
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  // Manejar búsqueda en tiempo real
  const handlePlaceSearch = (query: string, type: 'origin' | 'destination') => {
    handleInputChange(type, query);
    searchPlaces(query, type);
  };

  // Seleccionar lugar del autocompletado
  const selectPlace = (place: PlaceData, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setFormData(prev => ({ 
        ...prev, 
        origin: place.name,
        originCoords: place
      }));
      setShowOriginSuggestions(false);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        destination: place.name,
        destinationCoords: place
      }));
      setShowDestinationSuggestions(false);
    }
    
    // Calcular distancia si ambos lugares están seleccionados
    if ((type === 'origin' && formData.destinationCoords) || 
        (type === 'destination' && formData.originCoords)) {
      calculateRouteDistance();
    }
  };

  // Calcular distancia de la ruta
  const calculateRouteDistance = async () => {
    if (formData.originCoords && formData.destinationCoords) {
      try {
        const distance = await maps.calculateDistance(
          { lat: formData.originCoords.lat, lng: formData.originCoords.lng },
          { lat: formData.destinationCoords.lat, lng: formData.destinationCoords.lng }
        );
        setRouteDistance(distance);
        setShowRoutePreview(true);
      } catch (error) {
        console.error('Error calculating distance:', error);
        setRouteDistance(null);
      }
    }
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validar todos los campos
    Object.keys(formData).forEach(key => {
      if (['origin', 'destination', 'date', 'time', 'seats', 'price'].includes(key)) {
        const error = validateField(key, formData[key as keyof FormData] as string);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    if (!user || !token) {
      setError('Debes estar autenticado para crear un viaje');
      return;
    }

    setSubmitting(true);

    try {
      // Combinar fecha y hora
      const dateTime = new Date(`${formData.date}T${formData.time}:00`);
      
      const rideData = {
        from_city: formData.origin,
        from_lat: formData.originCoords!.lat,
        from_lon: formData.originCoords!.lng,
        to_city: formData.destination,
        to_lat: formData.destinationCoords!.lat,
        to_lon: formData.destinationCoords!.lng,
        date_time: dateTime.toISOString(),
        seats_total: parseInt(formData.seats),
        price: parseFloat(formData.price),
        notes: formData.notes || undefined,
      };

      const response = await api.createRide(rideData, token);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/rides');
        }, 2000);
      } else {
        setError(response.error || 'Error al crear el viaje');
      }
    } catch (error) {
      console.error('Error creating ride:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Formatear distancia
  const formatDistance = (meters: number) => {
    return maps.formatDistance(meters);
  };

  // Establecer fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  // Mostrar loading de autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando Dale...</p>
        </div>
      </div>
    );
  }

  // No renderizar si no está autenticado
  if (!user) {
    return null;
  }

  // Página de éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Viaje creado!</h2>
            <p className="text-gray-600 mb-4">
              Tu viaje ha sido publicado exitosamente. Redirigiendo...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Oferta de Viaje</h1>
              <p className="text-gray-600">Comparte tu viaje y encuentra compañeros de viaje</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error general */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Error</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              )}

              {/* Información del viaje */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Viaje</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campo Origen */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Origen *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.origin}
                        onChange={(e) => handlePlaceSearch(e.target.value, 'origin')}
                        onFocus={() => setOriginInputFocus(true)}
                        onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                        placeholder="¿Desde dónde viajas?"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.origin ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {/* Sugerencias de autocompletado */}
                      {showOriginSuggestions && originSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {originSuggestions.map((place, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectPlace(place, 'origin')}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                            >
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{place.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {validationErrors.origin && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.origin}</p>
                    )}
                  </div>

                  {/* Campo Destino */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Navigation className="w-4 h-4 inline mr-1" />
                      Destino *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => handlePlaceSearch(e.target.value, 'destination')}
                        onFocus={() => setDestinationInputFocus(true)}
                        onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                        placeholder="¿Hacia dónde viajas?"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.destination ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {/* Sugerencias de autocompletado */}
                      {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {destinationSuggestions.map((place, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectPlace(place, 'destination')}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                            >
                              <Navigation className="w-4 h-4 text-gray-400" />
                              <span>{place.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {validationErrors.destination && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.destination}</p>
                    )}
                  </div>

                  {/* Campo Fecha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={today}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.date ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.date && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
                    )}
                  </div>

                  {/* Campo Hora */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.time ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.time && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.time}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles del viaje */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Viaje</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campo Asientos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Número de Asientos *
                    </label>
                    <select
                      value={formData.seats}
                      onChange={(e) => handleInputChange('seats', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.seats ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona asientos</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} asiento{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    {validationErrors.seats && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.seats}</p>
                    )}
                  </div>

                  {/* Campo Precio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Precio por Asiento *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        max="1000"
                        step="0.01"
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        €
                      </span>
                    </div>
                    {validationErrors.price && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                    )}
                  </div>
                </div>

                {/* Campo Notas */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Ej: Viaje cómodo, música suave, paradas frecuentes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.originCoords || !formData.destinationCoords}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creando Viaje...
                    </>
                  ) : (
                    <>
                      <Car className="w-5 h-5" />
                      Crear Viaje
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Panel lateral - Vista previa */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h2>
              
              {/* Ruta */}
              {formData.origin && formData.destination && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Route className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Ruta</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-900">{formData.origin}</span>
                    </div>
                    
                    <div className="ml-1.5 h-px bg-gray-300 relative">
                      <Car className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-900">{formData.destination}</span>
                    </div>
                  </div>
                  
                  {/* Información de distancia */}
                  {routeDistance && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800">
                          Distancia aproximada: {formatDistance(routeDistance)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detalles del viaje */}
              {formData.date && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fecha y Hora</h3>
                  <div className="text-gray-900">
                    {formData.date && new Date(formData.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {formData.time && (
                      <span className="text-gray-600 ml-2">
                        a las {formData.time}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Resumen de precio */}
              {formData.seats && formData.price && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de Precio</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio por asiento:</span>
                      <span className="font-medium">{parseFloat(formData.price).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número de asientos:</span>
                      <span className="font-medium">{formData.seats}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="text-gray-900 font-medium">Total por viaje:</span>
                      <span className="font-bold text-blue-600">
                        {(parseFloat(formData.price) * parseInt(formData.seats)).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Estado del formulario */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Estado</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.originCoords ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm ${
                      formData.originCoords ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Origen seleccionado
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.destinationCoords ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm ${
                      formData.destinationCoords ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Destino seleccionado
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.date && formData.time ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm ${
                      formData.date && formData.time ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Fecha y hora configuradas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.seats && formData.price ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm ${
                      formData.seats && formData.price ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Detalles completos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}