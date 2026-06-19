from rest_framework import serializers
from .models import User, Session, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar_url']

class SessionSerializer(serializers.ModelSerializer):
    creator_details = UserSerializer(source='creator', read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'creator', 'creator_details', 'title', 'description', 'price', 'date_time', 'created_at']
        read_only_fields = ['creator']

class BookingSerializer(serializers.ModelSerializer):
    # 💡 THE SERALIZER FIX: Injects nested details for both the slot and the customer user profile
    session_details = SessionSerializer(source='session', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'session', 'session_details', 'user', 'user_details', 'booked_at', 'status']
        read_only_fields = ['user']
