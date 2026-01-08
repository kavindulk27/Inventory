from rest_framework import serializers
from .models import InventoryItem
from supplier.serializers import SupplierSerializer

class InventoryItemSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = InventoryItem
        fields = '__all__'
