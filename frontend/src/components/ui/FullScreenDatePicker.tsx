'use client';

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths,
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FullScreenDatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
  variant?: 'fullscreen' | 'embedded';
  className?: string;
}

export function FullScreenDatePicker({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedDate, 
  minDate = new Date(),
  variant = 'fullscreen',
  className
}: FullScreenDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // Prevent body scroll when open ONLY if fullscreen
  useEffect(() => {
    if (isOpen && variant === 'fullscreen') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, variant]);

  if (!isOpen) return null;

  const normalizedMinDate = startOfDay(minDate);
  const isFullscreen = variant === 'fullscreen';

  const handleDateClick = (date: Date) => {
    if (isBefore(date, normalizedMinDate)) return;
    onSelect(date);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // EMBEDDED VARIANT (Desktop): Single month with navigation
  if (!isFullscreen) {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className={cn(
        "absolute inset-0 z-20 bg-white rounded-2xl shadow-lg animate-in fade-in duration-200 p-6 flex flex-col",
        className
      )}>
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handlePrevMonth}
            className="p-2 text-[#1a1a1a] hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-[#1a1a1a] capitalize">
            {format(currentMonth, 'MMMM', { locale: es })}
          </h3>
          <button 
            onClick={handleNextMonth}
            className="p-2 text-[#1a1a1a] hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-3">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-neutral-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 flex-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            const isDisabled = isBefore(day, normalizedMinDate);

            return (
              <div key={day.toISOString()} className="flex justify-center items-center">
                <button
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled || !isCurrentMonth}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full text-base font-medium transition-all",
                    isSelected && "bg-[#fd5810] text-white shadow-md",
                    !isSelected && isCurrentMonth && !isDisabled && "text-[#1a1a1a] hover:bg-neutral-100 active:scale-90",
                    !isCurrentMonth && "text-neutral-300 cursor-default",
                    isDisabled && isCurrentMonth && "text-neutral-300 cursor-not-allowed",
                    isTodayDate && !isSelected && isCurrentMonth && "border-2 border-[#fd5810]"
                  )}
                >
                  {format(day, 'd')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="mt-4 w-full py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-[#1a1a1a] font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  // FULLSCREEN VARIANT (Mobile): Infinite scroll
  const months = Array.from({ length: 12 }, (_, i) => addMonths(new Date(), i));

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom-full duration-300",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-white sticky top-0 z-10 shrink-0">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-[#1a1a1a] hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <span className="text-lg font-semibold text-[#1a1a1a]"></span>
        <div className="w-8" /> {/* Spacer for centering if needed */}
      </div>

      <div className="px-6 py-4 shrink-0">
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8">
          ¿Cuándo vas a viajar?
        </h2>
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-neutral-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Calendar Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="space-y-8">
          {months.map((month) => {
            const firstDayOfMonth = startOfMonth(month);
            const lastDayOfMonth = endOfMonth(month);
            const startDate = startOfWeek(firstDayOfMonth);
            const endDate = endOfWeek(lastDayOfMonth);
            const days = eachDayOfInterval({ start: startDate, end: endDate });

            return (
              <div key={month.toISOString()} className="mb-8">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 capitalize">
                  {format(month, 'MMMM', { locale: es })}
                </h3>
                
                <div className="grid grid-cols-7 gap-y-4">
                  {days.map((day) => {
                    const isCurrentMonth = isSameMonth(day, month);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    const isDisabled = isBefore(day, normalizedMinDate);

                    if (!isCurrentMonth) {
                      return <div key={day.toISOString()} />;
                    }

                    return (
                      <div key={day.toISOString()} className="flex justify-center">
                        <button
                          onClick={() => handleDateClick(day)}
                          disabled={isDisabled}
                          className={cn(
                            "relative w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium transition-all",
                            isSelected && "bg-[#fd5810] text-white shadow-lg shadow-orange-500/20",
                            !isSelected && !isDisabled && "text-[#1a1a1a] hover:bg-neutral-100 active:scale-90",
                            isDisabled && "text-neutral-300 cursor-not-allowed",
                            isTodayDate && !isSelected && "text-[#fd5810]"
                          )}
                        >
                          {format(day, 'd')}
                          {isTodayDate && !isSelected && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-[#fd5810] rounded-full" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
