'use client';

import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { Ride } from '@/lib/api';

interface RideCardProps {
  ride: Ride;
  onClick?: () => void;
  className?: string;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onClick, className = '' }) => {
  // Format time from ISO date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Calculate mock arrival time (+2 hours) since backend doesn't provide it
  const departureDate = new Date(ride.date_time);
  const arrivalDate = new Date(departureDate.getTime() + 2 * 60 * 60 * 1000);

  // Driver info with fallbacks
  const driverName = ride.driver?.name || 'Conductor';
  const driverAvatar = ride.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${driverName}`;
  const isVerified = true; // Mock verification status - not in API yet
  const driverRating = 4.8; // Mock rating - not in API yet

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-5 shadow-sm border border-gray-100
        hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]
        ${className}
      `}
    >
      {/* Route Timeline */}
      <div className="flex items-start gap-4 mb-4">
        {/* Timeline dots */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <div className="w-3 h-3 rounded-full bg-[#fd5810]" />
          <div className="w-0.5 h-12 bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-[#fd5810]" />
        </div>
        
        {/* Route details */}
        <div className="flex-1 space-y-3">
          {/* Origin */}
          <div>
            <div className="text-lg font-semibold text-[#1a1a1a]">{formatTime(ride.date_time)}</div>
            <div className="text-sm text-[#6b7280]">{ride.from_city}</div>
          </div>
          
          {/* Destination */}
          <div>
            <div className="text-lg font-semibold text-[#1a1a1a]">{formatTime(arrivalDate.toISOString())}</div>
            <div className="text-sm text-[#6b7280]">{ride.to_city}</div>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <div className="text-2xl font-bold text-[#1a1a1a]">
            ${ride.price?.toFixed(0) || '0'}
          </div>
          <div className="text-xs text-[#6b7280]">por persona</div>
        </div>
      </div>
      
      {/* Driver Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar with verification badge */}
          <div className="relative">
            <img
              src={driverAvatar}
              alt={driverName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#fd5810] rounded-full flex items-center justify-center">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-[#1a1a1a]">{driverName}</div>
            <div className="text-xs text-[#6b7280]">★ {driverRating}</div>
          </div>
        </div>
        
        {/* Seats available */}
        <div className="text-xs text-[#6b7280]">
          {ride.seats_available} {ride.seats_available === 1 ? 'asiento' : 'asientos'}
        </div>
      </div>
    </div>
  );
};
