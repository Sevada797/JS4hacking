(function () {
/*
MORE WILL COME !!
STAY TUNED !!
*/


    const html = document.body.outerHTML;
    const params = new URLSearchParams(window.location.search);

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    params.forEach((value, key) => {
        if (!value || value.length < 4) return;

        try {
            const esc = escapeRegExp(value);
            // Updated pattern per your request
            const re = new RegExp("`[^'\">`]*" + esc + "[^'\"<`]*`");

            if (re.test(html)) {
                alert("Potential XSS found (raw) - Try " + key + "=${alert(document.domain)}");
            }

            // Decoded check
            try {
                const decoded = decodeURIComponent(value);
                if (decoded !== value) {
                    const reDec = new RegExp("`[^'\">`]*" + escapeRegExp(decoded) + "[^'\"<`]*`");
                    if (reDec.test(html)) {
                        alert("Potential XSS found (urldecoded) - Try " + key + "=${alert(document.domain)}");
                    }
                }
            } catch (e) { /* ignore decode errors */ }

        } catch (e) {
            console.warn("Regex failed for param", key, e);
        }
    });
})();
