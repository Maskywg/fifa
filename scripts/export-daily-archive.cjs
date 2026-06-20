#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const outputDir = path.resolve(process.argv[2] || "archive/obsidian");

function runGit(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

function slug(value) {
  return String(value || "untitled")
    .normalize("NFKD")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function targetDateIso(data, commitDate) {
  const label = String(data.targetDateLabel || "");
  const taiwanMatch = label.match(/(\d{4})-(\d{2})-(\d{2})\s*台灣時間/);
  if (taiwanMatch) return `${taiwanMatch[1]}-${taiwanMatch[2]}-${taiwanMatch[3]}`;

  const labelMatch = label.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (labelMatch) return `${labelMatch[1]}-${labelMatch[2]}-${labelMatch[3]}`;

  const visualMatch = String(data.visualDate || "").match(/([A-Za-z]{3})\s+(\d{1,2})/);
  const year = String(data.publishedAt || commitDate).match(/^(\d{4})/)?.[1] || commitDate.slice(0, 4);
  if (visualMatch) {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };
    const month = months[visualMatch[1]];
    const day = visualMatch[2].padStart(2, "0");
    if (month) return `${year}-${month}-${day}`;
  }

  return commitDate;
}

function list(items = [], render) {
  if (!items.length) return "_無資料_\n";
  return items.map(render).join("\n");
}

function renderDaily(data, meta) {
  const title = `FIFA Match Radar - ${data.targetDateLabel || meta.commitDate}`;
  const date = targetDateIso(data, meta.commitDate);
  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: ${date}`,
    `targetDate: "${data.targetDateLabel || ""}"`,
    `targetDateIso: ${date}`,
    `publishedAt: "${data.publishedAt || ""}"`,
    `commit: "${meta.hash}"`,
    `commitDate: "${meta.commitDate}"`,
    `archiveMonth: "${date.slice(0, 7)}"`,
    `sourceFile: "data/daily.json"`,
    "tags:",
    "  - FIFA",
    "  - MatchRadar",
    "  - WorldCup2026",
    "---"
  ].join("\n");

  const matches = list(data.matches, (match) => [
    `### ${match.priority || ""} ${match.home || ""} vs ${match.away || ""}`.trim(),
    `- 分組：${match.group || ""}`,
    `- 時間：${match.time || ""}`,
    `- 場地：${match.venue || ""}`,
    `- 標題：${match.headline || ""}`,
    `- 看點：${match.analysis || ""}`,
    `- 標籤：${(match.tags || []).join("、")}`
  ].join("\n"));

  const players = list(data.players, (player) => [
    `### ${player.name || ""} (${player.team || ""})`,
    `- 職業隊：${player.currentClub || ""}`,
    `- 球星看點：${player.note || ""}`,
    `- 照片：${player.photoUrl || ""}`,
    `- 來源：${player.profileUrl || ""}`
  ].join("\n"));

  const videos = list(data.highlightVideos, (video) => [
    `- [${video.title || video.url}](${video.url || ""})`,
    `  - 來源：${video.source || ""}`,
    `  - 相關球員：${video.player || ""}`,
    `  - 說明：${video.description || ""}`
  ].join("\n"));

  const watchPoints = list(data.watchPoints, (point) => `- ${point}`);
  const sources = list(data.sources, (source) => `- [${source.label || source.url}](${source.url || ""})`);

  return [
    frontmatter,
    "",
    `# ${title}`,
    "",
    `> Git commit: \`${meta.hash.slice(0, 7)}\` (${meta.subject})`,
    "",
    "## 摘要",
    "",
    data.summary || "_無摘要_",
    "",
    "## 今日主軸",
    "",
    data.dailyAngle || "_無主軸_",
    "",
    "## 賽程與看點",
    "",
    matches,
    "",
    "## 球星資訊",
    "",
    players,
    "",
    "## 精彩影片",
    "",
    videos,
    "",
    "## 看球重點",
    "",
    watchPoints,
    "",
    "## 來源",
    "",
    sources,
    ""
  ].join("\n");
}

function main() {
  const rawLog = runGit(["log", "--reverse", "--format=%H%x09%cs%x09%s", "--", "data/daily.json"]).trim();
  if (!rawLog) {
    throw new Error("No data/daily.json history found.");
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const indexRows = [];
  for (const line of rawLog.split("\n")) {
    const [hash, commitDate, ...subjectParts] = line.split("\t");
    const subject = subjectParts.join("\t");
    let data;
    try {
      data = JSON.parse(runGit(["show", `${hash}:data/daily.json`]));
    } catch (error) {
      console.warn(`skip ${hash.slice(0, 7)}: ${error.message}`);
      continue;
    }

    const date = targetDateIso(data, commitDate);
    const target = data.targetDateLabel || date;
    const published = String(data.publishedAt || commitDate).replace(/[:+]/g, "-");
    const fileName = `${date} ${slug(target)} ${published} ${hash.slice(0, 7)}.md`;
    const monthDir = path.join(outputDir, date.slice(0, 7));
    fs.mkdirSync(monthDir, { recursive: true });
    const filePath = path.join(monthDir, fileName);
    fs.writeFileSync(filePath, renderDaily(data, { hash, commitDate, subject }), "utf8");
    indexRows.push(`- ${date} - [[${date.slice(0, 7)}/${fileName.replace(/\.md$/, "")}]] - ${target} - ${subject} - \`${hash.slice(0, 7)}\``);
  }

  fs.writeFileSync(
    path.join(outputDir, "FIFA Match Radar Archive Index.md"),
    [
      "---",
      'title: "FIFA Match Radar Archive Index"',
      "tags:",
      "  - FIFA",
      "  - MatchRadar",
      "  - Archive",
      "---",
      "",
      "# FIFA Match Radar Archive Index",
      "",
      `Generated at ${new Date().toISOString()}.`,
      "",
      ...indexRows,
      ""
    ].join("\n"),
    "utf8"
  );

  console.log(`Exported ${indexRows.length} notes to ${outputDir}`);
}

main();
