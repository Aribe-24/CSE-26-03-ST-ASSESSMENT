from django.db import models
from django.utils import timezone

# Create your models here.
class VideoUpload(models.Model):
    # Added video quality options here
    QUALITY_CHOICES = [
        ('360p', '360p'),
        ('480p', '480p'),
        ('720p', '720p (HD)'),
        ('1080p', '1080p (Full HD)'),
        ('2k', '2K'),
        ('4k', '4K (Ultra HD)'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    date_of_publishing = models.DateField(default=timezone.now)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/')

    def __str__(self):
        return self.title