import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
  Car,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Ride {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  driver: {
    id: string;
    name: string;
    rating: number;
    totalRides: number;
    avatar?: string;
    phone?: string;
  };
}

interface RideCardProps {
  ride: Ride;
  onReserve?: (rideId: string) => void;
  isReserved?: boolean;
  className?: string;
}

const RideCard: React.FC<RideCardProps> = ({ 
  ride, 
  onReserve, 
  isReserved = false,
  className = '' 
}) => {
  const [isReserving, setIsReserving] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleReserve = async () => {
    if (isReserved || ride.availableSeats === 0) return;
    
    setIsReserving(true);
    setReservationStatus('idle');

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onReserve) {
        onReserve(ride.id);
      }
      
      setReservationStatus('success');
    } catch (error) {
      setReservationStatus('error');
    } finally {
      setIsReserving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderSeatIcons = () => {
    const seats = [];
    for (let i = 0; i < ride.totalSeats; i++) {
      seats.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-sm ${
            i < ride.availableSeats
              ? 'bg-green-400 border-green-500'
              : 'bg-red-400 border-red-500'
          } border opacity-70`}
        />
      );
    }
    return seats;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Header con información del viaje */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar size={16} />
              <span>{formatDate(ride.date)}</span>
              <Clock size={16} className="ml-2" />
              <span>{ride.time}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{ride.origin}</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 relative">
                <Car className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{ride.destination}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
              <DollarSign size={24} />
              <span>{formatPrice(ride.price)}</span>
            </div>
            <div className="text-sm text-gray-500">por asiento</div>
          </div>
        </div>
      </div>

      {/* Información del conductor */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {ride.driver.avatar ? (
              <img 
                src={ride.driver.avatar} 
                alt={ride.driver.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              ride.driver.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{ride.driver.name}</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(ride.driver.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {ride.driver.rating.toFixed(1)} ({ride.driver.totalRides} viajes)
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {ride.driver.phone && (
              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                <Phone size={18} />
              </button>
            )}
            <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors">
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Información de asientos */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-600" />
            <span className="font-medium text-gray-900">
              {ride.availableSeats} de {ride.totalSeats} asientos disponibles
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 mb-4">
          {renderSeatIcons()}
        </div>
        
        <div className="flex gap-2 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 border border-green-500 rounded-sm"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 border border-red-500 rounded-sm"></div>
            <span>Ocupado</span>
          </div>
        </div>

        {/* Estado y botón de reserva */}
        <div className="flex items-center justify-between">
          {reservationStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Reservado</span>
            </div>
          )}
          
          {reservationStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm">Error al reservar</span>
            </div>
          )}
          
          {reservationStatus === 'idle' && (
            <div className="text-sm text-gray-600">
              {ride.availableSeats === 0 ? (
                <span className="text-red-600 font-medium">Completamente lleno</span>
              ) : (
                `${ride.availableSeats} asiento${ride.availableSeats > 1 ? 's' : ''} disponible${ride.availableSeats > 1 ? 's' : ''}`
              )}
            </div>
          )}
          
          <button
            onClick={handleReserve}
            disabled={isReserved || ride.availableSeats === 0 || isReserving}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              isReserved
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : ride.availableSeats === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            } ${isReserving ? 'opacity-75' : ''}`}
          >
            {isReserving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Reservando...</span>
              </div>
            ) : isReserved ? (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Reservado</span>
              </div>
            ) : (
              'Reservar Asiento'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCard;