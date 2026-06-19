from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, BookingViewSet , oauth_callback_view, update_profile_view


router = DefaultRouter()
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/oauth/', oauth_callback_view, name='oauth_callback'),
    path('auth/profile/update/', update_profile_view, name='profile_update')
]
