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
6. 資料來源優先使用 FIFA 官方賽程、官方分組頁、主要體育媒體最新賽程與 standings。
7. 本機預覽確認首頁能載入資料、球星照片與 3D 主視覺。
8. commit 並 push 到 GitHub repo `Maskywg/fifa` 的 `main` 分支。

輸出需包含：

- 更新日期
- 目標賽事日期
- 本次最推薦觀看的一場
- GitHub Pages URL
