from typing import Optional

class CostEngine:
    """Configurable electricity cost calculation engine."""

    def __init__(self, default_rate_per_kwh: float = 8.0):
        self.rate_per_kwh = default_rate_per_kwh

    def calculate_cost(self, energy_kwh: float, custom_rate: Optional[float] = None) -> float:
        rate = custom_rate if custom_rate is not None else self.rate_per_kwh
        return round(energy_kwh * rate, 2)

    def calculate_projected_bill(self, projected_kwh: float, custom_rate: Optional[float] = None) -> float:
        rate = custom_rate if custom_rate is not None else self.rate_per_kwh
        return round(projected_kwh * rate, 2)

cost_engine = CostEngine(default_rate_per_kwh=8.0)
