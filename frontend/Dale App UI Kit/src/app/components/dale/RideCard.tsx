import React from 'react';
import { MapPin, BadgeCheck } from 'lucide-react';
import { cn } from '../ui/utils';

export interface Ride {
  id: string;
  originCity: string;
  originTime: string;
  destinationCity: string;
  destinationTime: string;
  price: number;
  driver: {
    name: string;
    avatar: string;
    verified: boolean;
    rating?: number;
  };
  seatsAvailable: number;
}

interface RideCardProps {
  ride: Ride;
  onClick?: () => void;
  className?: string;
}

export function RideCard({ ride, onClick, className }: RideCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-5 shadow-sm border border-gray-100',
        'hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      {/* Route Timeline */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex flex-col items-center gap-1 pt-1">
          <div className="w-3 h-3 rounded-full bg-[#fd5810]" />
          <div className="w-0.5 h-12 bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-[#fd5810]" />
        </div>
        
        <div className="flex-1 space-y-3">
          {/* Origin */}
          <div>
            <div className="text-lg text-[#1a1a1a]">{ride.originTime}</div>
            <div className="text-sm text-[#6b7280]">{ride.originCity}</div>
          </div>
          
          {/* Destination */}
          <div>
            <div className="text-lg text-[#1a1a1a]">{ride.destinationTime}</div>
            <div className="text-sm text-[#6b7280]">{ride.destinationCity}</div>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <div className="text-2xl text-[#1a1a1a]">${ride.price}</div>
          <div className="text-xs text-[#6b7280]">por persona</div>
        </div>
      </div>
      
      {/* Driver Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {ride.driver.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#fd5810] rounded-full flex items-center justify-center">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-[#1a1a1a]">{ride.driver.name}</div>
            {ride.driver.rating && (
              <div className="text-xs text-[#6b7280]">★ {ride.driver.rating}</div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-[#6b7280]">
          {ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'asiento' : 'asientos'}
        </div>
      </div>
    </div>
  );
}
