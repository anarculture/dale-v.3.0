"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { DPageSection, DSpinner } from "@/components/ui";
import { BookingList } from "@/components/bookings/BookingList";
import { apiClient, Booking } from "@/lib/api";

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const data = await apiClient.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (authLoading) {
    return (
      <AppLayout>
        <DSpinner fullScreen />
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <DPageSection 
          title="Mis Reservas" 
          description="Gestiona tus viajes reservados y consulta su estado."
        >
          <BookingList bookings={bookings} loading={loading} />
        </DPageSection>
      </div>
    </AppLayout>
  );
}
