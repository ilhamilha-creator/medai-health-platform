"""
Specialized AI Agents for Medical Care
Agent 1: Symptom Analysis Agent
Agent 2: Urgency Assessment Agent
Agent 3: Care Coordination Agent
"""

class SymptomAnalysisAgent:
    """Analyzes patient symptoms and suggests conditions"""
    
    def analyze(self, symptoms, patient_data):
        """Analyze symptoms and suggest possible conditions"""
        possible_conditions = []
        
        if 'fever' in symptoms.lower():
            possible_conditions.append('Infection')
        if 'chest pain' in symptoms.lower():
            possible_conditions.append('Cardiovascular issue')
        if 'thirst' in symptoms.lower() and 'urination' in symptoms.lower():
            possible_conditions.append('Diabetes')
        
        return {
            'possible_conditions': possible_conditions,
            'recommended_tests': ['Blood test', 'ECG', 'X-Ray'],
            'urgency': 'medium'
        }

class UrgencyAssessmentAgent:
    """Assesses urgency level based on symptoms"""
    
    def assess(self, symptoms, vital_signs):
        """Assess urgency level"""
        high_urgency_keywords = ['severe pain', 'difficulty breathing', 'chest tightness', 'fainting']
        
        for keyword in high_urgency_keywords:
            if keyword in symptoms.lower():
                return {
                    'urgency_level': 'high',
                    'action': 'Immediate medical attention required',
                    'timeframe': 'Within 1 hour'
                }
        
        return {
            'urgency_level': 'low',
            'action': 'Schedule appointment within 1-2 weeks',
            'timeframe': '1-2 weeks'
        }

class CareCoordinationAgent:
    """Coordinates care between family and professionals"""
    
    def coordinate(self, patient_id, needs, caregivers):
        """Coordinate care plan"""
        care_plan = {
            'patient_id': patient_id,
            'needs': needs,
            'tasks': []
        }
        
        for need in needs:
            if need == 'medication':
                care_plan['tasks'].append({
                    'task': 'Medication management',
                    'assigned_to': caregivers.get('primary', 'family'),
                    'frequency': 'Daily'
                })
            elif need == 'monitoring':
                care_plan['tasks'].append({
                    'task': 'Vital signs monitoring',
                    'assigned_to': caregivers.get('nurse', 'professional'),
                    'frequency': 'Twice daily'
                })
        
        return care_plan

class CarePlanSynthesisAgent:
    """Synthesizes comprehensive care plans based on patient data and needs"""
    
    def synthesize(self, patient_data, clinical_findings, recommendations):
        """Generate comprehensive care plan"""
        care_plan = {
            'patient_id': patient_data.get('id', 'unknown'),
            'patient_info': {
                'age': patient_data.get('age'),
                'diagnosis': clinical_findings.get('diagnosis', 'Pending'),
                'conditions': clinical_findings.get('conditions', [])
            },
            'medications': [],
            'daily_routine': [],
            'dietary_recommendations': [],
            'follow_up_schedule': [],
            'monitoring_parameters': [],
            'goals': []
        }
        
        # Medications based on conditions
        for condition in clinical_findings.get('conditions', []):
            if 'diabetes' in condition.lower():
                care_plan['medications'].append({
                    'name': 'Metformin',
                    'dosage': '500mg twice daily',
                    'purpose': 'Blood sugar control'
                })
            elif 'hypertension' in condition.lower():
                care_plan['medications'].append({
                    'name': 'Lisinopril',
                    'dosage': '10mg daily',
                    'purpose': 'Blood pressure control'
                })
        
        # Daily routine
        care_plan['daily_routine'] = [
            {'time': '08:00', 'activity': 'Morning medication'},
            {'time': '08:30', 'activity': 'Breakfast'},
            {'time': '10:00', 'activity': 'Light exercise/walk'},
            {'time': '12:00', 'activity': 'Lunch'},
            {'time': '14:00', 'activity': 'Rest period'},
            {'time': '16:00', 'activity': 'Afternoon medication'},
            {'time': '18:00', 'activity': 'Dinner'},
            {'time': '20:00', 'activity': 'Evening medication'},
            {'time': '22:00', 'activity': 'Bedtime'}
        ]
        
        # Dietary recommendations
        care_plan['dietary_recommendations'] = [
            'Low sodium diet',
            'High fiber intake',
            'Limit sugar intake',
            'Stay hydrated (8 glasses/day)',
            'Regular meal times'
        ]
        
        # Follow-up schedule
        care_plan['follow_up_schedule'] = [
            {'frequency': 'Weekly', 'type': 'Nurse visit', 'purpose': 'Vital signs check'},
            {'frequency': 'Monthly', 'type': 'Physician visit', 'purpose': 'Clinical assessment'},
            {'frequency': 'Quarterly', 'type': 'Lab tests', 'purpose': 'Blood work'}
        ]
        
        # Monitoring parameters
        care_plan['monitoring_parameters'] = [
            {'parameter': 'Blood pressure', 'target': '<130/80 mmHg', 'frequency': 'Daily'},
            {'parameter': 'Blood glucose', 'target': '70-130 mg/dL', 'frequency': 'Twice daily'},
            {'parameter': 'Weight', 'target': 'Stable', 'frequency': 'Weekly'},
            {'parameter': 'Heart rate', 'target': '60-100 bpm', 'frequency': 'Daily'}
        ]
        
        # Goals
        care_plan['goals'] = [
            'Maintain blood pressure within target range',
            'Control blood glucose levels',
            'Improve mobility and independence',
            'Enhance quality of life',
            'Prevent complications'
        ]
        
        return care_plan

