"""
Performance Benchmark Script
Measures latency and throughput for all components
"""

import time
import json
from modules.ai_agents import symptom_agent, urgency_agent, care_plan_agent
from modules.temporal_reasoning import temporal_reasoning
from modules.langchain_agents import langchain_care_agent
from modules.advanced_temporal import advanced_temporal

print("=== Performance Benchmark ===\n")

results = {}

# Benchmark Symptom Agent
start = time.time()
for _ in range(100):
    symptom_agent.analyze("fever and chest pain", {"age": 50, "gender": "male"})
end = time.time()
results['symptom_agent'] = {
    'avg_latency_ms': ((end - start) / 100) * 1000,
    'throughput_rps': 100 / (end - start)
}

# Benchmark Urgency Agent
start = time.time()
for _ in range(100):
    urgency_agent.assess("severe pain in chest", {"heart_rate": 120})
end = time.time()
results['urgency_agent'] = {
    'avg_latency_ms': ((end - start) / 100) * 1000,
    'throughput_rps': 100 / (end - start)
}

# Benchmark Care Plan Agent
start = time.time()
for _ in range(50):
    care_plan_agent.synthesize({'id': 'test', 'age': 75}, {'diagnosis': 'Hypertension', 'conditions': ['hypertension']}, ['BP monitoring'])
end = time.time()
results['care_plan_agent'] = {
    'avg_latency_ms': ((end - start) / 50) * 1000,
    'throughput_rps': 50 / (end - start)
}

# Benchmark Temporal Reasoning
temporal_reasoning.add_record('perf_test', {'glucose': 100})
start = time.time()
for _ in range(100):
    temporal_reasoning.detect_changes('perf_test')
end = time.time()
results['temporal_reasoning'] = {
    'avg_latency_ms': ((end - start) / 100) * 1000,
    'throughput_rps': 100 / (end - start)
}

# Benchmark LangChain Agent
start = time.time()
for _ in range(50):
    langchain_care_agent.generate_care_plan({'id': 'test', 'age': 75}, ['diabetes'])
end = time.time()
results['langchain_agent'] = {
    'avg_latency_ms': ((end - start) / 50) * 1000,
    'throughput_rps': 50 / (end - start)
}

# Save results
with open('./results/performance_benchmark.json', 'w') as f:
    json.dump(results, f, indent=2)

print("=== Benchmark Results ===")
for component, metrics in results.items():
    print(f"{component}:")
    print(f"  Latency: {metrics['avg_latency_ms']:.2f}ms")
    print(f"  Throughput: {metrics['throughput_rps']:.2f} RPS")

print("\nResults saved to: ./results/performance_benchmark.json")
