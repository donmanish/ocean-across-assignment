from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Session, Booking


class CustomUserAdmin(UserAdmin):
    """
    Extends the default Django User configuration page
    to display your assignment roles and avatar attributes.
    """
    model = User
    list_display = ['username', 'email', 'role', 'is_staff']
    list_filter = ['role', 'is_staff']

    # Injects fields into the visual user editing pane
    fieldsets = UserAdmin.fieldsets + (
        ('Marketplace Role Info', {'fields': ('role', 'avatar_url')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Marketplace Role Info', {'fields': ('role', 'avatar_url')}),
    )


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    """Configures the overview layout dashboard for marketplace sessions."""
    list_display = ['title', 'creator', 'price', 'date_time', 'created_at']
    list_filter = ['date_time', 'created_at']
    search_fields = ['title', 'description']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Configures the overview layout dashboard for session bookings."""
    list_display = ['session', 'user', 'booked_at', 'status']
    list_filter = ['status', 'booked_at']


# Registers the custom User manager panel
admin.site.register(User, CustomUserAdmin)

