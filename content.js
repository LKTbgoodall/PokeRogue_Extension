const coords = {
  p1_top: { x: 0.3954, y: 0.149 },
  p1_bot: { x: 0.3954, y: 0.2593 },
  p2_top: { x: 0.365, y: 0.3 },
  p2_bot: { x: 0.365, y: 0.41 },
  check: { x: 0.15, y: 0.3 },
};

const typesData = {
  Normal: { color: "#A8A77A", rgb: [168, 167, 122], icon: "normal" },
  Feu: { color: "#EE8130", rgb: [238, 129, 48], icon: "fire" },
  Eau: { color: "#6390F0", rgb: [99, 144, 240], icon: "water" },
  Plante: { color: "#7AC74C", rgb: [122, 199, 76], icon: "grass" },
  Électrik: { color: "#F7D02C", rgb: [247, 208, 44], icon: "electric" },
  Glace: { color: "#96D9D6", rgb: [150, 217, 214], icon: "ice" },
  Combat: { color: "#C22E28", rgb: [194, 46, 40], icon: "fighting" },
  Poison: { color: "#A33EA1", rgb: [163, 62, 161], icon: "poison" },
  Sol: { color: "#E2BF65", rgb: [226, 191, 101], icon: "ground" },
  Vol: { color: "#A98FF3", rgb: [169, 143, 243], icon: "flying" },
  Psy: { color: "#F95587", rgb: [249, 85, 135], icon: "psychic" },
  Insecte: { color: "#A6B91A", rgb: [166, 185, 26], icon: "bug" },
  Roche: { color: "#B6A136", rgb: [182, 161, 54], icon: "rock" },
  Spectre: { color: "#735797", rgb: [115, 87, 151], icon: "ghost" },
  Dragon: { color: "#6F35FC", rgb: [111, 53, 252], icon: "dragon" },
  Ténèbres: { color: "#705746", rgb: [112, 87, 70], icon: "dark" },
  Acier: { color: "#B7B7CE", rgb: [183, 183, 206], icon: "steel" },
  Fée: { color: "#D685AD", rgb: [214, 133, 173], icon: "fairy" },
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

const overlayContainer = document.createElement("div");
overlayContainer.id = "pr-overlay-container";
document.body.appendChild(overlayContainer);

const cardP1 = document.createElement("div");
cardP1.id = "pr-card-p1";
cardP1.className = "pr-card";
overlayContainer.appendChild(cardP1);

const cardP2 = document.createElement("div");
cardP2.id = "pr-card-p2";
cardP2.className = "pr-card";
overlayContainer.appendChild(cardP2);

const scanBtn = document.createElement("button");
scanBtn.id = "pr-scan-btn";
scanBtn.textContent = "Scan Types";
document.body.appendChild(scanBtn);

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

function buildHTML(selectedTypes) {
  if (selectedTypes.length === 0) return "";

  const titleText = selectedTypes.join(" / ");
  let html = `<div class="pr-title">${titleText}</div>`;

  let matchups = {};
  Object.keys(typesData).forEach((t) => (matchups[t] = 1));

  selectedTypes.forEach((t) => {
    typeChart[t].weak.forEach((x) => (matchups[x] *= 2));
    typeChart[t].res.forEach((x) => (matchups[x] *= 0.5));
    typeChart[t].imm.forEach((x) => (matchups[x] *= 0));
  });

  const categories = {
    "Dégâts x4": [],
    "Dégâts x2": [],
    "Dégâts x0.5": [],
    "Dégâts x0.25": [],
    "Immunisé (x0)": [],
  };

  for (let [type, val] of Object.entries(matchups)) {
    if (val === 4) categories["Dégâts x4"].push(type);
    if (val === 2) categories["Dégâts x2"].push(type);
    if (val === 0.5) categories["Dégâts x0.5"].push(type);
    if (val === 0.25) categories["Dégâts x0.25"].push(type);
    if (val === 0) categories["Immunisé (x0)"].push(type);
  }

  for (let [catTitle, list] of Object.entries(categories)) {
    if (list.length > 0) {
      html += `<div class="pr-group"><h3>${catTitle}</h3><div class="pr-badges">`;
      list.forEach((type) => {
        const color = typesData[type].color;
        const icon = typesData[type].icon;
        html += `<div class="pr-badge" style="background-color:${color}">
                            <img src="https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${icon}.svg">
                            ${type}
                         </div>`;
      });
      html += `</div></div>`;
    }
  }
  return html;
}

scanBtn.addEventListener("click", () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  cardP1.style.top = `${rect.top + rect.height * 0.12}px`;
  cardP1.style.left = `${rect.left + rect.width * 0.43}px`;

  cardP2.style.top = `${rect.top + rect.height * 0.28}px`;
  cardP2.style.left = `${rect.left + rect.width * 0.41}px`;

  chrome.runtime.sendMessage({ action: "capture" }, (response) => {
    if (!response || !response.imgSrc) return;

    const img = new Image();
    img.onload = function () {
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
      const typeP1Top = getClosestType(pxP1Top[0], pxP1Top[1], pxP1Top[2]);
      const typeP1Bot = getClosestType(pxP1Bot[0], pxP1Bot[1], pxP1Bot[2]);

      let p1Types = [];
      if (typeP1Top !== "Inconnu") p1Types.push(typeP1Top);
      if (typeP1Bot !== "Inconnu" && typeP1Bot !== typeP1Top)
        p1Types.push(typeP1Bot);

      if (p1Types.length > 0) {
        cardP1.innerHTML = buildHTML(p1Types);
        cardP1.style.display = "block";
      } else {
        cardP1.style.display = "none";
      }

      const pxCheck = getPixel(coords.check);
      const isDouble = pxCheck[0] < 90 && pxCheck[1] < 90 && pxCheck[2] < 100;

      if (isDouble) {
        const pxP2Top = getPixel(coords.p2_top);
        const pxP2Bot = getPixel(coords.p2_bot);
        const typeP2Top = getClosestType(pxP2Top[0], pxP2Top[1], pxP2Top[2]);
        const typeP2Bot = getClosestType(pxP2Bot[0], pxP2Bot[1], pxP2Bot[2]);

        let p2Types = [];
        if (typeP2Top !== "Inconnu") p2Types.push(typeP2Top);
        if (typeP2Bot !== "Inconnu" && typeP2Bot !== typeP2Top)
          p2Types.push(typeP2Bot);

        if (p2Types.length > 0) {
          cardP2.innerHTML = buildHTML(p2Types);
          cardP2.style.display = "block";
        } else {
          cardP2.style.display = "none";
        }
      } else {
        cardP2.style.display = "none";
      }
    };
    img.src = response.imgSrc;
  });
});
