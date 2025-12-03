import React, { useState } from 'react';
import { DInput } from '@/components/ui/DInput';
import { DButton } from '@/components/ui/DButton';
import { RideSearchParams } from '@/lib/api';
import { Search, MapPin, Calendar } from 'lucide-react';

interface RideSearchFormProps {
  onSearch: (params: RideSearchParams) => void;
  isLoading?: boolean;
}

export const RideSearchForm: React.FC<RideSearchFormProps> = ({ onSearch, isLoading }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      from_city: fromCity || undefined,
      to_city: toCity || undefined,
      date: date || undefined,
    });
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Find your next ride</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <DInput
            label="Leaving from"
            placeholder="City"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            startContent={<MapPin className="text-gray-400" size={18} />}
            classNames={{
              inputWrapper: "bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:bg-white/20 focus-within:bg-white/20",
              input: "text-white placeholder:text-white/60",
              label: "text-white/80"
            }}
            variant="flat"
          />
        </div>
        <div className="flex-1 w-full">
          <DInput
            label="Going to"
            placeholder="City"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            startContent={<MapPin className="text-gray-400" size={18} />}
            classNames={{
              inputWrapper: "bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:bg-white/20 focus-within:bg-white/20",
              input: "text-white placeholder:text-white/60",
              label: "text-white/80"
            }}
            variant="flat"
          />
        </div>
        <div className="w-full md:w-48">
          <DInput
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            startContent={<Calendar className="text-gray-400" size={18} />}
            classNames={{
              inputWrapper: "bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:bg-white/20 focus-within:bg-white/20",
              input: "text-white placeholder:text-white/60",
              label: "text-white/80"
            }}
            variant="flat"
          />
        </div>
        <div className="w-full md:w-auto">
          <DButton
            type="submit"
            color="secondary"
            className="w-full md:w-auto h-14 px-8 font-bold text-lg shadow-lg"
            isLoading={isLoading}
            leftIcon={<Search size={20} />}
          >
            Search
          </DButton>
        </div>
      </form>
    </div>
  );
};
