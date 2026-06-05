from django.db import models

# Create your models here.


class Video(models.Model):
    QUALITY_CHOICES = [
        ('360p', '360p'),
        ('720p', '720p'),
        ('1080p', '1080p'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    date_of_publishing = models.DateField()
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    views = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title