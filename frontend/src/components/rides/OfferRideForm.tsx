import React, { useState } from 'react';
import { DInput } from '@/components/ui/DInput';
import { DButton } from '@/components/ui/DButton';
import { DTextarea } from '@/components/ui/DTextarea';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, DollarSign, Users } from 'lucide-react';

export const OfferRideForm: React.FC = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    from_city: '',
    to_city: '',
    date: '',
    time: '',
    price: '',
    seats: '3',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.from_city || !formData.to_city || !formData.date || !formData.time || !formData.price || !formData.seats) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    // Date Validation
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    if (selectedDate < new Date()) {
      showToast('error', 'Trip date cannot be in the past');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.createRide({
        from_city: formData.from_city,
        from_lat: 0, // Mock lat/lon for now as we don't have geocoding yet
        from_lon: 0,
        to_city: formData.to_city,
        to_lat: 0,
        to_lon: 0,
        date_time: selectedDate.toISOString(),
        seats_total: parseInt(formData.seats),
        price: parseFloat(formData.price),
        notes: formData.notes
      });

      showToast('success', 'Ride published successfully!');
      router.push('/rides');
    } catch (error: any) {
      console.error(error);
      showToast('error', error.message || 'Failed to publish ride');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DInput
          label="From"
          name="from_city"
          placeholder="City of departure"
          value={formData.from_city}
          onChange={handleChange}
          startContent={<MapPin size={18} className="text-gray-400" />}
          isRequired
        />
        <DInput
          label="To"
          name="to_city"
          placeholder="City of arrival"
          value={formData.to_city}
          onChange={handleChange}
          startContent={<MapPin size={18} className="text-gray-400" />}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DInput
          type="date"
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          startContent={<Calendar size={18} className="text-gray-400" />}
          isRequired
        />
        <DInput
          type="time"
          label="Time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          startContent={<Clock size={18} className="text-gray-400" />}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DInput
          type="number"
          label="Price per seat"
          name="price"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange}
          startContent={<DollarSign size={18} className="text-gray-400" />}
          min={0}
          step="0.01"
          isRequired
        />
        <DInput
          type="number"
          label="Available seats"
          name="seats"
          value={formData.seats}
          onChange={handleChange}
          startContent={<Users size={18} className="text-gray-400" />}
          min={1}
          max={8}
          isRequired
        />
      </div>

      <DTextarea
        label="Trip details (optional)"
        name="notes"
        placeholder="Meeting point, pet policy, music preference..."
        value={formData.notes}
        onChange={handleChange}
      />

      <DButton
        type="submit"
        className="w-full h-12 text-lg font-bold"
        isLoading={isLoading}
      >
        Publish Ride
      </DButton>
    </form>
  );
};
