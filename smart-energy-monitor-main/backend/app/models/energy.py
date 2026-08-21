from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    floor = Column(String, default="1st Floor")
    capacity = Column(Integer, default=2)
    status = Column(String, default="normal")
    created_at = Column(DateTime, default=datetime.utcnow)

    devices = relationship("Device", back_populates="room")
    readings = relationship("EnergyReading", back_populates="room")
    alerts = relationship("Alert", back_populates="room")
    recommendations = relationship("Recommendation", back_populates="room")

class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    nominal_power_w = Column(Float, default=1000.0)
    status = Column(String, default="normal")

    room = relationship("Room", back_populates="devices")
    readings = relationship("EnergyReading", back_populates="device")

class EnergyReading(Base):
    __tablename__ = "energy_readings"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=True)
    energy_kwh = Column(Float, nullable=False)
    power_kw = Column(Float, nullable=False)
    source = Column(String, default="mock")

    room = relationship("Room", back_populates="readings")
    device = relationship("Device", back_populates="readings")

class AnomalyEvent(Base):
    __tablename__ = "anomaly_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    device_id = Column(String, ForeignKey("devices.id"), nullable=True)
    actual_value = Column(Float, nullable=False)
    expected_min = Column(Float, nullable=False)
    expected_max = Column(Float, nullable=False)
    deviation_percent = Column(Float, nullable=False)
    severity = Column(String, default="HIGH")
    status = Column(String, default="ACTIVE")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String, default="HIGH")
    actual_value = Column(Float, nullable=False)
    expected_range = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="ACTIVE")

    room = relationship("Room", back_populates="alerts")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, index=True)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    suggested_action = Column(Text, nullable=False)
    potential_savings = Column(String, nullable=False)
    severity = Column(String, default="TIP")
    created_at = Column(DateTime, default=datetime.utcnow)

    room = relationship("Room", back_populates="recommendations")

class SystemConfig(Base):
    __tablename__ = "system_configs"

    key = Column(String, primary_key=True)
    value = Column(String, nullable=False)
