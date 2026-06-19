#!/usr/bin/env node

const fs = require("fs");

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv("config/line.env");

const siteUrl = process.env.FIFA_SITE_URL || "https://maskywg.github.io/fifa/";
const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const targetGroup = ["安馨益起玩", "LINE_GROUP_ANXIN_PLAY"];

function loadDaily() {
  return JSON.parse(fs.readFileSync("data/daily.json", "utf8"));
}

function matchList(matches = []) {
  return matches
    .map((match) => `${match.time?.replace("台灣 ", "") || ""} ${match.home} vs ${match.away}`)
    .join("\n");
}

function buildMessage(daily) {
  const video = daily.highlightVideos?.[0];
  const lines = [
    "FIFA 明日看賽重點已更新",
    daily.targetDateLabel || null,
    "",
    "完整分析看網頁：",
    siteUrl,
    "",
    "明日四場：",
    matchList(daily.matches),
    "",
    video?.url ? "精彩進球影片：" : null,
    video?.url || null
  ];

  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

async function pushMessage(groupName, groupId, message) {
  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      to: groupId,
      messages: [{ type: "text", text: message }]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${groupName} push failed: ${response.status} ${body}`);
  }
}

async function main() {
  if (!token) {
    throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN");
  }

  const [groupName, groupEnvName] = targetGroup;
  const groupId = process.env[groupEnvName];
  if (!groupId) {
    throw new Error(`Missing LINE group ID: ${groupEnvName}`);
  }

  const message = buildMessage(loadDaily());
  await pushMessage(groupName, groupId, message);
  console.log(`sent: ${groupName}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
