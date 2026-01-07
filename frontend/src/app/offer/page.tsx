'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { OfferRideForm, OfferRideData } from '@/components/rides/OfferRideForm';

export default function OfferPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Debes iniciar sesión para publicar un viaje');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (data: OfferRideData) => {
    if (!user) {
      toast.error('Debes iniciar sesión para publicar un viaje');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      // Extract YYYY-MM-DD from ISO string and combine with time
      const datePart = data.date.split('T')[0];  // "2026-01-08T..." → "2026-01-08"
      const dateTime = `${datePart}T${data.time}:00`;

      await apiClient.createRide({
        from_city: data.from_city,
        from_lat: 0, // Will be geocoded on backend or updated later
        from_lon: 0,
        to_city: data.to_city,
        to_lat: 0,
        to_lon: 0,
        date_time: dateTime,
        seats_total: data.seats_total,
        price: data.price,
        notes: data.notes || undefined,
      });

      toast.success('¡Viaje publicado exitosamente!');
      router.push('/rides');
    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error('Error al publicar el viaje. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fffbf3] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#fd5810] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <OfferRideForm 
      onSubmit={handleSubmit} 
      onBack={handleBack}
      isLoading={submitting} 
    />
  );
}
