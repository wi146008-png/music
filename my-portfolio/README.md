# Spec-Driven Portfolio (`CLAUDE.md` / `AGENTS.md`)

採用 **規則驅動開發（Rule-Driven Development）** 設計的個人作品展示網站。
透過根目錄的 `CLAUDE.md` 與 `AGENTS.md` 明確定義設計系統（Design Tokens）、檔案邊界與擴充 SOP，讓 AI 編碼助手（Claude Code、Cursor、Gemini CLI 等）在後續新增作品或獨立頁面時，能 100% 維持視覺與架構一致性。

## 目錄結構

```text
my-portfolio/
├── CLAUDE.md                 # AI 開發核心規範書（Claude Code 自動讀取）
├── AGENTS.md                 # 通用 AI Agent 規範書（與 CLAUDE.md 同步）
├── README.md                 # 專案說明與部署指南
├── .nojekyll                 # 停用 GitHub Pages 預設 Jekyll 編譯，加快部署
├── .gitignore                # Git 忽略清單
├── index.html                # 首頁：個人簡介 + 動態分類篩選 + 作品卡片
├── project.html              # 作品詳情頁：透過網址參數 (?id=xxx) 動態載入
├── about.html                # 關於我頁面：開發理念與技術棧
├── assets/
│   └── videos/               # 放置 AI 音樂 MV 影片（video_1.mp4 ~ video_4.mp4）
├── templates/
│   └── page-template.html    # 新增獨立頁面時的標準 HTML 骨架
├── css/
│   ├── tokens.css            # 全域 Design Tokens（色彩、字級、間距變數）
│   └── style.css             # 共用元件與響應式排版樣式
└── js/
    ├── data.js               # 集中式作品資料庫（Single Source of Truth）
    └── app.js                # 渲染引擎與互動邏輯
```

## 放入 AI 音樂作品影片（可選）

`js/data.js` 已收錄 4 首 Suno AI 原創音樂作品（分類為 `AI Music`）。若希望在作品詳情頁直接線上播放影片，請將這 4 個影片檔放入 `assets/videos/` 資料夾並維持以下檔名：
- `assets/videos/video_1.mp4` — 《妳的愛，給我無限依賴（One Love）》
- `assets/videos/video_2.mp4` — 《成為你的光（Reach for the Light）》
- `assets/videos/video_3.mp4` — 《Faded Memory》
- `assets/videos/video_4.mp4` — 《小松果，我陪你去看世界》

> 若尚未放入 `.mp4` 檔案，網頁仍會正常顯示作品介紹、創作亮點與歌詞摘錄，不會出現破圖。

## 部署至 GitHub Pages

1. 在 GitHub 建立一個公開儲存庫（例如 `my-portfolio`）。
2. 將本資料夾內的所有檔案推送至 `main` 分支：
   ```bash
   git init
   git add .
   git commit -m "feat: add AI music works to spec-driven portfolio"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/my-portfolio.git
   git push -u origin main
   ```
3. 前往 GitHub Repository 的 **Settings → Pages**，在 **Source** 選擇 `Deploy from a branch`，Branch 選擇 `main` 與 `/ (root)`，點擊 **Save**。
4. 等待約 1 分鐘即可透過 `https://<你的帳號>.github.io/my-portfolio/` 瀏覽線上網站。
