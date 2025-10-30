import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Dale</h1>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h2 className="text-5xl font-bold text-neutral-900 mb-6">
            Comparte viajes y ahorra
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Encuentra compañeros de viaje o publica tus trayectos. Económico, 
            sostenible y social.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rides">
              <Button size="lg" fullWidth>
                🔍 Buscar viajes
              </Button>
            </Link>
            <Link href="/offer">
              <Button size="lg" variant="secondary" fullWidth>
                🚗 Publicar viaje
              </Button>
            </Link>
          </div>

          {/* Como funciona */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-semibold text-lg mb-2">Busca tu ruta</h3>
              <p className="text-neutral-600">
                Indica origen, destino y fecha del viaje
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Reserva tu asiento</h3>
              <p className="text-neutral-600">
                Elige el viaje que más te convenga
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-lg mb-2">¡Listo para viajar!</h3>
              <p className="text-neutral-600">
                Contacta con el conductor y disfruta
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6">
        <div className="container mx-auto px-4 text-center text-neutral-600">
          <p>© 2025 Dale. Desarrollado con Spec-Driven Development.</p>
        </div>
      </footer>
    </div>
  );
}
