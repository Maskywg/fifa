# Daily FIFA Match Radar update

每天台北時間上午執行：

1. 查詢最新 FIFA 世界盃隔天賽程、開球時間、場地、分組積分與最近賽果。日期口徑必須以台灣時間 `Asia/Taipei` 的隔天為準，不可直接使用北美當地日期；若北美 6/17 晚間賽事落在台灣 6/18 凌晨，必須歸入台灣 6/18 看賽重點。
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
   - 來源優先順序：
     1. FIFA 官方與 FIFA+：官方賽事 highlights、goal clips、match recap。
     2. FIFA 官方 YouTube：若有公開影片，優先使用，因為 LINE 與網頁預覽較穩定。
     3. 台灣觀眾來源：愛爾達體育家族 Facebook / ELTA Sports YouTube / 愛爾達官方頁面。
     4. 轉播權與大型體育媒體：FOX Soccer、Telemundo/Universo、ESPN、beIN SPORTS 等公開 highlights。
     5. 其他可公開外連的媒體精華，必須避免盜版或來路不明影片。
   - 搜尋關鍵字包含：`FIFA World Cup highlights goals <date>`、`FIFA goals today`、`愛爾達 世界盃 精華 進球`、球員姓名加 `goal`、對戰組合加 `highlights`。
   - 若來源允許嵌入，提供可嵌入 URL；若 Facebook/Reels 等來源限制嵌入，保留外開播放連結。
   - LINE 推送中不要讓影片搶主內容；精彩進球影片固定放在訊息最下方。
   - 更新 `highlightVideos`，包含 `title`、`source`、`player`、`description`、`url`。
7. 資料來源優先使用 FIFA 官方賽程、官方分組頁、主要體育媒體最新賽程與 standings。
8. 本機預覽確認首頁能載入資料、球星照片、影片連結與 3D 主視覺。
9. commit 並 push 到 GitHub repo `Maskywg/fifa` 的 `main` 分支。
10. 若環境變數 `LINE_CHANNEL_ACCESS_TOKEN` 與 `LINE_GROUP_ANXIN_PLAY` 已設定，執行 `node scripts/line-push.js`，只將最新看賽重點推送到 `安馨益起玩`；LINE 訊息必須以網頁連結作為主要內容，先放完整網頁分析，再放必看比賽與看點，精彩進球影片固定放最下方；若未設定，回報 LINE 推送尚未啟用，不要硬送或要求 LINE 個人帳密。

輸出需包含：

- 更新日期
- 目標賽事日期
- 本次最推薦觀看的一場
- 前日進球影片連結狀態
- LINE 群組推送狀態
- GitHub Pages URL
