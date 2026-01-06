'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign, FileText, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Top 5 ciudades de Venezuela por población - rutas más transitadas
const POPULAR_CITIES = [
  'Caracas',
  'Maracaibo',
  'Valencia',
  'Barquisimeto',
  'Maracay',
];

export interface OfferRideData {
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  seats_total: number;
  price: number;
  notes: string;
}

interface OfferRideFormProps {
  onSubmit: (data: OfferRideData) => Promise<void>;
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

export const OfferRideForm: React.FC<OfferRideFormProps> = ({ onSubmit, onBack, isLoading = false }) => {
  const [formData, setFormData] = useState<OfferRideData>({
    from_city: '',
    to_city: '',
    date: '',
    time: '',
    seats_total: 3,
    price: 0,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.from_city.trim()) {
      newErrors.from_city = 'Ciudad de origen requerida';
    }
    if (!formData.to_city.trim()) {
      newErrors.to_city = 'Ciudad de destino requerida';
    }
    if (formData.from_city.toLowerCase() === formData.to_city.toLowerCase() && formData.from_city) {
      newErrors.to_city = 'La ciudad de destino debe ser diferente';
    }
    if (!formData.date) {
      newErrors.date = 'Fecha requerida';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'La fecha debe ser futura';
      }
    }
    if (!formData.time) {
      newErrors.time = 'Hora requerida';
    }
    if (formData.seats_total < 1 || formData.seats_total > 8) {
      newErrors.seats_total = 'Entre 1 y 8 asientos';
    }
    if (formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error('Error al publicar el viaje');
    }
  };

  const updateField = (field: keyof OfferRideData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Publicar viaje</h2>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            {/* Origin */}
            <CityInput 
              label="¿Desde dónde sales?" 
              placeholder="Ciudad de origen" 
              value={formData.from_city} 
              onChange={(v) => updateField('from_city', v)} 
              error={errors.from_city} 
            />

            {/* Destination */}
            <CityInput 
              label="¿A dónde vas?" 
              placeholder="Ciudad de destino" 
              value={formData.to_city} 
              onChange={(v) => updateField('to_city', v)} 
              error={errors.to_city} 
            />

            {/* Date */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Fecha de salida</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  <Calendar className="w-5 h-5" />
                </div>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => updateField('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${errors.date ? 'border-red-500' : ''}`} 
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Time */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Hora de salida</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  <Clock className="w-5 h-5" />
                </div>
                <input 
                  type="time" 
                  value={formData.time} 
                  onChange={(e) => updateField('time', e.target.value)}
                  className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${errors.time ? 'border-red-500' : ''}`} 
                />
              </div>
              {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
            </div>

            {/* Seats */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Asientos disponibles</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => updateField('seats_total', Math.max(1, formData.seats_total - 1))} 
                  className="w-12 h-12 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" 
                  disabled={formData.seats_total <= 1}
                >−</button>
                <div className="flex-1 h-14 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#6b7280] mr-2" />
                  <span className="text-lg font-medium text-[#1a1a1a]">{formData.seats_total}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => updateField('seats_total', Math.min(8, formData.seats_total + 1))} 
                  className="w-12 h-12 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" 
                  disabled={formData.seats_total >= 8}
                >+</button>
              </div>
            </div>

            {/* Price */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Precio por asiento ($)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  step="0.5"
                  value={formData.price} 
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${errors.price ? 'border-red-500' : ''}`} 
                />
              </div>
              <p className="mt-1 text-xs text-[#6b7280]">Deja en 0 si el viaje es gratis</p>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            {/* Notes */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Notas adicionales (opcional)</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-[#6b7280]">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Ej: Salida desde el centro comercial. Acepto mascotas..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 pl-12 py-3 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white resize-none"
                />
              </div>
              <p className="mt-1 text-xs text-[#6b7280] text-right">{formData.notes.length}/500</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Publicando...</>) : 'Publicar viaje'}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-[#fff7ed] rounded-xl">
            <p className="text-sm text-[#fd5810]">
              💡 <span className="text-[#6b7280]">Consejo: Indica claramente el punto de encuentro para facilitar la coordinación</span>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-12">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] transition mb-4">
                <ChevronLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
            )}
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Publicar un viaje</h1>
            <p className="text-lg text-[#6b7280]">Comparte tu viaje y ahorra en cada trayecto</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            {/* Cities Row */}
            <div className="grid grid-cols-2 gap-6">
              <CityInput 
                label="¿Desde dónde sales?" 
                placeholder="Ciudad de origen" 
                value={formData.from_city} 
                onChange={(v) => updateField('from_city', v)} 
                error={errors.from_city} 
              />
              <CityInput 
                label="¿A dónde vas?" 
                placeholder="Ciudad de destino" 
                value={formData.to_city} 
                onChange={(v) => updateField('to_city', v)} 
                error={errors.to_city} 
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Fecha de salida</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => updateField('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${errors.date ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Hora de salida</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <input 
                    type="time" 
                    value={formData.time} 
                    onChange={(e) => updateField('time', e.target.value)}
                    className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${errors.time ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
              </div>
            </div>

            {/* Seats & Price Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Asientos disponibles</label>
                <div className="flex items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => updateField('seats_total', Math.max(1, formData.seats_total - 1))} 
                    className="w-14 h-14 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" 
                    disabled={formData.seats_total <= 1}
                  >−</button>
                  <div className="flex-1 h-14 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#6b7280] mr-2" />
                    <span className="text-lg font-medium text-[#1a1a1a]">{formData.seats_total}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => updateField('seats_total', Math.min(8, formData.seats_total + 1))} 
                    className="w-14 h-14 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95 disabled:opacity-50" 
                    disabled={formData.seats_total >= 8}
                  >+</button>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Precio por asiento ($)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    step="0.5"
                    value={formData.price} 
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white ${errors.price ? 'border-red-500' : ''}`} 
                  />
                </div>
                <p className="mt-1 text-xs text-[#6b7280]">Deja en 0 si el viaje es gratis</p>
              </div>
            </div>

            {/* Notes */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">Notas adicionales (opcional)</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-[#6b7280]">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Ej: Salida desde el centro comercial. Acepto mascotas. Parada en el camino..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 pl-12 py-3 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white resize-none"
                />
              </div>
              <p className="mt-1 text-xs text-[#6b7280] text-right">{formData.notes.length}/500</p>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Publicando...</>) : 'Publicar viaje'}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-6 bg-[#fff7ed] rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💡</span>
              <div>
                <h3 className="font-semibold text-[#fd5810] mb-2">Consejos para tu viaje</h3>
                <ul className="text-sm text-[#6b7280] space-y-1">
                  <li>• Indica claramente el punto de encuentro</li>
                  <li>• Especifica si aceptas mascotas o equipaje grande</li>
                  <li>• Sé puntual para generar buenas valoraciones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
