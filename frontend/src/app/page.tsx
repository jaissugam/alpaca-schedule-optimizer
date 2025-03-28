'use client';

import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState({
    street_name: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted address:', address);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-8 text-black">Compatible Client Schedules</h1>
      
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
