"""
Advanced Temporal Reasoning with Change Detection
Implements CUSUM and EWMA for sophisticated change detection
"""

import numpy as np
from scipy import stats

class AdvancedTemporalReasoning:
    """Advanced temporal reasoning with CUSUM and EWMA change detection"""
    
    def __init__(self):
        self.history = {}
        self.baselines = {}
    
    def add_record(self, patient_id, metrics, timestamp=None):
        """Add a record for a patient"""
        if patient_id not in self.history:
            self.history[patient_id] = []
            self.baselines[patient_id] = {}
        
        if timestamp is None:
            from datetime import datetime
            timestamp = datetime.now()
        
        self.history[patient_id].append({
            'timestamp': timestamp,
            'metrics': metrics
        })
        
        # Update baselines
        for key, value in metrics.items():
            if key not in self.baselines[patient_id]:
                self.baselines[patient_id][key] = []
            self.baselines[patient_id][key].append(value)
    
    def detect_changes_cusum(self, patient_id, metric, k=0.5, h=5):
        """CUSUM change detection"""
        if patient_id not in self.history:
            return []
        
        records = self.history[patient_id]
        values = [r['metrics'].get(metric) for r in records if metric in r['metrics']]
        
        if len(values) < 10:
            return []
        
        # Calculate target mean
        target = np.mean(values[:len(values)//2])
        
        # CUSUM
        S_pos = 0
        S_neg = 0
        changes = []
        
        for i, value in enumerate(values):
            x = value - target
            S_pos = max(0, S_pos + x - k)
            S_neg = max(0, S_neg - x - k)
            
            if S_pos > h or S_neg > h:
                changes.append({
                    'index': i,
                    'value': value,
                    'type': 'increase' if S_pos > h else 'decrease',
                    'threshold_exceeded': S_pos if S_pos > h else S_neg
                })
                S_pos = 0
                S_neg = 0
        
        return changes
    
    def detect_changes_ewma(self, patient_id, metric, alpha=0.3, std_threshold=2):
        """EWMA change detection"""
        if patient_id not in self.history:
            return []
        
        records = self.history[patient_id]
        values = [r['metrics'].get(metric) for r in records if metric in r['metrics']]
        
        if len(values) < 10:
            return []
        
        # EWMA
        ewma = values[0]
        changes = []
        
        for i, value in enumerate(values[1:], 1):
            ewma = alpha * value + (1 - alpha) * ewma
            
            # Calculate rolling std
            if i >= 5:
                window = values[max(0, i-5):i+1]
                std = np.std(window)
                
                if abs(value - ewma) > std_threshold * std:
                    changes.append({
                        'index': i,
                        'value': value,
                        'ewma': ewma,
                        'deviation': abs(value - ewma) / std if std > 0 else 0
                    })
        
        return changes
    
    def detect_anomalies_zscore(self, patient_id, metric, threshold=3):
        """Z-score based anomaly detection"""
        if patient_id not in self.history:
            return []
        
        records = self.history[patient_id]
        values = [r['metrics'].get(metric) for r in records if metric in r['metrics']]
        
        if len(values) < 10:
            return []
        
        mean = np.mean(values)
        std = np.std(values)
        
        anomalies = []
        for i, value in enumerate(values):
            zscore = (value - mean) / std if std > 0 else 0
            if abs(zscore) > threshold:
                anomalies.append({
                    'index': i,
                    'value': value,
                    'zscore': zscore,
                    'mean': mean,
                    'std': std
                })
        
        return anomalies

# Export
advanced_temporal = AdvancedTemporalReasoning()
