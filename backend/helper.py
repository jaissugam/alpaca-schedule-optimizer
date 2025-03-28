from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime, timedelta
from fastapi import HTTPException
from data.clinician_data import clinicians
from data.client_data import clients
from data.drive_times import get_drive_time, get_travel_window

class Address(BaseModel):
    street_name: str
    city: str
    state: str
    zip_code: str

class ScheduleSlot(BaseModel):
    client_name: str
    client_address: Dict
    start_time: str
    end_time: str
    drive_time_to: int
    drive_time_from: int

class DailySchedule(BaseModel):
    day_of_week: int
    slots: List[ScheduleSlot]
    total_hours: float

class ScheduleOption(BaseModel):
    total_weekly_hours: float
    daily_schedules: List[DailySchedule]

# Check if two time slots are compatible considering drive time
def check_slot_compatibility(slot1_start: str, slot1_end: str, 
                           slot2_start: str, slot2_end: str, 
                           drive_time: int) -> bool:
    
    t1_end = datetime.strptime(slot1_end, "%H:%M")
    t2_start = datetime.strptime(slot2_start, "%H:%M")
    buffer = timedelta(minutes=drive_time)
    return (t2_start - t1_end) >= buffer

# Generate optimized schedule options for a clinician
def generate_schedule_options(clinician_id: str) -> List[ScheduleOption]:
    clinician = next((c for c in clinicians if c["id"] == clinician_id), None)
    if not clinician:
        raise HTTPException(status_code=404, detail="Clinician not found")
    
    schedule_options = []
    clinician_address = clinician["address"]
    max_clients_per_day = clinician["max_clients_per_day"]
    
    # Generating all possible combinations of client assignments
    for day in range(1, 6): 
        clinician_day_slots = [a for a in clinician["availabilities"] 
                             if a["day_of_the_week"] == day]
        if not clinician_day_slots:
            continue
            
        # Finding available clients for this day
        available_clients = [
            c for c in clients
            if any(a["day_of_the_week"] == day for a in c["availabilities"])
        ]
        
        daily_schedules = []
        for client in available_clients:
            client_slots = [a for a in client["availabilities"] 
                          if a["day_of_the_week"] == day]
            
            for slot in client_slots:
                drive_time_to = get_drive_time(clinician_address, client["address"])
                drive_time_from = get_drive_time(client["address"], clinician_address)
                
                schedule_slot = ScheduleSlot(
                    client_name=client["name"],
                    client_address=client["address"],
                    start_time=slot["start_time"],
                    end_time=slot["end_time"],
                    drive_time_to=drive_time_to,
                    drive_time_from=drive_time_from
                )
                daily_schedules.append(schedule_slot)
        
        # Sorting daily schedules
        daily_schedules.sort(key=lambda x: x.start_time)
        
        # Creating multiple schedule options with different combinations
        valid_combinations = []
        for i in range(len(daily_schedules)):
            current_combination = [daily_schedules[i]]
            for slot in daily_schedules[i+1:]:
                if len(current_combination) >= max_clients_per_day:
                    break
                    
                last_slot = current_combination[-1]
                if check_slot_compatibility(
                    last_slot.start_time, 
                    last_slot.end_time,
                    slot.start_time,
                    slot.end_time,
                    last_slot.drive_time_from
                ):
                    current_combination.append(slot)
            
            if current_combination:
                valid_combinations.append(current_combination)
        
        # Calculating total hours for each combination
        for combination in valid_combinations:
            total_hours = sum(
                (datetime.strptime(slot.end_time, "%H:%M") - 
                 datetime.strptime(slot.start_time, "%H:%M")).seconds / 3600
                for slot in combination
            )
            
            schedule_options.append(
                ScheduleOption(
                    total_weekly_hours=total_hours,
                    daily_schedules=[
                        DailySchedule(
                            day_of_week=day,
                            slots=combination,
                            total_hours=total_hours
                        )
                    ]
                )
            )
    
    # Sorting options by total weekly hours in descending order
    schedule_options.sort(key=lambda x: x.total_weekly_hours, reverse=True)
    return schedule_options
