from rest_framework.views import APIView
from rest_framework.response import Response
from inventory.models import InventoryItem
from supplier.models import Supplier
from orders.models import Order
from django.db.models import Sum, F

class DashboardStatsView(APIView):
    def get(self, request):
        total_items = InventoryItem.objects.count()
        low_stock_items = InventoryItem.objects.filter(quantity__lte=F('min_stock_level')).count()
        total_suppliers = Supplier.objects.count()
        total_inventory_value = InventoryItem.objects.aggregate(total=Sum(F('quantity') * F('price')))['total'] or 0
        
        # Monthly orders (simple count for now)
        recent_orders_count = Order.objects.count()

        # Low stock items list
        low_stock_list = InventoryItem.objects.filter(quantity__lte=F('min_stock_level'))
        low_stock_items_data = [
            {
                'id': item.id,
                'name': item.name,
                'sku': item.sku,
                'quantity': item.quantity,
                'minStockLevel': item.min_stock_level,
                'unit': item.unit,
                'price': float(item.price),
                'category': item.category
            } for item in low_stock_list
        ]

        data = {
            'totalItems': total_items,
            'lowStockItems': low_stock_items,
            'totalSuppliers': total_suppliers,
            'totalInventoryValue': float(total_inventory_value),
            'recentOrdersCount': recent_orders_count,
            'lowStockItemsList': low_stock_items_data
        }
        return Response(data)
