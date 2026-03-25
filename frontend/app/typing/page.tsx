"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBackendUrl } from "@/lib/backend";

type TextData = {
  id: number;
  content: string;
  theme: string;
};

function TypingGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") ?? "python";

  const [text, setText] = useState<TextData | null>(null);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`${getBackendUrl()}/api/texts?theme=${theme}`)
      .then((r) => r.json())
      .then((data) => setText(data))
      .catch(() => setError(true));
  }, [theme]);

  useEffect(() => {
    if (text) inputRef.current?.focus();
  }, [text]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished || !text) return;
    const value = e.target.value;

    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    setTyped(value);

    if (value === text.content) {
      setFinished(true);
      const elapsed = (Date.now() - (startTime ?? Date.now())) / 1000 / 60;
      const wordCount = text.content.trim().split(/\s+/).length;
      const wpm = Math.round(wordCount / Math.max(elapsed, 0.001));

      let correct = 0;
      for (let i = 0; i < text.content.length; i++) {
        if (value[i] === text.content[i]) correct++;
      }
      const accuracy = Math.round((correct / text.content.length) * 100);

      router.push(
        `/result?wpm=${wpm}&accuracy=${accuracy}&theme=${theme}&textId=${text.id}`
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-400">
        テキストの読み込みに失敗しました
      </div>
    );
  }

  if (!text) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        読み込み中...
      </div>
    );
  }

  const chars = text.content.split("");

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            ← テーマ選択に戻る
          </button>
          <span className="text-zinc-600 text-sm capitalize">{theme}</span>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-8 mb-6 border border-zinc-800">
          <pre className="font-mono text-lg leading-8 whitespace-pre-wrap break-all">
            {chars.map((char, i) => {
              let cls = "text-zinc-600";
              if (i < typed.length) {
                cls =
                  typed[i] === char
                    ? "text-emerald-400"
                    : "bg-red-900 text-red-300 rounded";
              } else if (i === typed.length) {
                cls = "text-white border-b-2 border-white";
              }
              return (
                <span key={i} className={cls}>
                  {char}
                </span>
              );
            })}
          </pre>
        </div>

        <div className="relative">
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            disabled={finished}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-5 font-mono text-white text-sm resize-none focus:outline-none focus:border-zinc-500 placeholder-zinc-700"
            placeholder="ここに入力してください..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <div className="absolute bottom-4 right-5 text-zinc-600 text-xs">
            {typed.length} / {text.content.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
          読み込み中...
        </div>
      }
    >
      <TypingGame />
    </Suspense>
  );
}
