from app.services.cost_engine import CostEngine

def test_cost_calculation():
    engine = CostEngine(default_rate_per_kwh=8.0)
    
    # 100 kWh @ Rs. 8/kWh = Rs. 800
    assert engine.calculate_cost(100.0) == 800.0
    
    # Custom rate Rs. 10/kWh
    assert engine.calculate_cost(50.0, custom_rate=10.0) == 500.0

def test_bill_projection():
    engine = CostEngine(default_rate_per_kwh=8.0)
    assert engine.calculate_projected_bill(1556.0) == 12448.0
