# FIFA Match Radar

每日整理隔天 FIFA 世界盃賽事、重點球星與看賽角度的 GitHub Pages 靜態網站。

## 更新方式

主要內容集中在 `data/daily.json`：

- `targetDateLabel`：頁面顯示的目標賽事日期
- `summary`：首頁摘要
- `dailyAngle`：今日看賽主軸
- `matches`：賽事排序、時間、場地、分析與標籤
- `players`：需要盯緊的球星
- `watchPoints`：三個看球角度
- `sources`：參考來源

更新資料後直接推送 `main` 分支即可由 GitHub Pages 發布。

## 本機預覽

因為頁面會讀取 `data/daily.json`，建議用簡單本機伺服器預覽：

```bash
python3 -m http.server 8080
```

再開啟 `http://localhost:8080`。
