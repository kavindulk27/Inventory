from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/inventory/', include('inventory.urls')),
    path('api/suppliers/', include('supplier.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/sales/', include('sales.urls')),
]


