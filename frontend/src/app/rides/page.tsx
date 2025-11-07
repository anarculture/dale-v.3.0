'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Ride, RideSearchParams, ApiError } from '@/lib/api';
import { RideCard } from '@/components/rides/RideCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function RidesPage() {
  const router = useRouter();
  const { user, loading: authLoading, getToken } = useAuth();

  // Estados de búsqueda
  const [searchParams, setSearchParams] = useState<RideSearchParams>({
    from_city: '',
    to_city: '',
    date: '',
    min_seats: undefined,
    max_price: undefined,
  });

  // Estados de datos
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingRideId, setBookingRideId] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Configurar el getter de token para el API client
  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  /**
   * Buscar viajes con los filtros actuales
   */
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const params: RideSearchParams = {};
      
      if (searchParams.from_city?.trim()) {
        params.from_city = searchParams.from_city.trim();
      }
      if (searchParams.to_city?.trim()) {
        params.to_city = searchParams.to_city.trim();
      }
      if (searchParams.date) {
        params.date = searchParams.date;
      }
      if (searchParams.min_seats) {
        params.min_seats = searchParams.min_seats;
      }
      if (searchParams.max_price) {
        params.max_price = searchParams.max_price;
      }

      const results = await apiClient.searchRides(params);
      setRides(results);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.error || 'Error al buscar viajes');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/rides');
    }
  }, [user, authLoading, router]);

  // Cargar viajes al montar el componente
  useEffect(() => {
    if (user && !searchPerformed) {
      handleSearch();
    }
  }, [user, searchPerformed, handleSearch]);

  /**
   * Reservar una plaza en un viaje
   */
  const handleBookRide = async (rideId: string) => {
    if (!user) {
      router.push('/login?redirect=/rides');
      return;
    }

    setBookingRideId(rideId);
    setError(null);

    try {
      await apiClient.createBooking(rideId);
      
      // Actualizar la lista de viajes para reflejar la plaza reservada
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === rideId
            ? { ...ride, seats_available: ride.seats_available - 1 }
            : ride
        )
      );

      // Mostrar mensaje de éxito y redirigir a mis reservas
      alert('¡Reserva realizada con éxito!');
      router.push('/bookings');
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.detail || apiError.error || 'Error al realizar la reserva';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setBookingRideId(null);
    }
  };

  /**
   * Limpiar filtros de búsqueda
   */
  const handleClearFilters = () => {
    setSearchParams({
      from_city: '',
      to_city: '',
      date: '',
      min_seats: undefined,
      max_price: undefined,
    });
    setSearchPerformed(false);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se redirigirá)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Buscar Viajes
          </h1>
          <p className="text-neutral-600">
            Encuentra el viaje perfecto para tu destino
          </p>
        </div>

        {/* Filtros de búsqueda */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Filtros de búsqueda
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Ciudad origen */}
              <Input
                label="Ciudad de origen"
                placeholder="Madrid, Barcelona..."
                value={searchParams.from_city}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, from_city: e.target.value })
                }
              />

              {/* Ciudad destino */}
              <Input
                label="Ciudad de destino"
                placeholder="Valencia, Sevilla..."
                value={searchParams.to_city}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, to_city: e.target.value })
                }
              />

              {/* Fecha */}
              <Input
                label="Fecha"
                type="date"
                value={searchParams.date}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, date: e.target.value })
                }
              />

              {/* Plazas mínimas */}
              <Input
                label="Plazas mínimas"
                type="number"
                min="1"
                max="8"
                placeholder="1"
                value={searchParams.min_seats || ''}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    min_seats: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />

              {/* Precio máximo */}
              <Input
                label="Precio máximo (€)"
                type="number"
                min="0"
                step="0.5"
                placeholder="50"
                value={searchParams.max_price || ''}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    max_price: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                loading={loading}
                disabled={loading}
                variant="primary"
              >
                Buscar viajes
              </Button>
              <Button
                onClick={handleClearFilters}
                disabled={loading}
                variant="ghost"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
            <p className="text-error font-medium">{error}</p>
          </div>
        )}

        {/* Resultados */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              {loading ? 'Buscando...' : `${rides.length} viajes encontrados`}
            </h2>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-2xl h-64 border border-neutral-200"></div>
                </div>
              ))}
            </div>
          )}

          {/* Lista de viajes */}
          {!loading && rides.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onBook={handleBookRide}
                  loading={bookingRideId === ride.id}
                  showBookButton={true}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && searchPerformed && rides.length === 0 && (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No se encontraron viajes
              </h3>
              <p className="text-neutral-600 mb-4">
                Intenta ajustar los filtros de búsqueda o prueba con otras fechas
              </p>
              <Button onClick={handleClearFilters} variant="ghost">
                Limpiar filtros
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
