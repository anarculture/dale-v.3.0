'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Booking } from '@/lib/api';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => Promise<void>;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!onCancel) return;
    
    const confirmed = confirm(
      '¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;

    try {
      setIsCancelling(true);
      await onCancel(booking.id);
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    const time = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { day, time };
  };

  const { day, time } = formatDate(booking.ride.date_time);

  // Estado visual
  const getStatusStyles = () => {
    switch (booking.status) {
      case 'confirmed':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-800',
          label: 'Confirmada',
        };
      case 'cancelled':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-600',
          label: 'Cancelada',
        };
      case 'pending':
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800',
          label: 'Pendiente',
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <Card
      className={`${statusStyles.bg} border-2 ${statusStyles.border} transition-all hover:shadow-md`}
    >
      <CardBody className="p-4">
        {/* Badge de estado */}
        <div className="flex justify-between items-start mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.badge}`}
          >
            {statusStyles.label}
          </span>
          <span className="text-xs text-gray-500">
            Reservado el {new Date(booking.created_at).toLocaleDateString('es-ES')}
          </span>
        </div>

        {/* Ruta */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="10" r="3" />
                </svg>
                <span className="font-semibold text-gray-900">
                  {booking.ride.from_city}
                </span>
              </div>
              
              <div className="ml-2 border-l-2 border-dashed border-gray-300 h-4"></div>
              
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2L12 8L18 8L13 12L15 18L10 14L5 18L7 12L2 8L8 8L10 2Z" />
                </svg>
                <span className="font-semibold text-gray-900">
                  {booking.ride.to_city}
                </span>
              </div>
            </div>

            {/* Fecha y hora */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600 capitalize">
                {day}
              </div>
              <div className="text-lg font-bold text-gray-900">{time}</div>
            </div>
          </div>
        </div>

        {/* Información del conductor */}
        {booking.ride.driver && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {booking.ride.driver.name?.charAt(0).toUpperCase() || 'D'}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {booking.ride.driver.name || 'Conductor'}
                </div>
                <div className="text-xs text-gray-500">Conductor</div>
              </div>
            </div>
          </div>
        )}

        {/* Detalles de la reserva */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Plazas reservadas</div>
            <div className="font-bold text-gray-900">{booking.seats_booked}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Precio total</div>
            <div className="font-bold text-gray-900">
              €{(booking.ride.price * booking.seats_booked).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Precio por plaza */}
        <div className="text-xs text-gray-500 mb-4">
          €{booking.ride.price.toFixed(2)} por plaza
        </div>

        {/* Notas del viaje (si existen) */}
        {booking.ride.notes && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Notas del conductor:
            </div>
            <div className="text-sm text-gray-600">{booking.ride.notes}</div>
          </div>
        )}

        {/* Botón cancelar */}
        {booking.status === 'confirmed' && onCancel && (
          <Button
            onClick={handleCancel}
            disabled={isCancelling}
            loading={isCancelling}
            variant="outline"
            fullWidth
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Cancelar reserva
          </Button>
        )}

        {/* Información de cancelación */}
        {booking.status === 'cancelled' && (
          <div className="text-sm text-gray-500 text-center italic">
            Esta reserva ha sido cancelada
          </div>
        )}
      </CardBody>
    </Card>
  );
}
