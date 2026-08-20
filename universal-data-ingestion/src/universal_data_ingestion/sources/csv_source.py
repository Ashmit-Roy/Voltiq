import csv
import io
from typing import List, Union, Dict, Any
from ..schemas import StandardTelemetry, BatchTelemetryResponse

class CSVSourceParser:
    """Parses CSV formatted telemetry data into normalized telemetry objects."""

    @staticmethod
    def parse_csv_content(
        csv_text: str,
        timestamp_col: str = "timestamp",
        entity_col: str = "location",
        device_col: str = "device",
        value_col: str = "value",
        unit_col: str = "unit"
    ) -> BatchTelemetryResponse:
        reader = csv.DictReader(io.StringIO(csv_text.strip()))
        results: List[StandardTelemetry] = []
        errors: List[Dict[str, Any]] = []
        total = 0

        for row_num, row in enumerate(reader, start=1):
            total += 1
            try:
                entity = row.get(entity_col) or row.get("room_id") or row.get("entity_id") or "UNKNOWN"
                device = row.get(device_col) or row.get("device_id") or row.get("source_id") or "main"
                raw_val = row.get(value_col) or row.get("energy_kwh") or row.get("power_kw") or row.get("val") or 0.0
                value = float(raw_val)
                unit = row.get(unit_col) or row.get("metric_unit") or "kWh"
                ts = row.get(timestamp_col) or row.get("time") or "2026-08-21T00:00:00Z"

                telemetry = StandardTelemetry(
                    timestamp=str(ts),
                    entity_id=str(entity),
                    source_id=str(device),
                    metric_type="energy",
                    value=value,
                    unit=str(unit),
                    source_type="csv",
                    metadata={"row_number": row_num}
                )
                results.append(telemetry)
            except Exception as e:
                errors.append({"row_number": row_num, "error": str(e), "raw_row": row})

        return BatchTelemetryResponse(
            total_records=total,
            successful_records=len(results),
            failed_records=len(errors),
            data=results,
            errors=errors
        )
