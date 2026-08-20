from forecasting_prediction_engine import LinearTrendForecast, MovingAverageForecast, ExponentialSmoothingForecast

def test_linear_trend():
    history = [10.0, 20.0, 30.0, 40.0]
    res = LinearTrendForecast.forecast(history, remaining_periods=2)
    assert res.current_total == 100.0
    assert res.predicted_next_value == 50.0
    assert res.projected_period_total == 210.0
    assert res.trend == "INCREASING"

def test_moving_average():
    history = [10.0, 10.0, 10.0, 10.0]
    res = MovingAverageForecast.forecast(history, remaining_periods=2)
    assert res.current_total == 40.0
    assert res.predicted_next_value == 10.0
    assert res.projected_period_total == 60.0
    assert res.trend == "STABLE"

def test_exponential_smoothing():
    history = [15.0, 15.0, 15.0, 15.0]
    res = ExponentialSmoothingForecast.forecast(history, remaining_periods=3)
    assert res.current_total == 60.0
    assert round(res.predicted_next_value, 1) == 15.0
    assert round(res.projected_period_total, 1) == 105.0
