"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, BadgeCheck, Star, MapPin, Calendar, MessageCircle } from "lucide-react";
import { DButton } from "@/components/ui/DButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
  tripRoute: string;
}

interface TripOffer {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  seatsAvailable: number;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
  memberSince: string;
  bio?: string;
  tripsCompleted: number;
  isDriver: boolean;
}

// Mock data for demo
const mockUser: UserProfile = {
  id: "1",
  name: "Carlos Méndez",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  rating: 4.9,
  verified: true,
  memberSince: "enero 2023",
  bio: "Conductor experimentado con más de 5 años compartiendo viajes. Me encanta conocer gente nueva y hacer que los viajes sean cómodos y seguros. Siempre puntual y con buena música en el auto.",
  tripsCompleted: 124,
  isDriver: true,
};

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Ana García",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5.0,
    comment: "Excelente conductor, muy puntual y amable. El auto estaba muy limpio y cómodo.",
    date: "15 dic 2024",
    tripRoute: "Caracas → Valencia",
  },
  {
    id: "2",
    author: "Pedro Rodríguez",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 4.8,
    comment: "Muy buen viaje, llegamos a tiempo. Recomendado!",
    date: "10 dic 2024",
    tripRoute: "Valencia → Caracas",
  },
];

const mockTripOffers: TripOffer[] = [
  {
    id: "1",
    origin: "Caracas",
    destination: "Valencia",
    date: "10 ene 2025",
    time: "08:00",
    price: 25,
    seatsAvailable: 2,
  },
  {
    id: "2",
    origin: "Valencia",
    destination: "Caracas",
    date: "12 ene 2025",
    time: "14:00",
    price: 28,
    seatsAvailable: 3,
  },
];

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  // In production, fetch user data based on userId
  const user = mockUser;
  const reviews = mockReviews;
  const tripOffers = mockTripOffers;

  const handleBack = () => router.back();
  const handleMessageClick = () => {
    // TODO: Navigate to messaging screen
    console.log("Message user:", userId);
  };

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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.verified && (
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

            {user.verified && (
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
                  <span className="text-lg font-semibold">{user.rating}</span>
                </div>
                <span className="text-white/80">Valoración</span>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">{user.tripsCompleted}</div>
                <span className="text-white/80">Viajes</span>
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
              <span className="text-sm">Miembro desde {user.memberSince}</span>
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
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.authorAvatar} alt={review.author} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral font-medium">{review.author}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm text-neutral">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">{review.comment}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <MapPin className="w-3 h-3" />
                        <span>{review.tripRoute}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.verified && (
                      <div className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl text-neutral font-bold mb-3">{user.name}</h2>

                  {user.verified && (
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
                          <span className="text-2xl text-neutral font-bold">{user.rating}</span>
                        </div>
                        <div className="text-xs text-neutral-500">Valoración</div>
                      </div>
                      <div>
                        <div className="text-2xl text-neutral font-bold mb-1">
                          {user.tripsCompleted}
                        </div>
                        <div className="text-xs text-neutral-500">Viajes</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-500 justify-center pt-4 border-t border-neutral-100">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde {user.memberSince}</span>
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
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex gap-4 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.authorAvatar} alt={review.author} />
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-neutral font-medium">{review.author}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-primary text-primary" />
                              <span className="text-neutral">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-neutral-500 mb-3 leading-relaxed">{review.comment}</p>
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <MapPin className="w-4 h-4" />
                            <span>{review.tripRoute}</span>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="text-neutral font-medium">{trip.origin}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-neutral-500" />
                              <span className="text-neutral-500">{trip.destination}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl text-primary font-bold">${trip.price}</div>
                            <div className="text-xs text-neutral-500">por persona</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-neutral-500">
                            {trip.date} • {trip.time}
                          </div>
                          <div className="text-neutral-500">
                            {trip.seatsAvailable}{" "}
                            {trip.seatsAvailable === 1 ? "asiento" : "asientos"}
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
