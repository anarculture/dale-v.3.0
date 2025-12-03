'use client';

import React from 'react';
import { OfferRideForm } from '@/components/rides/OfferRideForm';

export default function OfferPage() {
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
