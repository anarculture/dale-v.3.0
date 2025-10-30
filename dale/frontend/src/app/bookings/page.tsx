'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api, type Booking } from '@/lib/api';
import { BookingCard } from '@/components/rides/BookingCard';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function BookingsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  // Protección de ruta
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Cargar reservas
  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getBookings(token);
        
        if (response.success && response.data) {
          // Ordenar por fecha de creación (más recientes primero)
          const sortedBookings = response.data.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setBookings(sortedBookings);
          setFilteredBookings(sortedBookings);
        } else {
          setError(response.error?.message || 'Error al cargar reservas');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Filtrar reservas cuando cambia el filtro
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  // Manejar cancelación
  const handleCancelBooking = async (bookingId: string) => {
    if (!token) return;

    try {
      const response = await api.cancelBooking(bookingId, token);
      
      if (response.success) {
        // Actualizar la lista de reservas optimísticamente
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: 'cancelled' as const }
              : booking
          )
        );
        
        alert('Reserva cancelada exitosamente');
      } else {
        alert(response.error?.message || 'Error al cancelar reserva');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error al cancelar reserva');
    }
  };

  if (!user) {
    return null; // O un loading spinner
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Gestiona tus viajes reservados
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setStatusFilter('all')}
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              className="flex-1 sm:flex-none"
            >
              Todas ({bookings.length})
            </Button>
            <Button
              onClick={() => setStatusFilter('confirmed')}
              variant={statusFilter === 'confirmed' ? 'primary' : 'outline'}
              className="flex-1 sm:flex-none"
            >
              Confirmadas ({bookings.filter(b => b.status === 'confirmed').length})
            </Button>
            <Button
              onClick={() => setStatusFilter('pending')}
              variant={statusFilter === 'pending' ? 'primary' : 'outline'}
              className="flex-1 sm:flex-none"
            >
              Pendientes ({bookings.filter(b => b.status === 'pending').length})
            </Button>
            <Button
              onClick={() => setStatusFilter('cancelled')}
              variant={statusFilter === 'cancelled' ? 'primary' : 'outline'}
              className="flex-1 sm:flex-none"
            >
              Canceladas ({bookings.filter(b => b.status === 'cancelled').length})
            </Button>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Cargando reservas...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card className="bg-red-50 border-red-200">
            <CardBody className="p-6 text-center">
              <svg
                className="w-12 h-12 text-red-600 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800 font-medium mb-2">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Reintentar
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Lista de reservas */}
        {!loading && !error && (
          <>
            {filteredBookings.length === 0 ? (
              <Card className="bg-gray-50">
                <CardBody className="p-12 text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {statusFilter === 'all' 
                      ? 'No tienes reservas'
                      : `No tienes reservas ${
                          statusFilter === 'confirmed' ? 'confirmadas' :
                          statusFilter === 'pending' ? 'pendientes' :
                          'canceladas'
                        }`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {statusFilter === 'all'
                      ? 'Busca viajes disponibles y haz tu primera reserva'
                      : 'Intenta con otro filtro para ver más reservas'
                    }
                  </p>
                  {statusFilter === 'all' && (
                    <Button
                      onClick={() => router.push('/rides')}
                      variant="primary"
                    >
                      Buscar viajes
                    </Button>
                  )}
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Botón buscar más viajes */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push('/rides')}
              variant="outline"
            >
              Buscar más viajes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
