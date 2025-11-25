"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { DCard, DPageSection, DSpinner } from "@/components/ui";
import { OfferRideForm } from "@/components/rides/OfferRideForm";

export default function OfferPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
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
          title="Publicar un Viaje" 
          description="Comparte tu auto y reduce costos. Llena los detalles de tu viaje a continuación."
        >
          <DCard className="p-2 sm:p-4">
            <OfferRideForm />
          </DCard>
        </DPageSection>
      </div>
    </AppLayout>
  );
}
