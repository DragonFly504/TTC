from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Shipment

def track_page(request):
    # Renders the tracking page with map and timeline
    return render(request, "track.html")

def shipment_detail_json(request, tracking_number):
    # Returns full shipment details as JSON
    shipment = get_object_or_404(Shipment, tracking_number=tracking_number)
    data = {
        "tracking_number": shipment.tracking_number,
        "origin_lat": shipment.origin_lat,
        "origin_lng": shipment.origin_lng,
        "dest_lat": shipment.dest_lat,
        "dest_lng": shipment.dest_lng,
        "current_lat": shipment.current_lat,
        "current_lng": shipment.current_lng,
        "status": shipment.status,
        "estimated_delivery": shipment.estimated_delivery.strftime("%Y-%m-%d %H:%M"),
        "events": [
            {
                "status": e.status,
                "timestamp": e.timestamp.strftime("%Y-%m-%d %H:%M")
            }
            for e in shipment.events.all()
        ]
    }
    return JsonResponse(data)

def shipment_location_json(request, tracking_number):
    # Returns only current location and status as JSON
    shipment = get_object_or_404(Shipment, tracking_number=tracking_number)
    data = {
        "current_lat": shipment.current_lat,
        "current_lng": shipment.current_lng,
        "status": shipment.status
    }
    return JsonResponse(data)
