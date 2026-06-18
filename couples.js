const dataUrl = "data/couples.json";

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

function imageBlock(person, role) {
  const block = create("figure", `person-photo ${role}`);
  if (person.wide) block.classList.add("wide-person-photo");

  if (person.photoUrl) {
    const img = create("img");
    img.src = person.photoUrl;
    img.alt = `${person.name} 照片`;
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      img.replaceWith(fallbackBlock(person));
      block.classList.add("missing-public-photo");
    };
    block.append(img);
  } else {
    block.classList.add("missing-public-photo");
    block.append(fallbackBlock(person));
  }

  const caption = create("figcaption");
  caption.append(create("strong", "", person.name));
  caption.append(create("span", "", person.label));
  block.append(caption);
  return block;
}

function fallbackBlock(person) {
  const fallback = create("div", "photo-fallback");
  fallback.append(create("strong", "", person.initials));
  fallback.append(create("span", "", "公開照片暫無"));
  return fallback;
}

function renderCouples(couples) {
  const grid = document.querySelector("#starCoupleGrid");
  grid.innerHTML = "";

  couples.forEach((item) => {
    const card = create("article", "star-couple-card");
    const rank = create("div", "couple-rank", String(item.rank).padStart(2, "0"));
    const photos = create("div", "couple-photos");
    photos.append(imageBlock(item.player, "player-side"), imageBlock(item.partner, "partner-side"));

    const body = create("div", "couple-body");
    body.append(create("p", "couple-team", item.team));
    if (item.club) body.append(create("p", "couple-club", `目前俱樂部：${item.club}`));
    body.append(create("h3", "", item.title));
    body.append(create("p", "couple-story", item.story));

    const tags = create("div", "tag-row");
    item.tags.forEach((tag) => tags.append(create("span", "tag", tag)));

    const links = create("div", "couple-links");
    item.links.forEach((link) => {
      const anchor = create("a", "photo-source", link.label);
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      links.append(anchor);
    });

    body.append(tags, links);
    card.append(rank, photos, body);
    grid.append(card);
  });
}

function renderSources(sources) {
  const box = document.querySelector("#coupleSources");
  box.innerHTML = "";
  sources.forEach((source) => {
    const anchor = create("a", "", source.label);
    anchor.href = source.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    box.append(anchor);
  });
}

async function loadCouples() {
  const response = await fetch(dataUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Cannot load ${dataUrl}`);
  return response.json();
}

loadCouples()
  .then((data) => {
    text("#couplesLead", data.summary);
    text("#couplesMeta", data.note);
    text("#couplesUpdatedAt", `Last updated ${new Date(data.publishedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`);
    renderCouples(data.couples);
    renderSources(data.sources);
  })
  .catch(() => {
    text("#couplesLead", "暫時無法載入甜蜜球星資料，請稍後再試。");
  });
