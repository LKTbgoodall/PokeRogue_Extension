const coords = {
  p1_top: { x: 0.3954, y: 0.149 },
  p1_bot: { x: 0.3954, y: 0.2593 },
  p2_top: { x: 0.365, y: 0.3 },
  p2_bot: { x: 0.365, y: 0.41 },
  check: { x: 0.15, y: 0.3 },
};

const typesData = {
  Normal: { rgb: [168, 167, 122] },
  Feu: { rgb: [238, 129, 48] },
  Eau: { rgb: [99, 144, 240] },
  Plante: { rgb: [122, 199, 76] },
  Électrik: { rgb: [247, 208, 44] },
  Glace: { rgb: [150, 217, 214] },
  Combat: { rgb: [194, 46, 40] },
  Poison: { rgb: [163, 62, 161] },
  Sol: { rgb: [226, 191, 101] },
  Vol: { rgb: [169, 143, 243] },
  Psy: { rgb: [249, 85, 135] },
  Insecte: { rgb: [166, 185, 26] },
  Roche: { rgb: [182, 161, 54] },
  Spectre: { rgb: [115, 87, 151] },
  Dragon: { rgb: [111, 53, 252] },
  Ténèbres: { rgb: [112, 87, 70] },
  Acier: { rgb: [183, 183, 206] },
  Fée: { rgb: [214, 133, 173] },
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

function getClosestType(r, g, b) {
  let closestType = "Inconnu";
  let minDistance = Infinity;

  for (const [type, data] of Object.entries(typesData)) {
    const distance = Math.sqrt(
      Math.pow(r - data.rgb[0], 2) +
        Math.pow(g - data.rgb[1], 2) +
        Math.pow(b - data.rgb[2], 2),
    );
    if (distance < minDistance && distance < 80) {
      minDistance = distance;
      closestType = type;
    }
  }
  return closestType;
}

function renderCard(id, selectedTypes) {
  const card = document.getElementById(`card-${id}`);

  if (selectedTypes.length === 0) {
    card.classList.add("hidden");
    return;
  }

  card.classList.remove("hidden");

  let matchups = {};
  Object.keys(typesData).forEach((t) => (matchups[t] = 1));

  selectedTypes.forEach((t) => {
    typeChart[t].weak.forEach((x) => (matchups[x] *= 2));
    typeChart[t].res.forEach((x) => (matchups[x] *= 0.5));
    typeChart[t].imm.forEach((x) => (matchups[x] *= 0));
  });

  let buffs = [];
  let debuffs = [];

  for (let [type, val] of Object.entries(matchups)) {
    if (val === 4) buffs.push(`${type} (x4)`);
    if (val === 2) buffs.push(`${type} (x2)`);
    if (val === 0.5) debuffs.push(`${type} (x0.5)`);
    if (val === 0.25) debuffs.push(`${type} (x0.25)`);
    if (val === 0) debuffs.push(`${type} (x0)`);
  }

  let dangerTypes = new Set();
  selectedTypes.forEach((enemyType) => {
    Object.keys(typeChart).forEach((myType) => {
      if (typeChart[myType].weak.includes(enemyType)) {
        dangerTypes.add(myType);
      }
    });
  });
  const dangerArray = Array.from(dangerTypes);

  let html = `<div class="pr-card-content"><div class="pr-title">Ennemi détecté [${selectedTypes.join(" / ")}]</div>`;

  if (buffs.length > 0) {
    html += `<div class="pr-section pr-buff"><div class="pr-label">[TAPER AVEC] :</div><div class="pr-value">${buffs.join(", ")}</div></div>`;
  }

  if (debuffs.length > 0) {
    html += `<div class="pr-section pr-debuff"><div class="pr-label">[DEBUFF] :</div><div class="pr-value">${debuffs.join(", ")}</div></div>`;
  }

  if (dangerArray.length > 0) {
    html += `<div class="pr-section pr-danger"><div class="pr-label">[DANGER] :</div><div class="pr-value">${dangerArray.join(", ")}</div></div>`;
  }

  html += `</div>`;
  card.innerHTML = html;
}

document.getElementById("scan-btn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      },
    },
    (results) => {
      if (!results || !results[0].result) return;
      const rect = results[0].result;

      chrome.tabs.captureVisibleTab(
        null,
        { format: "png" },
        function (dataUrl) {
          const img = new Image();
          img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            function getPixel(coord) {
              const x = Math.floor(rect.left + rect.width * coord.x);
              const y = Math.floor(rect.top + rect.height * coord.y);
              return ctx.getImageData(x, y, 1, 1).data;
            }

            const pxP1Top = getPixel(coords.p1_top);
            const pxP1Bot = getPixel(coords.p1_bot);
            let t1Top = getClosestType(pxP1Top[0], pxP1Top[1], pxP1Top[2]);
            let t1Bot = getClosestType(pxP1Bot[0], pxP1Bot[1], pxP1Bot[2]);

            let p1Types = [];
            if (t1Top !== "Inconnu") p1Types.push(t1Top);
            if (t1Bot !== "Inconnu" && t1Bot !== t1Top) p1Types.push(t1Bot);

            renderCard("p1", p1Types);

            const pxP2Top = getPixel(coords.p2_top);
            const pxP2Bot = getPixel(coords.p2_bot);
            let t2Top = getClosestType(pxP2Top[0], pxP2Top[1], pxP2Top[2]);
            let t2Bot = getClosestType(pxP2Bot[0], pxP2Bot[1], pxP2Bot[2]);

            let p2Types = [];
            if (t2Top !== "Inconnu") p2Types.push(t2Top);
            if (t2Bot !== "Inconnu" && t2Bot !== t2Top) p2Types.push(t2Bot);

            renderCard("p2", p2Types);
          };
          img.src = dataUrl;
        },
      );
    },
  );
});
