# nmos-patch-gui-wrapper

[taqq505/nmos-patch-gui](https://github.com/taqq505/nmos-patch-gui)（NMOS Simple BCC）を
Windows x64 でローカル動作する単一の exe に **Tauri** でラッピングするだけの、最軽量なリポジトリです。

このリポジトリ自体はアプリのコードを一切持ちません。GitHub Actions（`.github/workflows/build-windows.yml`）を
手動実行するたびに、本家リポジトリの最新ソースをそのまま取得してラッピングします。中身を固定・改変しないので、
本家が更新されても、このリポジトリ側は何もしなくてもそのまま追随できます。

## 使い方

1. GitHub の **Actions** タブ → `Build Windows wrapper` → **Run workflow**
2. 必要なら `upstream_ref` に本家のブランチ／タグ／コミットを指定（未指定なら `main`）
3. 実行完了後、Artifacts から以下をダウンロード
   - `nmos-patch-gui-wrapper-portable-exe`: インストール不要の単体 exe
   - `nmos-patch-gui-wrapper-nsis-installer`: インストーラー形式（.exe）

いずれも Windows 10/11 x64 で動作します（WebView2 ランタイムが必要ですが、最近の Windows には標準搭載）。

## 仕組み

- `src-tauri/` : Tauri（Rust）側のラッパー本体。これだけがこのリポジトリの実体です。
- ビルド時、CI が本家リポジトリを `webapp/` にチェックアウトし、`frontendDist` としてそのまま Tauri に渡します
  （ビルドステップなし。本家は素の HTML/CSS/JS + Service Worker のプレーンな PWA のため、そのまま埋め込めます）。
- アプリアイコンも本家の `favicon.svg` から CI 実行のたびに生成し、リポジトリにはコミットしません。

### 本家が使っている技術への配慮

- **WebSocket**（RDS 購読、Stream Deck ブリッジ `ws://localhost:57284` など）: そのまま動作します。
- **NMOS API アクセス（IS-04/IS-05 への fetch/PATCH）**: 本家は同一オリジンではない NMOS 機器への
  fetch/PATCH を行うため、通常のブラウザや素の WebView では CORS 制限に引っかかります（本家アプリの
  設定画面にある「CORS Help」は Chrome を `--disable-web-security` 付きで起動する回避策を案内しています）。
  このラッパーでは `tauri.conf.json` の `additionalBrowserArgs` で WebView2 に対して最初から
  同等のフラグ（`--disable-web-security` など）を渡しており、放送設備のローカルネットワーク内で使う
  専用コントロールアプリとして、追加の回避策なしで動作するようにしています。
- **PWA 対応（manifest.json / service-worker.js）**: そのまま同梱していますが、Service Worker は
  クロスオリジン（NMOS 機器）へのリクエストを素通りさせる実装になっているため、キャッシュ戦略が
  NMOS 通信を妨げることはありません。
- **JavaScript モジュール（`<script type="module">`）**: ビルド・バンドル不要でそのまま Tauri の
  アセットとして配信されるため、素の ES Modules のまま動作します。

## セキュリティ上の注意

`additionalBrowserArgs` による Web セキュリティの無効化は、本家アプリ自身が「開発用回避策」として
案内している挙動を常時有効にするものです。信頼できるローカル放送ネットワーク内での利用を前提としており、
不特定のインターネットサイトを閲覧する用途には使わないでください。
