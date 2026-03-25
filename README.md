# TypeCode

プログラミングコード・名言をテーマにしたタイピング練習アプリ。

## 技術スタック

| | 技術 |
|---|---|
| フロントエンド | Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 |
| バックエンド | Django 6 / Django REST Framework |
| DB | SQLite（開発）/ MySQL（本番） |

## 機能

- **テーマ選択** — Python・JavaScript・名言 の3テーマ
- **タイピング画面** — リアルタイムの正誤判定（文字ごとに色分け）
- **結果画面** — WPM・正確率・グレード（S〜D）表示、スコア投稿
- **ランキング** — テーマ別トップ20、メダル表示

## セットアップ

### バックエンド

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata typing_app/fixtures/texts.json
python manage.py runserver 0.0.0.0:8000
```

### フロントエンド

```bash
cd frontend
yarn install
yarn dev
```

`http://localhost:3000` でアクセス。

## GitHub Codespaces で動かす場合

フロントエンドとバックエンドは別コンテナで動くため、ブラウザが直接バックエンドにアクセスする構成になっています。

1. バックエンドのポート `8000` を **Public** に設定
2. フロントエンドは自動的にCodespacesのURLを検出してバックエンドに接続します

## API

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/api/texts?theme=python` | ランダムなテキストを取得 |
| POST | `/api/scores` | スコアを登録 |
| GET | `/api/ranking?theme=python` | ランキングを取得（上位20件） |

`theme` には `python` / `javascript` / `quotes` を指定。省略すると全テーマ対象。

## ディレクトリ構成

```
typing/
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # ホーム（テーマ選択）
│   │   ├── typing/page.tsx   # タイピング画面
│   │   ├── result/page.tsx   # 結果画面
│   │   └── ranking/page.tsx  # ランキング
│   └── lib/backend.ts        # バックエンドURL自動検出
└── backend/
    ├── config/               # Django設定・CORS
    └── typing_app/           # モデル・ビュー・シリアライザ
```



https://github.com/user-attachments/assets/93537dcc-3283-4572-b7ab-037b92aa7f36

