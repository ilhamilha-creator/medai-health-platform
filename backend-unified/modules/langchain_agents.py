"""
LangChain-based Care Plan Agent
Uses LangChain for sophisticated care plan generation
"""

from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import SystemMessage

print("Initializing LangChain Care Plan Agent...")

# Define tools for the agent
def get_medication_info(condition: str) -> str:
    """Get medication information for a condition"""
    medications = {
        'diabetes': 'Metformin 500mg twice daily, Insulin as needed',
        'hypertension': 'Lisinopril 10mg daily, Amlodipine 5mg daily',
        'heart_failure': 'Carvedilol 12.5mg twice daily, Furosemide 40mg daily',
        'cancer': 'Chemotherapy protocol based on cancer type',
        'respiratory': 'Bronchodilators, Inhaled corticosteroids'
    }
    return medications.get(condition.lower(), 'Consult physician for medication advice')

def get_dietary_recommendations(condition: str) -> str:
    """Get dietary recommendations for a condition"""
    recommendations = {
        'diabetes': 'Low sugar, high fiber, consistent carbohydrate intake',
        'hypertension': 'Low sodium (<2g/day), DASH diet, increase potassium',
        'heart_failure': 'Fluid restriction, low sodium, monitor weight daily',
        'cancer': 'High protein, calorie-dense foods, stay hydrated',
        'respiratory': 'High protein, antioxidant-rich foods, stay hydrated'
    }
    return recommendations.get(condition.lower(), 'Balanced diet recommended')

def get_monitoring_parameters(condition: str) -> str:
    """Get monitoring parameters for a condition"""
    parameters = {
        'diabetes': 'Blood glucose twice daily, HbA1c quarterly',
        'hypertension': 'Blood pressure daily, kidney function quarterly',
        'heart_failure': 'Weight daily, blood pressure daily, ejection fraction',
        'cancer': 'Tumor markers as per protocol, blood counts weekly',
        'respiratory': 'Peak flow daily, oxygen saturation as needed'
    }
    return parameters.get(condition.lower(), 'Regular monitoring recommended')

# Create LangChain tools
tools = [
    Tool(
        name="MedicationInfo",
        func=get_medication_info,
        description="Get medication information for a specific medical condition"
    ),
    Tool(
        name="DietaryRecommendations",
        func=get_dietary_recommendations,
        description="Get dietary recommendations for a specific medical condition"
    ),
    Tool(
        name="MonitoringParameters",
        func=get_monitoring_parameters,
        description="Get monitoring parameters for a specific medical condition"
    )
]

# Create simple LangChain agent (without OpenAI, using tool calling directly)
class LangChainCarePlanAgent:
    """Care plan agent using LangChain tools"""
    
    def __init__(self):
        self.tools = tools
    
    def generate_care_plan(self, patient_data, conditions):
        """Generate care plan using LangChain tools"""
        care_plan = {
            'patient_id': patient_data.get('id', 'unknown'),
            'age': patient_data.get('age'),
            'conditions': conditions,
            'medications': [],
            'dietary_recommendations': [],
            'monitoring_parameters': [],
            'tool_calls': []
        }
        
        for condition in conditions:
            # Use LangChain tools
            try:
                med_info = get_medication_info(condition)
                care_plan['medications'].append({
                    'condition': condition,
                    'medication': med_info
                })
                care_plan['tool_calls'].append(f"MedicationInfo tool called for {condition}")
            except Exception as e:
                care_plan['tool_calls'].append(f"MedicationInfo error: {e}")
            
            try:
                diet_rec = get_dietary_recommendations(condition)
                care_plan['dietary_recommendations'].append({
                    'condition': condition,
                    'recommendation': diet_rec
                })
                care_plan['tool_calls'].append(f"DietaryRecommendations tool called for {condition}")
            except Exception as e:
                care_plan['tool_calls'].append(f"DietaryRecommendations error: {e}")
            
            try:
                mon_params = get_monitoring_parameters(condition)
                care_plan['monitoring_parameters'].append({
                    'condition': condition,
                    'parameters': mon_params
                })
                care_plan['tool_calls'].append(f"MonitoringParameters tool called for {condition}")
            except Exception as e:
                care_plan['tool_calls'].append(f"MonitoringParameters error: {e}")
        
        return care_plan

# Export agent
langchain_care_agent = LangChainCarePlanAgent()

print("LangChain Care Plan Agent initialized!")
print(f"Tools available: {[tool.name for tool in tools]}")
