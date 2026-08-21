import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from anomaly_detection_engine import AnomalyDetector

if __name__ == "__main__":
    detector = AnomalyDetector()
    history = [12.0, 14.5, 13.2, 11.8, 15.0, 12.5]
    
    print("--- Testing Baseline Read ---")
    res1 = detector.evaluate(current_value=13.0, history=history)
    print(res1.model_dump_json(indent=2))
    
    print("\n--- Testing High Spike (Room 203 Anomaly) ---")
    res2 = detector.evaluate(current_value=42.0, history=history)
    print(res2.model_dump_json(indent=2))
