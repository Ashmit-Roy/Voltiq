from anomaly_detection_engine import RuleBasedAnomalyEvaluator

def test_rule_evaluator():
    # Hard limit test
    is_anomaly, msg = RuleBasedAnomalyEvaluator.evaluate_hard_limit(55.0, max_limit=50.0)
    assert is_anomaly
    
    # Normal value
    is_anomaly_norm, _ = RuleBasedAnomalyEvaluator.evaluate_hard_limit(42.0, max_limit=50.0)
    assert not is_anomaly_norm

    # Percentage surge test
    is_surge, dev_pct = RuleBasedAnomalyEvaluator.evaluate_percentage_surge(30.0, baseline_mean=10.0, surge_multiplier=1.5)
    assert is_surge
    assert dev_pct == 200.0
