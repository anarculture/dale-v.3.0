/**
 * Cliente API para comunicación con el backend FastAPI
 * Maneja autenticación automática con tokens JWT de Supabase
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiError {
  error: string;
  detail?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'rider' | 'driver';
  created_at: string;
}

export interface Ride {
  id: string;
  driver_id: string;
  driver?: User;
  from_city: string;
  from_lat: number;
  from_lon: number;
  to_city: string;
  to_lat: number;
  to_lon: number;
  date_time: string;
  seats_total: number;
  seats_available: number;
  price: number | null;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  ride_id: string;
  rider_id: string;
  seats_booked: number;
  ride?: Ride;
  rider?: User;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface RideSearchParams {
  from_city?: string;
  to_city?: string;
  date?: string;
  min_seats?: number;
  max_price?: number;
}

class ApiClient {
  private baseURL: string;
  private getToken: (() => Promise<string | null>) | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Configura la función para obtener el token de autenticación
   */
  setTokenGetter(getter: () => Promise<string | null>) {
    this.getToken = getter;
  }

  /**
   * Realiza una petición HTTP al backend
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obtener token si está disponible
    const token = this.getToken ? await this.getToken() : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach((header) => {
          if (Array.isArray(header) && header.length === 2) {
            headers[header[0]] = header[1];
          }
        });
      } else {
        Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
          headers[key] = value;
        });
      }
    }

    // Agregar token de autorización si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Si es 204 No Content, no hay body que parsear
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          error: data.error || 'Error en la petición',
          detail: data.detail || response.statusText,
        } as ApiError;
      }

      if (data && typeof data === 'object' && 'data' in data && 'success' in data && data.success === true) {
        return data.data as T;
      }

      return data;
    } catch (error) {
      if ((error as ApiError).error) {
        throw error;
      }
      throw {
        error: 'Error de conexión',
        detail: 'No se pudo conectar con el servidor',
      } as ApiError;
    }
  }

  // ==================== USERS ====================

  /**
   * Obtener perfil del usuario actual
   */
  async getMyProfile(): Promise<User> {
    return this.request<User>('/api/users/me');
  }

  /**
   * Actualizar perfil del usuario actual
   */
  async updateMyProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Obtener perfil público de un usuario
   */
  async getUserProfile(userId: string): Promise<User> {
    return this.request<User>(`/api/users/${userId}`);
  }

  // ==================== RIDES ====================

  /**
   * Buscar viajes con filtros
   */
  async searchRides(params?: RideSearchParams): Promise<Ride[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.from_city) queryParams.append('from_city', params.from_city);
    if (params?.to_city) queryParams.append('to_city', params.to_city);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.min_seats) queryParams.append('min_seats', params.min_seats.toString());
    if (params?.max_price) queryParams.append('max_price', params.max_price.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/api/rides?${query}` : '/api/rides';
    
    return this.request<Ride[]>(endpoint);
  }

  /**
   * Obtener detalles de un viaje
   */
  async getRide(rideId: string): Promise<Ride> {
    return this.request<Ride>(`/api/rides/${rideId}`);
  }

  /**
   * Crear un nuevo viaje (solo conductores)
   */
  async createRide(data: {
    from_city: string;
    from_lat: number;
    from_lon: number;
    to_city: string;
    to_lat: number;
    to_lon: number;
    date_time: string;
    seats_total: number;
    price?: number;
    notes?: string;
  }): Promise<Ride> {
    return this.request<Ride>('/api/rides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Obtener mis viajes como conductor
   */
  async getMyRides(): Promise<Ride[]> {
    return this.request<Ride[]>('/api/rides/my/rides');
  }

  /**
   * Eliminar un viaje
   */
  async deleteRide(rideId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/rides/${rideId}`, {
      method: 'DELETE',
    });
  }

  // ==================== BOOKINGS ====================

  /**
   * Crear una reserva
   */
  async createBooking(rideId: string): Promise<Booking> {
    return this.request<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ride_id: rideId }),
    });
  }

  /**
   * Obtener mis reservas
   */
  async getMyBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/api/bookings');
  }

  /**
   * Obtener detalles de una reserva
   */
  async getBooking(bookingId: string): Promise<Booking> {
    return this.request<Booking>(`/api/bookings/${bookingId}`);
  }

  /**
   * Cancelar una reserva
   */
  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Confirmar una reserva (solo conductor del viaje)
   */
  async confirmBooking(bookingId: string): Promise<Booking> {
    return this.request<Booking>(`/api/bookings/${bookingId}/confirm`, {
      method: 'PATCH',
    });
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient(API_BASE_URL);
