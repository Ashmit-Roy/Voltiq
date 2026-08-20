import random
from datetime import datetime, timedelta
from typing import List, Generator
from ..schemas import StandardTelemetry

class MockStreamGenerator:
    """Generates continuous realistic telemetry streams with controllable spike injection."""

    def __init__(self, entities: List[str] = None):
        self.entities = entities or ["ROOM-101", "ROOM-105", "ROOM-203", "ROOM-302"]

    def generate_reading(
        self,
        entity_id: str,
        base_value: float = 2.0,
        inject_anomaly: bool = False,
        anomaly_multiplier: float = 3.5
    ) -> StandardTelemetry:
        noise = random.uniform(-0.3, 0.4)
        val = base_value + noise
        if inject_anomaly:
            val = val * anomaly_multiplier

        return StandardTelemetry(
            timestamp=datetime.utcnow().isoformat() + "Z",
            entity_id=entity_id,
            source_id="mock_sensor_01",
            metric_type="energy",
            value=round(max(0.1, val), 2),
            unit="kWh",
            source_type="mock_stream",
            metadata={"is_injected_anomaly": inject_anomaly}
        )

    def stream(self, count: int = 10, inject_at_index: int = -1) -> Generator[StandardTelemetry, None, None]:
        for i in range(count):
            entity = random.choice(self.entities)
            is_anomaly = (i == inject_at_index)
            yield self.generate_reading(entity_id=entity, inject_anomaly=is_anomaly)
