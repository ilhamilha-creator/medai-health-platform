"""
Unit Tests for Medical AI Platform
Tests for ML, agents, temporal reasoning, and document integration
"""

import unittest
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from modules.ai_agents import symptom_agent, urgency_agent, care_plan_agent
from modules.temporal_reasoning import temporal_reasoning
from modules.langchain_agents import langchain_care_agent
from modules.advanced_temporal import advanced_temporal
from modules.document_integration import doc_integration

class TestAgents(unittest.TestCase):
    """Test AI agents"""
    
    def test_symptom_agent(self):
        """Test symptom analysis agent"""
        result = symptom_agent.analyze("fever and chest pain", {"age": 50, "gender": "male"})
        self.assertIn('possible_conditions', result)
        self.assertIsInstance(result['possible_conditions'], list)
    
    def test_urgency_agent(self):
        """Test urgency assessment agent"""
        result = urgency_agent.assess("severe pain in chest", {"heart_rate": 120})
        self.assertIn('urgency_level', result)
        self.assertIn(result['urgency_level'], ['low', 'medium', 'high'])
    
    def test_care_plan_agent(self):
        """Test care plan synthesis agent"""
        patient_data = {'id': 'test_001', 'age': 75, 'gender': 'female'}
        clinical_findings = {'diagnosis': 'Hypertension', 'conditions': ['hypertension']}
        recommendations = ['BP monitoring']
        result = care_plan_agent.synthesize(patient_data, clinical_findings, recommendations)
        self.assertIn('medications', result)
        self.assertIn('daily_routine', result)

class TestTemporalReasoning(unittest.TestCase):
    """Test temporal reasoning"""
    
    def test_temporal_reasoning_add_record(self):
        """Test adding records"""
        temporal_reasoning.add_record('test_patient', {'glucose': 100})
        self.assertIn('test_patient', temporal_reasoning.history)
    
    def test_temporal_reasoning_detect_changes(self):
        """Test change detection"""
        temporal_reasoning.add_record('test_patient2', {'glucose': 100})
        temporal_reasoning.add_record('test_patient2', {'glucose': 110})
        changes = temporal_reasoning.detect_changes('test_patient2')
        self.assertIsInstance(changes, list)

class TestAdvancedTemporal(unittest.TestCase):
    """Test advanced temporal reasoning"""
    
    def test_cusum_detection(self):
        """Test CUSUM change detection"""
        advanced_temporal.add_record('test_adv', {'metric1': 100})
        advanced_temporal.add_record('test_adv', {'metric1': 105})
        advanced_temporal.add_record('test_adv', {'metric1': 110})
        changes = advanced_temporal.detect_changes_cusum('test_adv', 'metric1')
        self.assertIsInstance(changes, list)
    
    def test_ewma_detection(self):
        """Test EWMA change detection"""
        advanced_temporal.add_record('test_adv2', {'metric1': 100})
        advanced_temporal.add_record('test_adv2', {'metric1': 105})
        changes = advanced_temporal.detect_changes_ewma('test_adv2', 'metric1')
        self.assertIsInstance(changes, list)

class TestDocumentIntegration(unittest.TestCase):
    """Test document integration"""
    
    def test_document_processing(self):
        """Test document processing"""
        text = "Patient has diabetes and hypertension. Prescribed metformin and lisinopril."
        result = doc_integration.process_document('doc_001', text)
        self.assertIn('diagnosis', result)
        self.assertIn('medications', result)
    
    def test_document_summary(self):
        """Test document summary"""
        doc_integration.process_document('doc_002', "Patient has asthma")
        summary = doc_integration.get_summary('doc_002')
        self.assertIsNotNone(summary)

class TestLangChainAgent(unittest.TestCase):
    """Test LangChain agent"""
    
    def test_langchain_care_plan(self):
        """Test LangChain care plan generation"""
        patient_data = {'id': 'test_001', 'age': 75}
        conditions = ['diabetes', 'hypertension']
        result = langchain_care_agent.generate_care_plan(patient_data, conditions)
        self.assertIn('medications', result)
        self.assertIn('tool_calls', result)

if __name__ == '__main__':
    print("=== Running Unit Tests ===\n")
    unittest.main(verbosity=2)
