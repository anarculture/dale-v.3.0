'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, ChevronLeft, Loader2 } from 'lucide-react';
import { RideSearchParams, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { FullScreenDatePicker } from '@/components/ui/FullScreenDatePicker';

// Top 5 ciudades de Venezuela por población - rutas más transitadas
const POPULAR_CITIES = [
  'Caracas',
  'Maracaibo',
  'Valencia',
  'Barquisimeto',
  'Maracay',
];

interface RideSearchFormProps {
  onSearch: (params: RideSearchParams) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

interface CityInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CityInput: React.FC<CityInputProps> = ({ label, placeholder, value, onChange, error }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCities = POPULAR_CITIES.filter(city =>
    city.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => setShowSuggestions(true);
  const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);
  const handleSelectCity = (city: string) => {
    onChange(city);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full" ref={containerRef}>
      <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        {showSuggestions && filteredCities.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
            <div className="p-2">
              <p className="px-3 py-1 text-xs text-[#6b7280] uppercase tracking-wide">Ciudades populares</p>
            </div>
            {filteredCities.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={() => handleSelectCity(city)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#fff7ed] transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-[#fd5810]" />
                <span className="text-[#1a1a1a]">{city}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const RideSearchForm: React.FC<RideSearchFormProps> = ({ onSearch, onBack, isLoading = false }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fromCity.trim()) newErrors.fromCity = 'Ciudad de origen requerida';
    else if (fromCity.length < 2) newErrors.fromCity = 'Mínimo 2 caracteres';
    if (!toCity.trim()) newErrors.toCity = 'Ciudad de destino requerida';
    else if (toCity.length < 2) newErrors.toCity = 'Mínimo 2 caracteres';
    if (!date) {
      newErrors.date = 'Fecha requerida';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = 'La fecha debe ser futura';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      onSearch({ from_city: fromCity.trim(), to_city: toCity.trim(), date, min_seats: passengers });
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.detail || 'Error al buscar viajes');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        <div className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
              <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
            </button>
          )}
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Buscar viaje</h2>
        </div>
        <div className="p-6">
          <div className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
            <CityInput label="¿Desde dónde?" placeholder="Ciudad de origen" value={fromCity} onChange={setFromCity} error={errors.fromCity} />
            <CityInput label="¿A dónde vas?" placeholder="Ciudad de destino" value={toCity} onChange={setToCity} error={errors.toCity} />
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Fecha</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]"><Calendar className="w-5 h-5" /></div>
                <input 
                  type="text" 
                  readOnly
                  placeholder="Seleccionar fecha"
                  value={date ? format(new Date(date), 'dd/MM/yyyy') : ''}
                  onClick={() => setShowDatePicker(true)}
                  className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white cursor-pointer select-none ${errors.date ? 'border-red-500' : ''}`} 
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Pasajeros</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-12 h-12 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" disabled={passengers <= 1}>−</button>
                <div className="flex-1 h-14 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#6b7280] mr-2" />
                  <span className="text-lg font-medium text-[#1a1a1a]">{passengers}</span>
                </div>
                <button type="button" onClick={() => setPassengers(Math.min(8, passengers + 1))} className="w-12 h-12 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" disabled={passengers >= 8}>+</button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button onClick={handleSubmit} disabled={isLoading} className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Buscando...</>) : 'Buscar'}
            </button>
          </div>
          <div className="mt-6 p-4 bg-[#fff7ed] rounded-xl">
            <p className="text-sm text-[#fd5810]">💡 <span className="text-[#6b7280]">Consejo: Reserva con anticipación para mejores precios</span></p>
          </div>
          <FullScreenDatePicker 
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onSelect={(d) => setDate(d.toISOString())}
            selectedDate={date ? new Date(date) : null}
            minDate={new Date()}
            variant="fullscreen"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-12">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Buscar un viaje</h1>
            <p className="text-lg text-[#6b7280]">Encuentra conductores en tu ruta y viaja cómodo</p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-lg space-y-6 relative overflow-hidden">
            <div className="grid grid-cols-2 gap-6">
              <CityInput label="¿Desde dónde?" placeholder="Ciudad de origen" value={fromCity} onChange={setFromCity} error={errors.fromCity} />
              <CityInput label="¿A dónde vas?" placeholder="Ciudad de destino" value={toCity} onChange={setToCity} error={errors.toCity} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Fecha</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]"><Calendar className="w-5 h-5" /></div>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="Seleccionar fecha"
                    value={date ? format(new Date(date), 'dd/MM/yyyy') : ''}
                    onClick={() => setShowDatePicker(true)}
                    className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white cursor-pointer select-none ${errors.date ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Pasajeros</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-14 h-14 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" disabled={passengers <= 1}>−</button>
                  <div className="flex-1 h-14 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#6b7280] mr-2" />
                    <span className="text-lg font-medium text-[#1a1a1a]">{passengers}</span>
                  </div>
                  <button type="button" onClick={() => setPassengers(Math.min(8, passengers + 1))} className="w-14 h-14 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" disabled={passengers >= 8}>+</button>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button onClick={handleSubmit} disabled={isLoading} className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Buscando...</>) : 'Buscar viajes disponibles'}
              </button>
            </div>
            <FullScreenDatePicker 
              isOpen={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              onSelect={(d) => setDate(d.toISOString())}
              selectedDate={date ? new Date(date) : null}
              minDate={new Date()}
              variant="embedded"
            />
          </div>
          <div className="mt-6 p-6 bg-[#fff7ed] rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💡</span>
              <div>
                <h3 className="font-semibold text-[#fd5810] mb-2">Consejos para tu búsqueda</h3>
                <ul className="text-sm text-[#6b7280] space-y-1">
                  <li>• Reserva con anticipación para mejores precios</li>
                  <li>• Revisa las valoraciones de los conductores</li>
                  <li>• Consulta las políticas de equipaje antes de reservar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
