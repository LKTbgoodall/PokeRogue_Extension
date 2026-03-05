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

function renderCard(id, title, selectedTypes) {
  const card = document.getElementById(`card-${id}`);
  const capsule = document.getElementById(`capsule-${id}`);
  const results = document.getElementById(`results-${id}`);

  capsule.innerHTML = "";
  results.innerHTML = "";

  if (selectedTypes.length === 0) {
    card.classList.add("hidden");
    return;
  }

  card.classList.remove("hidden");

  if (selectedTypes.length === 1) {
    const t = typesData[selectedTypes[0]];
    const half = document.createElement("div");
    half.className = "half";
    half.style.width = "100%";
    half.style.backgroundColor = t.color;
    const img = document.createElement("img");
    img.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.icon}.svg`;
    const span = document.createElement("span");
    span.textContent = selectedTypes[0];
    half.appendChild(img);
    half.appendChild(span);
    capsule.appendChild(half);
  } else {
    const t1 = typesData[selectedTypes[0]];
    const t2 = typesData[selectedTypes[1]];

    const h1 = document.createElement("div");
    h1.className = "half";
    h1.style.width = "50%";
    h1.style.backgroundColor = t1.color;
    const img1 = document.createElement("img");
    img1.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t1.icon}.svg`;
    const span1 = document.createElement("span");
    span1.textContent = selectedTypes[0];
    h1.appendChild(img1);
    h1.appendChild(span1);

    const h2 = document.createElement("div");
    h2.className = "half";
    h2.style.width = "50%";
    h2.style.backgroundColor = t2.color;
    h2.style.borderLeft = "2px solid #222";
    const img2 = document.createElement("img");
    img2.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t2.icon}.svg`;
    const span2 = document.createElement("span");
    span2.textContent = selectedTypes[1];
    h2.appendChild(img2);
    h2.appendChild(span2);

    capsule.appendChild(h1);
    capsule.appendChild(h2);
  }

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
      const group = document.createElement("div");
      group.className = "result-group";
      const h3 = document.createElement("h3");
      h3.textContent = catTitle;
      group.appendChild(h3);

      const badges = document.createElement("div");
      badges.className = "badges-container";

      list.forEach((type) => {
        const badge = document.createElement("div");
        badge.className = "result-badge";
        badge.style.backgroundColor = typesData[type].color;

        const img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${typesData[type].icon}.svg`;

        const span = document.createElement("span");
        span.textContent = type;

        badge.appendChild(img);
        badge.appendChild(span);
        badges.appendChild(badge);
      });

      group.appendChild(badges);
      results.appendChild(group);
    }
  }
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

            renderCard("p1", "Pokémon 1", p1Types);

            const pxP2Top = getPixel(coords.p2_top);
            const pxP2Bot = getPixel(coords.p2_bot);
            let t2Top = getClosestType(pxP2Top[0], pxP2Top[1], pxP2Top[2]);
            let t2Bot = getClosestType(pxP2Bot[0], pxP2Bot[1], pxP2Bot[2]);

            let p2Types = [];
            if (t2Top !== "Inconnu") p2Types.push(t2Top);
            if (t2Bot !== "Inconnu" && t2Bot !== t2Top) p2Types.push(t2Bot);

            renderCard("p2", "Pokémon 2", p2Types);
          };
          img.src = dataUrl;
        },
      );
    },
  );
});
