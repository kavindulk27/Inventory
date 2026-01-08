from django.urls import path
from .views import DashboardStatsView, SalesReportView

urlpatterns = [
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('sales-report/', SalesReportView.as_view(), name='sales-report'),
]
