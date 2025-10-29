'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Car,
  XCircle,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Booking } from '@/lib/api';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => Promise<void>;
  className?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onCancel, 
  className = '' 
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCancel = async () => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return;
    }

    setIsCancelling(true);
    setCancelStatus('idle');

    try {
      await onCancel(booking.id);
      setCancelStatus('success');
    } catch (error) {
      setCancelStatus('error');
    } finally {
      setIsCancelling(false);
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const ride = booking.ride;
  const { date, time } = formatDateTime(ride?.date_time || '');

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Header con información del viaje y estado */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar size={16} />
              <span>{date}</span>
              <Clock size={16} className="ml-2" />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{ride?.from_city}</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 relative">
                <Car className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{ride?.to_city}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(booking.total_price)}
              </div>
              <div className="text-sm text-gray-500">
                {booking.seats_booked} asiento{booking.seats_booked > 1 ? 's' : ''}
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span>{getStatusText(booking.status)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del conductor */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {ride?.driver_name ? ride.driver_name.charAt(0).toUpperCase() : <User size={20} />}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{ride?.driver_name || 'Conductor'}</h4>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {booking.seats_booked} asiento{booking.seats_booked > 1 ? 's' : ''} reservado{booking.seats_booked > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {ride?.driver_rating && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <span>⭐</span>
                <span>{ride.driver_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notas del viaje */}
      {ride?.notes && (
        <div className="p-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Notas del conductor:</span>
            <p className="mt-1">{ride.notes}</p>
          </div>
        </div>
      )}

      {/* Información adicional y acciones */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Reserva realizada el {formatDateTime(booking.created_at).date}
          </div>
          
          {booking.status === 'cancelled' && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={18} />
              <span className="text-sm font-medium">Reserva cancelada</span>
            </div>
          )}
        </div>

        {/* Estado de cancelación y botón de acción */}
        <div className="flex items-center justify-between">
          {cancelStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm">Error al cancelar</span>
            </div>
          )}
          
          {cancelStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Cancelada correctamente</span>
            </div>
          )}

          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Cancelando...</span>
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  <span>Cancelar Reserva</span>
                </>
              )}
            </button>
          )}
          
          {booking.status === 'completed' && (
            <div className="flex items-center gap-2 text-blue-600">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Viaje completado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;