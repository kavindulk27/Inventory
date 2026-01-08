from django.db import models
from inventory.models import InventoryItem

class Sale(models.Model):
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='sales')
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    date_sold = models.DateTimeField(auto_now_add=True)

    @property
    def category(self):
        return self.inventory_item.category

    def __str__(self):
        return f"Sale: {self.inventory_item.name} x {self.quantity} on {self.date_sold.date()}"
