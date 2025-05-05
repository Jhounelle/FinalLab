from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from .models import Product, UserProfile, Order, OrderItem
from .serializers import ProductSerializer, OrderSerializer, OrderItemSerializer
from .permissions import IsEmployee, IsCustomerReadOnly
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework.decorators import action

User = get_user_model()

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    @transaction.atomic
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('firstName', '')
        last_name = request.data.get('lastName', '')
        location = request.data.get('location', '')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        
        profile = UserProfile.objects.create(
            user=user,
            is_customer=True,  
            location=location
        )
        
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'role': 'customer',
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'location': profile.location
        }, status=status.HTTP_201_CREATED)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        
        
        role = 'admin' if user.is_staff else 'customer'
        
        return Response({
            'token': token.key,
            'role': role
        })
    

class EmployeeProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsEmployee]
    
    def create(self, request, *args, **kwargs):
        print("\n----- DEBUG: PRODUCT CREATION -----")
        print("Request data type:", type(request.data))
        print("Request data:", request.data)
        
        
        try:
            data = request.data.copy()
            if 'price' in data and not isinstance(data['price'], (int, float)):
                print(f"Converting price from {type(data['price'])} to float")
                data['price'] = float(data['price'])
                
            if 'stock' in data and not isinstance(data['stock'], int):
                print(f"Converting stock from {type(data['stock'])} to int")
                data['stock'] = int(data['stock'])
                
            serializer = self.get_serializer(data=data)
            
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print("Exception during product creation:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def check_ordered(self, request, pk=None):
        """Check if a product has been ordered"""
        product = self.get_object()
        in_orders = OrderItem.objects.filter(product=product).exists()
        return Response({'in_orders': in_orders})
        
    def destroy(self, request, *args, **kwargs):
        """Override delete to prevent deletion of products in orders"""
        product = self.get_object()
        
        
        if OrderItem.objects.filter(product=product).exists():
            return Response(
                {"detail": "This product cannot be deleted because it has been ordered by customers."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
      
        return super().destroy(request, *args, **kwargs)


class CustomerProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsCustomerReadOnly]


class PublicProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsEmployee]

class CustomerOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        print("\n----- DEBUG: ORDER CREATION -----")
        print("Request data:", request.data)
        
        
        data = request.data.copy()
        
        
        required_fields = ['full_name', 'email', 'address', 'phone', 'total_amount']
        for field in required_fields:
            if field not in data:
                return Response(
                    {field: ["This field is required."]}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        
        if 'order_items' not in data or not data['order_items']:
            return Response(
                {'order_items': ["At least one order item is required."]},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            for item_data in data['order_items']:
                if not all(k in item_data for k in ['product', 'quantity', 'price']):
                    return Response(
                        {'order_items': ["Each order item must have product, quantity, and price."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                try:
                    product_id = int(item_data['product'])
                    product = Product.objects.get(id=product_id)
                except (ValueError, TypeError):
                    return Response(
                        {'order_items': ["Product ID must be a valid integer."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                except Product.DoesNotExist:
                    return Response(
                        {'order_items': [f"Product with ID {product_id} does not exist."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                try:
                    quantity = int(item_data['quantity'])
                    if quantity <= 0:
                        return Response(
                            {'order_items': ["Quantity must be greater than zero."]},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except (ValueError, TypeError):
                    return Response(
                        {'order_items': ["Quantity must be a valid integer."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if product.stock < quantity:
                    return Response(
                        {'non_field_errors': [f"Product '{product.name}' has insufficient stock. Available: {product.stock}, requested: {quantity}"]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                try:
                    price = float(item_data['price'])
                    if price <= 0:
                        return Response(
                            {'order_items': ["Price must be greater than zero."]},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except (ValueError, TypeError):
                    return Response(
                        {'order_items': ["Price must be a valid number."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            order_data = {
                'full_name': data['full_name'],
                'email': data['email'],
                'address': data['address'],
                'phone': data['phone'],
                'total_amount': data['total_amount'],
                'status': 'pending'
            }
            
            order = Order.objects.create(
                user=request.user,
                **order_data
            )
            
            for item_data in data['order_items']:
                product_id = int(item_data['product'])
                product = Product.objects.get(id=product_id)
                quantity = int(item_data['quantity'])
                price = float(item_data['price'])
                
                product.stock -= quantity
                product.save()
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=price
                )
            
            serializer = self.get_serializer(order)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            print("Exception during order creation:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)