from rest_framework import viewsets
from .models import Sale
from .serializers import SaleSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Sum

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        today = timezone.now().date()
        sales_today = self.queryset.filter(date_sold__date=today)
        
        summary = {
            'food': sales_today.filter(inventory_item__category='food').aggregate(total=Sum('quantity'))['total'] or 0,
            'beverage': sales_today.filter(inventory_item__category='beverage').aggregate(total=Sum('quantity'))['total'] or 0,
            'total_revenue': sales_today.aggregate(total=Sum('total_price'))['total'] or 0
        }
        return Response(summary)
