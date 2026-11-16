document.addEventListener("DOMContentLoaded", () => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  // 0. 同步品牌名稱與聯絡連結
  document.querySelectorAll(".nav-brand").forEach((el) => {
    if (data.profile.brand) el.textContent = data.profile.brand;
  });

  const aboutGithubEl = document.getElementById("about-github-link");
  if (aboutGithubEl && data.profile.github) {
    aboutGithubEl.href = data.profile.github;
  }

  // 1. 自動標記當前導覽列 Active 狀態
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const hrefFile = link.getAttribute("href").replace("./", "");
    if (hrefFile === currentFile) {
      link.classList.add("active");
    }
  });

  // 2. 首頁：渲染 Hero、分類篩選器與作品卡片網格
  const gridEl = document.getElementById("project-grid");
  const filterBarEl = document.getElementById("filter-bar");

  if (gridEl) {
    const badgeEl = document.getElementById("hero-badge");
    const headlineEl = document.getElementById("hero-headline");
    const bioEl = document.getElementById("hero-bio");
    if (badgeEl) badgeEl.textContent = data.profile.badge;
    if (headlineEl) headlineEl.textContent = data.profile.headline;
    if (bioEl) bioEl.textContent = data.profile.bio;

    const categories = ["All", ...new Set(data.projects.map((p) => p.category))];

    if (filterBarEl) {
      categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "filter-btn" + (cat === "All" ? " active" : "");
        btn.textContent = cat === "All" ? "全部作品" : cat;
        btn.addEventListener("click", () => {
          document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          renderProjects(cat);
        });
        filterBarEl.appendChild(btn);
      });
    }

    function renderProjects(selectedCategory) {
      gridEl.innerHTML = "";
      const filtered =
        selectedCategory === "All"
          ? data.projects
          : data.projects.filter((p) => p.category === selectedCategory);

      filtered.forEach((project) => {
        const card = document.createElement("article");
        card.className = "card";

        const tagsHtml = project.tags
          .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
          .join("");

        const primaryLabel = project.videoUrl ? "試聽與詳情" : "查看詳情";

        card.innerHTML = `
          <div>
            <div class="card-meta">
              <span>${escapeHtml(project.category)}</span>
              <span>${escapeHtml(project.date)}</span>
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
          </div>
          <div>
            <div class="tag-list">${tagsHtml}</div>
            <div class="btn-group">
              <a class="btn btn-primary" href="./project.html?id=${encodeURIComponent(project.id)}">${primaryLabel}</a>
              ${project.repoUrl ? `<a class="btn btn-outline" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener">GitHub</a>` : ""}
            </div>
          </div>
        `;
        gridEl.appendChild(card);
      });
    }

    renderProjects("All");
  }

  // 3. 作品詳情頁：依據 URL ?id=xxx 動態渲染內容
  const detailEl = document.getElementById("project-detail");
  if (detailEl) {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");
    const project = data.projects.find((p) => p.id === projectId) || data.projects[0];

    if (project) {
      document.title = `${project.title} | 作品展示`;
      const highlightsHtml = project.highlights
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      const tagsHtml = project.tags
        .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
        .join("");

      const videoSectionHtml = project.videoUrl
        ? `<div id="video-section">
             <h2>作品影音播放</h2>
             <div class="video-wrapper">
               <video id="project-video" class="video-player" controls preload="metadata" src="${escapeHtml(project.videoUrl)}"></video>
             </div>
           </div>`
        : "";

      const lyricsSectionHtml = project.lyrics
        ? `<h2>歌詞精選摘錄</h2>
           <div class="lyrics-box">${escapeHtml(project.lyrics)}</div>`
        : "";

      detailEl.innerHTML = `
        <div class="detail-box">
          <div class="card-meta">
            <span>${escapeHtml(project.category)}</span>
            <span>${escapeHtml(project.date)}</span>
          </div>
          <h1>${escapeHtml(project.title)}</h1>
          <div class="tag-list">${tagsHtml}</div>
          ${videoSectionHtml}
          <h2>作品概述</h2>
          <p>${escapeHtml(project.description)}</p>
          <h2>核心亮點與創作設計</h2>
          <ul class="detail-list">${highlightsHtml}</ul>
          ${lyricsSectionHtml}
          <div class="btn-group">
            <a class="btn btn-outline" href="./index.html">← 返回作品列表</a>
            ${project.repoUrl ? `<a class="btn btn-primary" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener">前往 GitHub 原始碼</a>` : ""}
            ${project.demoUrl ? `<a class="btn btn-outline" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener">線上預覽</a>` : ""}
          </div>
        </div>
      `;

      // 若本地影片尚未放入 assets/videos/，優雅隱藏播放器區塊避免破圖
      const videoEl = document.getElementById("project-video");
      const videoSectionEl = document.getElementById("video-section");
      if (videoEl && videoSectionEl) {
        videoEl.addEventListener("error", () => {
          videoSectionEl.classList.add("is-hidden");
        });
      }
    }
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
