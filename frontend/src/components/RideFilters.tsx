// RideFilters component with Google Places integration
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, DollarSign, MapPin } from 'lucide-react';
import { maps, PlaceResult } from '@/lib/maps';

interface RideFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

interface FilterState {
  origin: string;
  destination: string;
  date: string;
  maxPrice: number;
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
}

export default function RideFilters({ onFiltersChange, isLoading = false }: RideFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    origin: '',
    destination: '',
    date: '',
    maxPrice: 50,
  });

  const [originSuggestions, setOriginSuggestions] = useState<PlaceResult[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlaceResult[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const originTimeoutRef = useRef<NodeJS.Timeout>();
  const destinationTimeoutRef = useRef<NodeJS.Timeout>();

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  // Inicializar Google Places cuando se monta el componente
  useEffect(() => {
    const initPlaces = async () => {
      try {
        await maps.init();
      } catch (error) {
        console.error('Error initializing Google Places:', error);
      }
    };
    
    initPlaces();
  }, []);

  // Notificar cambios de filtros al componente padre
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleOriginChange = async (value: string) => {
    setFilters(prev => ({ ...prev, origin: value }));
    
    if (originTimeoutRef.current) {
      clearTimeout(originTimeoutRef.current);
    }

    if (value.length < 3) {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
      return;
    }

    originTimeoutRef.current = setTimeout(async () => {
      try {
        const suggestions = await maps.searchPlaces(value);
        setOriginSuggestions(suggestions.slice(0, 5)); // Limitar a 5 resultados
        setShowOriginSuggestions(true);
      } catch (error) {
        console.error('Error searching origin places:', error);
      }
    }, 300);
  };

  const handleDestinationChange = async (value: string) => {
    setFilters(prev => ({ ...prev, destination: value }));
    
    if (destinationTimeoutRef.current) {
      clearTimeout(destinationTimeoutRef.current);
    }

    if (value.length < 3) {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      return;
    }

    destinationTimeoutRef.current = setTimeout(async () => {
      try {
        const suggestions = await maps.searchPlaces(value);
        setDestinationSuggestions(suggestions.slice(0, 5)); // Limitar a 5 resultados
        setShowDestinationSuggestions(true);
      } catch (error) {
        console.error('Error searching destination places:', error);
      }
    }, 300);
  };

  const selectOrigin = (place: PlaceResult) => {
    setFilters(prev => ({
      ...prev,
      origin: place.name,
      originCoords: { lat: place.lat, lng: place.lng }
    }));
    setShowOriginSuggestions(false);
    if (originInputRef.current) {
      originInputRef.current.blur();
    }
  };

  const selectDestination = (place: PlaceResult) => {
    setFilters(prev => ({
      ...prev,
      destination: place.name,
      destinationCoords: { lat: place.lat, lng: place.lng }
    }));
    setShowDestinationSuggestions(false);
    if (destinationInputRef.current) {
      destinationInputRef.current.blur();
    }
  };

  const swapLocations = () => {
    setFilters(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
      originCoords: prev.destinationCoords,
      destinationCoords: prev.originCoords,
    }));
  };

  const resetFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      date: '',
      maxPrice: 50,
    });
    setOriginSuggestions([]);
    setDestinationSuggestions([]);
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Buscar viajes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Origen */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Origen
          </label>
          <div className="relative">
            <input
              ref={originInputRef}
              type="text"
              value={filters.origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              onFocus={() => {
                if (originSuggestions.length > 0) {
                  setShowOriginSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay para permitir click en sugerencias
                setTimeout(() => setShowOriginSuggestions(false), 200);
              }}
              placeholder="Ciudad de origen"
              className="input-field pr-10"
              disabled={isLoading}
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          {/* Sugerencias de origen */}
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {originSuggestions.map((place, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  onClick={() => selectOrigin(place)}
                  type="button"
                >
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{place.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destino */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Destino
          </label>
          <div className="relative">
            <input
              ref={destinationInputRef}
              type="text"
              value={filters.destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => {
                if (destinationSuggestions.length > 0) {
                  setShowDestinationSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay para permitir click en sugerencias
                setTimeout(() => setShowDestinationSuggestions(false), 200);
              }}
              placeholder="Ciudad de destino"
              className="input-field pr-10"
              disabled={isLoading}
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          {/* Sugerencias de destino */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {destinationSuggestions.map((place, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  onClick={() => selectDestination(place)}
                  type="button"
                >
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{place.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Fecha
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            min={today}
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Precio máximo
          </label>
          <div className="relative">
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 0 }))}
              min="0"
              max="200"
              step="5"
              className="input-field pr-10"
              disabled={isLoading}
            />
            <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="mt-1">
            <input
              type="range"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              min="0"
              max="200"
              step="5"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={swapLocations}
          className="btn-secondary flex items-center justify-center gap-2"
          disabled={isLoading || (!filters.origin && !filters.destination)}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Intercambiar
        </button>
        
        <div className="flex gap-2 ml-auto">
          <button
            onClick={resetFilters}
            className="btn-secondary"
            disabled={isLoading}
            type="button"
          >
            Limpiar
          </button>
          
          <button
            onClick={() => onFiltersChange(filters)}
            className="btn-primary flex items-center gap-2"
            disabled={isLoading}
            type="button"
          >
            <Search className="w-4 h-4" />
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Filtros activos */}
      {(filters.origin || filters.destination || filters.date || filters.maxPrice !== 50) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.origin && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Origen: {filters.origin}
              </span>
            )}
            {filters.destination && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Destino: {filters.destination}
              </span>
            )}
            {filters.date && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Fecha: {new Date(filters.date).toLocaleDateString('es-ES')}
              </span>
            )}
            {filters.maxPrice !== 50 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Max: ${filters.maxPrice}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}