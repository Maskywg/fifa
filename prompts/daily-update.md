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
5. 資料來源優先使用 FIFA 官方賽程、官方分組頁、主要體育媒體最新賽程與 standings。
6. 本機預覽確認首頁能載入資料與 3D 主視覺。
7. commit 並 push 到 GitHub repo `Maskywg/fifa` 的 `main` 分支。

輸出需包含：

- 更新日期
- 目標賽事日期
- 本次最推薦觀看的一場
- GitHub Pages URL
