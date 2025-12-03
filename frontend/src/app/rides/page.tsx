'use client';

import React, { useEffect, useState } from 'react';
import { RideSearchForm } from '@/components/rides/RideSearchForm';
import { RideCard } from '@/components/rides/RideCard';
import { apiClient, Ride, RideSearchParams } from '@/lib/api';
import { DEmptyState } from '@/components/ui/DEmptyState';
import { DSpinner } from '@/components/ui/DSpinner';
import { useRouter } from 'next/navigation';

export default function RidesPage() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async (params: RideSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.searchRides(params);
      setRides(data);
    } catch (err) {
      console.error('Failed to fetch rides:', err);
      setError('Failed to load rides. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = (params: RideSearchParams) => {
    fetchRides(params);
  };

  const handleRideClick = (rideId: string) => {
    router.push(`/rides/${rideId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <RideSearchForm onSearch={handleSearch} isLoading={loading} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Rides</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <DSpinner size="lg" label="Finding the best rides for you..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
            <button 
              onClick={() => fetchRides()} 
              className="block mx-auto mt-4 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : rides.length === 0 ? (
          <DEmptyState 
            title="No rides found" 
            description="Try changing your search criteria or check back later."
            icon="car"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rides.map((ride) => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                onClick={() => handleRideClick(ride.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
