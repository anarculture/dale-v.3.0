"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/Switch";

interface NotificationPreferences {
  trips: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  chat: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  promotions: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

function SettingRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-neutral">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    trips: { push: true, email: true, sms: false },
    chat: { push: true, email: false, sms: false },
    promotions: { push: false, email: true, sms: false },
  });

  const updatePreference = (
    category: keyof NotificationPreferences,
    channel: "push" | "email" | "sms",
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: { ...prev[category], [channel]: value },
    }));
    // TODO: Call API to save preferences
  };

  const handleBack = () => router.back();

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        <div className="bg-card px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-surface rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6 text-neutral" />
            </button>
            <h2 className="text-xl text-neutral font-semibold">Ajustes de notificaciones</h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Viajes Section */}
          <div className="bg-surface-200 rounded-xl p-5 shadow-card">
            <h3 className="text-lg text-neutral mb-4 font-semibold">Viajes</h3>
            <div className="space-y-1 divide-y divide-neutral-100">
              <SettingRow
                label="Notificaciones push"
                checked={preferences.trips.push}
                onCheckedChange={(val) => updatePreference("trips", "push", val)}
              />
              <SettingRow
                label="Correo electrónico"
                checked={preferences.trips.email}
                onCheckedChange={(val) => updatePreference("trips", "email", val)}
              />
              <SettingRow
                label="SMS"
                checked={preferences.trips.sms}
                onCheckedChange={(val) => updatePreference("trips", "sms", val)}
              />
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-surface-200 rounded-xl p-5 shadow-card">
            <h3 className="text-lg text-neutral mb-4 font-semibold">Chat</h3>
            <div className="space-y-1 divide-y divide-neutral-100">
              <SettingRow
                label="Notificaciones push"
                checked={preferences.chat.push}
                onCheckedChange={(val) => updatePreference("chat", "push", val)}
              />
              <SettingRow
                label="Correo electrónico"
                checked={preferences.chat.email}
                onCheckedChange={(val) => updatePreference("chat", "email", val)}
              />
              <SettingRow
                label="SMS"
                checked={preferences.chat.sms}
                onCheckedChange={(val) => updatePreference("chat", "sms", val)}
              />
            </div>
          </div>

          {/* Promociones Section */}
          <div className="bg-surface-200 rounded-xl p-5 shadow-card">
            <h3 className="text-lg text-neutral mb-4 font-semibold">Promociones</h3>
            <div className="space-y-1 divide-y divide-neutral-100">
              <SettingRow
                label="Notificaciones push"
                checked={preferences.promotions.push}
                onCheckedChange={(val) => updatePreference("promotions", "push", val)}
              />
              <SettingRow
                label="Correo electrónico"
                checked={preferences.promotions.email}
                onCheckedChange={(val) => updatePreference("promotions", "email", val)}
              />
              <SettingRow
                label="SMS"
                checked={preferences.promotions.sms}
                onCheckedChange={(val) => updatePreference("promotions", "sms", val)}
              />
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-surface-200 rounded-xl p-4">
            <p className="text-sm text-neutral-500">
              <span className="text-primary">💡</span> Puedes cambiar estas preferencias en
              cualquier momento. Las notificaciones importantes del sistema siempre se enviarán.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-card rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6 text-neutral" />
              </button>
              <h1 className="text-4xl text-neutral font-bold">Ajustes de notificaciones</h1>
            </div>
            <p className="text-lg text-neutral-500 ml-14">
              Personaliza cómo y cuándo quieres recibir notificaciones
            </p>
          </div>

          <div className="space-y-6">
            {/* Viajes Section */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h3 className="text-2xl text-neutral mb-4 font-semibold">Viajes</h3>
              <p className="text-neutral-500 mb-6">
                Recibe actualizaciones sobre tus reservas, cambios de itinerario y solicitudes
              </p>
              <div className="space-y-2 divide-y divide-neutral-100">
                <SettingRow
                  label="Notificaciones push"
                  checked={preferences.trips.push}
                  onCheckedChange={(val) => updatePreference("trips", "push", val)}
                />
                <SettingRow
                  label="Correo electrónico"
                  checked={preferences.trips.email}
                  onCheckedChange={(val) => updatePreference("trips", "email", val)}
                />
                <SettingRow
                  label="SMS"
                  checked={preferences.trips.sms}
                  onCheckedChange={(val) => updatePreference("trips", "sms", val)}
                />
              </div>
            </div>

            {/* Chat Section */}
            <div className="bg-surface-200 rounded-2xl p-8 shadow-card">
              <h3 className="text-2xl text-neutral mb-4 font-semibold">Chat</h3>
              <p className="text-neutral-500 mb-6">
                Mantente conectado con otros pasajeros y conductores
              </p>
              <div className="space-y-2 divide-y divide-neutral-100">
                <SettingRow
                  label="Notificaciones push"
                  checked={preferences.chat.push}
                  onCheckedChange={(val) => updatePreference("chat", "push", val)}
                />
                <SettingRow
                  label="Correo electrónico"
                  checked={preferences.chat.email}
                  onCheckedChange={(val) => updatePreference("chat", "email", val)}
                />
                <SettingRow
                  label="SMS"
                  checked={preferences.chat.sms}
                  onCheckedChange={(val) => updatePreference("chat", "sms", val)}
                />
              </div>
            </div>

            {/* Promociones Section */}
            <div className="bg-surface-200 rounded-2xl p-8 shadow-card">
              <h3 className="text-2xl text-neutral mb-4 font-semibold">Promociones</h3>
              <div className="space-y-2 divide-y divide-neutral-100">
                <SettingRow
                  label="Notificaciones push"
                  checked={preferences.promotions.push}
                  onCheckedChange={(val) => updatePreference("promotions", "push", val)}
                />
                <SettingRow
                  label="Correo electrónico"
                  checked={preferences.promotions.email}
                  onCheckedChange={(val) => updatePreference("promotions", "email", val)}
                />
                <SettingRow
                  label="SMS"
                  checked={preferences.promotions.sms}
                  onCheckedChange={(val) => updatePreference("promotions", "sms", val)}
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-surface-200 rounded-2xl p-6">
              <div className="flex gap-4">
                <span className="text-4xl">💡</span>
                <div>
                  <h4 className="text-primary mb-2 font-semibold">Información importante</h4>
                  <p className="text-neutral-500">
                    Puedes cambiar estas preferencias en cualquier momento. Las notificaciones
                    importantes del sistema siempre se enviarán para garantizar la seguridad y el
                    correcto funcionamiento del servicio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
