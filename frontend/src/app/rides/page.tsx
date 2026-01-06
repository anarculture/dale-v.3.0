'use client';

import React, { useEffect, useState } from 'react';
import { RideSearchForm } from '@/components/rides/RideSearchForm';
import { RideList } from '@/components/rides/RideList';
import { apiClient, Ride, RideSearchParams } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RidesPage() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchParams, setSearchParams] = useState<RideSearchParams>({});

  const fetchRides = async (params: RideSearchParams = {}) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const data = await apiClient.searchRides(params);
      setRides(Array.isArray(data) ? data : []);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Failed to fetch rides:', err);
      toast.error('Error al cargar viajes. Intenta de nuevo.');
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: RideSearchParams) => {
    fetchRides(params);
  };

  const handleRideClick = (ride: Ride) => {
    router.push(`/rides/${ride.id}`);
  };

  const handleBack = () => {
    if (searchPerformed) {
      setSearchPerformed(false);
      setRides([]);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {!searchPerformed ? (
        <RideSearchForm 
          onSearch={handleSearch} 
          onBack={handleBack}
          isLoading={loading} 
        />
      ) : (
        <RideList 
          rides={rides}
          loading={loading}
          origin={searchParams.from_city}
          destination={searchParams.to_city}
          date={searchParams.date}
          onRideClick={handleRideClick}
        />
      )}
    </div>
  );
}
