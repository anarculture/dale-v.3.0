import React from 'react';
import { DaleButton } from '../dale/DaleButton';
import { DaleInput } from '../dale/DaleInput';
import { RideCard, Ride } from '../dale/RideCard';
import { MapPin, Search } from 'lucide-react';

export function DesignSystemScreen() {
  const sampleRide: Ride = {
    id: 'sample',
    originCity: 'Caracas',
    originTime: '08:00',
    destinationCity: 'Valencia',
    destinationTime: '11:30',
    price: 25,
    driver: {
      name: 'Carlos Méndez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      verified: true,
      rating: 4.9,
    },
    seatsAvailable: 3,
  };

  return (
    <div className="min-h-screen bg-[#fffbf3] p-6 pb-12">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-[#fd5810] mb-2">Dale! UI Kit</h1>
          <p className="text-[#6b7280]">Design System & Component Library</p>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-xl mb-4">Color Tokens</h2>
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#fd5810] shadow-sm" />
                <div>
                  <div className="text-sm text-[#1a1a1a]">Primary Orange</div>
                  <div className="text-xs text-[#6b7280]">#fd5810</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#fffbf3] border border-gray-200" />
                <div>
                  <div className="text-sm text-[#1a1a1a]">Background Cream</div>
                  <div className="text-xs text-[#6b7280]">#fffbf3</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ffffff] border border-gray-200 shadow-sm" />
                <div>
                  <div className="text-sm text-[#1a1a1a]">Surface White</div>
                  <div className="text-xs text-[#6b7280]">#ffffff</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#fff7ed]" />
                <div>
                  <div className="text-sm text-[#1a1a1a]">Secondary BG</div>
                  <div className="text-xs text-[#6b7280]">#fff7ed</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#f3f4f6]" />
                <div>
                  <div className="text-sm text-[#1a1a1a]">Input BG</div>
                  <div className="text-xs text-[#6b7280]">#f3f4f6</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-xl mb-4">Typography</h2>
          <div className="bg-white rounded-2xl p-6 space-y-3">
            <div>
              <h1>Heading 1 - Plus Jakarta Sans Bold</h1>
              <p className="text-xs text-[#6b7280]">32px / 2rem</p>
            </div>
            <div>
              <h2>Heading 2 - Plus Jakarta Sans Bold</h2>
              <p className="text-xs text-[#6b7280]">24px / 1.5rem</p>
            </div>
            <div>
              <h3>Heading 3 - Plus Jakarta Sans SemiBold</h3>
              <p className="text-xs text-[#6b7280]">20px / 1.25rem</p>
            </div>
            <div>
              <p className="text-[#6b7280]">Body text - Plus Jakarta Sans Regular, 16px</p>
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Small text - Plus Jakarta Sans Regular, 14px</p>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-xl mb-4">Border Radius</h2>
          <div className="bg-white rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#fd5810] rounded-xl" />
              <div>
                <div className="text-sm text-[#1a1a1a]">Buttons & Inputs</div>
                <div className="text-xs text-[#6b7280]">16px / rounded-xl</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#fd5810] rounded-2xl" />
              <div>
                <div className="text-sm text-[#1a1a1a]">Cards & Sheets</div>
                <div className="text-xs text-[#6b7280]">24px / rounded-2xl</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-8 bg-[#fd5810] rounded-full" />
              <div>
                <div className="text-sm text-[#1a1a1a]">Pills & Badges</div>
                <div className="text-xs text-[#6b7280]">999px / rounded-full</div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl mb-4">Buttons (Height: 56px)</h2>
          <div className="bg-white rounded-2xl p-6 space-y-3">
            <div>
              <p className="text-xs text-[#6b7280] mb-2">Primary</p>
              <DaleButton variant="primary">Buscar un viaje</DaleButton>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] mb-2">Secondary</p>
              <DaleButton variant="secondary">Publicar un viaje</DaleButton>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] mb-2">Ghost</p>
              <DaleButton variant="ghost">Cancelar</DaleButton>
            </div>
            <div>
              <p className="text-xs text-[#6b7280] mb-2">Disabled</p>
              <DaleButton variant="primary" disabled>Deshabilitado</DaleButton>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-xl mb-4">Input Fields (Height: 56px)</h2>
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <DaleInput
              label="Default State"
              placeholder="Escribe aquí..."
            />
            <DaleInput
              label="With Icon"
              placeholder="Ciudad de origen"
              icon={<MapPin className="w-5 h-5" />}
            />
            <DaleInput
              label="Error State"
              placeholder="Campo requerido"
              error="Este campo es obligatorio"
            />
          </div>
        </section>

        {/* Ride Card */}
        <section>
          <h2 className="text-xl mb-4">Ride Card Component</h2>
          <RideCard ride={sampleRide} />
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-xl mb-4">Icon Style</h2>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex gap-4 items-center">
              <MapPin className="w-6 h-6 text-[#fd5810]" />
              <Search className="w-6 h-6 text-[#fd5810]" />
              <div className="text-sm text-[#6b7280]">
                Lucide React - Rounded, outlined style
              </div>
            </div>
          </div>
        </section>

        {/* Touch Targets */}
        <section>
          <h2 className="text-xl mb-4">Touch Targets</h2>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-[#6b7280] mb-4">
              Minimum height: 44px (iOS/Android guidelines)
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#fd5810]" />
                <span className="text-sm text-[#1a1a1a]">Buttons: 56px height</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#fd5810]" />
                <span className="text-sm text-[#1a1a1a]">Inputs: 56px height</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#fd5810]" />
                <span className="text-sm text-[#1a1a1a]">Nav items: 80px height</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
