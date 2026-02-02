'use client';

import React from 'react';
import { StarRating } from './StarRating';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

interface ReviewCardProps {
  authorName: string;
  authorAvatar?: string | null;
  score: number;
  comment?: string | null;
  createdAt: string;
  role: 'rider' | 'driver';
}

/**
 * ReviewCard displays a single review with author info, rating, and comment.
 */
export function ReviewCard({
  authorName,
  authorAvatar,
  score,
  comment,
  createdAt,
  role
}: ReviewCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const roleLabel = role === 'rider' ? 'Pasajero' : 'Conductor';

  // Get initials for fallback
  const initials = authorName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-900 truncate">{authorName}</h4>
              <span className="text-xs text-gray-500">{roleLabel}</span>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</span>
          </div>
          <div className="mt-1">
            <StarRating rating={score} size="sm" />
          </div>
          {comment && (
            <p className="mt-2 text-sm text-gray-600">{comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ReputationSummary displays overall rating and count for a user profile.
 */
export function ReputationSummary({
  averageRating,
  ratingCount
}: {
  averageRating: number | null;
  ratingCount: number;
}) {
  if (averageRating === null || ratingCount === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <span className="text-sm">Sin calificaciones aún</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <span className="text-lg font-bold text-gray-900">{averageRating.toFixed(1)}</span>
      </div>
      <span className="text-sm text-gray-500">
        ({ratingCount} {ratingCount === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
}
