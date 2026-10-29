"""
Test AI Agents with EHPAD longitudinal data
Tests care plan synthesis and follow-up with simulated data
"""

import os
from modules.ai_agents import care_plan_agent, follow_up_agent
from modules.temporal_reasoning import temporal_reasoning
import sqlite3

print("=== Testing AI Agents with EHPAD Data ===\n")

# Connect to EHPAD database
db_path = './data/ehpad_longitudinal.db'
if not os.path.exists(db_path):
    print("EHPAD database not found. Run simulate_ehpad.py first.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get a sample patient
cursor.execute('SELECT * FROM patients LIMIT 1')
patient = cursor.fetchone()

if patient:
    patient_id = patient[0]
    age = patient[1]
    gender = patient[2]
    
    print(f"Testing with patient: {patient_id}")
    print(f"Age: {age}, Gender: {gender}\n")
    
    # Test 1: Care Plan Synthesis
    print("1. Testing Care Plan Synthesis Agent")
    patient_data = {
        'id': patient_id,
        'age': age,
        'gender': gender
    }
    
    clinical_findings = {
        'diagnosis': 'Hypertension, Type 2 Diabetes',
        'conditions': ['hypertension', 'diabetes']
    }
    
    recommendations = ['Blood pressure monitoring', 'Blood sugar control', 'Dietary management']
    
    care_plan = care_plan_agent.synthesize(patient_data, clinical_findings, recommendations)
    print(f"   Medications: {len(care_plan['medications'])}")
    print(f"   Daily routine items: {len(care_plan['daily_routine'])}")
    print(f"   Follow-up schedule items: {len(care_plan['follow_up_schedule'])}")
    print(f"   Monitoring parameters: {len(care_plan['monitoring_parameters'])}")
    print(f"   Goals: {len(care_plan['goals'])}")
    
    # Test 2: Follow-up Scheduling
    print("\n2. Testing Follow-up Agent")
    tasks = [
        {'type': 'blood_pressure_check', 'description': 'Daily BP monitoring', 'assigned_to': 'nurse', 'frequency': 'daily'},
        {'type': 'glucose_check', 'description': 'Twice daily glucose monitoring', 'assigned_to': 'nurse', 'frequency': 'daily'},
        {'type': 'physician_visit', 'description': 'Monthly assessment', 'assigned_to': 'physician', 'frequency': 'monthly'}
    ]
    
    follow_up = follow_up_agent.schedule_follow_up(patient_id, tasks, time_horizon_days=30)
    print(f"   Scheduled follow-ups: {len(follow_up['follow_ups'])}")
    print(f"   Reminders: {len(follow_up['reminders'])}")
    
    # Test 3: Temporal Reasoning
    print("\n3. Testing Temporal Reasoning with EHPAD data")
    cursor.execute('SELECT metric_name, metric_value FROM observations WHERE patient_id = ? LIMIT 10', (patient_id,))
    observations = cursor.fetchall()
    
    for obs in observations:
        temporal_reasoning.add_record(patient_id, {obs[0]: obs[1]})
    
    changes = temporal_reasoning.detect_changes(patient_id)
    print(f"   Changes detected: {len(changes)}")
    if changes:
        for change in changes[:3]:
            print(f"     {change['metric']}: {change['old_value']:.2f} -> {change['new_value']:.2f}")
    
    print("\n=== Tests Complete ===")
    print("All agents tested successfully with EHPAD longitudinal data!")
else:
    print("No patients found in database")

conn.close()
