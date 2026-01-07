'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
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
      const { error: authError, message: successMessage } = await resetPassword(email);
      if (authError) {
        setError(authError);
      } else {
        setMessage(successMessage || 'Se ha enviado un correo para restablecer tu contraseña.');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <Link href="/login" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
          </Link>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Recuperar contraseña</h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6 pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#fff7ed] rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-[#fd5810]" />
            </div>
          </div>

          {/* Info Text */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">¿Olvidaste tu contraseña?</h2>
            <p className="text-[#6b7280]">
              No te preocupes. Ingresa tu correo y te enviaremos instrucciones para recuperarla.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">{message}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!message}
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!message}
                className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : message ? (
                  'Correo enviado'
                ) : (
                  'Enviar instrucciones'
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-[#6b7280] mt-6">
              <Link href="/login" className="text-[#fd5810] font-medium hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link 
            href="/login"
            className="flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] transition mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver al inicio de sesión</span>
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#fff7ed] rounded-full flex items-center justify-center">
              <Mail className="w-12 h-12 text-[#fd5810]" />
            </div>
          </div>

          {/* Info Text */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">¿Olvidaste tu contraseña?</h2>
            <p className="text-[#6b7280]">
              No te preocupes. Ingresa tu correo y te enviaremos instrucciones para recuperarla.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">{message}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!message}
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!message}
                className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : message ? (
                  'Correo enviado'
                ) : (
                  'Enviar instrucciones'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
