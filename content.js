const coords = {
  p1_top: { x: 0.3954, y: 0.149 },
  p1_bot: { x: 0.3954, y: 0.2593 },
  p2_top: { x: 0.365, y: 0.3 },
  p2_bot: { x: 0.365, y: 0.41 },
  boss_top: { x: 0.55, y: 0.15 },
  boss_bot: { x: 0.55, y: 0.25 },
  check: { x: 0.15, y: 0.3 },
};

const typesData = {
  Feu: { rgb: [247, 82, 49] },
  Normal: { rgb: [173, 165, 148] },
  Poison: { rgb: [145, 65, 203] },
  Plante: { rgb: [123, 206, 82] },
  Eau: { rgb: [57, 156, 255] },
  Insecte: { rgb: [173, 189, 33] },
  Combat: { rgb: [165, 82, 57] },
  Fée: { rgb: [239, 112, 239] },
  Électrik: { rgb: [255, 198, 49] },
  Spectre: { rgb: [99, 99, 181] },
  Psy: { rgb: [239, 65, 121] },
  Acier: { rgb: [129, 166, 190] },
  Vol: { rgb: [156, 173, 247] },
  Sol: { rgb: [174, 122, 59] },
  Dragon: { rgb: [123, 99, 231] },
  Ténèbres: { rgb: [115, 90, 74] },
  Glace: { rgb: [90, 206, 231] },
  Roche: { rgb: [189, 165, 90] },
};

const typeChart = {
  Normal: { imm: ["Spectre"], weak: ["Combat"], res: [] },
  Feu: {
    imm: [],
    weak: ["Eau", "Sol", "Roche"],
    res: ["Feu", "Plante", "Glace", "Insecte", "Acier", "Fée"],
  },
  Eau: {
    imm: [],
    weak: ["Plante", "Électrik"],
    res: ["Feu", "Eau", "Glace", "Acier"],
  },
  Plante: {
    imm: [],
    weak: ["Feu", "Glace", "Poison", "Vol", "Insecte"],
    res: ["Eau", "Plante", "Électrik", "Sol"],
  },
  Électrik: { imm: [], weak: ["Sol"], res: ["Électrik", "Vol", "Acier"] },
  Glace: { imm: [], weak: ["Feu", "Combat", "Roche", "Acier"], res: ["Glace"] },
  Combat: {
    imm: [],
    weak: ["Vol", "Psy", "Fée"],
    res: ["Insecte", "Roche", "Ténèbres"],
  },
  Poison: {
    imm: [],
    weak: ["Sol", "Psy"],
    res: ["Plante", "Combat", "Poison", "Insecte", "Fée"],
  },
  Sol: {
    imm: ["Électrik"],
    weak: ["Eau", "Plante", "Glace"],
    res: ["Poison", "Roche"],
  },
  Vol: {
    imm: ["Sol"],
    weak: ["Électrik", "Glace", "Roche"],
    res: ["Plante", "Combat", "Insecte"],
  },
  Psy: {
    imm: [],
    weak: ["Insecte", "Spectre", "Ténèbres"],
    res: ["Combat", "Psy"],
  },
  Insecte: {
    imm: [],
    weak: ["Feu", "Vol", "Roche"],
    res: ["Plante", "Combat", "Sol"],
  },
  Roche: {
    imm: [],
    weak: ["Eau", "Plante", "Combat", "Sol", "Acier"],
    res: ["Normal", "Feu", "Poison", "Vol"],
  },
  Spectre: {
    imm: ["Normal", "Combat"],
    weak: ["Spectre", "Ténèbres"],
    res: ["Poison", "Insecte"],
  },
  Dragon: {
    imm: [],
    weak: ["Glace", "Dragon", "Fée"],
    res: ["Feu", "Eau", "Plante", "Électrik"],
  },
  Ténèbres: {
    imm: ["Psy"],
    weak: ["Combat", "Insecte", "Fée"],
    res: ["Spectre", "Ténèbres"],
  },
  Acier: {
    imm: ["Poison"],
    weak: ["Feu", "Combat", "Sol"],
    res: [
      "Normal",
      "Plante",
      "Glace",
      "Vol",
      "Psy",
      "Insecte",
      "Roche",
      "Dragon",
      "Acier",
      "Fée",
    ],
  },
  Fée: {
    imm: ["Dragon"],
    weak: ["Poison", "Acier"],
    res: ["Combat", "Insecte", "Ténèbres"],
  },
};

