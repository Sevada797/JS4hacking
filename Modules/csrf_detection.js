(function() {
//    console.log("%c[JS4Hacking] CSRF Detector Loaded","color:#00eaff;font-weight:bold;");

    const csrfPatterns = [
        /authenticity_token/i,
        /csrfmiddlewaretoken/i,
        /_token/i,
        /_csrf/i,
        /xsrf/i,
        /csrf/i,
        /nonce/i,
        /__RequestVerificationToken/i
    ];

    const csrfPayloadPatterns = /(csrf|xsrf|token|nonce|verification)/i;

    function hasCSRFField(form) {
        const inputs = form.querySelectorAll("input[type='hidden']");
        return Array.from(inputs).find(inp =>
            csrfPatterns.some(p => p.test(inp.name))
        )?.name || null;
    }

    const checkedForms = new WeakSet();

    function checkForm(form) {
        if (checkedForms.has(form)) return;
        checkedForms.add(form);

        const method = form.method.toLocaleUpperCase();

        if (method===undefined) {
            console.log(`%c[CSRF] ⚠ Form With UNDEFINED Method -> ${form.action}`,
                "color:#ff5555;font-weight:bold;");
            return;
        }

        else if (method === "GET") {
            console.log(`%c[CSRF] ⚠ Form With GET Method -> ${form.action}`,
                "color:#ff5555;font-weight:bold;");
            return;
        }
        else {
        let token = hasCSRFField(form);
        if (token) {
            console.log(`%c[CSRF] ✓ POST Form Protected (${token}) -> ${form.action}`,
                        "color:#00c853;font-weight:bold;");
        } else {
            console.log(`%c[CSRF] ⚠ POST Form Missing Token -> ${form.action}`,
                         "color:#ff5555;font-weight:bold;");
        } 
        }
    }


    function detectForms() {
        const forms = document.querySelectorAll("form");
        if (forms.length === 0) {
            console.log("%c[CSRF] ⚠ No forms found on this page",
                         "color:#ff8800;font-weight:bold;");
            return;
        }
        forms.forEach(checkForm);
    }
    

    function detectCookies() {
        document.cookie.split(";").forEach(c => {
            const [name] = c.trim().split("=");
            if (csrfPatterns.some(p => p.test(name))) {
                console.log(`%c[CSRF] Cookie Token Detected: ${name}`,
                            "color:#0f0;");
            }
        });
    }

    // Detect dynamic content changes (SPAs)
    let formCheckTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(formCheckTimeout);
        formCheckTimeout = setTimeout(detectForms, 300);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    

///////////
function inspectRequest(type, url, headers, body) {
    let headerStr = "";
    // Convert Headers object to string key list
    if (headers instanceof Headers) {
        headers.forEach((v, k) => {
            headerStr += `${k}:${v};`;
        });
    } else if (typeof headers === "object") {
        headerStr = Object.keys(headers).join(";");
    } else {
        headerStr = String(headers);
    }

    const hasCSRFHeader = /csrf|xsrf|token/i.test(headerStr);
    const hasAuthHeader = /authorization|cookie/i.test(headerStr);
    const hasCSRFInPayload = body && csrfPayloadPatterns.test(body);
    let len=document.domain.split('.').length;
    let domain=document.domain.split('.')[len-2]+'.'+document.domain.split('.')[len-1];
    //console.log(`[DEBUG]: domain=${domain} url=${url}`);
    if (url.indexOf(domain+"/")!=-1 || url.startsWith(`/`)) {
        if ( ( hasCSRFHeader || hasAuthHeader || hasCSRFInPayload ) ) {
            //console.log(`%c[CSRF] ✓ ${type} Protected -> ${url}`, "color:#00c853;font-weight:bold;");
            "";
        } else {
            console.log(`%c[CSRF] ⚠ ${type} Missing Token -> ${url}`,
                        "color:#ff5555;font-weight:bold;");
        }
    }
}


function detectFetch() {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options = {}] = args;
        const method = (options.method || "GET").toUpperCase();

        if (method !== "GET") {
            inspectRequest(
                "Fetch",
                url,
                JSON.stringify(options.headers || {}),
                typeof options.body === "string" ? options.body : ""
            );
        }

        try {
            const response = await origFetch(...args);
            return response;
        } catch (err) {
            return
        }
    };
}

function detectXHR() {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method.toUpperCase();
        this._url = url;
        this._reqHeaders = {};
        return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(k, v) {
        this._reqHeaders[k] = v;
        return origSetHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        xhr._body = body || "";
        
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState === 4 && xhr._method !== "GET") {
                inspectRequest(
                    "XHR",
                    xhr._url,
                    xhr._reqHeaders,
                    typeof xhr._body === "string" ? xhr._body : ""
                );
            }
        });

        return origSend.apply(this, arguments);
    };
}


    // Run all
    detectCookies();
    detectForms();
    detectFetch();
    detectXHR();
})();
