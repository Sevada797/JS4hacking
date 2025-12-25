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

(function () {
    /*
    ============================================
    🔥 CSRF DETECTOR - JS4HACKING MODULE
    ============================================
    Auto-detects missing CSRF tokens on POST forms
    Monitors for dynamically added forms
    ============================================
    */

    const bodyText = document.body.innerText.toLowerCase();
    const checkedForms = new WeakSet(); // Track already checked forms

    // ==========================================
    // 🎯 HELPER FUNCTIONS
    // ==========================================
    
    const isLoginPage = () => {
        const loginKeywords = [
            'login', 'log in', 'log-in',
            'signin', 'sign in', 'sign-in',
            'signup', 'sign up', 'sign-up',
            'register', 'registration',
            'вход', 'войти', 'войдите',
            'регистрация', 'регистрироваться',
            'create account'
        ];
        
        return loginKeywords.some(kw => bodyText.includes(kw));
    };

    const hasCSRFToken = (form) => {
        const csrfPatterns = [
            /csrf.*/i,
            /.*token.*/i,
            /.*nonce.*/i,
            /anti-forgery/i,
            /xsrf.*/i,
            /__requestverificationtoken/i
        ];

        // Check input fields
        const inputs = form.querySelectorAll('input[type="hidden"], input[name]');
        for (let input of inputs) {
            const name = input.getAttribute('name') || '';
            const id = input.getAttribute('id') || '';
            
            if (csrfPatterns.some(p => p.test(name) || p.test(id))) {
                return true;
            }
        }

        return false;
    };

    const checkForm = (form, index) => {
        // Skip if already checked
        if (checkedForms.has(form)) {
            return;
        }

        // Mark as checked
        checkedForms.add(form);

        if (!hasCSRFToken(form)) {
            const action = form.getAttribute('action') || 'current page';
            //const formId = form.getAttribute('id') || form.getAttribute('name') || `Form #${index + 1}`;
            
            console.log(`%c🔥 GOLDEN BUG: Missing CSRF Token`, 'color: orange; font-weight: bold;');
            console.log('Form:', form);
            
            alert(`🔥 GOLDEN BUG FOUND!\n\n` +
                  `Type: Missing CSRF Protection\n` +
//                  `Form: ${formId}\n` +
                  `Action: ${action}\n` +
                  `Method: POST\n` +
                  `Impact: State-changing operation without CSRF protection\n` +
                  `Confidence: 90%`);
        }
    };

    // ==========================================
    // 🛡️ CSRF DETECTION (Missing Token on POST)
    // ==========================================
    
    const scanForms = () => {
        if (isLoginPage()) {
            return;
        }

        const postForms = document.querySelectorAll('form[method="post"][action]');
        
        postForms.forEach((form, index) => {
            checkForm(form, index);
        });
    };

    // ==========================================
    // 🔄 STATE CHANGE MONITOR (Every 0.4 seconds)
    // ==========================================
    
    // Initial scan
    scanForms();

    // Monitor for new forms every 400ms
    setInterval(() => {
        scanForms();
    }, 400);

    // Also use MutationObserver for immediate detection (more efficient)
    const observer = new MutationObserver((mutations) => {
        let hasNewForms = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Check if added node is a form or contains forms
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'FORM' || node.querySelector('form')) {
                        hasNewForms = true;
                    }
                }
            });
        });

        if (hasNewForms) {
            scanForms();
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ==========================================
    // 📊 SUMMARY
    // ==========================================
    
    console.log(`%c🛡️ CSRF Detector Loaded from Golden Bug Detector - Monitoring POST forms (0.4s interval MutationObserver)`, 'color: #00ff00; font-weight: bold;');

})();
