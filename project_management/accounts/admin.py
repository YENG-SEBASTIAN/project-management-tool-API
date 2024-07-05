from django.contrib import admin
from accounts.models import User
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'date_joined']
    search_fields = ['username', 'email']
    list_filter = ['date_joined']