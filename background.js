chrome.alarms.create("keepAlive", { periodInMinutes: 0.4 });
chrome.alarms.onAlarm.addListener(() => {});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "capture-port") return;

  port.onMessage.addListener((msg) => {
    if (msg.action !== "capture") return;

    // Cherche l'onglet actif et capture sa fenêtre
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.error("[PR BG] Aucun onglet actif trouvé");
        port.postMessage({ imgSrc: null });
        port.disconnect();
        return;
      }

      const windowId = tabs[0].windowId;
      console.log("[PR BG] Capture windowId:", windowId, "url:", tabs[0].url);

      chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error("[PR BG] Erreur capture:", chrome.runtime.lastError.message);
          port.postMessage({ imgSrc: null });
        } else {
          console.log("[PR BG] Capture OK, taille:", dataUrl.length);
          port.postMessage({ imgSrc: dataUrl });
        }
        port.disconnect();
      });
    });
  });
});