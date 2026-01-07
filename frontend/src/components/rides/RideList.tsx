'use client';

import React from 'react';
import { ChevronLeft, SlidersHorizontal, Calendar } from 'lucide-react';
import { Ride } from '@/lib/api';
import { RideCard } from './RideCard';

interface RideListProps {
  rides: Ride[];
  loading: boolean;
  origin?: string;
  destination?: string;
  date?: string;
  onRideClick?: (ride: Ride) => void;
  onBack?: () => void;
}

export const RideList: React.FC<RideListProps> = ({ 
  rides, 
  loading,
  origin,
  destination,
  date,
  onRideClick,
  onBack
}) => {
  // Format date for display
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatDisplayDateLong = (dateStr?: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf3] flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#fd5810] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#6b7280] text-sm">Buscando los mejores viajes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        {/* Header */}
        <div className="bg-white px-6 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            {onBack && (
              <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
                <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-[#1a1a1a] flex-1">
              {origin || 'Origen'} → {destination || 'Destino'}
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <SlidersHorizontal className="w-5 h-5 text-[#6b7280]" />
            </button>
          </div>
          
          {/* Date Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {date && (
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff7ed] text-[#fd5810] rounded-full text-sm hover:bg-[#ffedd5] transition">
                <Calendar className="w-4 h-4" />
                {formatDisplayDate(date)}
              </button>
            )}
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
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">No hay viajes disponibles</h3>
              <p className="text-[#6b7280]">
                Intenta buscar en otra fecha o publica tu propio viaje
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {onBack && (
                <button 
                  onClick={onBack} 
                  className="p-2 hover:bg-white rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
                </button>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#1a1a1a]">
                  {origin || 'Origen'} → {destination || 'Destino'}
                </h1>
                <p className="text-[#6b7280] mt-1">
                  {rides.length} {rides.length === 1 ? 'viaje encontrado' : 'viajes encontrados'}
                </p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              {date && (
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#fd5810] rounded-xl hover:shadow-md transition border-2 border-[#fd5810]">
                  <Calendar className="w-4 h-4" />
                  {formatDisplayDateLong(date)}
                </button>
              )}
              <button className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#6b7280] rounded-xl hover:shadow-md transition">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#6b7280] rounded-xl hover:shadow-md transition">
                Precio más bajo
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#6b7280] rounded-xl hover:shadow-md transition">
                Hora de salida
              </button>
            </div>
          </div>

          {/* Results Grid */}
          {rides.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onClick={() => onRideClick?.(ride)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-3">No hay viajes disponibles</h3>
              <p className="text-lg text-[#6b7280] mb-6">
                Intenta buscar en otra fecha o publica tu propio viaje
              </p>
              <button className="px-6 py-3 bg-[#fd5810] text-white rounded-xl hover:bg-[#e54f0e] transition font-semibold">
                Publicar mi viaje
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
