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

## LINE 群組推送

LINE Notify 已結束服務，群組自動推送需使用 LINE Messaging API 與 LINE 官方帳號 Bot。

需要準備：

- LINE Developers 的 Messaging API channel access token
- 將 Bot 加入目標群組
- 目標群組的 groupId：
  - `安馨益起玩`
  - `AI資訊鍊金工坊`
  - `光仁義班同學會`
  - `大內家人群組`

環境變數範例在 `config/line.env.example`。設定完成後可執行：

```bash
node scripts/line-push.js
```

正式本機設定可建立 `config/line.env`。這個檔案已被 `.gitignore` 排除，不會提交到 GitHub。

腳本會把最新 `data/daily.json` 摘要、前日進球影片連結與網站網址推送到已設定的群組。

## 本機預覽

因為頁面會讀取 `data/daily.json`，建議用簡單本機伺服器預覽：

```bash
python3 -m http.server 8080
```

再開啟 `http://localhost:8080`。
