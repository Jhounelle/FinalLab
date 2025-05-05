from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeProductViewSet, 
    CustomerProductViewSet, 
    PublicProductViewSet, 
    UserRegistrationView,
    CustomAuthToken,
    AdminOrderViewSet,
    CustomerOrderViewSet
)

router = DefaultRouter()
router.register(r'employee/products', EmployeeProductViewSet, basename='employee-products')
router.register(r'customer/products', CustomerProductViewSet, basename='customer-products')
router.register(r'public/products', PublicProductViewSet, basename='public-products')
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-orders')
router.register(r'customer/orders', CustomerOrderViewSet, basename='customer-orders')

urlpatterns = [
    path('api/token/', CustomAuthToken.as_view(), name='custom_token_auth'),
    path('api/register/', UserRegistrationView.as_view(), name='user_registration'),
    path('api/', include(router.urls)),
]
