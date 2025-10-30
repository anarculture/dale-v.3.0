'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, ApiError } from '@/lib/api';
import { RideForm } from '@/components/rides/RideForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OfferPage() {
  const router = useRouter();
  const { user, loading: authLoading, getToken } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Configurar el getter de token para el API client
  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/offer');
    }
  }, [user, authLoading, router]);

  // Cargar perfil del usuario para verificar el rol
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  /**
   * Cargar perfil del usuario
   */
  const loadUserProfile = async () => {
    setLoadingProfile(true);
    setError(null);

    try {
      const profile = await apiClient.getMyProfile();
      setUserProfile(profile);

      // Verificar si es conductor
      if (profile.role !== 'driver') {
        setError('Solo los conductores pueden publicar viajes');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.error || 'Error al cargar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (formData: any) => {
    setSubmitting(true);
    setError(null);

    try {
      // Combinar fecha y hora
      const dateTime = `${formData.date}T${formData.time}:00`;

      // Crear viaje
      const newRide = await apiClient.createRide({
        from_city: formData.from_city,
        from_lat: formData.from_lat!,
        from_lon: formData.from_lon!,
        to_city: formData.to_city,
        to_lat: formData.to_lat!,
        to_lon: formData.to_lon!,
        date_time: dateTime,
        seats_total: formData.seats_total,
        price: formData.price > 0 ? formData.price : undefined,
        notes: formData.notes || undefined,
      });

      // Redirigir a la lista de viajes con mensaje de éxito
      alert('¡Viaje publicado con éxito!');
      router.push('/rides');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.error || 'Error al publicar el viaje');
      alert(`Error: ${apiError.detail || apiError.error}`);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Cambiar a rol de conductor
   */
  const handleBecomeDriver = async () => {
    try {
      await apiClient.updateMyProfile({ role: 'driver' });
      // Recargar perfil
      await loadUserProfile();
    } catch (err) {
      const apiError = err as ApiError;
      alert(`Error: ${apiError.detail || apiError.error}`);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading || loadingProfile) {
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
  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Publicar un viaje
          </h1>
          <p className="text-neutral-600">
            Comparte tu viaje con otros usuarios y ahorra en gastos
          </p>
        </div>

        {/* Verificación de rol de conductor */}
        {userProfile.role !== 'driver' ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Conviértete en conductor
            </h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Para publicar viajes, necesitas cambiar tu rol a conductor. Esto te permitirá
              ofrecer tus viajes a otros usuarios.
            </p>
            <Button onClick={handleBecomeDriver} variant="primary">
              Cambiar a conductor
            </Button>
            <div className="mt-4">
              <Button onClick={() => router.push('/rides')} variant="ghost">
                Volver a búsqueda
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Mensaje de error general */}
            {error && (
              <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
                <p className="text-error font-medium">{error}</p>
              </div>
            )}

            {/* Formulario de crear viaje */}
            <RideForm onSubmit={handleSubmit} loading={submitting} />

            {/* Información adicional */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  💡 Consejos para publicar tu viaje
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong>Sé puntual:</strong> Indica la hora exacta de salida y respétala
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong>Precio justo:</strong> Calcula el precio basándote en combustible y peajes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong>Detalles claros:</strong> Indica el punto de encuentro y cualquier parada en las notas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong>Sé amable:</strong> Responde rápido a las reservas y mantén una buena comunicación
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
