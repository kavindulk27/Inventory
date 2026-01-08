from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import InventoryItem, Supplier
from .serializers import InventoryItemSerializer, SupplierSerializer
from django.db.models import Q

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', '')
        status_filter = self.request.query_params.get('status', 'all')
        
        if search_term:
            queryset = queryset.filter(
                Q(name__icontains=search_term) |
                Q(sku__icontains=search_term)
            )
        
        if status_filter == 'low':
            queryset = queryset.filter(quantity__lt=models.F('min_stock_level'))
        elif status_filter == 'in-stock':
            queryset = queryset.filter(quantity__gte=models.F('min_stock_level'))
        
        return queryset

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer