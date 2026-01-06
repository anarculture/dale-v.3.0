'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { 
  format, 
  addMonths, 
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

interface FullScreenDatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
}

export function FullScreenDatePicker({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedDate, 
  minDate = new Date() 
}: FullScreenDatePickerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate next 12 months
  const months = Array.from({ length: 12 }, (_, i) => addMonths(new Date(), i));
  const normalizedMinDate = startOfDay(minDate);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, normalizedMinDate)) return;
    onSelect(date);
    onClose();
  };

  const weekDays = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fffbf3] animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-[#fffbf3] sticky top-0 z-10 shrink-0">
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
          {weekDays.map((day) => (
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
            
            // Get all days including padding for the first week
            const startDate = startOfWeek(firstDayOfMonth);
            const endDate = endOfWeek(lastDayOfMonth);
            
            const days = eachDayOfInterval({
              start: startDate,
              end: endDate
            });

            return (
              <div key={month.toISOString()} className="mb-8">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 capitalize">
                  {format(month, 'MMMM', { locale: es })}
                </h3>
                
                <div className="grid grid-cols-7 gap-y-4">
                  {days.map((day, dayIdx) => {
                    // Check if day belongs to current month (to handle padding visibility)
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
                          className={`
                            relative w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium transition-all
                            ${isSelected 
                              ? 'bg-[#fd5810] text-white shadow-lg shadow-orange-500/20' 
                              : isDisabled
                                ? 'text-neutral-300 cursor-not-allowed'
                                : 'text-[#1a1a1a] hover:bg-neutral-100 active:scale-90'
                            }
                            ${isTodayDate && !isSelected ? 'text-[#fd5810]' : ''}
                          `}
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
