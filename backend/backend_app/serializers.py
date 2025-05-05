from rest_framework import serializers
from .models import Product, Order, OrderItem
from django.db import transaction

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
    def validate_price(self, value):
        """
        Validate that price is positive
        """
        try:
            # Convert to float in case we got a string
            if isinstance(value, str):
                value = float(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Price must be a valid number")
            
        if value <= 0:
            raise serializers.ValidationError("Price must be positive")
        return value
    
    def validate_stock(self, value):
        """
        Validate that stock is non-negative
        """
        try:
            # Convert to int in case we got a string
            if isinstance(value, str):
                value = int(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Stock must be a valid integer")
            
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value
        
    def validate(self, data):
        """
        Additional cross-field validations if needed
        """
        return data

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
        
    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.SerializerMethodField()
    
    # Fields for creating order items when creating the order
    order_items = OrderItemCreateSerializer(many=True, write_only=True, required=False)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'full_name', 'email', 'address', 'phone', 
            'total_amount', 'status', 'status_display', 'created_at', 
            'items', 'order_items'
        ]
        read_only_fields = ['user']
        
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    @transaction.atomic
    def create(self, validated_data):
        # Extract order items data
        order_items_data = validated_data.pop('order_items', [])
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Process each order item
        for item_data in order_items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            # Check stock
            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Product '{product.name}' has insufficient stock. Available: {product.stock}, requested: {quantity}"
                )
            
            # Reduce product stock
            product.stock -= quantity
            product.save()
            
            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=item_data['price']
            )
            
        return order
