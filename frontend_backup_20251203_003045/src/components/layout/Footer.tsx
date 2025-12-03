import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Dale</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              La forma más inteligente de viajar. Conecta con personas, comparte gastos y reduce tu huella de carbono.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Viajar</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><Link href="/rides" className="hover:text-primary transition-colors">Buscar viaje</Link></li>
              <li><Link href="/offer" className="hover:text-primary transition-colors">Publicar viaje</Link></li>
              <li><Link href="/safety" className="hover:text-primary transition-colors">Seguridad</Link></li>
              <li><Link href="/insurance" className="hover:text-primary transition-colors">Seguros</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Comunidad</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><Link href="/about" className="hover:text-primary transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Política de privacidad</Link></li>
            </ul>
          </div>

          {/* Social/App Column */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Descarga la App</h4>
            <div className="space-y-3">
              <button className="w-full bg-neutral-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors">
                <span></span> App Store
              </button>
              <button className="w-full bg-neutral-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors">
                <span>▶</span> Google Play
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-400">
            © 2025 Dale. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-neutral-400">
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
