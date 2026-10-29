"""
Quick Demo Script - Shows all features in 1 minute
"""
print("=== Medical AI Platform Quick Demo ===\n")

print("1. Testing AI Agents...")
from modules.ai_agents import symptom_agent, urgency_agent
print(f"   Symptom: {symptom_agent.analyze('fever', {'age': 50})}")
print(f"   Urgency: {urgency_agent.assess('severe pain', {'hr': 120})}")

print("\n2. Testing Temporal Reasoning...")
from modules.temporal_reasoning import temporal_reasoning
temporal_reasoning.add_record('test', {'glucose': 100})
temporal_reasoning.add_record('test', {'glucose': 110})
print(f"   Changes: {temporal_reasoning.detect_changes('test')}")

print("\n3. Testing LangChain Agent...")
from modules.langchain_agents import langchain_care_agent
print(f"   Care Plan: {langchain_care_agent.generate_care_plan({'id': 'test', 'age': 75}, ['diabetes'])}")

print("\n4. Testing Advanced Temporal...")
from modules.advanced_temporal import advanced_temporal
advanced_temporal.add_record('test2', {'bp': 120})
advanced_temporal.add_record('test2', {'bp': 130})
print(f"   CUSUM: {advanced_temporal.detect_changes_cusum('test2', 'bp')}")

print("\n5. Testing Document Integration...")
from modules.document_integration import doc_integration
print(f"   Process: {doc_integration.process_document('doc1', 'Patient has diabetes')}")

print("\n=== Demo Complete ===")
print("All components functional!")
