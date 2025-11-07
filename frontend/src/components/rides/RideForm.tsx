'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { CityAutocomplete } from './CityAutocomplete';
import { getPlaceDetails, geocodeAddress } from '@/lib/maps';

export interface RideFormData {
  from_city: string;
  from_place_id?: string;
  from_lat?: number;
  from_lon?: number;
  to_city: string;
  to_place_id?: string;
  to_lat?: number;
  to_lon?: number;
  date: string;
  time: string;
  seats_total: number;
  price: number;
  notes: string;
}

interface RideFormProps {
  onSubmit: (data: RideFormData) => Promise<void>;
  loading?: boolean;
}

export function RideForm({ onSubmit, loading = false }: RideFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RideFormData>({
    from_city: '',
    to_city: '',
    date: '',
    time: '',
    seats_total: 3,
    price: 0,
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RideFormData, string>>>({});
  const [geocoding, setGeocoding] = useState(false);

  const totalSteps = 4;

  /**
   * Actualizar campo del formulario
   */
  const updateField = (
    field: keyof RideFormData,
    value: RideFormData[keyof RideFormData]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Validar Step 1: Ciudades
   */
  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof RideFormData, string>> = {};

    if (!formData.from_city.trim()) {
      newErrors.from_city = 'La ciudad de origen es obligatoria';
    }
    if (!formData.to_city.trim()) {
      newErrors.to_city = 'La ciudad de destino es obligatoria';
    }
    if (formData.from_city.toLowerCase() === formData.to_city.toLowerCase()) {
      newErrors.to_city = 'La ciudad de destino debe ser diferente al origen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validar Step 2: Fecha y hora
   */
  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof RideFormData, string>> = {};

    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    } else {
      // Verificar que sea fecha futura
      const selectedDate = new Date(formData.date + 'T' + (formData.time || '00:00'));
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.date = 'La fecha debe ser futura';
      }
    }

    if (!formData.time) {
      newErrors.time = 'La hora es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validar Step 3: Plazas y precio
   */
  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<keyof RideFormData, string>> = {};

    if (!formData.seats_total || formData.seats_total < 1 || formData.seats_total > 8) {
      newErrors.seats_total = 'Las plazas deben estar entre 1 y 8';
    }

    if (formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Avanzar al siguiente paso
   */
  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = true;
        break;
    }

    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  /**
   * Retroceder al paso anterior
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Enviar formulario
   */
  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    setGeocoding(true);
    try {
      // Obtener coordenadas para origen
      let fromCoords = { lat: formData.from_lat, lng: formData.from_lon };
      if (!fromCoords.lat || !fromCoords.lng) {
        if (formData.from_place_id) {
          const fromDetails = await getPlaceDetails(formData.from_place_id);
          if (fromDetails) {
            fromCoords = { lat: fromDetails.lat, lng: fromDetails.lng };
          }
        } else {
          const fromDetails = await geocodeAddress(formData.from_city);
          if (fromDetails) {
            fromCoords = { lat: fromDetails.lat, lng: fromDetails.lng };
          }
        }
      }

      // Obtener coordenadas para destino
      let toCoords = { lat: formData.to_lat, lng: formData.to_lon };
      if (!toCoords.lat || !toCoords.lng) {
        if (formData.to_place_id) {
          const toDetails = await getPlaceDetails(formData.to_place_id);
          if (toDetails) {
            toCoords = { lat: toDetails.lat, lng: toDetails.lng };
          }
        } else {
          const toDetails = await geocodeAddress(formData.to_city);
          if (toDetails) {
            toCoords = { lat: toDetails.lat, lng: toDetails.lng };
          }
        }
      }

      if (!fromCoords.lat || !fromCoords.lng || !toCoords.lat || !toCoords.lng) {
        setErrors({
          from_city: !fromCoords.lat ? 'No se pudieron obtener las coordenadas' : undefined,
          to_city: !toCoords.lat ? 'No se pudieron obtener las coordenadas' : undefined,
        });
        return;
      }

      // Enviar datos
      await onSubmit({
        ...formData,
        from_lat: fromCoords.lat,
        from_lon: fromCoords.lng,
        to_lat: toCoords.lat,
        to_lon: toCoords.lng,
      });
    } catch (error) {
      console.error('Error submitting ride:', error);
      setErrors({ from_city: 'Error al crear el viaje' });
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                step <= currentStep ? 'bg-primary' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-600 text-center">
          Paso {currentStep} de {totalSteps}
        </p>
      </div>

      <Card>
        <CardBody className="p-8">
          {/* Step 1: Ciudades */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                ¿A dónde vas?
              </h2>
              <p className="text-neutral-600 mb-6">
                Indica las ciudades de origen y destino de tu viaje
              </p>

              <div className="space-y-4">
                <CityAutocomplete
                  label="Ciudad de origen"
                  value={formData.from_city}
                  onChange={(value, placeId) => {
                    updateField('from_city', value);
                    if (placeId) {
                      updateField('from_place_id', placeId);
                    }
                  }}
                  error={errors.from_city}
                  placeholder="Madrid, Barcelona..."
                  required
                />

                <CityAutocomplete
                  label="Ciudad de destino"
                  value={formData.to_city}
                  onChange={(value, placeId) => {
                    updateField('to_city', value);
                    if (placeId) {
                      updateField('to_place_id', placeId);
                    }
                  }}
                  error={errors.to_city}
                  placeholder="Valencia, Sevilla..."
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Fecha y hora */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                ¿Cuándo sales?
              </h2>
              <p className="text-neutral-600 mb-6">
                Selecciona la fecha y hora de salida
              </p>

              <div className="space-y-4">
                <Input
                  label="Fecha de salida"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  error={errors.date}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />

                <Input
                  label="Hora de salida"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  error={errors.time}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Plazas y precio */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Detalles del viaje
              </h2>
              <p className="text-neutral-600 mb-6">
                ¿Cuántas plazas ofreces y cuál es el precio?
              </p>

              <div className="space-y-4">
                <Input
                  label="Plazas disponibles"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.seats_total}
                  onChange={(e) => updateField('seats_total', parseInt(e.target.value) || 1)}
                  error={errors.seats_total}
                  helperText="Número de pasajeros que puedes llevar"
                  required
                />

                <Input
                  label="Precio por plaza (€)"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.price}
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  error={errors.price}
                  helperText="Deja en 0 si el viaje es gratis"
                />
              </div>
            </div>
          )}

          {/* Step 4: Notas y resumen */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Resumen y notas
              </h2>
              <p className="text-neutral-600 mb-6">
                Revisa los datos y añade notas opcionales
              </p>

              {/* Resumen */}
              <Card className="mb-6 bg-neutral-50">
                <CardBody className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="text-sm text-neutral-500">Origen</p>
                      <p className="font-medium">{formData.from_city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <p className="text-sm text-neutral-500">Destino</p>
                      <p className="font-medium">{formData.to_city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="text-sm text-neutral-500">Fecha y hora</p>
                      <p className="font-medium">
                        {new Date(formData.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        - {formData.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <div>
                      <p className="text-sm text-neutral-500">Plazas</p>
                      <p className="font-medium">{formData.seats_total} disponibles</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="text-sm text-neutral-500">Precio</p>
                      <p className="font-medium">
                        {formData.price > 0 ? `€${formData.price.toFixed(2)}` : 'Gratis'}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Notas opcionales */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Ej: Salida desde la estación de Atocha. Acepto mascotas. Parada en el camino..."
                  rows={4}
                  maxLength={500}
                  className="block w-full px-4 py-3 rounded-xl border border-neutral-300 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {formData.notes.length}/500 caracteres
                </p>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                disabled={loading || geocoding}
              >
                Atrás
              </Button>
            )}

            {currentStep < totalSteps && (
              <Button
                onClick={handleNext}
                fullWidth={currentStep === 1}
                disabled={loading || geocoding}
              >
                Siguiente
              </Button>
            )}

            {currentStep === totalSteps && (
              <Button
                onClick={handleSubmit}
                loading={loading || geocoding}
                disabled={loading || geocoding}
                fullWidth
              >
                {geocoding ? 'Obteniendo coordenadas...' : 'Publicar viaje'}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
