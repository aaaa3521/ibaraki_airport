# 茨城空港マルシェ

茨城空港をアジアの農産物物流ハブとして活用するデジタルプラットフォームのデモアプリ。
スカイマーク旅客便の空きベリースペースをAIがリアルタイムで算出し、地域農家が即時予約できるマッチングシステムです。

## デモURL

[https://ibaraki-airport.vercel.app](https://ibaraki-airport.vercel.app)

## 背景・開発経緯

茨城空港ビジネスコンテスト（2026年5月・水戸）向けに開発したデモアプリです。
茨城県産のメロン・干し芋・常陸牛などの農産物を、スカイマーク旅客便のベリースペース（貨物室）を活用して全国へ翌日配送するビジネスモデルを想定しています。
審査員に「実現したらこんな体験になる」をリアルに伝えることを目的としています。

## 主な機能

| 画面 | 概要 |
|------|------|
| ロール選択 | 農家・バイヤーの2ロールを選択するトップページ |
| フライト一覧 | 今日の便・空き容量・価格をリアルタイム表示 |
| 集荷マップ | Leaflet.jsを使った農家の位置情報マップ |
| 予約画面 | タクシーアプリ風UIでベリースペースを即時予約。Claude APIがAIアドバイスを提供 |
| 予約確定画面 | QRコード付きの予約確定・明細表示 |
| バイヤー商品一覧 | Amazon風ECサイトUIで産地直送農産物を注文 |
| バイヤー購入確定 | カート内容の確認・注文確定 |

## スクリーンショット

> ※ 画像は後で追加予定

| ロール選択 | フライト一覧 | 予約画面 |
|:---:|:---:|:---:|
| （画像） | （画像） | （画像） |

| バイヤー商品一覧 | 予約確定 |
|:---:|:---:|
| （画像） | （画像） |

## 使用技術

| カテゴリ | 技術 |
|------|------|
| フロントエンド | React 19 / Vite |
| スタイリング | Tailwind CSS / shadcn/ui |
| アニメーション | Framer Motion |
| 地図 | Leaflet.js / React Leaflet |
| AI | Claude API（Anthropic） |
| データ | モックデータ（デモ用） |
| デプロイ | Vercel |

## ローカル環境での起動方法

### 必要環境

- Node.js 18以上
- Claude APIキー（[Anthropic Console](https://console.anthropic.com) で取得）

### セットアップ

\`\`\`bash
# リポジトリをクローン
git clone https://github.com/aaaa3521/ibaraki_airport.git
cd ibaraki_airport/ibaraki_airport

# 依存パッケージをインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.local を開いて VITE_ANTHROPIC_API_KEY にAPIキーを設定
\`\`\`

### 起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:5173](http://localhost:5173) を開いてください。

### ビルド

\`\`\`bash
npm run build
\`\`\`

## ライセンス

デモ用途のみ。商用利用不可。
