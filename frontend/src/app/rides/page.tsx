// Rides page for Dale PWA
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import RideCard from '@/components/RideCard';
import RideFilters, { FilterState } from '@/components/RideFilters';
import RidePagination from '@/components/RidePagination';
import { api, Ride, ApiResponse } from '@/lib/api';
import { Search, Filter, Users, Car, Plus, RefreshCw } from 'lucide-react';

interface SearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

interface SearchResults {
  rides: Ride[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function RidesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Estados principales
  const [rides, setRides] = useState<Ride[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros y paginación
  const [filters, setFilters] = useState<FilterState>({
    origin: '',
    destination: '',
    date: '',
    maxPrice: 50,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  
  // Estados de UI
  const [refreshing, setRefreshing] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Función para construir parámetros de búsqueda
  const buildSearchParams = useCallback((searchFilters: FilterState, page = 1): string => {
    const params = new URLSearchParams();
    
    if (searchFilters.origin) params.append('origin', searchFilters.origin);
    if (searchFilters.destination) params.append('destination', searchFilters.destination);
    if (searchFilters.date) params.append('date', searchFilters.date);
    if (searchFilters.maxPrice && searchFilters.maxPrice > 0) {
      params.append('maxPrice', searchFilters.maxPrice.toString());
    }
    
    params.append('page', page.toString());
    params.append('limit', '10'); // 10 rides por página
    
    return params.toString();
  }, []);

  // Función para buscar rides
  const searchRides = useCallback(async (searchFilters: FilterState, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = buildSearchParams(searchFilters, page);
      const response = await api.searchRides(queryParams);
      
      if (response.success && response.data) {
        // Transformar datos de la API al formato esperado
        const transformedRides: Ride[] = Array.isArray(response.data) ? response.data : [];
        
        const results: SearchResults = {
          rides: transformedRides,
          total: transformedRides.length,
          page,
          totalPages: Math.ceil(transformedRides.length / 10),
          hasNextPage: transformedRides.length === 10,
          hasPrevPage: page > 1,
        };
        
        setSearchResults(results);
        setRides(transformedRides);
        setCurrentPage(page);
      } else {
        setError(response.error || 'Error al buscar viajes');
        setRides([]);
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Error searching rides:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
      setRides([]);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }, [buildSearchParams]);

  // Buscar rides cuando cambien los filtros
  useEffect(() => {
    if (user) {
      searchRides(filters, 1);
    }
  }, [filters, searchRides, user]);

  // Manejar cambio de filtros
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    searchRides(filters, page);
    // Scroll al top de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refrescar resultados
  const handleRefresh = async () => {
    setRefreshing(true);
    await searchRides(filters, currentPage);
    setRefreshing(false);
  };

  // Simular datos de prueba si no hay resultados
  const generateMockRides = (): Ride[] => {
    const mockRides: Ride[] = [
      {
        id: '1',
        driver_id: 'driver1',
        from_city: 'Madrid',
        from_lat: 40.4168,
        from_lon: -3.7038,
        to_city: 'Barcelona',
        to_lat: 41.3851,
        to_lon: 2.1734,
        date_time: new Date(Date.now() + 86400000).toISOString(), // Mañana
        seats_total: 4,
        seats_available: 3,
        price: 25,
        notes: 'Viaje cómodo, dos paradas en la ruta',
        status: 'active',
        created_at: new Date().toISOString(),
        driver_name: 'Carlos García',
        driver_rating: 4.8,
      },
      {
        id: '2',
        driver_id: 'driver2',
        from_city: 'Valencia',
        from_lat: 39.4699,
        from_lon: -0.3763,
        to_city: 'Madrid',
        to_lat: 40.4168,
        to_lon: -3.7038,
        date_time: new Date(Date.now() + 172800000).toISOString(), // Pasado mañana
        seats_total: 3,
        seats_available: 1,
        price: 20,
        notes: 'Música suave durante el viaje',
        status: 'active',
        created_at: new Date().toISOString(),
        driver_name: 'María López',
        driver_rating: 4.9,
      },
      {
        id: '3',
        driver_id: 'driver3',
        from_city: 'Sevilla',
        from_lat: 37.3886,
        from_lon: -5.9823,
        to_city: 'Granada',
        to_lat: 37.1773,
        to_lon: -3.5986,
        date_time: new Date(Date.now() + 259200000).toISOString(), // En 3 días
        seats_total: 4,
        seats_available: 4,
        price: 15,
        notes: 'Perfecto para estudiantes',
        status: 'active',
        created_at: new Date().toISOString(),
        driver_name: 'Antonio Ruiz',
        driver_rating: 4.5,
      },
    ];
    return mockRides;
  };

  // Mostrar datos de prueba cuando no hay resultados y no está cargando
  useEffect(() => {
    if (!loading && rides.length === 0 && !error && user) {
      setRides(generateMockRides());
    }
  }, [loading, rides.length, error, user]);

  // Mostrar loading de autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando Dale...</p>
        </div>
      </div>
    );
  }

  // No renderizar si no está autenticado
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Buscar Viajes</h1>
              <span className="text-sm text-gray-600">
                {searchResults ? `${searchResults.total} viajes encontrados` : 'Cargando...'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Actualizar
              </button>
              
              <button
                onClick={() => router.push('/rides/create')}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Crear Viaje
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Filtros */}
        {showFilters && (
          <RideFilters
            onFiltersChange={handleFiltersChange}
            isLoading={loading}
          />
        )}

        {/* Estadísticas rápidas */}
        {searchResults && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Viajes encontrados</p>
                  <p className="text-xl font-semibold text-gray-900">{searchResults.total}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Viajes activos</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {rides.filter(ride => ride.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Asientos disponibles</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {rides.reduce((total, ride) => total + ride.seats_available, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="card border-red-200 bg-red-50 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error al buscar viajes</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de viajes */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                showBookButton={true}
                onBook={(ride) => {
                  console.log('Booking ride:', ride.id);
                  // Aquí iría la lógica de reserva
                  alert(`Reservando asiento en viaje de ${ride.from_city} a ${ride.destination}`);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron viajes
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tus filtros de búsqueda para encontrar más opciones.
                </p>
                <button
                  onClick={() => setFilters({
                    origin: '',
                    destination: '',
                    date: '',
                    maxPrice: 50,
                  })}
                  className="btn-secondary"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paginación */}
        {searchResults && searchResults.totalPages > 1 && (
          <RidePagination
            currentPage={searchResults.page}
            totalPages={searchResults.totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
}