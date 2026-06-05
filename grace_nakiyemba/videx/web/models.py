from django.db import models

QUALITY_CHOICES = [
    ('360p', '360p'),
    ('720p', '720p'),
    ('1080p', '1080p'),
]

class Video(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()  # No longer blank=True
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/')
    quality = models.CharField(max_length=10, choices=QUALITY_CHOICES, default='720p')
    publish_date = models.DateField(null=True, blank=True)
    views = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title