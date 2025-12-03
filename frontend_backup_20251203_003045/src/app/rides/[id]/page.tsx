"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { DCard, DButton, DSpinner, DAlert, DBadge } from "@/components/ui";
import { apiClient, Ride } from "@/lib/api";
import { Calendar, Clock, MapPin, User, Users, DollarSign, ArrowLeft } from "lucide-react";

export default function RideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const data = await apiClient.getRide(params.id as string);
        setRide(data);
      } catch (err) {
        console.error("Error fetching ride:", err);
        setError("No se pudo cargar la información del viaje.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRide();
    }
  }, [params.id]);

  const handleBook = async () => {
    if (!user) {
      router.push(`/login?redirect=/rides/${params.id}`);
      return;
    }

    setBookingLoading(true);
    try {
      await apiClient.createBooking(ride!.id);
      router.push("/bookings");

    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <DSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error || !ride) {
    return (
      <AppLayout>
        <DAlert variant="error" title="Error" description={error || "Viaje no encontrado"} />
        <DButton onPress={() => router.back()} startContent={<ArrowLeft />}>
          Volver
        </DButton>
      </AppLayout>
    );
  }

  const date = new Date(ride.date_time);
  const isValidDate = !isNaN(date.getTime());

  if (!isValidDate) {
    return (
      <AppLayout>
        <DAlert variant="error" title="Error" description="Fecha de viaje inválida" />
        <DButton onPress={() => router.back()} startContent={<ArrowLeft />}>
          Volver
        </DButton>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <DButton 
          variant="light" 
          onPress={() => router.back()} 
          startContent={<ArrowLeft size={18} />}
          className="mb-4 pl-0"
        >
          Volver a la búsqueda
        </DButton>

        <DCard className="overflow-hidden">
          {/* Header with Route */}
          <div className="bg-primary-50 p-6 border-b border-primary-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-0.5 h-10 bg-primary-200" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">{ride.from_city}</h1>
                  <h1 className="text-2xl font-bold text-gray-900">{ride.to_city}</h1>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  ${ride.price?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">por asiento</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-semibold capitalize">
                    {date.toLocaleDateString("es-VE", { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-semibold">
                    {date.toLocaleTimeString("es-VE", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Conductor</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                  {ride.driver?.avatar_url ? (
                    <img src={ride.driver.avatar_url} alt="Driver" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-lg">{ride.driver?.name || "Usuario de Dale"}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>Conductor verificado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats & Notes */}
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Disponibilidad</h3>
                <div className="flex items-center gap-2">
                  <Users className="text-gray-500" />
                  <span className="font-medium">{ride.seats_available} asientos disponibles</span>
                </div>
              </div>

              {ride.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notas del viaje</h3>
                  <p className="text-gray-600">{ride.notes}</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="border-t pt-6">
              <DButton 
                size="lg" 
                fullWidth 
                color="primary" 
                onPress={handleBook}
                isLoading={bookingLoading}
                isDisabled={ride.seats_available === 0}
              >
                {ride.seats_available > 0 ? "Reservar Asiento" : "Agotado"}
              </DButton>
              <p className="text-center text-xs text-gray-500 mt-2">
                No se te cobrará nada hasta que el conductor confirme.
              </p>
            </div>
          </div>
        </DCard>
      </div>
    </AppLayout>
  );
}
