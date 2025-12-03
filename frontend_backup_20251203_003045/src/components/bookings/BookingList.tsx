"use client";

import React from "react";
import { Booking } from "@/lib/api";
import { BookingCard } from "./BookingCard";
import { DEmptyState, DSpinner } from "@/components/ui";
import { Calendar } from "lucide-react";

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <DSpinner size="lg" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <DEmptyState
        icon={<Calendar size={48} />}
        title="No tienes reservas"
        description="Aún no has reservado ningún viaje. ¡Busca uno ahora!"
        actionLabel="Buscar Viajes"
        actionHref="/rides"
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};
