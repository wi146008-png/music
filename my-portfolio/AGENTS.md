# AGENTS.md / CLAUDE.md — 個人作品展示網站開發規範

## 1. 專案概述與技術約束
- **專案目標**：模組化、易擴充的個人作品展示網站（Static Portfolio），直接部署於 GitHub Pages。
- **技術棧限制**：純 HTML5、CSS3、原生 ES6+ JavaScript。
- **嚴格禁止**：
  - 禁止引入 React、Vue、Tailwind CDN 或任何需要 `npm build` 編譯的框架（確保推上 GitHub 即可直接瀏覽）。
  - 禁止在 HTML 標籤中使用 `style="..."` 行內樣式（Inline Styles）。
  - 禁止在 `css/style.css` 中寫死色碼（Hex/RGB），所有顏色與間距必須引用 `css/tokens.css` 的 CSS 變數。

## 2. 檔案職責邊界
- `css/tokens.css`：定義全域 Design Tokens（色彩、字體、間距、圓角、最大寬度）。
- `css/style.css`：定義全域 Reset、導覽列、頁尾、按鈕、卡片網格與詳情頁樣式。
- `js/data.js`：唯一的內容資料來源（Single Source of Truth），存放個人資訊與 `projects` 陣列。
- `js/app.js`：負責讀取 `PORTFOLIO_DATA` 並安全地渲染 DOM、處理分類篩選與導覽列 Active 狀態。
- `templates/page-template.html`：所有新增 HTML 頁面的唯一合法起手式範本。
- `assets/videos/`：存放作品展示影片（如 `.mp4`），統一使用相對路徑 `./assets/videos/<filename>` 引用。

## 3. 標準擴充作業程序 (SOP)

### SOP-A：新增一個作品（不需修改任何 HTML）
當使用者要求「新增一個作品」時，只需編輯 `js/data.js` 的 `projects` 陣列，依以下 Schema 新增一筆物件：
```javascript
{
  id: "kebab-case-unique-id",      // 唯一識別碼，用於網址 ?id=xxx
  title: "作品標題",
  category: "AI Agent",            // 分類標籤（會自動出現在首頁篩選器）
  date: "2026-11",
  summary: "一句話精簡描述（顯示於首頁卡片，限 60 字內）",
  description: "完整專案背景、解決的問題與技術架構說明（顯示於詳情頁）",
  highlights: [
    "核心技術亮點 1",
    "核心技術亮點 2"
  ],
  tags: ["Python", "LangGraph", "Security"],
  repoUrl: "https://github.com/username/repo",
  demoUrl: "https://example.com",  // 若無線上展示可填 ""
  videoUrl: "./assets/videos/demo.mp4", // 選填：作品展示影片相對路徑
  lyrics: "選填：音樂或文字創作作品的歌詞／片段摘錄"
}
```

### SOP-B：新增一個獨立網頁（例如 `notes.html` 或 `resume.html`）
當使用者要求「新增一個新頁面」時，必須嚴格執行以下 4 步驟：
1. **複製範本**：以 `templates/page-template.html` 為基礎建立新檔案，保留完整的 `<head>`、`tokens.css`、`style.css` 與 `<header>`/`<footer>` 結構。
2. **使用既有元件**：內容區塊必須包覆在 `<main class="page-section"><div class="container">` 內，優先復用 `.detail-box`、`.project-grid`、`.card`、`.tag`、`.btn` 等既有 class；若需新增樣式，必須附加於 `css/style.css` 底部並使用 `tokens.css` 變數。
3. **同步全站導覽列**：在所有現存 `.html` 檔案與 `templates/page-template.html` 的 `<nav>` 內 `<ul class="nav-links">` 中同步加入新頁面的連結。
4. **路徑規範**：所有內部連結與資源引用一律使用相對路徑（例如 `./notes.html`、`./css/style.css`），禁止使用 `/` 開頭的絕對路徑，避免在 GitHub Pages 子路徑下破圖。

## 4. AI 執行前自我檢查清單 (Checklist)
每次修改或新增內容後，請確認：
- [ ] 是否完全使用 `tokens.css` 變數，無寫死色碼？
- [ ] 所有內部連結是否為 `./` 開頭的相對路徑？
- [ ] 若新增了 HTML 頁面，所有現有頁面的 `<nav>` 選單是否都已同步更新？
- [ ] 手機版寬度（375px）下卡片網格與導覽列是否正常換行無破版？
