import Link from "next/link";

const themes = [
  {
    id: "python",
    label: "Python",
    description: "Pythonのコードスニペット",
    icon: "🐍",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "javascript",
    label: "JavaScript",
    description: "JavaScriptのコードスニペット",
    icon: "⚡",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "quotes",
    label: "名言",
    description: "プログラマーの名言集",
    icon: "💬",
    color: "from-purple-500 to-purple-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            TypeCode
          </h1>
          <p className="text-zinc-400 text-lg">
            テーマを選んでタイピングを始めよう
          </p>
        </div>

        <div className="grid gap-4 mb-10">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={`/typing?theme=${theme.id}`}
              className="group flex items-center gap-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all duration-200 hover:bg-zinc-800"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
              >
                {theme.icon}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-xl">
                  {theme.label}
                </div>
                <div className="text-zinc-400 text-sm mt-1">
                  {theme.description}
                </div>
              </div>
              <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/ranking"
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            ランキングを見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
