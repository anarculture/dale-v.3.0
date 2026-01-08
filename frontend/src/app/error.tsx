"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="text-[8rem] lg:text-[12rem] leading-none">⚠️</div>
        </div>

        {/* Content */}
        <h1 className="text-4xl lg:text-5xl text-neutral font-bold mb-4">Algo salió mal</h1>
        <p className="text-lg lg:text-xl text-neutral-500 mb-8">
          Estamos trabajando para solucionar el problema. Por favor, intenta nuevamente en unos
          momentos.
        </p>

        {/* Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-card mb-8">
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Estado del servidor</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                En mantenimiento
              </span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="text-sm text-neutral-500">
              Nuestro equipo está trabajando para restaurar el servicio lo antes posible.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-xs mx-auto space-y-3">
          <button
            onClick={reset}
            className="w-full h-14 bg-primary text-white rounded-full hover:bg-primary-dark transition font-semibold"
          >
            Reintentar
          </button>
          <a
            href="/home"
            className="block w-full h-14 bg-transparent text-neutral-500 rounded-full hover:bg-neutral-100 transition flex items-center justify-center font-semibold"
          >
            Volver al inicio
          </a>
        </div>

        {/* Error Code */}
        <div className="mt-12 text-sm text-neutral-500">Error 500 - Error del servidor</div>
      </div>
    </div>
  );
}
