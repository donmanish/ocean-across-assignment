import os
import requests
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import ScopedRateThrottle, UserRateThrottle

from .models import Session, Booking, User
from .serializers import SessionSerializer, BookingSerializer, UserSerializer
from .permissions import IsCreatorOrReadOnly


# --- EXISTING VIEWSETS FOR SESSIONS & BOOKINGS ---

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().order_by('-created_at')
    serializer_class = SessionSerializer
    permission_classes = [IsCreatorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 💡 THE SMART THROTTLE FIX: Dynamically choose rules based on user actions
    def get_throttles(self):
        # 1. If a student is trying to book (POST), enforce the strict payment spam shield
        if self.request.method == 'POST':
            self.throttle_scope = 'payments'
            return [ScopedRateThrottle()]

        # 2. If a creator or student is just looking at the dashboard (GET),
        # use the standard User limit so they never get a 429 error while viewing data!
        return [UserRateThrottle()]

    def get_queryset(self):
        user = self.request.user
        # If the logged-in profile is a Creator, fetch all platform rows
        if user.role == 'creator':
            return Booking.objects.all().order_by('-booked_at')
        # Standard students can only see their own private entries
        return Booking.objects.filter(user=user).order_by('-booked_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, payment_status='paid')

# --- FIXED OAUTH & JWT ENDPOINT VIEW ---

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([ScopedRateThrottle])
def oauth_callback_view(request):
    """
    Receives an authorization code and a provider string ('google' or 'github') from React.
    Exchanges it securely, fetches profile data, and returns signed JWT tokens.
    """
    request.auth = "oauth"

    provider = request.data.get('provider')
    # The 'access_token' field from frontend carries the temporary code string
    auth_code = request.data.get('access_token')

    if not provider or not auth_code:
        return Response(
            {'error': 'Both provider and access_token fields are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    email = ""
    username = ""
    avatar_url = ""

    # 1. Exchange temporary authorization code with Google or GitHub
    if provider == 'google':
        token_url = 'https://oauth2.googleapis.com/token'

        payload = {
            'code': auth_code,
            'client_id': os.getenv('OAUTH_CLIENT_ID'),
            'client_secret': os.getenv('OAUTH_CLIENT_SECRET'),
            'redirect_uri': 'http://localhost/',
            'grant_type': 'authorization_code'
        }

        token_response = requests.post(token_url, data=payload)

        # print(f"Token response status: ==> {token_response}")

        if token_response.status_code != 200:
            print(f"Google Token Error Log: ==> {token_response.text}")
            return Response(
                {'error': 'Failed to exchange authorization code with Google.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        access_token = token_response.json().get('access_token')

        # --- FIX 2: Point to Google's official user profile details path ---
        google_userinfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
        response = requests.get(
            google_userinfo_url,
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if response.status_code == 200:
            data = response.json()
            email = data.get('email', '')
            # Get clean username string prefix from email (e.g. 'john' from 'john@gmail.com')
            username = email.split('@')[0] if email else 'google_user'
            avatar_url = data.get('picture', '')

    elif provider == 'github':
        # --- FIX 3: Point to GitHub's official profile lookup endpoint ---
        github_userinfo_url = 'https://github.com'
        response = requests.get(
            github_userinfo_url,
            headers={'Authorization': f'token {auth_code}'}
        )
        if response.status_code == 200:
            data = response.json()
            username = data.get('login', 'github_user')
            email = data.get('email') or f"{username}@github.local"
            avatar_url = data.get('avatar_url', '')

    # Stop if we couldn't fetch data from the provider
    if not email and not username:
        return Response(
            {'error': 'Invalid token or authentication failed with provider.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # 2. Get or create the user profile inside your PostgreSQL DB
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'username': username,
            'avatar_url': avatar_url,
            'role': 'user'  # Assignment requirement: Default role is always user
        }
    )

    # 3. Create secure backend JWT tokens for the frontend client
    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'avatar_url': user.avatar_url
        }
    }, status=status.HTTP_200_OK)




@api_view(['PATCH', 'POST'])  # 💡 ALLOWS 'POST' AS A FALLBACK TO PREVENT CORS/METHOD CLASHES
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """
    Accepts partial updates (username, avatar_url) for the authenticated user,
    saves the row into PostgreSQL, and returns the fresh user profile data matrix.
    """
    try:
        user = request.user
        data = request.data



        # Update username string row if provided cleanly
        if 'username' in data and data['username'].strip():
            user.username = data['username'].strip()

        # Update avatar url string row if provided cleanly
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url'].strip()

        # Save updates straight into your PostgreSQL database container volume
        user.save()


        return Response({
            'message': '🎉 Profile updated successfully!',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'avatar_url': user.avatar_url
            }
        }, status=status.HTTP_200_OK)

    except Exception as error:
        # 🔍 CRITICAL ERROR LOGGER: Captures the exact reason for the server crash
        print(f"❌ CRITICAL PROFILE VIEW ERROR: {str(error)}")
        return Response({
            'error': 'Internal Database Transaction Failed',
            'details': str(error)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

