import sys
import os
from typing import Dict, Any, List

# Add sibling directories to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_root = os.path.abspath(os.path.join(current_dir, "../../../../"))

for repo_name in ["universal-data-ingestion", "anomaly-detection-engine", "forecasting-prediction-engine"]:
    src_path = os.path.join(workspace_root, repo_name, "src")
    if os.path.exists(src_path) and src_path not in sys.path:
        sys.path.insert(0, src_path)

# Import Tradable Modules
from universal_data_ingestion import DataNormalizer, StandardTelemetry
from anomaly_detection_engine import AnomalyDetector, AnomalyResult
from forecasting_prediction_engine import TimeSeriesForecaster, ForecastResult

normalizer_adapter = DataNormalizer()
anomaly_detector_adapter = AnomalyDetector(z_score_threshold=2.0)
forecaster_adapter = TimeSeriesForecaster()
