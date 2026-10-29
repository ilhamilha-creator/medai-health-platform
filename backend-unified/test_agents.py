"""
Quick test for agents and RAG (no LLM needed)
"""

from modules.ai_agents import symptom_agent, urgency_agent, coordination_agent
from modules.temporal_reasoning import temporal_reasoning

print("Testing AI Agents and Temporal Reasoning...")

# Test Symptom Agent
print("\n1. Symptom Analysis Agent")
result = symptom_agent.analyze("fever and chest pain", {"age": 50, "gender": "male"})
print(f"Result: {result}")

# Test Urgency Agent
print("\n2. Urgency Assessment Agent")
result = urgency_agent.assess("severe pain in chest", {"heart_rate": 120})
print(f"Result: {result}")

# Test Coordination Agent
print("\n3. Care Coordination Agent")
result = coordination_agent.coordinate("patient123", ["medication", "monitoring"], {"primary": "family", "nurse": "professional"})
print(f"Result: {result}")

# Test Temporal Reasoning
print("\n4. Temporal Reasoning")
temporal_reasoning.add_record("patient1", {"glucose": 100, "bp": 120})
temporal_reasoning.add_record("patient1", {"glucose": 110, "bp": 125})
changes = temporal_reasoning.detect_changes("patient1")
print(f"Changes: {changes}")

trend = temporal_reasoning.get_trend("patient1", "glucose")
print(f"Trend for glucose: {trend}")

print("\n=== All Tests Complete ===")
