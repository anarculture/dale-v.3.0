import React from 'react';
import { ChevronLeft, SlidersHorizontal, Calendar } from 'lucide-react';
import { RideCard, Ride } from '../dale/RideCard';

interface SearchResultsScreenProps {
  origin: string;
  destination: string;
  date: string;
  rides: Ride[];
  onBack?: () => void;
  onRideClick?: (ride: Ride) => void;
}

export function SearchResultsScreen({ 
  origin, 
  destination, 
  date, 
  rides, 
  onBack,
  onRideClick 
}: SearchResultsScreenProps) {
  return (
    <div className="min-h-screen bg-[#fffbf3] pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 mb-3">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
              <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
            </button>
          )}
          <h2 className="text-xl text-[#1a1a1a] flex-1">
            {origin} → {destination}
          </h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <SlidersHorizontal className="w-5 h-5 text-[#6b7280]" />
          </button>
        </div>
        
        {/* Date Filter Pill */}
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff7ed] text-[#fd5810] rounded-full text-sm hover:bg-[#ffedd5] transition">
            <Calendar className="w-4 h-4" />
            {new Date(date).toLocaleDateString('es-ES', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3f4f6] text-[#6b7280] rounded-full text-sm hover:bg-[#e5e7eb] transition">
            Precio más bajo
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 space-y-4">
        {rides.length > 0 ? (
          <>
            <p className="text-sm text-[#6b7280]">
              {rides.length} {rides.length === 1 ? 'viaje encontrado' : 'viajes encontrados'}
            </p>
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onClick={() => onRideClick?.(ride)}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-[#1a1a1a] mb-2">No hay viajes disponibles</h3>
            <p className="text-[#6b7280]">
              Intenta buscar en otra fecha o publica tu propio viaje
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
