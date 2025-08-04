(function () {
    const html = document.body.outerHTML;

    function checkStorage(storage, type) {
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            const value = storage.getItem(key);
            if (value && value.length > 5) {
                // Raw check
                if (html.includes(value)) {
                    console.log(`%c[!] Found reflected ${type} value (raw): ${key}=${value}`, 'color: cyan; font-weight: bold;');
                }
                // Decoded check
                try {
                    const decoded = decodeURIComponent(value);
                    if (decoded !== value && html.includes(decoded)) {
                        console.log(`%c[!] Found reflected ${type} value (decoded): ${key}=${decoded}`, 'color: cyan; font-weight: bold;');
                    }
                } catch (e) { /* ignore */ }
            }
        }
    }

    checkStorage(sessionStorage, 'sessionStorage');
    checkStorage(localStorage, 'localStorage');
})();
