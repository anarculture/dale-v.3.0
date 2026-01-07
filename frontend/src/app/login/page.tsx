'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { DaleLogo } from '@/components/ui/DaleLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError);
      } else {
        router.push('/home');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Header with Logo */}
        <div className="pt-12 pb-8 flex justify-center">
          <DaleLogo size="lg" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6">
          {/* Welcome Text */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Bienvenido de vuelta</h2>
            <p className="text-[#6b7280]">Inicia sesión para continuar tu viaje</p>
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
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-14 px-4 pl-12 pr-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#fd5810] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#e5e7eb]" />
              <span className="text-sm text-[#9ca3af]">o continúa con</span>
              <div className="flex-1 h-px bg-[#e5e7eb]" />
            </div>

            {/* Social Login (placeholder) */}
            <button
              type="button"
              className="w-full h-14 rounded-xl bg-[#f3f4f6] text-[#1a1a1a] font-medium hover:bg-[#e5e7eb] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#6b7280] mt-6">
              ¿No tienes una cuenta?{' '}
              <Link href="/signup" className="text-[#fd5810] font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Panel - Illustration */}
        <div className="w-1/2 bg-gradient-to-br from-[#fd5810] to-[#ff8c4b] flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <div className="mb-8">
              <div className="w-48 h-48 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <img src="/favicon.png" alt="Dale" className="w-36 h-36 object-contain" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Comparte tu viaje, ahorra en el camino
            </h2>
            <p className="text-xl text-white/80">
              Conecta con conductores verificados y viaja seguro por toda Venezuela
            </p>
            
            {/* Features */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-white/80">Conductores verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-white/80">Pagos seguros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <DaleLogo size="lg" />
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Bienvenido de vuelta</h2>
              <p className="text-[#6b7280]">Inicia sesión para continuar tu viaje</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
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
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-14 px-4 pl-12 pr-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#fd5810] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#e5e7eb]" />
              <span className="text-sm text-[#9ca3af]">o continúa con</span>
              <div className="flex-1 h-px bg-[#e5e7eb]" />
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full h-14 rounded-xl bg-[#f3f4f6] text-[#1a1a1a] font-medium hover:bg-[#e5e7eb] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#6b7280] mt-6">
              ¿No tienes una cuenta?{' '}
              <Link href="/signup" className="text-[#fd5810] font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
