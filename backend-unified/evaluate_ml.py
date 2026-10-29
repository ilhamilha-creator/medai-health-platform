"""
ML Model Evaluation and Benchmarking
Evaluates XGBoost models on test datasets
"""

import numpy as np
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import json
import os
from datetime import datetime

print("=== ML Model Evaluation ===\n")

# Create results directory
os.makedirs('./results', exist_ok=True)

results = {}

# Evaluate each model
diseases = ['diabetes', 'cardiovascular', 'cancer', 'kidney', 'liver', 'thyroid', 'respiratory']

for disease in diseases:
    print(f"Evaluating {disease} model...")
    
    try:
        # Load model
        model_path = f'./models/{disease}_xgboost.json'
        if not os.path.exists(model_path):
            print(f"  Model not found: {model_path}")
            continue
        
        model = xgb.XGBClassifier()
        model.load_model(model_path)
        
        # Generate synthetic test data (same as training)
        np.random.seed(42)
        n_test = 1000
        
        if disease == 'diabetes':
            X_test = np.random.rand(n_test, 8)
            y_test = np.random.randint(0, 2, n_test)
        elif disease == 'cardiovascular':
            X_test = np.random.rand(n_test, 8)
            y_test = np.random.randint(0, 2, n_test)
        else:
            X_test = np.random.rand(n_test, 6)
            y_test = np.random.randint(0, 2, n_test)
        
        # Predict
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='binary', zero_division=0)
        recall = recall_score(y_test, y_pred, average='binary', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='binary', zero_division=0)
        
        try:
            auc = roc_auc_score(y_test, y_proba)
        except:
            auc = 0.5
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        results[disease] = {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1),
            'auc': float(auc),
            'confusion_matrix': cm.tolist(),
            'test_samples': n_test
        }
        
        print(f"  Accuracy: {accuracy:.4f}")
        print(f"  Precision: {precision:.4f}")
        print(f"  Recall: {recall:.4f}")
        print(f"  F1: {f1:.4f}")
        print(f"  AUC: {auc:.4f}")
        
    except Exception as e:
        print(f"  Error: {e}")
        results[disease] = {'error': str(e)}

# Save results
results['timestamp'] = datetime.now().isoformat()
results['note'] = 'Evaluation on synthetic test data. Real-world validation needed.'

with open('./results/evaluation_report.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\n=== Evaluation Complete ===")
print(f"Results saved to: ./results/evaluation_report.json")

# Summary
print("\n=== Summary ===")
for disease, metrics in results.items():
    if disease != 'timestamp' and disease != 'note' and 'error' not in metrics:
        print(f"{disease}: Accuracy={metrics['accuracy']:.4f}, F1={metrics['f1_score']:.4f}")
