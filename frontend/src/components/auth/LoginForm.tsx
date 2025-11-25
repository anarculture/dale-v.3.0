"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DInput, DButton, DAlert, DFormField } from "@/components/ui";
import Link from "next/link";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        router.push("/rides"); // Default redirect after login
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al iniciar sesión.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <DAlert variant="error" description={error} />}
      
      <DInput
        label="Correo Electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isRequired
      />
      
      <DInput
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isRequired
      />

      <div className="flex justify-end">
        <Link 
          href="/forgot-password" 
          className="text-sm text-primary hover:text-primary-dark"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <DButton 
        type="submit" 
        fullWidth 
        isLoading={loading}
        color="primary"
      >
        Iniciar Sesión
      </DButton>

      <div className="text-center text-sm text-gray-600 mt-4">
        ¿No tienes una cuenta?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Regístrate
        </Link>
      </div>
    </form>
  );
};
