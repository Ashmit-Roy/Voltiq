from typing import List, Optional, Union
from .models import AnomalyResult, BatchAnomalyReport, TimeSeriesPoint
from .statistical import StatisticalAnomalyEvaluator
from .rules import RuleBasedAnomalyEvaluator

class AnomalyDetector:
    """
    Plug-and-Play Anomaly Detection Engine (HACQUIRE SELL #2).
    Evaluates streaming and historical numerical series using combined
    statistical dispersion (Z-Score) and threshold surge algorithms.
    """

    def __init__(
        self,
        z_score_threshold: float = 2.0,
        surge_multiplier: float = 1.5,
        max_hard_limit: Optional[float] = None,
        min_hard_limit: Optional[float] = None
    ):
        self.z_score_threshold = z_score_threshold
        self.surge_multiplier = surge_multiplier
        self.max_hard_limit = max_hard_limit
        self.min_hard_limit = min_hard_limit

    def evaluate(self, current_value: float, history: List[float]) -> AnomalyResult:
        """Evaluates a single data point against a historical baseline."""
        if not history:
            return AnomalyResult(
                is_anomaly=False,
                status="NORMAL",
                actual_value=round(current_value, 2),
                expected_min=round(current_value, 2),
                expected_max=round(current_value, 2),
                deviation_percent=0.0,
                severity="NONE",
                method_used="baseline_empty",
                message="No baseline history provided."
            )

        # 1. Statistical bounds
        mean_val, std_val, exp_min, exp_max = StatisticalAnomalyEvaluator.calculate_bounds(
            history, z_threshold=self.z_score_threshold
        )
        z_score = StatisticalAnomalyEvaluator.compute_z_score(current_value, mean_val, std_val)

        # 2. Rule evaluation
        is_hard_limit, hard_msg = RuleBasedAnomalyEvaluator.evaluate_hard_limit(
            current_value, self.max_hard_limit, self.min_hard_limit
        )
        is_surge, deviation_pct = RuleBasedAnomalyEvaluator.evaluate_percentage_surge(
            current_value, mean_val, self.surge_multiplier
        )

        is_abnormal = False
        method_used = "statistical_z_score"
        severity = "NONE"

        if is_hard_limit:
            is_abnormal = True
            method_used = "rule_hard_limit"
            severity = "CRITICAL"
        elif abs(z_score) >= self.z_score_threshold or current_value > exp_max:
            is_abnormal = True
            method_used = "statistical_z_score"
        elif is_surge and current_value > 2.0:
            is_abnormal = True
            method_used = "percentage_surge"

        if is_abnormal and severity != "CRITICAL":
            if deviation_pct > 120 or current_value > exp_max * 1.8:
                severity = "HIGH"
            elif deviation_pct > 50:
                severity = "MEDIUM"
            else:
                severity = "LOW"

        msg = (
            f"Abnormal spike detected (+{round(deviation_pct, 1)}% deviation from expected range {round(exp_min, 1)}-{round(exp_max, 1)})."
            if is_abnormal
            else "Consumption reading within expected baseline."
        )

        return AnomalyResult(
            is_anomaly=is_abnormal,
            status="ABNORMAL" if is_abnormal else "NORMAL",
            actual_value=round(current_value, 2),
            expected_min=round(exp_min, 2),
            expected_max=round(exp_max, 2),
            deviation_percent=round(deviation_pct, 1),
            severity=severity,
            method_used=method_used,
            message=msg
        )

    def evaluate_batch(self, series: List[float], window_size: int = 5) -> BatchAnomalyReport:
        """Evaluates a batch time-series using a sliding window baseline."""
        results: List[AnomalyResult] = []
        anomalous_indices: List[int] = []

        for idx, val in enumerate(series):
            history = series[max(0, idx - window_size):idx] if idx > 0 else [val]
            res = self.evaluate(val, history)
            results.append(res)
            if res.is_anomaly:
                anomalous_indices.append(idx)

        return BatchAnomalyReport(
            total_analyzed=len(series),
            anomalies_detected=len(anomalous_indices),
            anomalous_indices=anomalous_indices,
            results=results
        )
