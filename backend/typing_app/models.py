from django.db import models


class Text(models.Model):
    THEME_CHOICES = [
        ("python", "Python"),
        ("javascript", "JavaScript"),
        ("quotes", "名言"),
    ]
    content = models.TextField()
    theme = models.CharField(max_length=20, choices=THEME_CHOICES)

    class Meta:
        db_table = "texts"

    def __str__(self):
        return f"[{self.theme}] {self.content[:40]}"


class Score(models.Model):
    player_name = models.CharField(max_length=50)
    wpm = models.IntegerField()
    accuracy = models.FloatField()
    theme = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scores"
        ordering = ["-wpm", "-accuracy"]

    def __str__(self):
        return f"{self.player_name} - {self.wpm}wpm"
