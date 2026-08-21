import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from anomaly_detection_engine import AnomalyDetector

if __name__ == "__main__":
    detector = AnomalyDetector(z_score_threshold=2.0)
    
    # 24-hour reading series with a massive spike at index 14 (38.0 kWh in Room 203)
    readings = [
        10.5, 10.8, 11.2, 10.0, 9.8, 10.2, 11.5, 12.0,
        11.8, 12.4, 13.0, 12.8, 13.2, 13.5, 38.0, 14.0,
        13.5, 12.8, 12.0, 11.5, 10.8, 10.2, 9.5, 9.0
    ]
    
    report = detector.evaluate_batch(readings, window_size=5)
    print("==========================================")
    print("ANOMALY DETECTION ENGINE — BATCH REPORT")
    print("==========================================")
    print(f"Total Readings Processed: {report.total_analyzed}")
    print(f"Anomalies Detected:       {report.anomalies_detected}")
    print(f"Anomalous Index Points:   {report.anomalous_indices}")
    
    for idx in report.anomalous_indices:
        res = report.results[idx]
        print(f"\n[!] Anomaly at Hour {idx}:")
        print(f"    Observed:    {res.actual_value} kWh")
        print(f"    Expected:    {res.expected_min} - {res.expected_max} kWh")
        print(f"    Deviation:   +{res.deviation_percent}%")
        print(f"    Severity:    {res.severity}")
        print(f"    Method:      {res.method_used}")
