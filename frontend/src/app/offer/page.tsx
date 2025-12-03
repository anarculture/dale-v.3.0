'use client';

import React, { useEffect } from 'react';
import { OfferRideForm } from '@/components/rides/OfferRideForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DSpinner } from '@/components/ui/DSpinner';

export default function OfferPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <DSpinner size="lg" label="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publish a Ride</h1>
        <p className="text-gray-600">Share your journey and save on travel costs.</p>
      </div>
      
      <OfferRideForm />
    </div>
  );
}
