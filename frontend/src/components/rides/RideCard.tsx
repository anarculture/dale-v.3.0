"use client";

import React from "react";
import Link from "next/link";
import { Ride } from "@/lib/api";
import { DCard, DBadge } from "@/components/ui";
import { Calendar, Clock, User, ArrowRight, Users } from "lucide-react";

interface RideCardProps {
  ride: Ride;
}

export const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const date = new Date(ride.date_time);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/rides/${ride.id}`} className="block group">
      <DCard className="transition-shadow hover:shadow-md cursor-pointer h-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          
          {/* Left: Route & Time */}
          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar size={16} />
              <span className="capitalize">{formattedDate}</span>
              <span className="mx-1">•</span>
              <Clock size={16} />
              <span>{formattedTime}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-0.5 h-8 bg-gray-200" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-semibold text-lg">{ride.from_city}</span>
                <span className="font-semibold text-lg">{ride.to_city}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                {ride.driver?.avatar_url ? (
                  <img src={ride.driver.avatar_url} alt="Driver" className="w-full h-full rounded-full" />
                ) : (
                  <User size={14} />
                )}
              </div>
              <span className="text-sm text-gray-600">{ride.driver?.name || "Conductor"}</span>
            </div>
          </div>

          {/* Right: Price & Seats */}
          <div className="flex flex-row sm:flex-col justify-between sm:items-end sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
            <div>
              <span className="text-2xl font-bold text-primary">
                ${ride.price?.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 block">por asiento</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
              <Users size={14} />
              <span>{ride.seats_available} disp.</span>
            </div>
          </div>
        </div>
      </DCard>
    </Link>
  );
};
