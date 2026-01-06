'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { searchPlaces, PlaceSuggestion } from '@/lib/maps';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

// Top 5 ciudades de Venezuela por población - rutas más transitadas
const POPULAR_CITIES = [
  { name: 'Caracas', description: 'Distrito Capital, Venezuela' },
  { name: 'Maracaibo', description: 'Estado Zulia, Venezuela' },
  { name: 'Valencia', description: 'Estado Carabobo, Venezuela' },
  { name: 'Barquisimeto', description: 'Estado Lara, Venezuela' },
  { name: 'Maracay', description: 'Estado Aragua, Venezuela' },
];

interface CityAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string, placeId?: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function CityAutocomplete({
  label,
  value,
  onChange,
  error,
  placeholder = 'Escribe una ciudad...',
  required = false,
}: CityAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtrar ciudades populares según el input
  const filteredPopularCities = POPULAR_CITIES.filter(city =>
    city.name.toLowerCase().includes(value.toLowerCase())
  );

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowPopular(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar sugerencias cuando el usuario escribe
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (value.length >= 3) {
        setLoading(true);
        try {
          const results = await searchPlaces(value);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          setShowPopular(false);
        } catch (error) {
          console.error('Error searching places:', error);
          setSuggestions([]);
          // Si falla la API, mostrar ciudades populares con filtro
          setShowPopular(filteredPopularCities.length > 0);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    // Mostrar ciudades populares al enfocar si no hay input o hay pocas letras
    if (value.length < 3) {
      setShowPopular(true);
    }
  };

  const handleSelectSuggestion = (suggestion: PlaceSuggestion) => {
    onChange(suggestion.main_text, suggestion.place_id);
    setShowSuggestions(false);
    setShowPopular(false);
    setSuggestions([]);
  };

  const handleSelectPopularCity = (cityName: string) => {
    onChange(cityName);
    setShowPopular(false);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        label={label}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        error={error}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-4 top-11 text-neutral-400">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Ciudades populares de Venezuela */}
      {showPopular && !showSuggestions && filteredPopularCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-neutral-100">
            <p className="px-3 py-1 text-xs text-[#6b7280] uppercase tracking-wide">
              Ciudades populares
            </p>
          </div>
          {filteredPopularCities.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleSelectPopularCity(city.name)}
              className={cn(
                'w-full text-left px-4 py-3 hover:bg-[#fff7ed] transition-colors',
                'border-b border-neutral-100 last:border-b-0 flex items-center gap-3'
              )}
            >
              <MapPin className="w-4 h-4 text-[#fd5810]" />
              <div>
                <p className="font-medium text-neutral-900">{city.name}</p>
                <p className="text-sm text-neutral-500">{city.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Sugerencias de Google Places */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className={cn(
                'w-full text-left px-4 py-3 hover:bg-[#fff7ed] transition-colors',
                'border-b border-neutral-100 last:border-b-0'
              )}
            >
              <p className="font-medium text-neutral-900">{suggestion.main_text}</p>
              <p className="text-sm text-neutral-500">{suggestion.secondary_text}</p>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && !loading && value.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg p-4 text-center">
          <p className="text-sm text-neutral-500">No se encontraron ciudades</p>
        </div>
      )}
    </div>
  );
}
