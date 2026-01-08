from rest_framework import serializers
from .models import Sale
from inventory.serializers import InventoryItemSerializer

class SaleSerializer(serializers.ModelSerializer):
    item_details = InventoryItemSerializer(source='inventory_item', read_only=True)
    category = serializers.ReadOnlyField()

    class Meta:
        model = Sale
        fields = ['id', 'inventory_item', 'item_details', 'quantity', 'total_price', 'category', 'date_sold']

    def create(self, validated_data):
        item = validated_data['inventory_item']
        quantity = validated_data['quantity']
        
        # Deduct from inventory
        item.quantity -= quantity
        item.save()
        
        return super().create(validated_data)
