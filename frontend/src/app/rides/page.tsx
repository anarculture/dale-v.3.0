"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { DPageSection } from "@/components/layout/DPageSection";
import { RideSearchForm } from "@/components/rides/RideSearchForm";
import { RideList } from "@/components/rides/RideList";
import { apiClient, Ride, RideSearchParams } from "@/lib/api";
import { DSpinner } from "@/components/ui";

function RidesContent() {
  const searchParams = useSearchParams();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const params: RideSearchParams = {
          from_city: searchParams.get("from_city") || undefined,
          to_city: searchParams.get("to_city") || undefined,
          date: searchParams.get("date") || undefined,
        };
        
        const data = await apiClient.searchRides(params);
        setRides(data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto">
      <DPageSection 
        title="Buscar Viaje" 
        description="Encuentra el viaje perfecto al mejor precio."
      >
        <RideSearchForm />
        <RideList rides={rides} loading={loading} />
      </DPageSection>
    </div>
  );
}

export default function RidesPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex justify-center p-8"><DSpinner size="lg" /></div>}>
        <RidesContent />
      </Suspense>
    </AppLayout>
  );
}
