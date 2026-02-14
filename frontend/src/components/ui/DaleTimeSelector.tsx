import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DaleTimeSelectorProps {
  label?: string;
  value: string; // Format: "HH:MM" (e.g., "08:00")
  onChange: (time: string) => void;
  icon?: React.ReactNode;
}

export function DaleTimeSelector({ label, value, onChange, icon }: DaleTimeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || '08');
      setSelectedMinute(minute || '00');
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const handleTimeSelect = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange(`${hour}:${minute}`);
    setIsOpen(false);
  };

  const displayValue = value || `${selectedHour}:${selectedMinute}`;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block mb-2 text-sm text-[#1a1a1a]">
          {label}
        </label>
      )}
      
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 bg-white rounded-2xl border-none text-[#1a1a1a] flex items-center gap-3 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#fd5810]"
      >
        <div className="text-[#6b7280]">
          {icon || <Clock className="w-5 h-5" />}
        </div>
        <span className="flex-1 text-left text-base">
          {displayValue}
        </span>
      </button>

      {/* Dropdown Time Picker */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden border border-[rgba(0,0,0,0.06)]">
          <div className="p-4">
            <div className="text-center mb-4">
              <p className="text-sm text-[#6b7280] mb-1">Selecciona la hora</p>
              <div className="text-2xl text-[#1a1a1a] font-medium">
                {selectedHour}:{selectedMinute}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Hours Column */}
              <div>
                <p className="text-xs text-[#6b7280] mb-2 text-center">Hora</p>
                <div className="max-h-64 overflow-y-auto rounded-xl bg-[#fffbf3] p-2 space-y-1 custom-scrollbar">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleTimeSelect(hour, selectedMinute)}
                      className={`w-full py-2.5 px-3 rounded-lg text-sm transition-all ${
                        hour === selectedHour
                          ? 'bg-[#fd5810] text-white font-medium shadow-sm'
                          : 'text-[#1a1a1a] hover:bg-[#eae8dc]'
                      }`}
                    >
                      {hour}:00
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes Column */}
              <div>
                <p className="text-xs text-[#6b7280] mb-2 text-center">Minutos</p>
                <div className="rounded-xl bg-[#fffbf3] p-2 space-y-1">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleTimeSelect(selectedHour, minute)}
                      className={`w-full py-2.5 px-3 rounded-lg text-sm transition-all ${
                        minute === selectedMinute
                          ? 'bg-[#fd5810] text-white font-medium shadow-sm'
                          : 'text-[#1a1a1a] hover:bg-[#eae8dc]'
                      }`}
                    >
                      :{minute}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