const typeEng = {
  Normal: "normal",
  Feu: "fire",
  Eau: "water",
  Plante: "grass",
  Électrik: "electric",
  Glace: "ice",
  Combat: "fighting",
  Poison: "poison",
  Sol: "ground",
  Vol: "flying",
  Psy: "psychic",
  Insecte: "bug",
  Roche: "rock",
  Spectre: "ghost",
  Dragon: "dragon",
  Ténèbres: "dark",
  Acier: "steel",
  Fée: "fairy",
};

function getTypeIcon(type) {
  const rgb = typesData[type].rgb;
  const colorStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const iconUrl = chrome.runtime.getURL(`icons/${typeEng[type]}.svg`);
  return `<span class="type-badge" style="color: ${colorStr};"><img src="${iconUrl}" class="type-icon" style="background-color: ${colorStr};"> ${type}</span>`;
}


function captureScreen() {
  return new Promise((resolve) => {
    try {
      const port = chrome.runtime.connect({ name: "capture-port" });
      port.onMessage.addListener((msg) => resolve(msg.imgSrc || null));
      port.onDisconnect.addListener(() => resolve(null));
      port.postMessage({ action: "capture" });
    } catch (e) {
      resolve(null);
    }
  });
}


const overlayContainer = document.createElement("div");
overlayContainer.id = "pr-overlay-container";
document.body.appendChild(overlayContainer);

const card = document.createElement("div");
card.id = "pr-card-main";
card.className = "pr-card";
overlayContainer.appendChild(card);

const actionContainer = document.createElement("div");
actionContainer.id = "pr-action-container";
document.body.appendChild(actionContainer);

const toggleBtn = document.createElement("button");
toggleBtn.id = "pr-toggle-btn";
toggleBtn.className = "pr-btn";
toggleBtn.textContent = "Masquer";
actionContainer.appendChild(toggleBtn);

let overlayVisible = true;

toggleBtn.addEventListener("click", () => {
  toggleBtn.blur();
  overlayVisible = !overlayVisible;
  overlayContainer.style.display = overlayVisible ? "block" : "none";
  toggleBtn.textContent = overlayVisible ? "Masquer" : "Afficher";
});


function getClosestType(r, g, b) {
  for (const [type, data] of Object.entries(typesData)) {
    if (r === data.rgb[0] && g === data.rgb[1] && b === data.rgb[2]) {
      return type;
    }
  }
  return "Inconnu";
}

function buildSection(selectedTypes, label) {
  if (selectedTypes.length === 0) return "";

  const titleIcons = selectedTypes.map(getTypeIcon).join("");
  let html = `<div class="pr-card-content"><div class="pr-title">${label} : ${titleIcons}</div>`;

  let matchups = {};
  Object.keys(typesData).forEach((t) => (matchups[t] = 1));

  selectedTypes.forEach((t) => {
    typeChart[t].weak.forEach((x) => (matchups[x] *= 2));
    typeChart[t].res.forEach((x) => (matchups[x] *= 0.5));
    typeChart[t].imm.forEach((x) => (matchups[x] *= 0));
  });

  const tiers = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] };
  for (let [type, val] of Object.entries(matchups)) {
    if (tiers[val]) tiers[val].push(getTypeIcon(type));
  }

  if (tiers[4].length > 0 || tiers[2].length > 0) {
    html += `<div class="pr-section pr-buff"><div class="pr-label">[TAPER AVEC] :</div>`;
    if (tiers[4].length > 0) html += `<div class="tier-row"><span class="tier-val">x4</span>${tiers[4].join("")}</div>`;
    if (tiers[2].length > 0) html += `<div class="tier-row"><span class="tier-val">x2</span>${tiers[2].join("")}</div>`;
    html += `</div>`;
  }

  if (tiers[0.5].length > 0 || tiers[0.25].length > 0 || tiers[0].length > 0) {
    html += `<div class="pr-section pr-debuff"><div class="pr-label">[DEBUFF] :</div>`;
    if (tiers[0.5].length > 0) html += `<div class="tier-row"><span class="tier-val">x0.5</span>${tiers[0.5].join("")}</div>`;
    if (tiers[0.25].length > 0) html += `<div class="tier-row"><span class="tier-val">x0.25</span>${tiers[0.25].join("")}</div>`;
    if (tiers[0].length > 0) html += `<div class="tier-row"><span class="tier-val">x0</span>${tiers[0].join("")}</div>`;
    html += `</div>`;
  }

  let dangerTypes = new Set();
  selectedTypes.forEach((enemyType) => {
    Object.keys(typeChart).forEach((myType) => {
      if (typeChart[myType].weak.includes(enemyType)) dangerTypes.add(myType);
    });
  });

  const dangerArray = Array.from(dangerTypes);
  if (dangerArray.length > 0) {
    const dangerIcons = dangerArray.map(getTypeIcon).join("");
    html += `<div class="pr-section pr-danger"><div class="pr-label">[DANGER] :</div><div class="tier-row">${dangerIcons}</div></div>`;
  }

  html += `</div>`;
  return html;
}

