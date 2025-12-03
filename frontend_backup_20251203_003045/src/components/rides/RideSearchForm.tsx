"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DInput, DButton, DSelect, DCard } from "@/components/ui";
import { Search, MapPin, Calendar } from "lucide-react";

const VENEZUELA_CITIES = [
  { label: "Cualquiera", value: "" },
  { label: "Caracas", value: "Caracas" },
  { label: "Valencia", value: "Valencia" },
  { label: "Maracay", value: "Maracay" },
  { label: "Barquisimeto", value: "Barquisimeto" },
  { label: "Maracaibo", value: "Maracaibo" },
  { label: "San Cristóbal", value: "San Cristóbal" },
  { label: "Mérida", value: "Mérida" },
  { label: "Puerto La Cruz", value: "Puerto La Cruz" },
  { label: "Barcelona", value: "Barcelona" },
  { label: "Puerto Ordaz", value: "Puerto Ordaz" },
  { label: "Maturín", value: "Maturín" },
  { label: "La Guaira", value: "La Guaira" },
];

export const RideSearchForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get("from_city") || "");
  const [toCity, setToCity] = useState(searchParams.get("to_city") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromCity) params.set("from_city", fromCity);
    if (toCity) params.set("to_city", toCity);
    if (date) params.set("date", date);

    router.push(`/rides?${params.toString()}`);
  };

  return (
    <DCard className="mb-6">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <DSelect
          label="Origen"
          placeholder="Origen"
          options={VENEZUELA_CITIES}
          selectedKeys={fromCity ? [fromCity] : []}
          onChange={(e) => setFromCity(e.target.value)}
          startContent={<MapPin className="text-gray-400" size={16} />}
        />
        
        <DSelect
          label="Destino"
          placeholder="Destino"
          options={VENEZUELA_CITIES}
          selectedKeys={toCity ? [toCity] : []}
          onChange={(e) => setToCity(e.target.value)}
          startContent={<MapPin className="text-gray-400" size={16} />}
        />

        <DInput
          type="date"
          label="Fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          startContent={<Calendar className="text-gray-400" size={16} />}
        />

        <DButton type="submit" color="primary" startContent={<Search size={18} />}>
          Buscar
        </DButton>
      </form>
    </DCard>
  );
};
