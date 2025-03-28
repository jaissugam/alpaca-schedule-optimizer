import { Address, ScheduleOption } from '../types/schedule';

const API_BASE_URL = 'http://localhost:8000'; // Explicitly define the base URL for the API for testing only.

export async function getScheduleByAddress(address: Address): Promise<ScheduleOption[]> {
  const response = await fetch(`${API_BASE_URL}/clinician/schedule-by-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
