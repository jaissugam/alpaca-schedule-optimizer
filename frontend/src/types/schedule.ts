export interface Address {
  street_name: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface ScheduleSlot {
  client_name: string;
  client_address: Record<string, string>;
  start_time: string;
  end_time: string;
  drive_time_to: number;
  drive_time_from: number;
}

export interface DailySchedule {
  day_of_week: number;
  slots: ScheduleSlot[];
  total_hours: number;
}

export interface ScheduleOption {
  total_weekly_hours: number;
  daily_schedules: DailySchedule[];
}
