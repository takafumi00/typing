from rest_framework import serializers
from .models import Text, Score


class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ["id", "content", "theme"]


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ["id", "player_name", "wpm", "accuracy", "theme", "created_at"]
        read_only_fields = ["id", "created_at"]


class RankingSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField(read_only=True)

    class Meta:
        model = Score
        fields = ["rank", "player_name", "wpm", "accuracy", "theme", "created_at"]
