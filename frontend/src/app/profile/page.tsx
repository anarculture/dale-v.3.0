"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { DCard, DButton, DSpinner, DAlert } from "@/components/ui";
import { DPageSection } from "@/components/layout/DPageSection";
import { User, LogOut, Car, Calendar } from "lucide-react";
import Image from "next/image";
import { isValidAvatarUrl } from "@/lib/utils";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
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
    return null; // Will redirect via useEffect
  }

  return (
    <AppLayout>
      <DPageSection title="Mi Perfil">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="md:col-span-1">
            <DCard className="h-full">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600 overflow-hidden relative">
                  {user.user_metadata?.avatar_url && isValidAvatarUrl(user.user_metadata.avatar_url) ? (
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.user_metadata?.full_name || "Usuario"}
                </h2>
                <p className="text-gray-500 mb-6">{user.email}</p>
                
                <DButton 
                  variant="flat" 
                  color="danger" 
                  startContent={<LogOut size={18} />}
                  onPress={() => signOut()}
                  fullWidth
                >
                  Cerrar Sesión
                </DButton>
              </div>
            </DCard>
          </div>

          {/* Quick Actions & Stats */}
          <div className="md:col-span-2 space-y-6">
            <DCard header="Acciones Rápidas">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DButton 
                  as="a" 
                  href="/offer" 
                  color="primary" 
                  startContent={<Car size={20} />}
                  className="h-20 text-lg"
                >
                  Publicar Viaje
                </DButton>
                <DButton 
                  as="a" 
                  href="/rides" 
                  variant="bordered" 
                  color="primary"
                  startContent={<Calendar size={20} />}
                  className="h-20 text-lg"
                >
                  Buscar Viaje
                </DButton>
              </div>
            </DCard>

            <DCard header="Mis Estadísticas">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-gray-500">Viajes Publicados</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-gray-500">Reservas</p>
                </div>
              </div>
              <div className="mt-4">
                <DAlert 
                  variant="info" 
                  title="Próximamente" 
                  description="Pronto podrás ver aquí el historial detallado de tus viajes y reservas." 
                />
              </div>
            </DCard>
          </div>
        </div>
      </DPageSection>
    </AppLayout>
  );
}
