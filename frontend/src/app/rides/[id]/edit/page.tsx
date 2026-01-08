"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, MapPin, Calendar, Users, Clock, DollarSign, Trash2 } from "lucide-react";
import { DInput } from "@/components/ui/DInput";
import { DButton } from "@/components/ui/DButton";

interface RideData {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  notes?: string;
}

// Mock data for demo
const mockRide: RideData = {
  id: "1",
  origin: "Caracas",
  destination: "Valencia",
  date: "2025-01-10",
  time: "08:00",
  seats: 3,
  price: 25,
  notes: "Acepto mascotas pequeñas. Tengo espacio para 2 maletas grandes.",
};

export default function EditRidePage() {
  const router = useRouter();
  const params = useParams();
  const rideId = params.id as string;

  // In production, fetch ride data based on rideId
  const [formData, setFormData] = useState<RideData>(mockRide);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBack = () => router.back();

  const handleSubmit = () => {
    // TODO: Call API to update ride
    console.log("Saving ride:", formData);
    router.push(`/rides/${rideId}`);
  };

  const handleDelete = () => {
    // TODO: Call API to delete ride
    console.log("Deleting ride:", rideId);
    router.push("/rides");
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        {/* Header */}
        <div className="bg-card px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-surface rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6 text-neutral" />
            </button>
            <h2 className="text-xl text-neutral font-semibold">Editar viaje</h2>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-card space-y-4">
            <DInput
              label="Origen"
              placeholder="Ciudad de origen"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              startContent={<MapPin className="w-5 h-5" />}
            />

            <DInput
              label="Destino"
              placeholder="Ciudad de destino"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              startContent={<MapPin className="w-5 h-5" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <DInput
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                startContent={<Calendar className="w-5 h-5" />}
              />

              <DInput
                label="Hora"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                startContent={<Clock className="w-5 h-5" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-2 text-sm text-neutral font-medium">Asientos</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, seats: Math.max(1, formData.seats - 1) })
                    }
                    className="w-10 h-14 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition text-neutral text-xl"
                  >
                    −
                  </button>
                  <div className="flex-1 h-14 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-neutral-500 mr-2" />
                    <span className="text-lg text-neutral font-medium">{formData.seats}</span>
                  </div>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, seats: Math.min(8, formData.seats + 1) })
                    }
                    className="w-10 h-14 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition text-neutral text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <DInput
                label="Precio"
                type="number"
                value={formData.price.toString()}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                startContent={<DollarSign className="w-5 h-5" />}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-neutral font-medium">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ej: Acepto mascotas, tengo espacio para maletas..."
                className="w-full h-24 px-4 py-3 bg-neutral-100 rounded-xl text-neutral placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Save Button */}
          <DButton onClick={handleSubmit} className="w-full">
            Guardar cambios
          </DButton>

          {/* Delete Section */}
          <div className="bg-white rounded-xl p-5 shadow-card border-2 border-error/20">
            <h3 className="text-lg text-neutral font-semibold mb-2">Zona de peligro</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Eliminar este viaje es permanente y no se puede deshacer. Los pasajeros que hayan
              reservado serán notificados.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full h-14 bg-error/10 text-error rounded-full hover:bg-error/20 transition flex items-center justify-center gap-2 font-semibold"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar viaje
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-error mb-3">
                  ¿Estás seguro? Esta acción no se puede deshacer.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="h-11 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200 transition font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="h-11 bg-error text-white rounded-full hover:bg-error-dark transition font-semibold"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen p-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-card rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6 text-neutral" />
              </button>
              <h1 className="text-4xl text-neutral font-bold">Editar viaje</h1>
            </div>
            <p className="text-lg text-neutral-500 ml-14">
              Modifica los detalles de tu viaje publicado
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-card space-y-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <DInput
                label="Origen"
                placeholder="Ciudad de origen"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                startContent={<MapPin className="w-5 h-5" />}
              />

              <DInput
                label="Destino"
                placeholder="Ciudad de destino"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                startContent={<MapPin className="w-5 h-5" />}
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <DInput
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                startContent={<Calendar className="w-5 h-5" />}
              />

              <DInput
                label="Hora de salida"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                startContent={<Clock className="w-5 h-5" />}
              />

              <DInput
                label="Precio por persona"
                type="number"
                value={formData.price.toString()}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                startContent={<DollarSign className="w-5 h-5" />}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-neutral font-medium">
                Asientos disponibles
              </label>
              <div className="flex items-center gap-4 max-w-sm">
                <button
                  onClick={() =>
                    setFormData({ ...formData, seats: Math.max(1, formData.seats - 1) })
                  }
                  className="w-14 h-14 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition text-neutral text-xl font-medium"
                >
                  −
                </button>
                <div className="flex-1 h-14 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-neutral-500 mr-2" />
                  <span className="text-lg text-neutral font-medium">{formData.seats}</span>
                </div>
                <button
                  onClick={() =>
                    setFormData({ ...formData, seats: Math.min(8, formData.seats + 1) })
                  }
                  className="w-14 h-14 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition text-neutral text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-neutral font-medium">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ej: Acepto mascotas, tengo espacio para maletas grandes, puedo hacer paradas..."
                className="w-full h-32 px-4 py-3 bg-neutral-100 rounded-xl text-neutral placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full h-14 bg-primary text-white rounded-full hover:bg-primary-dark transition font-semibold"
              >
                Guardar cambios
              </button>
            </div>
          </div>

          {/* Delete Section */}
          <div className="bg-white rounded-2xl p-8 shadow-card border-2 border-error/20">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-neutral font-semibold mb-2">Eliminar viaje</h3>
                <p className="text-neutral-500 mb-6">
                  Eliminar este viaje es permanente y no se puede deshacer. Los pasajeros que hayan
                  reservado serán notificados automáticamente de la cancelación.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-8 h-14 bg-error/10 text-error rounded-full hover:bg-error/20 transition flex items-center gap-2 font-semibold"
                  >
                    <Trash2 className="w-5 h-5" />
                    Eliminar este viaje
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-error/10 rounded-xl">
                      <p className="text-error font-medium">
                        ⚠️ ¿Estás completamente seguro? Esta acción no se puede deshacer.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-8 h-14 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200 transition font-semibold"
                      >
                        No, cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-8 h-14 bg-error text-white rounded-full hover:bg-error-dark transition font-semibold"
                      >
                        Sí, eliminar viaje
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
