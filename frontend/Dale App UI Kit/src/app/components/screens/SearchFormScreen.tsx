import React, { useState } from 'react';
import { MapPin, Calendar, Users, ChevronLeft } from 'lucide-react';
import { DaleInput } from '../dale/DaleInput';
import { DaleButton } from '../dale/DaleButton';

interface SearchFormScreenProps {
  onSearch: (params: SearchParams) => void;
  onBack?: () => void;
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export function SearchFormScreen({ onSearch, onBack }: SearchFormScreenProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = () => {
    if (origin && destination && date) {
      onSearch({ origin, destination, date, passengers });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3] pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
          </button>
        )}
        <h2 className="text-xl text-[#1a1a1a]">Buscar viaje</h2>
      </div>

      <div className="p-6">
        {/* Search Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <DaleInput
            label="¿Desde dónde?"
            placeholder="Ciudad de origen"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            icon={<MapPin className="w-5 h-5" />}
          />

          <DaleInput
            label="¿A dónde vas?"
            placeholder="Ciudad de destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            icon={<MapPin className="w-5 h-5" />}
          />

          <DaleInput
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar className="w-5 h-5" />}
          />

          {/* Passengers Counter */}
          <div>
            <label className="block mb-2 text-sm text-[#1a1a1a]">
              Pasajeros
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-12 h-12 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95"
                disabled={passengers <= 1}
              >
                −
              </button>
              <div className="flex-1 h-14 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#6b7280] mr-2" />
                <span className="text-lg text-[#1a1a1a]">{passengers}</span>
              </div>
              <button
                onClick={() => setPassengers(Math.min(8, passengers + 1))}
                className="w-12 h-12 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] flex items-center justify-center transition text-[#1a1a1a] text-xl active:scale-95"
                disabled={passengers >= 8}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <DaleButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!origin || !destination || !date}
          >
            Buscar
          </DaleButton>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-[#fff7ed] rounded-xl">
          <p className="text-sm text-[#fd5810]">
            💡 <span className="text-[#6b7280]">Consejo: Reserva con anticipación para mejores precios</span>
          </p>
        </div>
      </div>
    </div>
  );
}
