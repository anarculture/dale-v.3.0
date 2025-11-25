"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DInput, DButton, DAlert } from "@/components/ui";
import Link from "next/link";

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        // Redirect to profile to complete setup or show success message
        // For MVP, we can redirect to login or directly to rides if auto-login works
        router.push("/profile"); 
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al registrarse.");
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
        description="Mínimo 6 caracteres"
      />

      <DInput
        label="Confirmar Contraseña"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        isRequired
      />

      <DButton 
        type="submit" 
        fullWidth 
        isLoading={loading}
        color="primary"
      >
        Crear Cuenta
      </DButton>

      <div className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Inicia Sesión
        </Link>
      </div>
    </form>
  );
};
