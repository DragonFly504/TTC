
class Shipment(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("in_transit", "In Transit"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
    ]

    tracking_number = models.CharField(max_length=32, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="created")

    origin = models.CharField(max_length=255, blank=True)
    destination = models.CharField(max_length=255, blank=True)

    origin_lat = models.FloatField(null=True, blank=True)
    origin_lng = models.FloatField(null=True, blank=True)
    dest_lat = models.FloatField(null=True, blank=True)
    dest_lng = models.FloatField(null=True, blank=True)

    current_lat = models.FloatField(null=True, blank=True)
    current_lng = models.FloatField(null=True, blank=True)

    estimated_delivery = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Shipment {self.tracking_number} ({self.status})"

    def is_delivered(self):
        return self.status == "delivered"

    def progress_percentage(self):
        """Calculate progress based on status."""
        status_order = ["created", "in_transit", "out_for_delivery", "delivered"]
        return (status_order.index(self.status) + 1) / len(status_order) * 100


class ShipmentEvent(models.Model):
    shipment = models.ForeignKey(Shipment, related_name="events", on_delete=models.CASCADE)
    status = models.CharField(max_length=64)
    notes = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.status} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


