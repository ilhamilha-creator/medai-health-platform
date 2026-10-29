"""
Appointments Module
Patient appointment scheduling and management
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from modules.auth.routes import get_current_user
from modules.database.database import get_db, Appointment

appointments_router = APIRouter()

# Models
class AppointmentCreate(BaseModel):
    doctor_id: int
    scheduled_time: datetime
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    scheduled_time: datetime
    status: str
    notes: Optional[str]
    created_at: datetime

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

@appointments_router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(
    appointment: AppointmentCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment"""
    if current_user["role"] != "patient":
        raise HTTPException(status_code=403, detail="Only patients can create appointments")
    
    new_appointment = Appointment(
        patient_id=current_user["id"],
        doctor_id=appointment.doctor_id,
        scheduled_time=appointment.scheduled_time,
        notes=appointment.notes,
        status="scheduled"
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return new_appointment

@appointments_router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appointments for current user"""
    if current_user["role"] == "patient":
        appointments = db.query(Appointment).filter(
            Appointment.patient_id == current_user["id"]
        ).all()
    else:  # doctor
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == current_user["id"]
        ).all()
    
    return appointments

@appointments_router.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific appointment by ID"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check access
    if current_user["role"] == "patient" and appointment.patient_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    if current_user["role"] == "doctor" and appointment.doctor_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return appointment

@appointments_router.put("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    update: AppointmentUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update appointment status or notes"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check access
    if current_user["role"] == "patient" and appointment.patient_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    if current_user["role"] == "doctor" and appointment.doctor_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if update.status:
        appointment.status = update.status
    if update.notes:
        appointment.notes = update.notes
    
    db.commit()
    db.refresh(appointment)
    
    return appointment

@appointments_router.delete("/appointments/{appointment_id}")
async def cancel_appointment(
    appointment_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an appointment"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check access
    if current_user["role"] == "patient" and appointment.patient_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    if current_user["role"] == "doctor" and appointment.doctor_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    appointment.status = "cancelled"
    db.commit()
    
    return {"message": "Appointment cancelled successfully"}
