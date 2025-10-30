'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { api, Booking } from '@/lib/api';
import BookingCard from '@/components/BookingCard';
import { 
  Calendar, 
  Filter, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search
} from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

const BookingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cargar reservas del usuario
  const loadBookings = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.getUserBookings(user.id, '');
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.error || 'Error al cargar las reservas');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Cargar reservas al montar el componente
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadBookings();
    }
  }, [authLoading, user?.id, loadBookings]);

  // Filtrar reservas
  useEffect(() => {
    let filtered = bookings;

    // Filtrar por estado
    if (currentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === currentFilter);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(booking => 
        booking.ride?.from_city?.toLowerCase().includes(query) ||
        booking.ride?.to_city?.toLowerCase().includes(query) ||
        booking.ride?.driver_name?.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, currentFilter, searchQuery]);

  // Cancelar reserva con actualización optimista
  const handleCancelBooking = async (bookingId: string) => {
    // Actualización optimista - actualizar estado inmediatamente
    const previousBookings = [...bookings];
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );

    try {
      await api.cancelBooking(bookingId, '');
      
      // Si la cancelación fue exitosa, recargar las reservas para asegurar sincronización
      await loadBookings();
    } catch (error) {
      // Revertir la actualización optimista si hay error
      setBookings(previousBookings);
      throw error;
    }
  };

  const getFilterIcon = (filter: FilterStatus) => {
    switch (filter) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return <Filter size={16} />;
    }
  };

  const getFilterLabel = (filter: FilterStatus) => {
    switch (filter) {
      case 'pending':
        return 'Pendientes';
      case 'confirmed':
        return 'Confirmadas';
      case 'cancelled':
        return 'Canceladas';
      case 'completed':
        return 'Completadas';
      default:
        return 'Todas';
    }
  };

  const getFilterCount = (filter: FilterStatus) => {
    if (filter === 'all') return bookings.length;
    return bookings.filter(booking => booking.status === filter).length;
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Autenticación requerida
          </h2>
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para ver tus reservas.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
              <p className="text-gray-600 mt-1">
                Gestiona todas tus reservas de viajes
              </p>
            </div>
            
            <button
              onClick={loadBookings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por destino, origen o conductor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as FilterStatus[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {getFilterIcon(filter)}
                <span>{getFilterLabel(filter)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {getFilterCount(filter)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Estado de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error al cargar las reservas</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {loading && bookings.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando reservas...</p>
            </div>
          </div>
        )}

        {/* Lista de reservas */}
        {!loading || bookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                {bookings.length === 0 ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes reservas aún
                    </h3>
                    <p className="text-gray-600 mb-6">
                      ¡Explora nuestros viajes disponibles y haz tu primera reserva!
                    </p>
                    <a
                      href="/rides"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Ver Viajes Disponibles</span>
                    </a>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron reservas
                    </h3>
                    <p className="text-gray-600">
                      Intenta cambiar los filtros o el término de búsqueda
                    </p>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Contador de resultados */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Mostrando {filteredBookings.length} de {bookings.length} reservas
                  </p>
                </div>

                {/* Grid de reservas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancelBooking}
                      className="hover:scale-[1.02] transition-transform duration-200"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingsPage;