"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, UserPlus, Clock, Settings } from "lucide-react";
import { DButton } from "@/components/ui/DButton";

export interface Notification {
  id: string;
  type: "request" | "confirmation" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "request",
    title: "Juan quiere unirse a tu viaje",
    message: "Caracas → Valencia - Mañana 8:00 AM",
    time: "Hace 5 min",
    read: false,
    actionable: true,
  },
  {
    id: "2",
    type: "confirmation",
    title: "Tu viaje ha sido confirmado",
    message: "Tu reserva para Valencia → Maracay está confirmada",
    time: "Hace 1 hora",
    read: false,
    actionable: false,
  },
  {
    id: "3",
    type: "info",
    title: "Recordatorio de viaje",
    message: "Tu viaje a Valencia sale mañana a las 8:00 AM",
    time: "Hace 2 horas",
    read: true,
    actionable: false,
  },
];

function getIcon(type: string) {
  switch (type) {
    case "request":
      return <UserPlus className="w-5 h-5 text-primary" />;
    case "confirmation":
      return <CheckCircle className="w-5 h-5 text-success" />;
    default:
      return <Clock className="w-5 h-5 text-neutral-500" />;
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const hasNotifications = notifications.length > 0;

  const handleBack = () => router.back();
  const handleSettingsClick = () => router.push("/notifications/settings");

  const handleAccept = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: Call API to accept request
  };

  const handleReject = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: Call API to reject request
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        {/* Header */}
        <div className="bg-card px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-surface rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6 text-neutral" />
            </button>
            <h2 className="text-xl text-neutral font-semibold">Notificaciones</h2>
            <button
              onClick={handleSettingsClick}
              className="p-2 -mr-2 hover:bg-surface rounded-full transition"
            >
              <Settings className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {hasNotifications ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-card rounded-xl p-4 shadow-card ${
                    !notification.read ? "border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-neutral font-medium">{notification.title}</h4>
                        <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                          {notification.time}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-500 mb-3">{notification.message}</p>

                      {notification.actionable && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(notification.id)}
                            className="flex-1 h-11 bg-primary text-white rounded-full hover:bg-primary-dark transition text-sm font-semibold"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleReject(notification.id)}
                            className="flex-1 h-11 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200 transition text-sm font-semibold"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="text-8xl mb-6">👍</div>
              <h3 className="text-2xl text-neutral mb-3 text-center font-semibold">
                Sin notificaciones
              </h3>
              <p className="text-neutral-500 text-center max-w-xs mb-6">
                Cuando alguien quiera unirse a tu viaje o tengas actualizaciones, aparecerán aquí
              </p>
              <DButton variant="flat" onClick={handleBack}>
                Volver al inicio
              </DButton>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl text-neutral mb-2 font-bold">Notificaciones</h1>
              <p className="text-neutral-500">Mantente al día con tus viajes y solicitudes</p>
            </div>
            <button
              onClick={handleSettingsClick}
              className="px-6 py-3 bg-card text-neutral rounded-full hover:bg-neutral-200 transition flex items-center gap-2 font-semibold"
            >
              <Settings className="w-5 h-5" />
              Ajustes
            </button>
          </div>

          {hasNotifications ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-card rounded-xl p-6 shadow-card transition-all hover:shadow-card-hover ${
                    !notification.read ? "border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-surface flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg text-neutral font-semibold">{notification.title}</h4>
                        <span className="text-sm text-neutral-500 whitespace-nowrap ml-4">
                          {notification.time}
                        </span>
                      </div>

                      <p className="text-neutral-500 mb-4">{notification.message}</p>

                      {notification.actionable && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAccept(notification.id)}
                            className="px-8 h-14 bg-primary text-white rounded-full hover:bg-primary-dark transition font-semibold"
                          >
                            Aceptar solicitud
                          </button>
                          <button
                            onClick={() => handleReject(notification.id)}
                            className="px-8 h-14 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200 transition font-semibold"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-16 text-center shadow-card">
              <div className="text-[10rem] mb-8">👍</div>
              <h3 className="text-3xl text-neutral mb-4 font-semibold">Sin notificaciones</h3>
              <p className="text-lg text-neutral-500 max-w-md mx-auto mb-8">
                Cuando alguien quiera unirse a tu viaje o tengas actualizaciones, aparecerán aquí
              </p>
              <DButton variant="flat" onClick={handleBack}>
                Volver al inicio
              </DButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
