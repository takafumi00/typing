import random
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Text, Score
from .serializers import TextSerializer, ScoreSerializer, RankingSerializer


class TextListView(APIView):
    def get(self, request):
        theme = request.query_params.get("theme")
        qs = Text.objects.all()
        if theme:
            qs = qs.filter(theme=theme)
        texts = list(qs)
        if texts:
            text = random.choice(texts)
            return Response(TextSerializer(text).data)
        return Response({"detail": "No texts found."}, status=status.HTTP_404_NOT_FOUND)


class ScoreCreateView(generics.CreateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer


class RankingView(APIView):
    def get(self, request):
        theme = request.query_params.get("theme")
        qs = Score.objects.all()
        if theme:
            qs = qs.filter(theme=theme)
        qs = qs.order_by("-wpm", "-accuracy")[:20]
        data = []
        for i, score in enumerate(qs, start=1):
            item = RankingSerializer(score).data
            item["rank"] = i
            data.append(item)
        return Response(data)
