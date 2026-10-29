"""
EHPAD Simulation - Longitudinal Care Memory
Simulates 6 months of patient observations in nursing home setting
"""

import numpy as np
import json
import os
from datetime import datetime, timedelta
import sqlite3

print("=== EHPAD Longitudinal Care Memory Simulation ===\n")

# Create data directory
os.makedirs('./data', exist_ok=True)

# Create database
db_path = './data/ehpad_longitudinal.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create tables
cursor.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        age INTEGER,
        gender TEXT,
        admission_date TEXT,
        room TEXT
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT,
        timestamp TEXT,
        metric_name TEXT,
        metric_value REAL,
        recorded_by TEXT
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS interventions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT,
        timestamp TEXT,
        intervention_type TEXT,
        description TEXT,
        performed_by TEXT
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS care_needs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT,
        timestamp TEXT,
        need_type TEXT,
        priority TEXT,
        status TEXT
    )
''')

conn.commit()

# Simulate 100 patients over 6 months
n_patients = 100
start_date = datetime.now() - timedelta(days=180)

print(f"Simulating {n_patients} patients over 6 months...")

patients = []
for i in range(n_patients):
    patient_id = f"patient_{i:03d}"
    age = np.random.randint(65, 95)
    gender = np.random.choice(['male', 'female'])
    admission_date = start_date + timedelta(days=np.random.randint(0, 30))
    room = f"room_{np.random.randint(1, 20):02d}"
    
    cursor.execute(
        'INSERT INTO patients VALUES (?, ?, ?, ?, ?)',
        (patient_id, age, gender, admission_date.isoformat(), room)
    )
    patients.append(patient_id)

# Simulate daily observations
print("Generating daily observations...")
metrics = ['blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 
           'glucose', 'temperature', 'oxygen_saturation', 'weight']

for patient_id in patients:
    for day in range(180):
        date = start_date + timedelta(days=day)
        
        # Randomly record 2-4 metrics per day
        n_metrics = np.random.randint(2, 5)
        selected_metrics = np.random.choice(metrics, n_metrics, replace=False)
        
        for metric in selected_metrics:
            # Generate realistic values
            if 'blood_pressure_systolic' in metric:
                value = np.random.normal(130, 15)
            elif 'blood_pressure_diastolic' in metric:
                value = np.random.normal(80, 10)
            elif 'heart_rate' in metric:
                value = np.random.normal(75, 10)
            elif 'glucose' in metric:
                value = np.random.normal(100, 30)
            elif 'temperature' in metric:
                value = np.random.normal(37, 0.5)
            elif 'oxygen_saturation' in metric:
                value = np.random.normal(98, 2)
            elif 'weight' in metric:
                value = np.random.normal(70, 15)
            
            cursor.execute(
                'INSERT INTO observations (patient_id, timestamp, metric_name, metric_value, recorded_by) VALUES (?, ?, ?, ?, ?)',
                (patient_id, date.isoformat(), metric, value, f'nurse_{np.random.randint(1, 5)}')
            )

# Simulate interventions
print("Generating interventions...")
intervention_types = ['medication', 'physical_therapy', 'social_activity', 'nutrition', 'monitoring']

for patient_id in patients:
    n_interventions = np.random.randint(10, 30)
    for _ in range(n_interventions):
        date = start_date + timedelta(days=np.random.randint(0, 180))
        intervention = np.random.choice(intervention_types)
        
        cursor.execute(
            'INSERT INTO interventions (patient_id, timestamp, intervention_type, description, performed_by) VALUES (?, ?, ?, ?, ?)',
            (patient_id, date.isoformat(), intervention, f'Daily {intervention}', f'staff_{np.random.randint(1, 10)}')
        )

# Simulate care needs
print("Generating care needs...")
need_types = ['mobility_assistance', 'medication_management', 'nutrition_support', 
               'social_engagement', 'cognitive_stimulation', 'palliative_care']

for patient_id in patients:
    n_needs = np.random.randint(1, 4)
    for _ in range(n_needs):
        date = start_date + timedelta(days=np.random.randint(0, 180))
        need = np.random.choice(need_types)
        priority = np.random.choice(['low', 'medium', 'high'])
        status = np.random.choice(['active', 'resolved', 'ongoing'])
        
        cursor.execute(
            'INSERT INTO care_needs (patient_id, timestamp, need_type, priority, status) VALUES (?, ?, ?, ?, ?)',
            (patient_id, date.isoformat(), need, priority, status)
        )

conn.commit()

# Summary
cursor.execute('SELECT COUNT(*) FROM patients')
n_patients_db = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM observations')
n_observations = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM interventions')
n_interventions = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM care_needs')
n_needs = cursor.fetchone()[0]

print(f"\n=== Simulation Complete ===")
print(f"Patients: {n_patients_db}")
print(f"Observations: {n_observations}")
print(f"Interventions: {n_interventions}")
print(f"Care Needs: {n_needs}")
print(f"Database: {db_path}")

conn.close()

print("\nLongitudinal care memory ready for temporal reasoning!")
