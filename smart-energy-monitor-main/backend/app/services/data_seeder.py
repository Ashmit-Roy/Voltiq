from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.models.energy import Room, Device, EnergyReading, AnomalyEvent, Alert, Recommendation, SystemConfig
from app.services.cost_engine import cost_engine

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Room).first():
        return

    # 1. Seed System Config
    db.add(SystemConfig(key="rate_per_kwh", value="8.0"))
    db.add(SystemConfig(key="source_mode", value="simulated_iot"))
    db.commit()

    # 2. Seed Rooms
    rooms_data = [
        {"id": "ROOM-101", "name": "Room 101", "floor": "1st Floor", "status": "efficient"},
        {"id": "ROOM-104", "name": "Room 104", "floor": "1st Floor", "status": "efficient"},
        {"id": "ROOM-105", "name": "Room 105", "floor": "1st Floor", "status": "normal"},
        {"id": "ROOM-203", "name": "Room 203", "floor": "2nd Floor", "status": "abnormal"},
        {"id": "ROOM-204", "name": "Room 204", "floor": "2nd Floor", "status": "normal"},
        {"id": "ROOM-301", "name": "Room 301", "floor": "3rd Floor", "status": "normal"},
        {"id": "ROOM-302", "name": "Room 302", "floor": "3rd Floor", "status": "high"},
    ]

    for r in rooms_data:
        db.add(Room(**r))
    db.commit()

    # 3. Seed Devices
    devices_data = [
        {"id": "DEV-AC-101", "name": "Room 101 Air Conditioner", "category": "Air Conditioner", "room_id": "ROOM-101", "nominal_power_w": 1200, "status": "normal"},
        {"id": "DEV-LT-101", "name": "Room 101 Smart LED", "category": "Lighting", "room_id": "ROOM-101", "nominal_power_w": 40, "status": "normal"},
        {"id": "DEV-FN-101", "name": "Room 101 Ceiling Fan", "category": "Fan", "room_id": "ROOM-101", "nominal_power_w": 75, "status": "normal"},

        {"id": "DEV-AC-203", "name": "Room 203 Heavy Duty AC", "category": "Air Conditioner", "room_id": "ROOM-203", "nominal_power_w": 2200, "status": "high"},
        {"id": "DEV-CP-203", "name": "Room 203 Gaming PC Rig", "category": "Computer", "room_id": "ROOM-203", "nominal_power_w": 650, "status": "high"},
        {"id": "DEV-LT-203", "name": "Room 203 Ambient Lights", "category": "Lighting", "room_id": "ROOM-203", "nominal_power_w": 60, "status": "normal"},

        {"id": "DEV-AC-105", "name": "Room 105 Air Conditioner", "category": "Air Conditioner", "room_id": "ROOM-105", "nominal_power_w": 1500, "status": "normal"},
        {"id": "DEV-AC-302", "name": "Room 302 Dual AC Unit", "category": "Air Conditioner", "room_id": "ROOM-302", "nominal_power_w": 1800, "status": "high"},
    ]

    for d in devices_data:
        db.add(Device(**d))
    db.commit()

    # 4. Generate Historical Hourly Readings (past 7 days)
    now = datetime.utcnow()
    readings = []

    for day_offset in range(7, 0, -1):
        for hour in range(0, 24, 2):
            reading_time = now - timedelta(days=day_offset, hours=24 - hour)

            # Room 101 (Efficient)
            readings.append(EnergyReading(
                timestamp=reading_time,
                room_id="ROOM-101",
                device_id="DEV-AC-101",
                energy_kwh=round(random.uniform(0.5, 0.9), 2),
                power_kw=round(random.uniform(0.4, 0.7), 2),
                source="simulated_iot"
            ))

            # Room 105 (Normal)
            readings.append(EnergyReading(
                timestamp=reading_time,
                room_id="ROOM-105",
                device_id="DEV-AC-105",
                energy_kwh=round(random.uniform(1.0, 1.6), 2),
                power_kw=round(random.uniform(0.8, 1.4), 2),
                source="simulated_iot"
            ))

            # Room 203 (Spike / Abnormal overnight usage)
            is_night_spike = (hour <= 6 or hour >= 22) and day_offset <= 2
            ac_kwh = round(random.uniform(3.5, 4.9), 2) if is_night_spike else round(random.uniform(1.8, 2.5), 2)

            readings.append(EnergyReading(
                timestamp=reading_time,
                room_id="ROOM-203",
                device_id="DEV-AC-203",
                energy_kwh=ac_kwh,
                power_kw=round(ac_kwh * 0.85, 2),
                source="simulated_iot"
            ))

            # Room 302 (High load)
            readings.append(EnergyReading(
                timestamp=reading_time,
                room_id="ROOM-302",
                device_id="DEV-AC-302",
                energy_kwh=round(random.uniform(1.5, 2.2), 2),
                power_kw=round(random.uniform(1.2, 1.8), 2),
                source="simulated_iot"
            ))

    db.bulk_save_objects(readings)
    db.commit()

    # 5. Create Core Anomaly for Room 203 (HACQUIRE Demo Scenario)
    anomaly_event = AnomalyEvent(
        timestamp=now - timedelta(minutes=15),
        room_id="ROOM-203",
        device_id="DEV-AC-203",
        actual_value=38.0,
        expected_min=10.0,
        expected_max=15.0,
        deviation_percent=153.0,
        severity="HIGH",
        status="ACTIVE"
    )
    db.add(anomaly_event)

    # 6. Seed Alerts
    alerts = [
        Alert(
            id="ALT-203",
            room_id="ROOM-203",
            title="Severe AC Power Spike",
            message="Room 203 exceeded baseline expected consumption (10-15 kWh) reaching 38.0 kWh (+153% deviation).",
            severity="HIGH",
            actual_value=38.0,
            expected_range="10 - 15 kWh",
            created_at=now - timedelta(minutes=14),
            status="ACTIVE"
        ),
        Alert(
            id="ALT-302",
            room_id="ROOM-302",
            title="Sustained High Demand Load",
            message="Room 302 current load operating at 92% capacity continuously for 4+ hours.",
            severity="MEDIUM",
            actual_value=22.4,
            expected_range="12 - 18 kWh",
            created_at=now - timedelta(hours=2),
            status="ACTIVE"
        ),
        Alert(
            id="ALT-105",
            room_id="ROOM-105",
            title="Idle Power Draw Alert",
            message="Minor standby power leakage detected during unoccupied hours.",
            severity="LOW",
            actual_value=1.8,
            expected_range="0.2 - 0.5 kWh",
            created_at=now - timedelta(hours=8),
            status="RESOLVED"
        )
    ]
    for a in alerts:
        db.add(a)

    # 7. Seed Recommendations (Generated via Acquired Recommendation Engine)
    recomms = [
        Recommendation(
            id="REC-203",
            room_id="ROOM-203",
            title="Prolonged Overnight AC Over-cooling in Room 203",
            description="Room 203 maintains continuous 18°C AC cooling between 12:00 AM and 05:30 AM while ambient temperature is 24°C.",
            suggested_action="Configure automated temperature setback to 24°C after 1:00 AM.",
            potential_savings="₹480 / month",
            severity="WARNING",
            created_at=now - timedelta(minutes=10)
        ),
        Recommendation(
            id="REC-302",
            room_id="ROOM-302",
            title="Peak Demand Tariff Shifting for Room 302",
            description="High-wattage appliances operating concurrently during evening commercial peak hours (6 PM - 10 PM).",
            suggested_action="Stagger heavy appliance operation to off-peak hours.",
            potential_savings="₹220 / month",
            severity="TIP",
            created_at=now - timedelta(hours=5)
        ),
        Recommendation(
            id="REC-101",
            room_id="ROOM-101",
            title="Exemplary Energy Efficiency Benchmark",
            description="Room 101 is consuming 35% less than the hostel floor average.",
            suggested_action="Award Energy Champion recognition on the leaderboard.",
            potential_savings="Optimal Tier",
            severity="TIP",
            created_at=now - timedelta(days=1)
        )
    ]
    for rec in recomms:
        db.add(rec)

    db.commit()
