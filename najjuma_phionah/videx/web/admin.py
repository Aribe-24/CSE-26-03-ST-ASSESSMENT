from django.contrib import admin

from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'quality', 'publishing_date', 'created_at')
    list_filter = ('quality', 'publishing_date')
    search_fields = ('title', 'description')
