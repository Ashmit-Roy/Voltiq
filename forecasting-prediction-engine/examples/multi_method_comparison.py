from forecasting_prediction_engine import TimeSeriesForecaster

if __name__ == "__main__":
    forecaster = TimeSeriesForecaster()
    
    # 14 days of campus energy telemetry (kWh)
    historical_kwh = [
        110.2, 115.4, 112.0, 118.5, 122.0, 120.4, 125.0,
        123.8, 128.0, 130.5, 129.0, 134.2, 136.0, 138.5
    ]
    
    comparison = forecaster.compare_methods(historical_kwh, remaining_periods=16)
    
    print("==========================================================")
    print("FORECASTING & PREDICTION ENGINE — MULTI-METHOD COMPARISON")
    print("==========================================================")
    print(f"Current Period Total (14 Days): {comparison.linear_trend.current_total:.1f} kWh\n")
    
    print(f"1. Linear Trend Regression:")
    print(f"   - Next Period Value:     {comparison.linear_trend.predicted_next_value} kWh")
    print(f"   - Projected Month Total: {comparison.linear_trend.projected_period_total:.1f} kWh")
    print(f"   - Detected Trend:        {comparison.linear_trend.trend} (+{comparison.linear_trend.growth_rate_percent}%)")
    
    print(f"\n2. Exponential Smoothing (Alpha=0.3):")
    print(f"   - Next Period Value:     {comparison.exponential_smoothing.predicted_next_value} kWh")
    print(f"   - Projected Month Total: {comparison.exponential_smoothing.projected_period_total:.1f} kWh")
    print(f"   - Detected Trend:        {comparison.exponential_smoothing.trend}")
    
    print(f"\n3. Moving Average (Window=5):")
    print(f"   - Next Period Value:     {comparison.moving_average.predicted_next_value} kWh")
    print(f"   - Projected Month Total: {comparison.moving_average.projected_period_total:.1f} kWh")
    
    print(f"\n>>> Recommended Model: {comparison.recommended_method.upper()} <<<")
