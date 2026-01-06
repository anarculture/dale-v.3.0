import React, { useState } from 'react';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { SearchFormScreen, SearchParams } from './components/screens/SearchFormScreen';
import { SearchResultsScreen } from './components/screens/SearchResultsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { DesignSystemScreen } from './components/screens/DesignSystemScreen';
import { BottomNav, NavTab } from './components/dale/BottomNav';
import { DesktopSidebar } from './components/dale/DesktopSidebar';
import { Ride } from './components/dale/RideCard';
import { Palette } from 'lucide-react';

type Screen = 'welcome' | 'search-form' | 'search-results' | 'publish' | 'profile' | 'design-system';

// Mock Data
const mockRides: Ride[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
    originCity: 'Caracas',
    originTime: '09:30',
    destinationCity: 'Valencia',
    destinationTime: '13:00',
    price: 22,
    driver: {
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      verified: true,
      rating: 4.8,
    },
    seatsAvailable: 2,
  },
  {
    id: '3',
    originCity: 'Caracas',
    originTime: '14:00',
    destinationCity: 'Valencia',
    destinationTime: '17:45',
    price: 28,
    driver: {
      name: 'José Pérez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      verified: true,
      rating: 4.7,
    },
    seatsAvailable: 4,
  },
  {
    id: '4',
    originCity: 'Caracas',
    originTime: '16:30',
    destinationCity: 'Valencia',
    destinationTime: '20:00',
    price: 20,
    driver: {
      name: 'Ana Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      verified: false,
      rating: 4.6,
    },
    seatsAvailable: 1,
  },
];

const mockUser = {
  name: 'Pedro Sánchez',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  rating: 4.8,
  verified: true,
  ridesCompleted: 47,
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [activeTab, setActiveTab] = useState<NavTab>('buscar');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'buscar':
        setCurrentScreen('search-form');
        break;
      case 'publicar':
        setCurrentScreen('publish');
        break;
      case 'perfil':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setCurrentScreen('search-results');
  };

  const showBottomNav = currentScreen !== 'welcome' && currentScreen !== 'search-results' && currentScreen !== 'design-system';
  const showDesktopSidebar = currentScreen !== 'welcome' && currentScreen !== 'design-system';

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Mobile View Container */}
      <div className="lg:hidden min-h-screen max-w-[375px] mx-auto relative bg-[#fffbf3] shadow-2xl">
        {/* Design System Toggle Button - Mobile */}
        {currentScreen !== 'design-system' && (
          <button
            onClick={() => setCurrentScreen('design-system')}
            className="fixed top-4 right-4 z-50 w-12 h-12 bg-[#fd5810] rounded-full shadow-lg flex items-center justify-center hover:bg-[#e54f0e] transition-colors"
            title="View Design System"
          >
            <Palette className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Screen Content - Mobile */}
        {currentScreen === 'design-system' && (
          <div className="relative">
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="fixed top-4 left-4 z-50 px-4 py-2 bg-white rounded-full shadow-lg text-sm text-[#1a1a1a] hover:bg-gray-50 transition-colors"
            >
              ← Volver a la app
            </button>
            <DesignSystemScreen />
          </div>
        )}

        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onSearchClick={() => {
              setCurrentScreen('search-form');
              setActiveTab('buscar');
            }}
            onPublishClick={() => {
              setCurrentScreen('publish');
              setActiveTab('publicar');
            }}
          />
        )}

        {currentScreen === 'search-form' && (
          <SearchFormScreen
            onSearch={handleSearch}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'search-results' && searchParams && (
          <SearchResultsScreen
            origin={searchParams.origin}
            destination={searchParams.destination}
            date={searchParams.date}
            rides={mockRides}
            onBack={() => setCurrentScreen('search-form')}
            onRideClick={(ride) => console.log('Selected ride:', ride)}
          />
        )}

        {currentScreen === 'publish' && (
          <div className="min-h-screen bg-[#fffbf3] pb-24">
            <div className="bg-white px-6 py-4 sticky top-0 z-10 shadow-sm">
              <h2 className="text-xl text-[#1a1a1a]">Publicar viaje</h2>
            </div>
            <div className="p-6">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl text-[#1a1a1a] mb-2">Publica tu viaje</h3>
                <p className="text-[#6b7280]">
                  Comparte tu trayecto y ayuda a otros viajeros mientras ahorras en gastos de combustible
                </p>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen user={mockUser} />
        )}

        {/* Bottom Navigation - Mobile */}
        {showBottomNav && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>

      {/* Desktop View Container */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Sidebar */}
        {showDesktopSidebar && (
          <DesktopSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogoClick={() => setCurrentScreen('welcome')}
          />
        )}

        {/* Main Content Area - Desktop */}
        <main className="flex-1 min-h-screen overflow-auto">
          {/* Design System Toggle Button - Desktop */}
          {currentScreen !== 'design-system' && (
            <button
              onClick={() => setCurrentScreen('design-system')}
              className="fixed top-6 right-6 z-50 w-14 h-14 bg-[#fd5810] rounded-full shadow-lg flex items-center justify-center hover:bg-[#e54f0e] transition-colors"
              title="View Design System"
            >
              <Palette className="w-7 h-7 text-white" />
            </button>
          )}

          {currentScreen === 'design-system' && (
            <div className="relative">
              <button
                onClick={() => setCurrentScreen('welcome')}
                className="fixed top-6 left-80 z-50 px-6 py-3 bg-white rounded-full shadow-lg text-sm text-[#1a1a1a] hover:bg-gray-50 transition-colors"
              >
                ← Volver a la app
              </button>
              <DesignSystemScreen />
            </div>
          )}

          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onSearchClick={() => {
                setCurrentScreen('search-form');
                setActiveTab('buscar');
              }}
              onPublishClick={() => {
                setCurrentScreen('publish');
                setActiveTab('publicar');
              }}
            />
          )}

          {currentScreen === 'search-form' && (
            <SearchFormScreen
              onSearch={handleSearch}
              onBack={() => setCurrentScreen('welcome')}
            />
          )}

          {currentScreen === 'search-results' && searchParams && (
            <SearchResultsScreen
              origin={searchParams.origin}
              destination={searchParams.destination}
              date={searchParams.date}
              rides={mockRides}
              onBack={() => setCurrentScreen('search-form')}
              onRideClick={(ride) => console.log('Selected ride:', ride)}
            />
          )}

          {currentScreen === 'publish' && (
            <div className="min-h-screen bg-[#fffbf3] p-12 flex items-center justify-center">
              <div className="max-w-2xl w-full">
                <div className="mb-8">
                  <h1 className="text-4xl text-[#1a1a1a] mb-2">Publicar un viaje</h1>
                  <p className="text-lg text-[#6b7280]">
                    Comparte tu trayecto y ayuda a otros viajeros
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                  <div className="text-8xl mb-6">🚗</div>
                  <h3 className="text-2xl text-[#1a1a1a] mb-3">Publica tu viaje</h3>
                  <p className="text-lg text-[#6b7280] mb-6">
                    Comparte tu trayecto y ayuda a otros viajeros mientras ahorras en gastos de combustible
                  </p>
                  <button className="px-8 py-4 bg-[#fd5810] text-white rounded-xl hover:bg-[#e54f0e] transition">
                    Crear publicación
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen user={mockUser} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
