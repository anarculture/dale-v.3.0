"use client";

import React from "react";
import { Ride } from "@/lib/api";
import { RideCard } from "./RideCard";
import { DEmptyState, DSpinner } from "@/components/ui";
import { Search } from "lucide-react";

interface RideListProps {
  rides: Ride[];
  loading: boolean;
}

export const RideList: React.FC<RideListProps> = ({ rides, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <DSpinner size="lg" />
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <DEmptyState
        icon={<Search size={48} />}
        title="No se encontraron viajes"
        description="Intenta cambiar los filtros de búsqueda o prueba con otra fecha."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );
};
