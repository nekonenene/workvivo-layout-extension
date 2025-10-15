# Workvivo Layout Modifier for Chrome Extensions

グロービス経営大学院の生徒向けコミュニティサイトとして  
[Workvivo](https://workvivo.com) を使っているものがあるのですが、  
フィードの表示幅が狭くて文章がやや読みづらい問題があったため、Chrome拡張機能で解決させました。


## 機能

### Before

![Before](./doc/SS_Before.jpeg)

### After

自身のプロフィール（フォロワー数・フォロー数）が見えている必要は薄く、  
サイドバーからのアクセスも可能であるため、  
プロフィールの列を非表示にし、フィードの表示幅を広げています。

![After](./doc/SS_After.jpeg)

## インストール方法

※ まだ Chrome ウェブストアに公開していないため、少し面倒です。

1. このリポジトリを `git clone`
2. `npm i` で依存パッケージをインストール
3. `npm run build` でビルド
4. Chrome や Brave などの拡張機能管理画面を開く（URLバーに `chrome://extensions/` と入力すれば行ける）
5. 右上の「デベロッパーモード」をオンにする
6. 「パッケージ化されていない拡張機能を読み込む」（Load unpacked）ボタンをクリックし、`workvivo-layout-extension/dist` フォルダを指定

これで、 Workvivo のページを開くと自動的にレイアウトが変更されるはずです。
