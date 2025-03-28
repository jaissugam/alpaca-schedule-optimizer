from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from data.clinician_data import clinicians
from helper import Address, ScheduleOption, generate_schedule_options

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "healthy"}

# Helper function to find clinician ID by address
def find_clinician_id_by_address(address: Address) -> str:
    for clinician in clinicians:
        clinician_address = clinician["address"]
        if (clinician_address["street_name"].lower() == address.street_name.lower() and
            clinician_address["city"].lower() == address.city.lower() and
            clinician_address["state"].lower() == address.state.lower() and
            clinician_address["zip_code"] == address.zip_code):
            return clinician["id"]
    raise HTTPException(status_code=404, detail="Clinician not found")


@app.get("/clinician/{clinician_id}/schedule-options")
async def get_schedule_options(clinician_id: str) -> List[ScheduleOption]:
    return generate_schedule_options(clinician_id)

@app.post("/clinician/schedule-by-address")
async def get_schedule_by_address(address: Address) -> List[ScheduleOption]:
    clinician_id = find_clinician_id_by_address(address)
    return generate_schedule_options(clinician_id)