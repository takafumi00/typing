"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBackendUrl } from "@/lib/backend";

type ScoreEntry = {
  rank: number;
  player_name: string;
  wpm: number;
  accuracy: number;
  theme: string;
  created_at: string;
};

const themeLabels: Record<string, string> = {
  python: "Python",
  javascript: "JavaScript",
  quotes: "名言",
};

const themes = [
  { id: "", label: "全て" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "quotes", label: "名言" },
];

function RankingContent() {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") ?? "";

  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = theme ? `${getBackendUrl()}/api/ranking?theme=${theme}` : `${getBackendUrl()}/api/ranking`;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => setScores(data))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [theme]);

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← ホーム
          </Link>
          <h1 className="text-white font-bold text-2xl">ランキング</h1>
          <div className="w-16" />
        </div>

        <div className="flex gap-2 mb-6">
          {themes.map((t) => (
            <Link
              key={t.id || "all"}
              href={t.id ? `/ranking?theme=${t.id}` : "/ranking"}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                theme === t.id
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-zinc-600 py-20">読み込み中...</div>
        ) : scores.length === 0 ? (
          <div className="text-center text-zinc-600 py-20">
            まだスコアがありません
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((score) => (
              <div
                key={`${score.rank}-${score.player_name}`}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4"
              >
                <div
                  className={`text-2xl font-black w-8 text-center tabular-nums ${
                    score.rank === 1
                      ? "text-yellow-400"
                      : score.rank === 2
                      ? "text-zinc-300"
                      : score.rank === 3
                      ? "text-amber-600"
                      : "text-zinc-600"
                  }`}
                >
                  {score.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {score.player_name}
                  </div>
                  <div className="text-zinc-500 text-xs mt-0.5">
                    {themeLabels[score.theme] ?? score.theme}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold tabular-nums">
                    {score.wpm}{" "}
                    <span className="text-zinc-500 font-normal text-sm">WPM</span>
                  </div>
                  <div className="text-emerald-400 text-sm tabular-nums">
                    {score.accuracy}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RankingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
          読み込み中...
        </div>
      }
    >
      <RankingContent />
    </Suspense>
  );
}
