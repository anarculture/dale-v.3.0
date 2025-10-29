import React from 'react';
import { Clock, User, MapPin, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Driver {
  name: string;
  rating: number;
  phone: string;
}

interface Trip {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  vehicle: {
    model: string;
    color: string;
    plate: string;
  };
}

interface BookingCardProps {
  booking: {
    id: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    trip: Trip;
    driver: Driver;
    price: number;
    bookingDate: string;
    seats: number;
  };
  onCancel?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    iconColor: 'text-yellow-600'
  },
  confirmed: {
    label: 'Confirmada',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600'
  },
  cancelled: {
    label: 'Cancelada',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600'
  }
};

export default function BookingCard({ booking, onCancel, onViewDetails }: BookingCardProps) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;
  
  const canCancel = booking.status === 'pending';
  
  const handleCancel = () => {
    if (onCancel && canCancel) {
      onCancel(booking.id);
    }
  };
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(booking.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header con estado */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${status.iconColor}`} />
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          ID: {booking.id}
        </span>
      </div>

      {/* Información del viaje */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-gray-900">{booking.trip.origin}</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-gray-900">{booking.trip.destination}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 ml-6">
          <div>
            <span className="font-medium">Salida:</span> {booking.trip.departureTime}
          </div>
          <div>
            <span className="font-medium">Llegada:</span> {booking.trip.arrivalTime}
          </div>
          <div>
            <span className="font-medium">Duración:</span> {booking.trip.duration}
          </div>
          <div>
            <span className="font-medium">Asientos:</span> {booking.seats}
          </div>
        </div>
      </div>

      {/* Información del conductor */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{booking.driver.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>⭐ {booking.driver.rating}</span>
              <span>•</span>
              <span>{booking.driver.phone}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {booking.trip.vehicle.color} {booking.trip.vehicle.model} • {booking.trip.vehicle.plate}
            </div>
          </div>
        </div>
      </div>

      {/* Precio y fecha */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 text-lg font-bold text-green-600">
          <DollarSign className="h-5 w-5" />
          <span>{formatPrice(booking.price)}</span>
        </div>
        <div className="text-sm text-gray-500">
          Reservado: {formatDate(booking.bookingDate)}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-3">
        {canCancel && (
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <XCircle className="h-4 w-4" />
            <span>Cancelar Reserva</span>
          </button>
        )}
        
        <button
          onClick={handleViewDetails}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <AlertCircle className="h-4 w-4" />
          <span>Ver Detalles</span>
        </button>
      </div>
    </div>
  );
}