"""
Fallback LLM response if phi-3-mini not available
Simulates LLM responses for medical queries
"""

class FallbackLLM:
    """Fallback LLM for testing without real model"""
    
    def generate(self, prompt, max_tokens=100):
        """Generate response (simulated)"""
        if "diabetes" in prompt.lower():
            return "Diabetes is a chronic condition characterized by high blood sugar. Key symptoms include increased thirst, frequent urination, and fatigue. Management involves blood sugar monitoring, medication, and lifestyle changes."
        elif "heart" in prompt.lower() or "cardio" in prompt.lower():
            return "Cardiovascular disease affects the heart and blood vessels. Risk factors include high blood pressure, high cholesterol, smoking, and diabetes. Regular exercise and a healthy diet are important for prevention."
        elif "cancer" in prompt.lower():
            return "Cancer involves abnormal cell growth. Early detection through screening is crucial. Treatment options include surgery, chemotherapy, radiation therapy, and immunotherapy depending on the type and stage."
        else:
            return "I understand your health concern. For accurate medical advice, please consult with a healthcare professional. This system provides general information only and should not replace professional medical diagnosis."

# Test fallback
if __name__ == "__main__":
    llm = FallbackLLM()
    print("Testing Fallback LLM...")
    print(llm.generate("What is diabetes?"))
    print(llm.generate("How to prevent heart disease?"))
