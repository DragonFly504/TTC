from django.urls import path
from your_app_name import views  # Replace with your actual app name

urlpatterns = [
    path('', views.track_page, name='track_page'),
    path('<str:tracking_number>/', views.shipment_detail_json, name='shipment_detail_json'),
    path('<str:tracking_number>/location/', views.shipment_location_json, name='shipment_location_json'),
]
