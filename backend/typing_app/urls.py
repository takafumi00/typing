from django.urls import path
from .views import TextListView, ScoreCreateView, RankingView

urlpatterns = [
    path("texts", TextListView.as_view(), name="texts"),
    path("scores", ScoreCreateView.as_view(), name="scores"),
    path("ranking", RankingView.as_view(), name="ranking"),
]
