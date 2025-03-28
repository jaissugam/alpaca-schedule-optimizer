'use client';

import { useState } from 'react';
import { getScheduleByAddress } from '@/api/schedule';
import type { ScheduleOption } from '@/types/schedule';
import { ScheduleBadge } from '@/components/ScheduleBadge';

export default function Home() {
  const [address, setAddress] = useState({
    street_name: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleOptions, setScheduleOptions] = useState<ScheduleOption[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScheduleOptions(null);

    try {
      const options = await getScheduleByAddress(address);
      // Limit to top 10 options
      setScheduleOptions(options.slice(0, 10));
      // Save to sessionStorage for detail page
      sessionStorage.setItem('scheduleOptions', JSON.stringify(options.slice(0, 10)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule options');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-8">Compatible Client Schedules</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="street_name" className="text-sm font-medium text-black">Street Name</label>
          <input
            type="text"
            id="street_name"
            name="street_name"
            value={address.street_name}
            onChange={handleChange}
            className="border rounded-md p-2 bg-white text-black"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-sm font-medium text-black">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="border rounded-md p-2 bg-white text-black"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="state" className="text-sm font-medium text-black">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            className="border rounded-md p-2 bg-white text-black"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="zip_code" className="text-sm font-medium text-black">ZIP Code</label>
          <input
            type="text"
            id="zip_code"
            name="zip_code"
            value={address.zip_code}
            onChange={handleChange}
            className="border rounded-md p-2 bg-white text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md w-full max-w-lg">
          {error}
        </div>
      )}

      {scheduleOptions && (
        <div className="mt-8 w-full max-w-2xl space-y-4">
          <h2 className="text-xl font-bold mb-4">Available Schedule Options</h2>
          {scheduleOptions.map((option, index) => (
            <ScheduleBadge key={index} option={option} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
