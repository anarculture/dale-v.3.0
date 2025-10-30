'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { api, Ride } from '@/lib/api';
import { maps, PlaceResult } from '@/lib/maps';
import { MapPin, Calendar, Users, DollarSign, FileText, ArrowRight, Clock, Loader } from 'lucide-react';

interface FormData {
  fromCity: string;
  fromLat: number;
  fromLng: number;
  toCity: string;
  toLat: number;
  toLng: number;
  date: string;
  time: string;
  seatsTotal: number;
  price: number;
  notes: string;
}

interface FormErrors {
  fromCity?: string;
  toCity?: string;
  date?: string;
  time?: string;
  seatsTotal?: string;
  price?: string;
  notes?: string;
  general?: string;
}

interface OfferFormProps {
  onSuccess?: (ride: Ride) => void;
  onCancel?: () => void;
}

export default function OfferForm({ onSuccess, onCancel }: OfferFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    fromCity: '',
    fromLat: 0,
    fromLng: 0,
    toCity: '',
    toLat: 0,
    toLng: 0,
    date: '',
    time: '',
    seatsTotal: 1,
    price: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<PlaceResult[]>([]);
  const [toSuggestions, setToSuggestions] = useState<PlaceResult[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  // Validación en tiempo real
  const validateField = useCallback((name: string, value: any) => {
    switch (name) {
      case 'fromCity':
        if (!value.trim()) return 'El origen es obligatorio';
        return '';
      case 'toCity':
        if (!value.trim()) return 'El destino es obligatorio';
        if (value.trim().toLowerCase() === formData.fromCity.trim().toLowerCase()) {
          return 'El destino debe ser diferente al origen';
        }
        return '';
      case 'date':
        if (!value) return 'La fecha es obligatoria';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'La fecha debe ser hoy o posterior';
        return '';
      case 'time':
        if (!value) return 'La hora es obligatoria';
        return '';
      case 'seatsTotal':
        if (value < 1) return 'Debe haber al menos 1 asiento disponible';
        if (value > 8) return 'No se pueden ofrecer más de 8 asientos';
        return '';
      case 'price':
        if (value < 0) return 'El precio no puede ser negativo';
        if (value > 1000) return 'El precio máximo es $1000';
        return '';
      case 'notes':
        if (value.length > 500) return 'Las notas no pueden exceder 500 caracteres';
        return '';
      default:
        return '';
    }
  }, [formData.fromCity]);

  // Actualizar campo y validar
  const updateField = (name: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Búsqueda de lugares con Google Places
  const searchPlaces = async (query: string, type: 'from' | 'to') => {
    if (query.length < 2) {
      if (type === 'from') {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    try {
      const places = await maps.searchPlaces(query);
      if (type === 'from') {
        setFromSuggestions(places);
        setShowFromSuggestions(true);
      } else {
        setToSuggestions(places);
        setShowToSuggestions(true);
      }
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  // Seleccionar lugar desde sugerencias
  const selectPlace = (place: PlaceResult, type: 'from' | 'to') => {
    if (type === 'from') {
      setFormData(prev => ({
        ...prev,
        fromCity: place.name,
        fromLat: place.lat,
        fromLng: place.lng,
      }));
      setShowFromSuggestions(false);
      setErrors(prev => ({ ...prev, fromCity: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        toCity: place.name,
        toLat: place.lat,
        toLng: place.lng,
      }));
      setShowToSuggestions(false);
      setErrors(prev => ({ ...prev, toCity: '' }));
    }
  };

  // Calcular distancia de la ruta
  const calculateRouteDistance = useCallback(async () => {
    if (formData.fromLat && formData.toLat) {
      setIsCalculatingDistance(true);
      try {
        const distance = await maps.calculateDistance(
          { lat: formData.fromLat, lng: formData.fromLng },
          { lat: formData.toLat, lng: formData.toLng }
        );
        setRouteDistance(distance);
      } catch (error) {
        console.error('Error calculating distance:', error);
        setRouteDistance(0);
      } finally {
        setIsCalculatingDistance(false);
      }
    }
  }, [formData.fromLat, formData.fromLng, formData.toLat, formData.toLng]);

  // Recalcular distancia cuando cambien origen o destino
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateRouteDistance();
    }, 500);

    return () => clearTimeout(timer);
  }, [calculateRouteDistance]);

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key]);
      if (error) {
        (newErrors as any)[key] = error;
      }
    });

    // Validación adicional: fecha y hora combinadas
    if (formData.date && formData.time) {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      if (dateTime <= now) {
        newErrors.date = 'La fecha y hora debe ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrors({ general: 'Debes estar autenticado para crear una oferta' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Combinar fecha y hora
      const dateTime = `${formData.date}T${formData.time}:00`;
      
      // Obtener token de sesión
      const { data: { session } } = await (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ).auth.getSession();

      if (!session?.access_token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const rideData = {
        from_city: formData.fromCity,
        from_lat: formData.fromLat,
        from_lon: formData.fromLng,
        to_city: formData.toCity,
        to_lat: formData.toLat,
        to_lon: formData.toLng,
        date_time: dateTime,
        seats_total: formData.seatsTotal,
        price: formData.price,
        notes: formData.notes || undefined,
      };

      const response = await api.createRide(rideData, session.access_token);

      if (response.success && response.data) {
        onSuccess?.(response.data);
        // Reset form
        setFormData({
          fromCity: '',
          fromLat: 0,
          fromLng: 0,
          toCity: '',
          toLat: 0,
          toLng: 0,
          date: '',
          time: '',
          seatsTotal: 1,
          price: 0,
          notes: '',
        });
      } else {
        setErrors({ general: response.error || 'Error al crear la oferta' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
      console.error('Error creating ride:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatear fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Formatear hora mínima
  const getMinTime = () => {
    if (formData.date === getMinDate()) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes() + 5).padStart(2, '0'); // +5 minutos de缓冲
      return `${hours}:${minutes}`;
    }
    return '00:00';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nueva Oferta de Viaje</h2>
        <p className="text-gray-600">Completa los detalles de tu viaje para ofrecerlo a otros usuarios</p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origen y Destino */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Origen */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Origen
            </label>
            <input
              type="text"
              value={formData.fromCity}
              onChange={(e) => {
                updateField('fromCity', e.target.value);
                searchPlaces(e.target.value, 'from');
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.fromCity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="¿Desde dónde viajas?"
            />
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {fromSuggestions.map((place, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectPlace(place, 'from')}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            )}
            {errors.fromCity && <p className="mt-1 text-sm text-red-600">{errors.fromCity}</p>}
          </div>

          {/* Campo Destino */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ArrowRight className="inline w-4 h-4 mr-1" />
              Destino
            </label>
            <input
              type="text"
              value={formData.toCity}
              onChange={(e) => {
                updateField('toCity', e.target.value);
                searchPlaces(e.target.value, 'to');
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.toCity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="¿A dónde viajas?"
            />
            {showToSuggestions && toSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {toSuggestions.map((place, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectPlace(place, 'to')}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            )}
            {errors.toCity && <p className="mt-1 text-sm text-red-600">{errors.toCity}</p>}
          </div>
        </div>

        {/* Vista previa de ruta */}
        {routeDistance > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                Vista previa de la ruta
              </span>
              {isCalculatingDistance ? (
                <Loader className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <span className="text-sm text-blue-700">
                  {maps.formatDistance(routeDistance)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Fecha de viaje
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              min={getMinDate()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Hora de salida
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => updateField('time', e.target.value)}
              min={getMinTime()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>

        {/* Asientos y Precio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Asientos disponibles
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.seatsTotal}
              onChange={(e) => updateField('seatsTotal', parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.seatsTotal ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.seatsTotal && <p className="mt-1 text-sm text-red-600">{errors.seatsTotal}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Precio por asiento (opcional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Notas adicionales (opcional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.notes ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Información adicional sobre el viaje, preferencias, etc."
          />
          <div className="flex justify-between">
            {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.notes.length}/500 caracteres
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creando oferta...
              </span>
            ) : (
              'Crear Oferta'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}