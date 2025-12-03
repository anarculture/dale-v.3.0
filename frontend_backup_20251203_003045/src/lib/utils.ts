import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} - ${formatTime(date)}`;
}

export function isValidAvatarUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const allowedHosts = [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ];
    
    // Check for exact match or subdomain match for supabase
    return (
      parsedUrl.protocol === "https:" &&
      (allowedHosts.includes(parsedUrl.hostname) || 
       parsedUrl.hostname.endsWith(".supabase.co"))
    );
  } catch {
    return false;
  }
}
