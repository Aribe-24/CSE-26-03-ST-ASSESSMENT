from django.db import models

# Create your models here.
class Video(models.Model):
    QUALITY_CHOICES = [
        ("360p", "360p"),
        ("720p", "720p"),
        ("1080p", "1080p"),
        ("4K", "4K"),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_file = models.FileField(upload_to="videos/")
    thumbnail = models.ImageField(upload_to="thumbnails/")
    quality = models.CharField(max_length=10,choices=QUALITY_CHOICES)
    publishing_date = models.DateField()
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at"]

    def __str__(self): #
        return self.title #This method returns the title of the video when the object is printed or displayed in the admin interface.