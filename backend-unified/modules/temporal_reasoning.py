"""
Temporal Reasoning for Medical Care Tracking
Tracks changes in patient data over time
"""

import numpy as np
from datetime import datetime, timedelta

class TemporalReasoning:
    """Track changes in patient health metrics over time"""
    
    def __init__(self):
        self.history = {}  # patient_id -> list of records
    
    def add_record(self, patient_id, metrics, timestamp=None):
        """Add a record for a patient"""
        if patient_id not in self.history:
            self.history[patient_id] = []
        
        if timestamp is None:
            timestamp = datetime.now()
        
        self.history[patient_id].append({
            'timestamp': timestamp,
            'metrics': metrics
        })
    
    def detect_changes(self, patient_id, lookback_days=30):
        """Detect significant changes in patient metrics"""
        if patient_id not in self.history:
            return []
        
        records = self.history[patient_id]
        if len(records) < 2:
            return []
        
        # Get records from lookback period
        cutoff = datetime.now() - timedelta(days=lookback_days)
        recent_records = [r for r in records if r['timestamp'] >= cutoff]
        
        if len(recent_records) < 2:
            return []
        
        changes = []
        
        # Compare first and last record
        first = recent_records[0]['metrics']
        last = recent_records[-1]['metrics']
        
        for key in first.keys():
            if key in last:
                diff = last[key] - first[key]
                if abs(diff) > 0.1:  # Significant change threshold
                    changes.append({
                        'metric': key,
                        'old_value': first[key],
                        'new_value': last[key],
                        'change': diff,
                        'trend': 'increasing' if diff > 0 else 'decreasing'
                    })
        
        return changes
    
    def get_trend(self, patient_id, metric):
        """Get trend for a specific metric"""
        if patient_id not in self.history:
            return None
        
        records = self.history[patient_id]
        if len(records) < 2:
            return None
        
        values = [r['metrics'].get(metric) for r in records if metric in r['metrics']]
        if len(values) < 2:
            return None
        
        # Simple linear regression
        x = np.arange(len(values))
        slope = np.polyfit(x, values, 1)[0]
        
        if slope > 0.01:
            return 'increasing'
        elif slope < -0.01:
            return 'decreasing'
        else:
            return 'stable'

# Singleton instance
temporal_reasoning = TemporalReasoning()
