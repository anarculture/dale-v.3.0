"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DInput, DButton, DAlert } from "@/components/ui";
import Link from "next/link";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error, message } = await resetPassword(email);
      if (error) {
        setError(error);
      } else {
        setMessage(message || "Se ha enviado un correo para restablecer tu contraseña.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <DAlert variant="error" description={error} />}
      {message && <DAlert variant="success" description={message} />}
      
      <DInput
        label="Correo Electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isRequired
      />

      <DButton 
        type="submit" 
        fullWidth 
        isLoading={loading}
        disabled={loading || !!message}
        color="primary"
      >
        Enviar Instrucciones
      </DButton>

      <div className="text-center text-sm text-gray-600 mt-4">
        <Link href="/login" className="text-primary font-medium hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  );
};
