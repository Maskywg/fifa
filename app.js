import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const dataUrl = "data/daily.json";

const text = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
};

const create = (tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
};

async function loadDailyData() {
  const response = await fetch(dataUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Cannot load ${dataUrl}`);
  return response.json();
}

function renderMatches(matches) {
  const grid = document.querySelector("#matchGrid");
  grid.innerHTML = "";

  matches.forEach(({ priority, group, time, home, away, headline, venue, analysis, tags = [] }) => {
    const card = create("article", "match-card");
    const meta = create("div", "match-meta");
    meta.append(create("span", "priority", priority));
    meta.append(create("span", "", `${group} · ${time}`));

    const teams = create("div", "teams");
    teams.append(create("span", "team-home", home));
    teams.append(create("span", "", "vs"));
    teams.append(create("span", "team-away", away));

    const headlineNode = create("h3", "", headline);
    const analysisNode = create("p", "card-copy", analysis);
    const tagsNode = create("div", "tag-row");

    tags.forEach((tag) => tagsNode.append(create("span", "tag", tag)));
    card.append(meta, teams, headlineNode);
    if (venue) card.append(create("p", "card-copy", venue));
    card.append(analysisNode, tagsNode);
    grid.append(card);
  });
}

function renderPlayers(players) {
  const list = document.querySelector("#playerList");
  list.innerHTML = "";

  players.forEach((player) => {
    const card = create("article", "player-card");
    const photo = create("img", "player-photo");
    photo.src = player.photoUrl;
    photo.alt = `${player.name} 球員照片`;
    photo.loading = "lazy";
    photo.referrerPolicy = "no-referrer";

    const copy = create("div", "");
    copy.append(create("h3", "", player.name));
    copy.append(create("p", "", player.note));

    const meta = create("div", "player-meta");
    meta.append(create("span", "player-team", player.team));
    if (player.currentClub) {
      meta.append(create("span", "player-club", `職業隊：${player.currentClub}`));
    }
    if (player.profileUrl) {
      const source = create("a", "photo-source", "照片來源");
      source.href = player.profileUrl;
      source.target = "_blank";
      source.rel = "noreferrer";
      meta.append(source);
    }

    card.append(photo, copy, meta);
    list.append(card);
  });
}

function renderVideos(videos = []) {
  const grid = document.querySelector("#videoGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!videos.length) {
    const empty = create("p", "empty-note", "目前沒有可公開播放的進球影片連結。");
    grid.append(empty);
    return;
  }

  videos.forEach((video) => {
    const card = create("article", "video-card");
    const meta = create("div", "video-meta");
    meta.append(create("span", "video-source", video.source));
    if (video.player) meta.append(create("span", "", video.player));

    card.append(meta);
    card.append(create("h3", "", video.title));
    card.append(create("p", "", video.description));

    const link = create("a", "video-link", "開啟影片");
    link.href = video.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    card.append(link);
    grid.append(card);
  });
}

function renderFanBrief(brief) {
  const section = document.querySelector("#fan-brief");
  const note = document.querySelector("#fanBriefNote");
  const grid = document.querySelector("#fanBriefGrid");
  if (!section || !note || !grid) return;

  if (!brief?.items?.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  note.textContent = brief.note || "";
  grid.innerHTML = "";

  const media = create("a", "fan-brief-media");
  media.href = brief.sourceUrl;
  media.target = "_blank";
  media.rel = "noreferrer";
  const image = create("img", "");
  image.src = brief.coverImage;
  image.alt = brief.coverAlt || `${brief.source || "影片"}封面`;
  image.loading = "lazy";
  media.append(image);

  const cards = create("div", "fan-brief-cards");
  brief.items.forEach((item) => {
    const card = create("article", "fan-brief-card");
    card.append(create("p", "fan-brief-match", item.match));
    card.append(create("h3", "", item.headline));
    card.append(create("p", "", item.tactics));
    card.append(create("p", "", item.stories));
    card.append(create("p", "fan-brief-prediction", item.prediction));
    cards.append(card);
  });

  grid.append(media, cards);
}

function renderWatchPoints(points) {
  const list = document.querySelector("#watchPoints");
  list.innerHTML = "";
  points.forEach((point) => list.append(create("li", "", point)));
}

function renderSources(data) {
  const sourceNote = document.querySelector("#sourceNote");
  const links = data.sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
    .join(" · ");
  sourceNote.innerHTML = `${data.sourceNote}<br>${links}`;
}

function renderDaily(data) {
  text("#summaryLead", data.summary);
  text("#targetDate", data.targetDateLabel);
  text("#matchCount", `${data.matches.length} 場`);
  text("#topMatch", data.matches[0]?.home && data.matches[0]?.away ? `${data.matches[0].home} vs ${data.matches[0].away}` : "--");
  text("#visualDate", data.visualDate);
  text("#dailyAngle", data.dailyAngle);
  text("#updatedAt", `Last updated ${new Date(data.publishedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`);
  renderMatches(data.matches);
  renderVideos(data.highlightVideos);
  renderFanBrief(data.fanBrief);
  renderPlayers(data.players);
  renderWatchPoints(data.watchPoints);
  renderSources(data);
}

function buildScene() {
  const canvas = document.querySelector("#matchCanvas");
  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  camera.position.set(0, 2.2, 8);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambient = new THREE.HemisphereLight(0xffffff, 0x00ff84, 2.45);
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(4, 7, 5);
  scene.add(ambient, key);

  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 7, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x15e66f, roughness: 0.78, metalness: 0.03 })
  );
  field.rotation.x = -Math.PI / 2;
  field.position.y = -1.35;
  scene.add(field);

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  const pitchLines = new THREE.Group();
  const lineSets = [
    [[-4.4, -2.7, 0], [4.4, -2.7, 0], [4.4, 2.7, 0], [-4.4, 2.7, 0], [-4.4, -2.7, 0]],
    [[0, -2.7, 0], [0, 2.7, 0]],
    [[-4.4, -1.1, 0], [-3.2, -1.1, 0], [-3.2, 1.1, 0], [-4.4, 1.1, 0]],
    [[4.4, -1.1, 0], [3.2, -1.1, 0], [3.2, 1.1, 0], [4.4, 1.1, 0]]
  ];

  lineSets.forEach((points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(([x, z, y]) => new THREE.Vector3(x, y - 1.32, z)));
    pitchLines.add(new THREE.Line(geometry, lineMaterial));
  });
  scene.add(pitchLines);

  const ball = new THREE.Group();
  const ballMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.12, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.52, metalness: 0.06 })
  );
  ball.add(ballMesh);

  const patchMaterial = new THREE.MeshStandardMaterial({ color: 0x111a14, roughness: 0.6 });
  for (let i = 0; i < 12; i += 1) {
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.22, 5), patchMaterial);
    const angle = (i / 12) * Math.PI * 2;
    const y = Math.sin(i * 1.7) * 0.72;
    patch.position.set(Math.cos(angle) * 1.03, y, Math.sin(angle) * 1.03);
    patch.lookAt(0, 0, 0);
    patch.rotateY(Math.PI);
    ball.add(patch);
  }
  ball.position.set(0.45, 0.78, 0);
  scene.add(ball);

  const markerGroup = new THREE.Group();
  const colors = [0x0057ff, 0xff174f, 0xffb000, 0xdfff00, 0x00d5ff, 0x7a3cff];
  for (let i = 0; i < 28; i += 1) {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      new THREE.MeshStandardMaterial({ color: colors[i % colors.length], emissive: colors[i % colors.length], emissiveIntensity: 0.28 })
    );
    const angle = (i / 28) * Math.PI * 2;
    const radius = 2.2 + (i % 5) * 0.33;
    marker.position.set(Math.cos(angle) * radius, Math.sin(i * 0.8) * 0.45 + 0.4, Math.sin(angle) * radius * 0.58);
    markerGroup.add(marker);
  }
  scene.add(markerGroup);

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function animate(time) {
    const t = time * 0.001;
    ball.rotation.x = t * 0.72;
    ball.rotation.y = t * 0.9;
    ball.position.y = 0.78 + Math.sin(t * 1.4) * 0.16;
    markerGroup.rotation.y = t * 0.28;
    pitchLines.position.y = Math.sin(t * 0.8) * 0.02;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(animate);
}

loadDailyData()
  .then(renderDaily)
  .catch(() => {
    text("#summaryLead", "暫時無法載入今日資料，請稍後再試。");
  });

buildScene();
