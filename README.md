# メールの匿名化サポート

**Anonymized_Email_Support** は、生成 AI を安全に活用するための軽量な匿名化支援ツールです。メールやテキストデータ内の個人名などを検出・置換し、プライバシー保護を確実に担保したうえで AI に渡すことができます。匿名化された状態で生成 AI に指示を送り、返答の中から元の固有名詞を自動的に復元することで、機密性を保ちながら自然な AI 活用を実現します。

---

## 👀 見てほしいもの
- [プレゼン資料はこちら](https://docs.google.com/presentation/d/1mSHcIrZzpEIUOkFYXL962ySl76yrwEKqRIJCYPAm8Xw/edit?usp=sharing)で公開中！
- [デモ動画はこちら](https://drive.google.com/file/d/1C10klO6orazvi0fFvgR0D-K5YC7pkGUb/view)で公開中！
- [アプリはこちら](https://akashisekizaki.github.io/Anonymized_Email_Support/ "Github Pages")で公開中！

## 🔍 概要

このアプリは、以下の 3 ステップで構成される安全な AI 活用プロセスをサポートします：

1. **個人名などを匿名化（自動＋手動）**  
   形態素解析によりテキスト中の固有名詞を自動で抽出・匿名化。さらに、ユーザー自身で追加のマスキングも可能です。

2. **AI への入力時に匿名化のルールを自動注入**  
   「この文章は匿名化されているので、それを維持してください」といったプロンプトを AI 入力に自動で追加します。

3. **AI の返信から元の名前に復元**  
   返答をそのままアプリに貼り付けることで、匿名化されたラベルを元の名前に自動的に差し戻します。

---

## ✨ 特徴

- 📛 形態素解析（kuromoji.js）で人名や固有名詞を自動検出
- ✍️ 手動でのマスキング操作も柔軟に対応
- 🧠 GPT 等の AI に「匿名化されたまま応答する」ようプロンプトを自動追加
- 🔁 AI の出力を貼り付けるだけで、匿名部分を復号（置換）可能
- 🔒 個人情報を一切サーバーに送信せず、ローカルで完結
- 💻 インストール不要、`index.html` を開くだけで使用可能（[公開されているアプリ](https://akashisekizaki.github.io/Anonymized_Email_Support/ "Github Pages")でも，通信などはありません）

---

## 🚀 ローカル環境での使い方

1. このリポジトリをダウンロードまたはクローン（`git clone https://github.com/AkashiSekizaki/Anonymized_Email_Support.git`）
2. `index.html` をブラウザで開く
3. テキストを入力 → 匿名化された結果をコピー
4. GPT などに貼り付けて出力を得る（自動プロンプト注入あり）
5. 出力結果をアプリに貼り付け → 匿名部分が元に戻る

---

## 📁 ファイル構成

```
./
├── index.html             # メインHTML
├── style.css              # スタイル
├── script.js              # アプリロジック
├── kuromoji.js            # 形態素解析ライブラリ
├── kuromoji-copy.js       # 必要に応じた改変版
├── dict/                  # 辞書データ
├── LICENSE-2.0.txt        # kuromoji.jsのライセンス
├── my_icon.png            # アプリアイコン
└── README.md              # 本ファイル
```

---

## 📝 ライセンス

このアプリは以下の OSS を利用しています：

- [`kuromoji.js`](https://github.com/takuyaa/kuromoji.js) - Apache License 2.0  
  本リポジトリに `LICENSE-2.0.txt` を同梱しています。

このツール自体のコード部分は MIT ライセンスの下で公開予定です（必要に応じて `LICENSE` を追加してください）。

---

## 📫 フィードバック

改善案・バグ報告などがあれば、[GitHub Issues](https://github.com/your-repo/issues) またはメールにてご連絡ください。
