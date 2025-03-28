from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from data.clinician_data import clinicians

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Address(BaseModel):
    street_name: str
    city: str
    state: str
    zip_code: str

@app.get("/")
async def health_check():
    return {"status": "healthy"}

# Endpoint to find a clinician by address
@app.post("/clinician/search")
async def find_clinician_by_address(address: Address):
    for clinician in clinicians:
        clinician_address = clinician["address"]
        if (clinician_address["street_name"].lower() == address.street_name.lower() and
            clinician_address["city"].lower() == address.city.lower() and
            clinician_address["state"].lower() == address.state.lower() and
            clinician_address["zip_code"] == address.zip_code):
            return {"clinician_id": clinician["id"]}
    
    raise HTTPException(status_code=404, detail="Clinician not found")