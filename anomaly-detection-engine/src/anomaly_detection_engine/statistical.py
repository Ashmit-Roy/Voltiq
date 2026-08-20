from typing import List, Tuple
import numpy as np

class StatisticalAnomalyEvaluator:
    """Computes statistical dispersion and Z-score outlier boundaries."""

    @staticmethod
    def calculate_bounds(history: List[float], z_threshold: float = 2.0) -> Tuple[float, float, float, float]:
        if not history:
            return 0.0, 0.0, 0.0, 0.0

        arr = np.array(history, dtype=float)
        mean_val = float(np.mean(arr))
        std_val = float(np.std(arr)) if len(arr) > 1 else 0.0

        spread = z_threshold * (std_val if std_val > 0 else 0.2 * mean_val)
        expected_min = max(0.0, mean_val - spread)
        expected_max = mean_val + spread

        return mean_val, std_val, expected_min, expected_max

    @staticmethod
    def compute_z_score(value: float, mean_val: float, std_val: float) -> float:
        if std_val == 0.0:
            return 0.0
        return (value - mean_val) / std_val
