"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { DCard } from "@/components/ui";

export default function LoginPage() {
  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido a Dale</h1>
            <p className="mt-2 text-gray-600">Inicia sesión para continuar tu viaje</p>
          </div>
          
          <DCard className="shadow-lg">
            <LoginForm />
          </DCard>
        </div>
      </div>
    </AppLayout>
  );
}
