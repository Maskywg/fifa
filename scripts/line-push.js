#!/usr/bin/env node

const fs = require("fs");

const siteUrl = process.env.FIFA_SITE_URL || "https://maskywg.github.io/fifa/";
const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const groupEnv = [
  ["AI資訊鍊金工坊", "LINE_GROUP_AI_ALCHEMY"],
  ["光仁義班同學會", "LINE_GROUP_KUANGJEN_YI"],
  ["大內家人群組", "LINE_GROUP_FAMILY"]
];

function loadDaily() {
  return JSON.parse(fs.readFileSync("data/daily.json", "utf8"));
}

function buildMessage(daily) {
  const topMatch = daily.matches?.[0];
  const video = daily.highlightVideos?.[0];
  const lines = [
    "FIFA 明日看賽重點已更新",
    daily.targetDateLabel,
    "",
    topMatch ? `必看首選：${topMatch.home} vs ${topMatch.away}` : null,
    topMatch?.headline ? `看點：${topMatch.headline}` : null,
    video?.url ? `前日進球影片：${video.url}` : null,
    "",
    siteUrl
  ];

  return lines.filter(Boolean).join("\n");
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

  const groups = groupEnv
    .map(([name, envName]) => ({ name, envName, id: process.env[envName] }))
    .filter((group) => group.id);

  if (!groups.length) {
    throw new Error(`Missing LINE group IDs: ${groupEnv.map(([, envName]) => envName).join(", ")}`);
  }

  const message = buildMessage(loadDaily());
  for (const group of groups) {
    await pushMessage(group.name, group.id, message);
    console.log(`sent: ${group.name}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
