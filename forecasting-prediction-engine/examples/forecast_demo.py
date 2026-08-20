from forecasting_prediction_engine import TimeSeriesForecaster

if __name__ == "__main__":
    forecaster = TimeSeriesForecaster()
    past_days_kwh = [25.4, 28.1, 26.5, 29.0, 31.2, 30.5, 34.0]
    
    projection = forecaster.forecast_period(past_days_kwh, remaining_periods=23)
    print("--- 30-Day Energy Bill Forecast ---")
    print(projection.model_dump_json(indent=2))
    
    # Calculate projected electricity cost at Rs. 8/kWh
    rate = 8.0
    projected_bill = projection.projected_period_total * rate
    print(f"\nEstimated Bill at Rs.{rate}/kWh: Rs.{projected_bill:,.2f}")
