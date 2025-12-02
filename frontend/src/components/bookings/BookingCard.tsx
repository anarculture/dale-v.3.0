"use client";

import React, { useState } from "react";
import { Booking, apiClient } from "@/lib/api";
import { DCard, DButton, DBadge } from "@/components/ui";
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;

    setLoading(true);
    try {
      await apiClient.cancelBooking(booking.id);
      router.refresh();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("No se pudo cancelar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking.ride) return null;

  const date = new Date(booking.ride.date_time);
  if (isNaN(date.getTime())) {
    console.error("Invalid date_time:", booking.ride.date_time);
    return null; // or display an error message
  }
  const formattedDate = date.toLocaleDateString("es-VE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = date.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusConfig = {
    pending: { color: "warning", label: "Pendiente", icon: AlertCircle },
    confirmed: { color: "success", label: "Confirmada", icon: CheckCircle },
    cancelled: { color: "danger", label: "Cancelada", icon: XCircle },
  } as const;

  const status = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <DCard className="mb-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-grow space-y-3">
          <div className="flex items-center justify-between md:justify-start gap-4">
            <DBadge color={status.color as any} variant="flat" className="flex items-center gap-1">
              <StatusIcon size={14} />
              {status.label}
            </DBadge>
            <span className="text-sm text-gray-500">
              Reserva #{booking.id.slice(0, 8)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-0.5 h-8 bg-gray-200" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{booking.ride.from_city}</span>
              <span className="font-semibold">{booking.ride.to_city}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>


          <div className="text-right">
            <p className="text-sm text-gray-500">Precio Total</p>
            <p className="text-xl font-bold text-primary">
              ${(booking.ride.price! * booking.seats_booked).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">{booking.seats_booked} asiento(s)</p>
          </div>

          {booking.status !== "cancelled" && (
            <DButton 
              size="sm" 
              color="danger" 
              variant="light" 
              onPress={handleCancel}
              isLoading={loading}
              className="mt-2"
            >
              Cancelar Reserva
            </DButton>
          )}
        </div>

    </DCard>
  );
};
