import React from 'react';
import { DCard } from '@/components/ui/DCard';
import { Ride } from '@/lib/api';
import { User, MapPin, Clock } from 'lucide-react';
import { Avatar } from '@heroui/react';

interface RideCardProps {
  ride: Ride;
  onClick?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Mock arrival time (2 hours later) for MVP since backend might not provide it yet
  // or just use the same date if it's a single point. 
  // Assuming ride.date_time is departure.
  const departureDate = new Date(ride.date_time);
  const arrivalDate = new Date(departureDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours mock

  return (
    <DCard 
      className="hover:shadow-md transition-shadow cursor-pointer border border-gray-100" 
      noPadding
      isPressable
      onPress={onClick}
    >
      <div className="p-4 flex flex-row justify-between items-stretch">
        {/* Left: Route Info */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Departure */}
          <div className="flex flex-row gap-3 items-start">
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <span className="font-bold text-lg text-gray-900">{formatDate(ride.date_time)}</span>
              {/* <span className="text-xs text-gray-500">Duration</span> */}
            </div>
            <div className="flex flex-col items-center pt-1.5 h-full">
              <div className="w-3 h-3 rounded-full border-2 border-gray-800 bg-white z-10"></div>
              <div className="w-0.5 bg-gray-300 flex-1 my-1"></div>
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="font-bold text-lg text-gray-800">{ride.from_city}</span>
              <span className="text-sm text-gray-500 truncate max-w-[150px]">{ride.from_lat.toFixed(2)}, {ride.from_lon.toFixed(2)}</span>
            </div>
          </div>

          {/* Arrival */}
          <div className="flex flex-row gap-3 items-start">
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <span className="font-bold text-lg text-gray-500">{formatDate(arrivalDate.toISOString())}</span>
            </div>
            <div className="flex flex-col items-center pt-1.5">
              <div className="w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-800 z-10"></div>
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="font-bold text-lg text-gray-800">{ride.to_city}</span>
              <span className="text-sm text-gray-500 truncate max-w-[150px]">{ride.to_lat.toFixed(2)}, {ride.to_lon.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Price & Driver */}
        <div className="flex flex-col justify-between items-end pl-4 border-l border-gray-100 min-w-[100px]">
          <div className="text-2xl font-bold text-green-600">
            ${ride.price?.toFixed(2) || '0.00'}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {ride.driver?.name || 'Driver'}
              </span>
              <Avatar 
                src={ride.driver?.avatar_url || undefined} 
                name={ride.driver?.name?.charAt(0) || 'D'}
                size="sm"
                isBordered
                color="primary"
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User size={12} />
              <span>{ride.seats_available ?? 0} seats</span>
            </div>
          </div>
        </div>
      </div>
    </DCard>
  );
};
