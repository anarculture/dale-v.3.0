import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, Plus, Minus } from 'lucide-react';

interface DalePriceSelectorProps {
  label?: string;
  value: number;
  onChange: (price: number) => void;
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  currency?: string;
}

export function DalePriceSelector({ 
  label, 
  value, 
  onChange, 
  icon,
  min = 5,
  max = 100,
  currency = '$'
}: DalePriceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync temp value when prop changes
  useEffect(() => {
    setTempValue(value);
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

  // Common price suggestions based on typical carpooling ranges
  const suggestedPrices = [10, 15, 20, 25, 30, 35, 40, 50];

  const handleIncrement = () => {
    const newValue = Math.min(max, tempValue + 1);
    setTempValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, tempValue - 1);
    setTempValue(newValue);
    onChange(newValue);
  };

  const handleSuggestedPrice = (price: number) => {
    setTempValue(price);
    onChange(price);
    setIsOpen(false);
  };

  const handleCustomInput = (inputValue: string) => {
    const numValue = parseInt(inputValue) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    setTempValue(clampedValue);
  };

  const handleInputBlur = () => {
    onChange(tempValue);
  };

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
          {icon || <DollarSign className="w-5 h-5" />}
        </div>
        <span className="flex-1 text-left text-base">
          {currency}{value}
        </span>
        <span className="text-sm text-[#6b7280]">por persona</span>
      </button>

      {/* Dropdown Price Picker */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden border border-[rgba(0,0,0,0.06)]">
          <div className="p-4">
            {/* Price Display & Controls */}
            <div className="mb-4">
              <p className="text-sm text-[#6b7280] mb-3 text-center">Ajusta el precio</p>
              
              {/* Large Price Display with +/- Controls */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={tempValue <= min}
                  className="w-12 h-12 rounded-xl bg-[#fffbf3] hover:bg-[#eae8dc] flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-5 h-5 text-[#1a1a1a]" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => handleCustomInput(e.target.value)}
                    onBlur={handleInputBlur}
                    min={min}
                    max={max}
                    className="w-full text-center text-3xl font-medium text-[#1a1a1a] bg-[#fffbf3] rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#fd5810] appearance-none"
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-1 text-xs text-[#6b7280]">
                    por persona
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={tempValue >= max}
                  className="w-12 h-12 rounded-xl bg-[#fffbf3] hover:bg-[#eae8dc] flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 text-[#1a1a1a]" />
                </button>
              </div>

              <div className="text-center text-xs text-[#6b7280]">
                Rango: {currency}{min} - {currency}{max}
              </div>
            </div>

            {/* Suggested Prices */}
            <div>
              <p className="text-xs text-[#6b7280] mb-2">Precios sugeridos</p>
              <div className="grid grid-cols-4 gap-2">
                {suggestedPrices.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => handleSuggestedPrice(price)}
                    className={`py-2.5 px-3 rounded-xl text-sm transition-all ${
                      price === tempValue
                        ? 'bg-[#fd5810] text-white font-medium shadow-sm'
                        : 'bg-[#fffbf3] text-[#1a1a1a] hover:bg-[#eae8dc]'
                    }`}
                  >
                    {currency}{price}
                  </button>
                ))}
              </div>
            </div>

            {/* Helper Text */}
            <div className="mt-4 p-3 bg-[#fff7ed] rounded-xl">
              <p className="text-xs text-[#6b7280]">
                💡 Los precios competitivos atraen más pasajeros
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
