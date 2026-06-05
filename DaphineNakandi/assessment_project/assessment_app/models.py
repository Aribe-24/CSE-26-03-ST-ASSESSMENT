from django.db import models

# Create your models here.
class Video(models.Model):
    VIDEO_QUALITY_CHOICES = [
        ("360p", "360p"),
        ("720p", "720p"),
        ("1080p", "1080p"),
        ("4K", "4K"),
    ]
    video_title = models.CharField(max_length=255)
    description = models.TextField()
    video_quality = models.CharField(max_length=10, choices=VIDEO_QUALITY_CHOICES)
    date_of_publish = models.DateField()
    video_file = models.FileField(upload_to="videos/")
    thumbnail = models.ImageField(upload_to="thumbnails/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.video_title