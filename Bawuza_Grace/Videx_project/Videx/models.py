from django.db import models

# Create your models here.

class Video(models.Model):
    QUALITY_CHOICES = [
        ('', 'Video Quality'),
        ('360', '360p'),
        ('720', '720p'),
        ('1080', '1080p'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    quality = models.CharField(
        max_length=10,
        choices=QUALITY_CHOICES
    )

    publish_date = models.DateField()

    video_file = models.FileField(
        upload_to='videos/'
    )

    thumbnail = models.ImageField(
        upload_to='thumbnails/'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title