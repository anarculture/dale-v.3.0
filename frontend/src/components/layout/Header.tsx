import Link from 'next/link';
import { Button } from '@/components/ui';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Dale
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/rides" className="text-neutral-600 hover:text-primary transition-colors font-medium">
            Buscar viaje
          </Link>
          <Link href="/offer" className="text-neutral-600 hover:text-primary transition-colors font-medium">
            Publicar viaje
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Iniciar sesión</Button>
          </Link>
          <Link href="/signup">
            <Button className="font-medium shadow-lg shadow-primary/20">Registrarse</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