class FollowUpAgent:
    """Manages follow-up scheduling and tracking for care interventions"""
    
    def __init__(self):
        self.scheduled_followups = {}
    
    def schedule_follow_up(self, patient_id, tasks, time_horizon_days=30):
        """Schedule follow-up tasks and reminders"""
        from datetime import datetime, timedelta
        
        follow_up_plan = {
            'patient_id': patient_id,
            'scheduled_date': datetime.now().isoformat(),
            'follow_ups': [],
            'reminders': []
        }
        
        for task in tasks:
            task_type = task.get('type', 'checkup')
            frequency = task.get('frequency', 'weekly')
            
            # Generate follow-up schedule
            if frequency == 'daily':
                interval = 1
            elif frequency == 'weekly':
                interval = 7
            elif frequency == 'monthly':
                interval = 30
            else:
                interval = 7
            
            # Schedule follow-ups for the time horizon
            for day in range(0, time_horizon_days, interval):
                follow_up_date = datetime.now() + timedelta(days=day)
                
                follow_up_plan['follow_ups'].append({
                    'date': follow_up_date.isoformat(),
                    'task_type': task_type,
                    'description': task.get('description', f'Scheduled {task_type}'),
                    'assigned_to': task.get('assigned_to', 'nurse'),
                    'status': 'scheduled'
                })
                
                # Add reminder 1 day before
                reminder_date = follow_up_date - timedelta(days=1)
                follow_up_plan['reminders'].append({
                    'date': reminder_date.isoformat(),
                    'type': 'reminder',
                    'message': f'Upcoming {task_type} scheduled for {follow_up_date.strftime("%Y-%m-%d")}',
                    'recipient': task.get('assigned_to', 'nurse')
                })
        
        self.scheduled_followups[patient_id] = follow_up_plan
        return follow_up_plan
    
    def update_follow_up_status(self, patient_id, follow_up_id, status, notes):
        """Update status of a follow-up task"""
        if patient_id in self.scheduled_followups:
            for follow_up in self.scheduled_followups[patient_id]['follow_ups']:
                if follow_up.get('id') == follow_up_id:
                    follow_up['status'] = status
                    follow_up['notes'] = notes
                    follow_up['completed_date'] = datetime.now().isoformat()
                    return True
        return False
    
    def get_upcoming_follow_ups(self, patient_id, days_ahead=7):
        """Get upcoming follow-ups in the next N days"""
        from datetime import datetime, timedelta
        
        if patient_id not in self.scheduled_followups:
            return []
        
        cutoff_date = datetime.now() + timedelta(days=days_ahead)
        upcoming = []
        
        for follow_up in self.scheduled_followups[patient_id]['follow_ups']:
            follow_up_date = datetime.fromisoformat(follow_up['date'])
            if datetime.now() <= follow_up_date <= cutoff_date and follow_up['status'] == 'scheduled':
                upcoming.append(follow_up)
        
        return upcoming

# Export agents
symptom_agent = SymptomAnalysisAgent()
urgency_agent = UrgencyAssessmentAgent()
coordination_agent = CareCoordinationAgent()
care_plan_agent = CarePlanSynthesisAgent()
follow_up_agent = FollowUpAgent()
