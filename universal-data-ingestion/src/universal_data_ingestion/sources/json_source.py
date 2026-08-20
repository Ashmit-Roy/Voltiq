import json
from typing import List, Dict, Any, Union
from ..schemas import StandardTelemetry, BatchTelemetryResponse

class JSONSourceParser:
    """Parses JSON dictionaries or batch arrays into normalized telemetry objects."""

    @staticmethod
    def parse_payload(payload: Union[str, Dict[str, Any], List[Dict[str, Any]]], source_type: str = "json_api") -> BatchTelemetryResponse:
        if isinstance(payload, str):
            data = json.loads(payload)
        else:
            data = payload

        if isinstance(data, dict):
            items = [data]
        elif isinstance(data, list):
            items = data
        else:
            raise ValueError("Unsupported JSON structure: Expected dict or list of dicts.")

        results: List[StandardTelemetry] = []
        errors: List[Dict[str, Any]] = []

        for idx, item in enumerate(items):
            try:
                entity = item.get("entity_id") or item.get("location") or item.get("room_id") or item.get("room") or "UNKNOWN"
                device = item.get("source_id") or item.get("device") or item.get("device_id") or "main"
                val = float(item.get("value") if item.get("value") is not None else (item.get("energy_kwh") or item.get("power_kw") or 0.0))
                unit = item.get("unit") or "kWh"
                ts = item.get("timestamp") or item.get("time") or "2026-08-21T00:00:00Z"
                metric = item.get("metric") or item.get("metric_type") or "energy"

                telemetry = StandardTelemetry(
                    timestamp=str(ts),
                    entity_id=str(entity),
                    source_id=str(device),
                    metric_type=str(metric),
                    value=val,
                    unit=str(unit),
                    source_type=source_type,
                    metadata=item.get("metadata", {})
                )
                results.append(telemetry)
            except Exception as e:
                errors.append({"index": idx, "error": str(e), "raw_item": item})

        return BatchTelemetryResponse(
            total_records=len(items),
            successful_records=len(results),
            failed_records=len(errors),
            data=results,
            errors=errors
        )
