/*    document.cookie
      .split('; ')
      .forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (value && value.length > 5 && document.body.outerHTML.includes(value)) {
          console.log(
            `%c[!] Found reflected cookie: ${name}=${value}`,
            'color: yellow; font-weight: bold;'
          );
        }
      });*/
(function () {
    const html = document.body.outerHTML;

    document.cookie.split('; ').forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (value && value.length > 5) {
            // Raw value check
            if (html.includes(value)) {
                console.log(`%c[!] Found reflected cookie (raw): ${name}=${value}`, 'color: yellow; font-weight: bold;');
            }
            // URL-decoded value check
            try {
                const decoded = decodeURIComponent(value);
                if (decoded !== value && html.includes(decoded)) {
                    console.log(`%c[!] Found reflected cookie (decoded): ${name}=${decoded}`, 'color: yellow; font-weight: bold;');
                }
            } catch (e) { /* ignore decode errors */ }
        }
    });
})();

