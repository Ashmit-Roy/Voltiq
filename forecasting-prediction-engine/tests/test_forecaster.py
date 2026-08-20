from forecasting_prediction_engine import TimeSeriesForecaster

def test_forecasting():
    forecaster = TimeSeriesForecaster()
    history = [100.0, 110.0, 120.0, 130.0, 140.0]
    result = forecaster.forecast_period(history, remaining_periods=5)
    
    assert result.current_total == 600.0
    assert result.predicted_next_value > 140.0
    assert result.projected_period_total > 600.0
    assert result.trend == "INCREASING"
