"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { DInput, DButton, DSelect, DTextarea, DAlert, DFormField } from "@/components/ui";
import { Car, MapPin, Calendar, Clock, DollarSign, Users } from "lucide-react";

const VENEZUELA_CITIES = [
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

export const OfferRideForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    from_city: "",
    to_city: "",
    date: "",
    time: "",
    price: "",
    seats: "3",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Reset error when user makes changes
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (formData.from_city === formData.to_city) {
      setError("El origen y el destino no pueden ser la misma ciudad.");
      setLoading(false);
      return;
    }

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    
    if (isNaN(selectedDateTime.getTime())) {
      setError("La fecha u hora del viaje no es válida.");
      setLoading(false);
      return;
    }
    
    if (selectedDateTime <= new Date()) {
      setError("La fecha y hora del viaje deben ser en el futuro.");
      setLoading(false);
      return;
    }

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      // For MVP, we'll use hardcoded coordinates for major cities or 0,0 if not found
      // In a real app, we would use the Google Maps API here
      const mockLat = 10.4806;
      const mockLon = -66.9036;

      await apiClient.createRide({
        from_city: formData.from_city,
        from_lat: mockLat,
        from_lon: mockLon,
        to_city: formData.to_city,
        to_lat: mockLat, 
        to_lon: mockLon,
        date_time: dateTime.toISOString(),
        seats_total: parseInt(formData.seats),
        price: parseFloat(formData.price),
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/rides"); // Redirect to rides list (or my rides)
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error("Error creating ride:", err);
      setError(err.error || "Ocurrió un error al publicar el viaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DAlert 
        variant="success" 
        title="¡Viaje Publicado!" 
        description="Tu viaje ha sido publicado exitosamente. Redirigiendo..." 
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <DAlert variant="error" description={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DSelect
          label="Origen"
          placeholder="Selecciona ciudad de origen"
          options={VENEZUELA_CITIES}
          selectedKeys={formData.from_city ? [formData.from_city] : []}
          onChange={(e) => handleChange("from_city", e.target.value)}
          startContent={<MapPin className="text-gray-400" size={18} />}
          isRequired
        />

        <DSelect
          label="Destino"
          placeholder="Selecciona ciudad de destino"
          options={VENEZUELA_CITIES}
          selectedKeys={formData.to_city ? [formData.to_city] : []}
          onChange={(e) => handleChange("to_city", e.target.value)}
          startContent={<MapPin className="text-gray-400" size={18} />}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DInput
          type="date"
          label="Fecha"
          placeholder="Selecciona la fecha"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          startContent={<Calendar className="text-gray-400" size={18} />}
          isRequired
        />

        <DInput
          type="time"
          label="Hora"
          placeholder="Selecciona la hora"
          value={formData.time}
          onChange={(e) => handleChange("time", e.target.value)}
          startContent={<Clock className="text-gray-400" size={18} />}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DInput
          type="number"
          label="Precio por Asiento ($)"
          placeholder="0.00"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          startContent={<DollarSign className="text-gray-400" size={18} />}
          min={0}
          step="0.5"
          isRequired
        />

        <DInput
          type="number"
          label="Asientos Disponibles"
          placeholder="3"
          value={formData.seats}
          onChange={(e) => handleChange("seats", e.target.value)}
          startContent={<Users className="text-gray-400" size={18} />}
          min={1}
          max={8}
          isRequired
        />
      </div>

      <DTextarea
        label="Notas del Viaje"
        placeholder="Ej: Salgo puntual, no fumar, espacio para maletas medianas..."
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        minRows={3}
      />

      <DButton 
        type="submit" 
        color="primary" 
        size="lg" 
        fullWidth 
        isLoading={loading}
        startContent={!loading && <Car />}
      >
        Publicar Viaje
      </DButton>
    </form>
  );
};
