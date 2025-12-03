"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { DCard } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h1>
            <p className="mt-2 text-gray-600">Ingresa tu correo para recibir instrucciones</p>
          </div>
          
          <DCard className="shadow-lg">
            <ForgotPasswordForm />
          </DCard>
        </div>
      </div>
    </AppLayout>
  );
}
