# Google Cloud Run デプロイメント手順

このプロジェクトは GitHub Actions を使用して Google Cloud Run にデプロイするように設定されています。以下の手順に従って、デプロイメントを設定してください。

## 前提条件

- Google Cloud アカウントとプロジェクト
- GitHub リポジトリ（このコードがプッシュされているもの）
- Google Cloud CLI（ローカルでのテスト用、オプション）

## Google Cloud の設定

1. Google Cloud プロジェクトを作成または選択します
2. 以下の API を有効にします:
   - Cloud Run API
   - Artifact Registry API
   - Cloud Build API

3. サービスアカウントを作成し、以下の権限を付与します:
   - Cloud Run Admin
   - Storage Admin
   - Artifact Registry Admin
   - Service Account User

4. サービスアカウントのキーを JSON 形式でダウンロードします

## GitHub Secrets の設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定します:

1. `GCP_PROJECT_ID`: Google Cloud プロジェクト ID
2. `GCP_SA_KEY`: ダウンロードしたサービスアカウントキー（JSON）をBase64エンコードした文字列
   ```bash
   cat path/to/service-account-key.json | base64
   ```
3. `OPENAI_API_KEY`: OpenAI API キー
4. `GOOGLE_CLOUD_QUOTA_PROJECT`: Google Cloud プロジェクト ID（通常は `GCP_PROJECT_ID` と同じ値）

## デプロイメント

メインブランチ（main）にコードをプッシュすると、GitHub Actions ワークフローが自動的に実行され、アプリケーションが Cloud Run にデプロイされます。

ワークフローの進行状況は GitHub リポジトリの Actions タブで確認できます。

## ローカルでのテスト

Dockerfile を使用してローカルでアプリケーションをテストするには:

```bash
# イメージをビルド
docker build -t study-quiz .

# コンテナを実行
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_openai_api_key \
  -e GOOGLE_CLOUD_QUOTA_PROJECT=your_gcp_project_id \
  study-quiz
```

ブラウザで http://localhost:3000 にアクセスしてアプリケーションを確認できます。
