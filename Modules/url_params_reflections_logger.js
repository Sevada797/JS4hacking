(function () {
    const html = document.body.outerHTML;
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
        if (value && value.length >= 4) {
            // Raw check
            occur=html.split(value).length-1;
            if (html.includes(value)) {
                console.log(`%c[!] Found reflected URL param (raw): ${key}=${value} ${occur}`, 'color: orange; font-weight: bold;');
            }
            // Decoded check
            try {
                const decoded = decodeURIComponent(value);
                occur=html.split(decoded).length-1;
                if (decoded !== value && html.includes(decoded)) {
                    console.log(`%c[!] Found reflected URL param (decoded): ${key}=${decoded} ${occur}`, 'color: orange; font-weight: bold;');
                }
            } catch (e) { /* ignore */ }
        }
    });
})();
