'use client';

import React from 'react';
import { Ride } from '@/lib/api';
import { RideCard } from './RideCard';

interface RideListProps {
  rides: Ride[];
  loading: boolean;
  origin?: string;
  destination?: string;
  date?: string;
  onRideClick?: (ride: Ride) => void;
}

export const RideList: React.FC<RideListProps> = ({ 
  rides, 
  loading,
  origin,
  destination,
  date,
  onRideClick 
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#fd5810] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#6b7280] text-sm">Buscando los mejores viajes...</p>
      </div>
    );
  }

  // Empty state
  if (rides.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">No hay viajes disponibles</h3>
        <p className="text-[#6b7280]">
          Intenta buscar en otra fecha o publica tu propio viaje
        </p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-[#fffbf3] pb-24">
      {/* Results Header */}
      {(origin || destination) && (
        <div className="bg-white px-6 py-4 sticky top-0 z-10 shadow-sm mb-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-3">
            {origin || 'Origen'} → {destination || 'Destino'}
          </h2>
          
          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {date && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff7ed] text-[#fd5810] rounded-full text-sm">
                📅 {formatDisplayDate(date)}
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3f4f6] text-[#6b7280] rounded-full text-sm">
              Precio más bajo
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6 space-y-4">
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
      </div>
    </div>
  );
};
