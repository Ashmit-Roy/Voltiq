from anomaly_detection_engine import AnomalyDetector

def test_anomaly_detection():
    detector = AnomalyDetector(z_score_threshold=2.0)
    baseline = [10.0, 11.2, 10.8, 12.0, 11.5]
    
    # Normal value
    normal_res = detector.evaluate(current_value=11.0, history=baseline)
    assert not normal_res.is_anomaly
    assert normal_res.status == "NORMAL"
    
    # Spike / Anomaly
    spike_res = detector.evaluate(current_value=38.0, history=baseline)
    assert spike_res.is_anomaly
    assert spike_res.status == "ABNORMAL"
    assert spike_res.severity in ["MEDIUM", "HIGH"]
