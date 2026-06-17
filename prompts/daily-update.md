# Daily FIFA Match Radar update

每天台北時間上午執行：

1. 查詢最新 FIFA 世界盃隔天賽程、開球時間、場地、分組積分與最近賽果。
2. 以繁體中文更新 `data/daily.json`。
3. 保持 `index.html`、`styles.css`、`app.js` 架構不變，除非需要修正頁面問題。
4. 分析每場比賽：
   - 必看排序
   - 分組壓力
   - 2-3 位重點球星或關鍵對位
   - 適合球迷觀看的戰術角度
5. 每位重點球星都要包含照片：
   - 優先找可公開使用的 Wikipedia/Wikimedia 球員照片。
   - 將照片下載到 `assets/players/`，避免外部 hotlink 造成破圖。
   - `data/daily.json` 的 `photoUrl` 使用本地路徑，`profileUrl` 保留網路照片來源頁。
   - 檢查照片完整性，避免頭頂、臉部或主要上半身被卡片裁掉；必要時換照片或調整 `object-position`。
6. 搜尋前一天進球王或重點進球影片：
   - 優先查找愛爾達體育家族 Facebook、FIFA 官方、YouTube、主要體育媒體的公開影片。
   - 若來源允許嵌入，提供可嵌入 URL；若 Facebook/Reels 等來源限制嵌入，保留外開播放連結。
   - 更新 `highlightVideos`，包含 `title`、`source`、`player`、`description`、`url`。
7. 資料來源優先使用 FIFA 官方賽程、官方分組頁、主要體育媒體最新賽程與 standings。
8. 本機預覽確認首頁能載入資料、球星照片、影片連結與 3D 主視覺。
9. commit 並 push 到 GitHub repo `Maskywg/fifa` 的 `main` 分支。

輸出需包含：

- 更新日期
- 目標賽事日期
- 本次最推薦觀看的一場
- 前日進球影片連結狀態
- GitHub Pages URL
