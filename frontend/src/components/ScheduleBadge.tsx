import { ScheduleOption } from '@/types/schedule';
import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface ScheduleBadgeProps {
  option: ScheduleOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function ScheduleBadge({ option, index, isSelected, onSelect }: ScheduleBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalDriveTime = option.daily_schedules.reduce((acc, schedule) => {
    return acc + schedule.slots.reduce((sum, slot) => 
      sum + slot.drive_time_to + slot.drive_time_from, 0);
  }, 0);

  const uniqueClients = new Set(
    option.daily_schedules.flatMap(schedule => 
      schedule.slots.map(slot => slot.client_name)
    )
  );

  const formatAddress = (address: Record<string, string>) => {
    return `${address.street_name}, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow h-full ${isSelected ? 'border-blue-500' : ''}`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Schedule Option {index + 1}</span>
          <button
            onClick={onSelect}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isSelected ? 'Hide Details' : 'Select'}
          </button>
        </div>

        <div className="space-y-2 flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">⏰</span>
            <span>{option.total_weekly_hours.toFixed(1)} hours/week</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">🚗</span>
            <span>{totalDriveTime} minutes total drive time</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">👥</span>
            <span>{uniqueClients.size} clients</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from(uniqueClients).map((client, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 border border-gray-300 text-gray-700"
              >
                {client}
              </span>
            ))}
          </div>
        </div>

        {isSelected && (
          <div className="mt-6 space-y-6 border-t pt-4 overflow-auto max-h-[600px]">
            {option.daily_schedules.map((day) => (
              <div key={day.day_of_week} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">{DAYS[day.day_of_week - 1]}</h3>
                <div className="space-y-4">
                  {day.slots.map((slot, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700">
                          {slot.client_name}
                        </span>
                        <span>{slot.start_time} - {slot.end_time}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div>📍 {formatAddress(slot.client_address)}</div>
                        <div>🚗 Drive time: {slot.drive_time_to + slot.drive_time_from} minutes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
