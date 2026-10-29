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

# Export agents
symptom_agent = SymptomAnalysisAgent()
urgency_agent = UrgencyAssessmentAgent()
coordination_agent = CareCoordinationAgent()
