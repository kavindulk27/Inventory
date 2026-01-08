from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, F, Count
from django.db.models.functions import ExtractHour, TruncDate
from inventory.models import InventoryItem
from supplier.models import Supplier
from sales.models import Sale
from inventory.serializers import InventoryItemSerializer

class DashboardStatsView(APIView):
    def get(self, request):
        total_items = InventoryItem.objects.count()
        low_stock_items_list = InventoryItem.objects.filter(quantity__lte=F('min_stock_level'))
        low_stock_count = low_stock_items_list.count()
        total_suppliers = Supplier.objects.count()
        
        total_value = InventoryItem.objects.aggregate(
            total=Sum(F('quantity') * F('price'))
        )['total'] or 0

        return Response({
            'totalItems': total_items,
            'lowStockItems': low_stock_count,
            'totalSuppliers': total_suppliers,
            'totalInventoryValue': total_value,
            'lowStockItemsList': InventoryItemSerializer(low_stock_items_list, many=True).data
        })

class SalesReportView(APIView):
    def get(self, request):
        period = request.query_params.get('period', 'daily')
        now = timezone.now()
        
        if period == 'daily':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            sales = Sale.objects.filter(date_sold__gte=start_date)
            chart_data = list(sales.annotate(label=ExtractHour('date_sold'))
                              .values('label')
                              .annotate(value=Sum('total_price'))
                              .order_by('label'))
        elif period == 'weekly':
            start_date = now - timedelta(days=7)
            sales = Sale.objects.filter(date_sold__gte=start_date)
            chart_data = list(sales.annotate(label=TruncDate('date_sold'))
                              .values('label')
                              .annotate(value=Sum('total_price'))
                              .order_by('label'))
        elif period == 'monthly':
            start_date = now - timedelta(days=30)
            sales = Sale.objects.filter(date_sold__gte=start_date)
            chart_data = list(sales.annotate(label=TruncDate('date_sold'))
                              .values('label')
                              .annotate(value=Sum('total_price'))
                              .order_by('label'))
        else:
            return Response({'error': 'Invalid period'}, status=status.HTTP_400_BAD_REQUEST)

        summary = sales.aggregate(
            total_sales=Sum('total_price'),
            total_items=Sum('quantity'),
            order_count=Count('id')
        )

        return Response({
            'period': period,
            'summary': summary,
            'chartData': chart_data
        })
