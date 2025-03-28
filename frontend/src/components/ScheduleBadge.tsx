import { ScheduleOption } from '@/types/schedule';
import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface ScheduleBadgeProps {
  option: ScheduleOption;
  index: number;
}

export function ScheduleBadge({ option, index }: ScheduleBadgeProps) {
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

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg font-bold">Schedule Option {index + 1}</span>
        <button className="text-blue-500 hover:text-blue-600">
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span>{option.total_weekly_hours.toFixed(1)} hours/week</span>
        </div>

        <div className="flex items-center gap-2">
          <span>{totalDriveTime} minutes total drive time</span>
        </div>

        <div className="flex items-center gap-2">
          <span>{uniqueClients.size} clients</span>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Clients: {Array.from(uniqueClients).join(', ')}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6 border-t pt-4">
          {option.daily_schedules.map((day) => (
            <div key={day.day_of_week} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">{DAYS[day.day_of_week - 1]}</h3>
              <div className="space-y-4">
                {day.slots.map((slot, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{slot.client_name}</span>
                      <span>{slot.start_time} - {slot.end_time}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Drive time: {slot.drive_time_to + slot.drive_time_from} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