function doScan() {
  return new Promise((resolve) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return resolve();

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    card.style.top = `${rect.top + rect.height * 0.10}px`;
    card.style.left = `${rect.left + rect.width * 0.01}px`;

    captureScreen().then((imgSrc) => {
      console.log("[PR] imgSrc reçu:", imgSrc ? "OUI (" + imgSrc.length + " chars)" : "NULL");
      if (!imgSrc) return resolve();

      const img = new Image();
      img.onerror = resolve;
      img.onload = function () {
        try {
          const offCanvas = document.createElement("canvas");
          offCanvas.width = img.width;
          offCanvas.height = img.height;
          const ctx = offCanvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          function getPixel(coord) {
            const x = Math.floor((rect.left + rect.width * coord.x) * dpr);
            const y = Math.floor((rect.top + rect.height * coord.y) * dpr);
            return ctx.getImageData(x, y, 1, 1).data;
          }

          const pxP1Top = getPixel(coords.p1_top);
          const pxP1Bot = getPixel(coords.p1_bot);
          let typeP1Top = getClosestType(pxP1Top[0], pxP1Top[1], pxP1Top[2]);
          let typeP1Bot = getClosestType(pxP1Bot[0], pxP1Bot[1], pxP1Bot[2]);
          console.log("[PR] canvas:", img.width, "x", img.height, "| dpr:", window.devicePixelRatio);
          console.log("[PR] P1 Top pixel:", pxP1Top[0], pxP1Top[1], pxP1Top[2], "→", typeP1Top);
          console.log("[PR] P1 Bot pixel:", pxP1Bot[0], pxP1Bot[1], pxP1Bot[2], "→", typeP1Bot);

          if (typeP1Top === "Inconnu") {
            const pxBossTop = getPixel(coords.boss_top);
            const pxBossBot = getPixel(coords.boss_bot);
            typeP1Top = getClosestType(pxBossTop[0], pxBossTop[1], pxBossTop[2]);
            typeP1Bot = getClosestType(pxBossBot[0], pxBossBot[1], pxBossBot[2]);
          }

          let p1Types = [];
          if (typeP1Top !== "Inconnu") p1Types.push(typeP1Top);
          if (typeP1Bot !== "Inconnu" && typeP1Bot !== typeP1Top) p1Types.push(typeP1Bot);

          const pxCheck = getPixel(coords.check);
          const isDouble = pxCheck[0] < 90 && pxCheck[1] < 90 && pxCheck[2] < 100;

          let p2Types = [];
          if (isDouble) {
            const pxP2Top = getPixel(coords.p2_top);
            const pxP2Bot = getPixel(coords.p2_bot);
            const typeP2Top = getClosestType(pxP2Top[0], pxP2Top[1], pxP2Top[2]);
            const typeP2Bot = getClosestType(pxP2Bot[0], pxP2Bot[1], pxP2Bot[2]);

            if (typeP2Top !== "Inconnu") p2Types.push(typeP2Top);
            if (typeP2Bot !== "Inconnu" && typeP2Bot !== typeP2Top) p2Types.push(typeP2Bot);
          }

          if (p1Types.length === 0 && p2Types.length === 0) {
            card.style.display = "none";
          } else {
            let html = "";
            if (p1Types.length > 0 && p2Types.length > 0) {
              html += buildSection(p1Types, "Ennemi 1");
              html += `<div class="pr-divider"></div>`;
              html += buildSection(p2Types, "Ennemi 2");
            } else {
              html += buildSection(p1Types.length > 0 ? p1Types : p2Types, "Ennemi détecté");
            }
            card.innerHTML = html;
            card.style.display = "block";
          }
        } catch (e) {
        }
        resolve();
      };
      img.src = imgSrc;
    });
  });
}

let isScanning = false;

setInterval(async () => {
  if (isScanning) return;
  isScanning = true;
  try {
    await doScan();
  } finally {
    isScanning = false;
  }
}, 1000);