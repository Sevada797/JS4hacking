(function () {
    const html = document.body.outerHTML;
    const params = new URLSearchParams(window.location.search);

    params.forEach((value, key) => {
        if (value && value.length >= 5) {
            // Raw check
            if (html.includes(value)) {
                console.log(`%c[!] Found reflected URL param (raw): ${key}=${value}`, 'color: orange; font-weight: bold;');
            }
            // Decoded check
            try {
                const decoded = decodeURIComponent(value);
                if (decoded !== value && html.includes(decoded)) {
                    console.log(`%c[!] Found reflected URL param (decoded): ${key}=${decoded}`, 'color: orange; font-weight: bold;');
                }
            } catch (e) { /* ignore */ }
        }
    });
})();
