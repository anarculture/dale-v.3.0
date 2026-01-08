import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[8rem] lg:text-[12rem] leading-none">🚗</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl lg:text-8xl opacity-20 font-bold">?</div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl lg:text-5xl text-neutral font-bold mb-4">Te has perdido</h1>
        <p className="text-lg lg:text-xl text-neutral-500 mb-8">
          La página que buscas no existe o ha sido movida. Vuelve al camino correcto.
        </p>

        {/* CTA */}
        <div className="max-w-xs mx-auto space-y-3">
          <Link
            href="/home"
            className="block w-full h-14 bg-primary text-white rounded-full hover:bg-primary-dark transition flex items-center justify-center font-semibold"
          >
            Volver al inicio
          </Link>
          <Link
            href="/home"
            className="block w-full h-14 bg-transparent text-neutral-500 rounded-full hover:bg-neutral-100 transition flex items-center justify-center font-semibold"
          >
            Buscar viajes
          </Link>
        </div>

        {/* Error Code */}
        <div className="mt-12 text-sm text-neutral-500">Error 404 - Página no encontrada</div>
      </div>
    </div>
  );
}
