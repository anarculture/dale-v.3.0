'use client';

import Image from 'next/image';
import { Ride } from '@/lib/api';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';

interface RideCardProps {
  ride: Ride;
  onBook?: (rideId: string) => void;
  loading?: boolean;
  showBookButton?: boolean;
}

export function RideCard({ 
  ride, 
  onBook, 
  loading = false,
  showBookButton = true 
}: RideCardProps) {
  const handleBookClick = () => {
    if (onBook) {
      onBook(ride.id);
    }
  };

  const hasSeatsFull = ride.seats_available === 0;
  const priceDisplay = ride.price ? `€${ride.price.toFixed(2)}` : 'Gratis';

  return (
    <Card hover>
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Ruta */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-lg font-semibold text-neutral-900">
                  {ride.from_city}
                </p>
                <p className="text-sm text-neutral-500">Origen</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-8 mb-3">
              <span className="text-neutral-400">↓</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-lg font-semibold text-neutral-900">
                  {ride.to_city}
                </p>
                <p className="text-sm text-neutral-500">Destino</p>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {priceDisplay}
            </p>
            <p className="text-xs text-neutral-500">por persona</p>
          </div>
        </div>

        {/* Información del viaje */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
          {/* Fecha y hora */}
          <div>
            <p className="text-xs text-neutral-500 mb-1">Fecha</p>
            <p className="text-sm font-medium text-neutral-900">
              {formatDate(ride.date_time)}
            </p>
            <p className="text-sm text-neutral-700">
              {formatTime(ride.date_time)}
            </p>
          </div>

          {/* Plazas disponibles */}
          <div>
            <p className="text-xs text-neutral-500 mb-1">Plazas</p>
            <p className={`text-sm font-medium ${
              hasSeatsFull ? 'text-error' : 'text-success'
            }`}>
              {ride.seats_available} / {ride.seats_total} disponibles
            </p>
          </div>
        </div>

        {/* Conductor */}
        {ride.driver && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
              {ride.driver.avatar_url ? (
                <Image 
                  src={ride.driver.avatar_url} 
                  alt={ride.driver.name}
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {ride.driver.name}
              </p>
              <p className="text-xs text-neutral-500">Conductor</p>
            </div>
          </div>
        )}

        {/* Notas (si existen) */}
        {ride.notes && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <p className="text-xs text-neutral-500 mb-1">Nota del conductor</p>
            <p className="text-sm text-neutral-700">{ride.notes}</p>
          </div>
        )}
      </CardBody>

      {showBookButton && (
        <CardFooter>
          <Button
            onClick={handleBookClick}
            loading={loading}
            disabled={hasSeatsFull || loading}
            fullWidth
            variant={hasSeatsFull ? 'secondary' : 'primary'}
          >
            {hasSeatsFull ? 'Sin plazas disponibles' : 'Reservar plaza'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
