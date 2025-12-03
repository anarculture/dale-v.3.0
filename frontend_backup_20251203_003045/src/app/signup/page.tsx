"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { DCard } from "@/components/ui";

export default function SignupPage() {
  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Únete a Dale</h1>
            <p className="mt-2 text-gray-600">Crea tu cuenta y empieza a compartir viajes</p>
          </div>
          
          <DCard className="shadow-lg">
            <SignupForm />
          </DCard>
        </div>
      </div>
    </AppLayout>
  );
}
