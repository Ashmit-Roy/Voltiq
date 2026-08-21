from typing import Dict, Any

class AcquiredNotificationService:
    """Adapter for HACQUIRE Purchased Notification Service (BUY #1)."""
    
    def __init__(self, channel: str = "in_app"):
        self.channel = channel

    def dispatch_alert(self, title: str, message: str, severity: str, entity_id: str) -> Dict[str, Any]:
        return {
            "status": "DELIVERED",
            "channel": self.channel,
            "title": title,
            "severity": severity,
            "entity_id": entity_id,
            "provider": "AcquiredAlertService_v1"
        }

class AcquiredRecommendationEngine:
    """Adapter for HACQUIRE Purchased Recommendation Engine (BUY #2)."""

    def generate_savings_recommendation(self, room_id: str, current_kwh: float, anomaly_detected: bool) -> Dict[str, Any]:
        if anomaly_detected or current_kwh > 200:
            return {
                "title": f"Excessive AC Operation in {room_id}",
                "description": f"{room_id} has exceeded normal baseline consumption by over 50%. Prolonged high cooling load detected.",
                "suggested_action": "Adjust AC thermostat to 24°C and ensure doors/windows are sealed.",
                "potential_savings": "₹450 / month",
                "severity": "WARNING"
            }
        elif current_kwh > 150:
            return {
                "title": f"Moderate Load Optimization in {room_id}",
                "description": "Continuous baseline consumption detected during low-occupancy daytime hours.",
                "suggested_action": "Enable smart sleep timer on entertainment & computing devices.",
                "potential_savings": "₹180 / month",
                "severity": "TIP"
            }
        else:
            return {
                "title": f"Energy Star Efficiency Maintained in {room_id}",
                "description": "Consumption is within the top 20% most efficient tier across the facility.",
                "suggested_action": "Maintain current usage schedule.",
                "potential_savings": "Top Tier (Optimal)",
                "severity": "TIP"
            }

notification_service_adapter = AcquiredNotificationService()
recommendation_engine_adapter = AcquiredRecommendationEngine()
