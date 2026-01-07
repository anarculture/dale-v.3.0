'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User } from 'lucide-react';
import { DaleLogo } from '@/components/ui/DaleLogo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signUp(email, password);
      if (authError) {
        setError(authError);
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al registrarse.');
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
        <div className="pt-12 pb-6 flex justify-center">
          <DaleLogo size="lg" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6">
          {/* Welcome Text */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Únete a Dale</h2>
            <p className="text-[#6b7280]">Crea tu cuenta y empieza a compartir viajes</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Name Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                </div>
              </div>

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
                <p className="mt-1 text-xs text-[#6b7280]">Mínimo 6 caracteres</p>
              </div>

              {/* Confirm Password Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                </div>
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
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-center text-[#9ca3af] mt-4">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/terms" className="text-[#fd5810] hover:underline">
                Términos de servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-[#fd5810] hover:underline">
                Política de privacidad
              </Link>
            </p>

            {/* Login Link */}
            <p className="text-center text-sm text-[#6b7280] mt-6">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[#fd5810] font-medium hover:underline">
                Inicia sesión
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
              Únete a la comunidad Dale
            </h2>
            <p className="text-xl text-white/80">
              Miles de venezolanos ya comparten sus viajes y ahorran cada día
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5K+</div>
                <div className="text-white/80 text-sm">Usuarios activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/80 text-sm">Viajes compartidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50%</div>
                <div className="text-white/80 text-sm">Ahorro promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 flex items-center justify-center p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-6">
              <DaleLogo size="lg" />
            </div>

            {/* Welcome Text */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Únete a Dale</h2>
              <p className="text-[#6b7280]">Crea tu cuenta y empieza a compartir viajes</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Name Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                </div>
              </div>

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
                <p className="mt-1 text-xs text-[#6b7280]">Mínimo 6 caracteres</p>
              </div>

              {/* Confirm Password Input */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#1a1a1a]">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-14 px-4 pl-12 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200 placeholder:text-[#9ca3af] text-[#1a1a1a] focus:outline-none focus:border-[#fd5810] focus:bg-white"
                  />
                </div>
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
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-center text-[#9ca3af] mt-4">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/terms" className="text-[#fd5810] hover:underline">
                Términos de servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-[#fd5810] hover:underline">
                Política de privacidad
              </Link>
            </p>

            {/* Login Link */}
            <p className="text-center text-sm text-[#6b7280] mt-6">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[#fd5810] font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
