"use client";

import React, { useState } from "react";
import { Booking, apiClient } from "@/lib/api";
import { DCard, DButton, DBadge, Modal, StarRating } from "@/components/ui";
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle, MessageCircle, Phone, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;

    setLoading(true);
    try {
      await apiClient.cancelBooking(booking.id);
      router.refresh();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("No se pudo cancelar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!booking.ride || !user) return;

    const isRider = user.id === booking.rider_id;
    const subjectId = isRider ? booking.ride.driver_id : booking.rider_id;
    const role = isRider ? "rider" : "driver";

    setReviewLoading(true);
    try {
      await apiClient.createReview({
        booking_id: booking.id,
        subject_id: subjectId,
        score: reviewScore,
        comment: reviewComment || undefined,
        role: role as 'rider' | 'driver',
      });
      toast.success("¡Reseña enviada con éxito!");
      setShowReviewModal(false);
      router.refresh();
    } catch (error: any) {
      const message = error?.detail || "No se pudo enviar la reseña.";
      toast.error(message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (!booking.ride) return null;

  const date = new Date(booking.ride.date_time);
  if (isNaN(date.getTime())) {
    console.error("Invalid date_time:", booking.ride.date_time);
    return null;
  }
  const formattedDate = date.toLocaleDateString("es-VE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = date.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusConfig = {
    pending: { color: "warning", label: "Pendiente", icon: AlertCircle },
    confirmed: { color: "success", label: "Confirmada", icon: CheckCircle },
    cancelled: { color: "danger", label: "Cancelada", icon: XCircle },
  } as const;

  const status = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  // Contact Logic
  const isRider = user?.id === booking.rider_id;
  const contactUser = isRider ? booking.ride.driver : booking.rider;
  const contactPhone = contactUser?.phone;
  const contactName = contactUser?.name || "Usuario";
  
  const showContact = booking.status === "confirmed" && contactPhone;

  // Review eligibility: confirmed booking + ride date has passed
  const rideDate = new Date(booking.ride.date_time);
  const ridePassed = rideDate < new Date();
  const canReview = booking.status === "confirmed" && ridePassed;

  return (
    <>
      <DCard className="mb-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-grow space-y-3">
            <div className="flex items-center justify-between md:justify-start gap-4">
              <DBadge color={status.color as any} variant="flat" className="flex items-center gap-1">
                <StatusIcon size={14} />
                {status.label}
              </DBadge>
              <span className="text-sm text-gray-500">
                Reserva #{booking.id.slice(0, 8)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-0.5 h-8 bg-gray-200" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{booking.ride.from_city}</span>
                <span className="font-semibold">{booking.ride.to_city}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span className="capitalize">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>


            <div className="text-right">
              <p className="text-sm text-gray-500">Precio Total</p>
              <p className="text-xl font-bold text-primary">
                ${(booking.ride.price! * booking.seats_booked).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">{booking.seats_booked} asiento(s)</p>
            </div>

            {/* Contact Section */}
            {showContact && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-green-50/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {isRider ? "Conductor" : "Pasajero"}
                    </p>
                    <p className="text-sm font-medium text-gray-900">{contactName}</p>
                    <p className="text-xs text-gray-600">{contactPhone}</p>
                  </div>
                </div>
                
                <DButton
                  size="sm"
                  color="success"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent"
                  startContent={<MessageCircle size={16} />}
                  onPress={() => window.open(`https://wa.me/${contactPhone?.replace(/\+/g, "")}`, "_blank")}
                >
                  WhatsApp
                </DButton>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {booking.status !== "cancelled" && (
                <DButton 
                  size="sm" 
                  color="danger" 
                  variant="light" 
                  onPress={handleCancel}
                  isLoading={loading}
                >
                  Cancelar Reserva
                </DButton>
              )}
              
              {canReview && (
                <DButton 
                  size="sm" 
                  color="warning" 
                  variant="flat" 
                  startContent={<Star size={16} />}
                  onPress={() => setShowReviewModal(true)}
                >
                  Dejar Reseña
                </DButton>
              )}
            </div>
          </div>

      </DCard>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Reseña para ${contactName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación
            </label>
            <StarRating 
              rating={reviewScore} 
              size="lg" 
              interactive 
              onRatingChange={setReviewScore} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              rows={3}
              placeholder="¿Cómo fue tu experiencia?"
              maxLength={500}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <DButton 
              variant="light" 
              onPress={() => setShowReviewModal(false)}
            >
              Cancelar
            </DButton>
            <DButton 
              color="primary" 
              onPress={handleSubmitReview}
              isLoading={reviewLoading}
            >
              Enviar Reseña
            </DButton>
          </div>
        </div>
      </Modal>
    </>
  );
};
