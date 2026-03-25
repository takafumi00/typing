"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBackendUrl } from "@/lib/backend";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wpm = Number(searchParams.get("wpm") ?? 0);
  const accuracy = Number(searchParams.get("accuracy") ?? 0);
  const theme = searchParams.get("theme") ?? "python";

  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [displayWpm, setDisplayWpm] = useState(0);
  const [displayAcc, setDisplayAcc] = useState(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayWpm(Math.round(eased * wpm));
      setDisplayAcc(Math.round(eased * accuracy));
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [wpm, accuracy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch(`${getBackendUrl()}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: playerName.trim(), wpm, accuracy, theme }),
      });
      setSubmitted(true);
    } catch {
      // fail silently
    } finally {
      setSubmitting(false);
    }
  };

  const grade =
    wpm >= 80 ? "S" : wpm >= 60 ? "A" : wpm >= 40 ? "B" : wpm >= 20 ? "C" : "D";

  const gradeColor =
    grade === "S"
      ? "text-yellow-400"
      : grade === "A"
      ? "text-emerald-400"
      : grade === "B"
      ? "text-blue-400"
      : grade === "C"
      ? "text-zinc-300"
      : "text-zinc-500";

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className={`text-8xl font-black mb-2 ${gradeColor}`}>
            {grade}
          </div>
          <p className="text-zinc-500 text-sm">ランク</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
            <div className="text-5xl font-bold text-white tabular-nums">
              {displayWpm}
            </div>
            <div className="text-zinc-500 text-sm mt-2">WPM</div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
            <div className="text-5xl font-bold text-emerald-400 tabular-nums">
              {displayAcc}%
            </div>
            <div className="text-zinc-500 text-sm mt-2">正確率</div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6">
            <p className="text-zinc-300 font-medium mb-4">スコアを登録する</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="名前を入力"
                maxLength={20}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="submit"
                disabled={!playerName.trim() || submitting}
                className="bg-white text-black font-semibold px-5 py-2 rounded-xl text-sm disabled:opacity-40 hover:bg-zinc-200 transition-colors"
              >
                登録
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6 mb-6 text-center text-emerald-300 text-sm">
            スコアを登録しました！
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/typing?theme=${theme}`)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            もう一度
          </button>
          <Link
            href="/ranking"
            className="flex-1 bg-white hover:bg-zinc-200 text-black font-medium py-3 rounded-xl text-sm transition-colors text-center"
          >
            ランキング
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
          読み込み中...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
