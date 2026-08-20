from typing import Optional, Tuple

class RuleBasedAnomalyEvaluator:
    """Evaluates fixed hard thresholds and percentage surge bounds."""

    @staticmethod
    def evaluate_hard_limit(value: float, max_limit: Optional[float] = None, min_limit: Optional[float] = None) -> Tuple[bool, str]:
        if max_limit is not None and value > max_limit:
            return True, f"Value {value} exceeded maximum hard limit ({max_limit})."
        if min_limit is not None and value < min_limit:
            return True, f"Value {value} dropped below minimum limit ({min_limit})."
        return False, "Within acceptable threshold range."

    @staticmethod
    def evaluate_percentage_surge(current_value: float, baseline_mean: float, surge_multiplier: float = 1.5) -> Tuple[bool, float]:
        if baseline_mean <= 0:
            return False, 0.0
        deviation_pct = ((current_value - baseline_mean) / baseline_mean) * 100.0
        is_surge = current_value > (baseline_mean * surge_multiplier)
        return is_surge, deviation_pct
