"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, BadgeCheck, Star, MapPin, Calendar, MessageCircle, Loader2 } from "lucide-react";
import { DButton } from "@/components/ui/DButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { apiClient, User, Review, Ride } from "@/lib/api";

interface UserProfile extends User {
  bio?: string;
  isDriver: boolean;
}

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tripOffers, setTripOffers] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const userData = await apiClient.getUserProfile(userId);
        setUser({
          ...userData,
          isDriver: true, // Will be determined by whether they have rides
          bio: undefined, // Backend doesn't have bio yet
        });

        // Fetch user reviews
        const reviewsData = await apiClient.getUserReviews(userId);
        setReviews(reviewsData);

        // Fetch user's published rides (trips they're offering as driver)
        const allRides = await apiClient.searchRides();
        const userRides = allRides.filter(ride => ride.driver_id === userId);
        setTripOffers(userRides);
        
        // Update isDriver based on whether they have rides
        if (userRides.length > 0) {
          setUser(prev => prev ? { ...prev, isDriver: true } : null);
        }

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("No se pudo cargar el perfil del usuario");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  const handleBack = () => router.back();
  const handleMessageClick = () => {
    // TODO: Navigate to messaging screen
    console.log("Message user:", userId);
  };

  // Format date for display
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const formatRideDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatRideTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-neutral-500">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 shadow-card text-center max-w-md">
          <h2 className="text-xl font-semibold text-neutral mb-2">Error</h2>
          <p className="text-neutral-500 mb-4">{error || "Usuario no encontrado"}</p>
          <DButton onClick={handleBack}>Volver</DButton>
        </div>
      </div>
    );
  }

  const memberSince = formatMemberSince(user.created_at);
  const userRating = user.average_rating ?? 0;
  const reviewCount = user.rating_count ?? 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary to-primary-light px-4 pt-12 pb-8 text-white relative">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.isDriver && (
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

            {user.isDriver && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-sm mb-3">
                <BadgeCheck className="w-4 h-4" />
                <span>Conductor verificado</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <Star className="w-4 h-4 fill-white" />
                  <span className="text-lg font-semibold">{userRating.toFixed(1)}</span>
                </div>
                <span className="text-white/80">Valoración</span>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">{reviewCount}</div>
                <span className="text-white/80">Reseñas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Member Since */}
          <div className="bg-white rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 text-neutral-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Miembro desde {memberSince}</span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-white rounded-xl p-5 shadow-card">
              <h3 className="text-lg text-neutral font-semibold mb-3">Acerca de</h3>
              <p className="text-neutral-500 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-xl p-5 shadow-card">
            <h3 className="text-lg text-neutral font-semibold mb-4">
              Reseñas ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <p className="text-neutral-500 text-sm">Este usuario aún no tiene reseñas.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex gap-3 mb-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.author?.avatar_url || undefined} alt={review.author?.name} />
                        <AvatarFallback>{review.author?.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-neutral font-medium">{review.author?.name || "Usuario"}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="text-sm text-neutral">{review.score}</span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-neutral-500 mb-2">{review.comment}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span>{new Date(review.created_at).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <DButton onClick={handleMessageClick} className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Enviar mensaje
          </DButton>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 px-6 py-3 bg-card text-neutral rounded-full hover:bg-neutral-200 transition flex items-center gap-2 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left: User Card (Sticky) */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-card sticky top-8">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <Avatar className="w-32 h-32 border-4 border-surface-200 shadow-lg">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                      <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.isDriver && (
                      <div className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl text-neutral font-bold mb-3">{user.name}</h2>

                  {user.isDriver && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-200 text-primary rounded-full text-sm mb-4 font-medium">
                      <BadgeCheck className="w-4 h-4" />
                      <span>Conductor verificado</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="w-full pt-4 border-t border-neutral-100">
                    <div className="grid grid-cols-2 gap-4 text-center mb-4">
                      <div>
                        <div className="flex items-center gap-1 justify-center mb-1">
                          <Star className="w-5 h-5 fill-primary text-primary" />
                          <span className="text-2xl text-neutral font-bold">{userRating.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-neutral-500">Valoración</div>
                      </div>
                      <div>
                        <div className="text-2xl text-neutral font-bold mb-1">
                          {reviewCount}
                        </div>
                        <div className="text-xs text-neutral-500">Reseñas</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-500 justify-center pt-4 border-t border-neutral-100">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde {memberSince}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="w-full mt-6">
                    <button
                      onClick={handleMessageClick}
                      className="w-full h-14 bg-primary text-white rounded-full hover:bg-primary-dark transition font-semibold flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enviar mensaje
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Reviews & Bio */}
            <div className="col-span-1 space-y-6">
              {/* Bio */}
              {user.bio && (
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="text-xl text-neutral font-semibold mb-4">Acerca de</h3>
                  <p className="text-neutral-500 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="text-xl text-neutral font-semibold mb-6">
                  Reseñas ({reviews.length})
                </h3>
                {reviews.length === 0 ? (
                  <p className="text-neutral-500">Este usuario aún no tiene reseñas.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0"
                      >
                        <div className="flex gap-4 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={review.author?.avatar_url || undefined} alt={review.author?.name} />
                            <AvatarFallback>{review.author?.name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-neutral font-medium">{review.author?.name || "Usuario"}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-primary text-primary" />
                                <span className="text-neutral">{review.score}</span>
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-neutral-500 mb-3 leading-relaxed">{review.comment}</p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <span>{new Date(review.created_at).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Current Trip Offers */}
            <div className="col-span-1">
              {tripOffers.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-card sticky top-8">
                  <h3 className="text-xl text-neutral font-semibold mb-4">Viajes publicados</h3>
                  <div className="space-y-4">
                    {tripOffers.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-4 bg-surface rounded-xl hover:bg-surface-200 transition cursor-pointer"
                        onClick={() => router.push(`/rides/${trip.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="text-neutral font-medium">{trip.from_city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-neutral-500" />
                              <span className="text-neutral-500">{trip.to_city}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl text-primary font-bold">${trip.price}</div>
                            <div className="text-xs text-neutral-500">por persona</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-neutral-500">
                            {formatRideDate(trip.date_time)} • {formatRideTime(trip.date_time)}
                          </div>
                          <div className="text-neutral-500">
                            {trip.seats_available}{" "}
                            {trip.seats_available === 1 ? "asiento" : "asientos"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
