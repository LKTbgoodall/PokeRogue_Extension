const coords = {
    p1_top: { x: 0.3954, y: 0.1490 },
    p1_bot: { x: 0.3954, y: 0.2593 },
    p2_top: { x: 0.3650, y: 0.3000 },
    p2_bot: { x: 0.3650, y: 0.4100 },
    check:  { x: 0.1500, y: 0.3000 }
};

document.getElementById('scan-btn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        }
    }, (results) => {
        if (!results || !results[0].result) {
            alert("Jeu introuvable sur cette page !");
            return;
        }

        const rect = results[0].result;

        chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                function getColor(coord) {
                    const x = Math.floor(rect.left + (rect.width * coord.x));
                    const y = Math.floor(rect.top + (rect.height * coord.y));
                    const pixel = ctx.getImageData(x, y, 1, 1).data;
                    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
                }

                const colorP1Top = getColor(coords.p1_top);
                const colorP1Bot = getColor(coords.p1_bot);
                const colorP2Top = getColor(coords.p2_top);
                const colorP2Bot = getColor(coords.p2_bot);
                const colorCheck = getColor(coords.check);

                document.getElementById('box-p1-haut').style.backgroundColor = colorP1Top;
                document.getElementById('rgb-p1-haut').textContent = colorP1Top;
                document.getElementById('box-p1-bas').style.backgroundColor = colorP1Bot;
                document.getElementById('rgb-p1-bas').textContent = colorP1Bot;

                document.getElementById('box-p2-haut').style.backgroundColor = colorP2Top;
                document.getElementById('rgb-p2-haut').textContent = colorP2Top;
                document.getElementById('box-p2-bas').style.backgroundColor = colorP2Bot;
                document.getElementById('rgb-p2-bas').textContent = colorP2Bot;

                document.getElementById('box-check').style.backgroundColor = colorCheck;
                document.getElementById('rgb-check').textContent = colorCheck;
            };
            img.src = dataUrl;
        });
    });
});
