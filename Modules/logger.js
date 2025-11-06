// Modules/logger.js — content script (runs in isolated world, has chrome.* access)
(function () {
    // small utilities
    function safeDecode(v) { try { return decodeURIComponent(v); } catch (e) { return v; } }
    function unique(arr) { return Array.from(new Set(arr)); }
  
    // scanners
    function scanCookies(html) {
      const out = [];
      try {
        (document.cookie || '').split('; ').forEach(c => {
          if (!c) return;
          const [n, ...r] = c.split('=');
          const v = r.join('=');
          if (!v || v.length <= 5) return;
          if (html.includes(v)) out.push(`[cookie raw] ${n}=${v}`);
          const d = safeDecode(v);
          if (d !== v && html.includes(d)) out.push(`[cookie decoded] ${n}=${d}`);
        });
      } catch (e) {}
      return out;
    }
  
    function scanStorage(html) {
      const out = [];
      const check = (s, t) => {
        try {
          for (let i = 0; i < s.length; i++) {
            const k = s.key(i);
            if (!k) continue;
            const v = s.getItem(k);
            if (!v || v.length <= 5) continue;
            if (html.includes(v)) out.push(`[${t} raw] ${k}=${v}`);
            const d = safeDecode(v);
            if (d !== v && html.includes(d)) out.push(`[${t} decoded] ${k}=${d}`);
          }
        } catch (e) {}
      };
      try { check(sessionStorage, 'sessionStorage'); } catch (e) {}
      try { check(localStorage, 'localStorage'); } catch (e) {}
      return out;
    }
  
    function scanUrlParams(html) {
      const out = [];
      try {
        new URLSearchParams(window.location.search).forEach((v, k) => {
          if (!v || v.length < 4) return;
          if (html.includes(v)) out.push(`[url param raw] ${k}=${v} (occ:${html.split(v).length - 1})`);
          const d = safeDecode(v);
          if (d !== v && html.includes(d)) out.push(`[url param decoded] ${k}=${d} (occ:${html.split(d).length - 1})`);
        });
      } catch (e) {}
      return out;
    }
  
    // send helper
    function sendToEndpoint(endpoint, reflections) {
      if (!endpoint) { console.info('[logger] no endpoint'); return; }
      if (!reflections || !reflections.length) { console.info('[logger] nothing to send'); return; }
      const body = ['URL: ' + window.location.href, '', 'Reflections found:', ...reflections].join('\n');
      try {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body, credentials: 'omit' })
          .then(() => console.info('[logger] sent', reflections.length, 'items'))
          .catch(e => console.error('[logger] send failed', e));
      } catch (e) {
        console.error('[logger] fetch error', e);
      }
    }
  
    // main runner
    function runLoggerOnce(endpoint) {
      try {
        if (!endpoint) { console.info('[logger] endpoint empty'); return; }
        const html = document.body ? document.body.outerHTML : (document.documentElement && document.documentElement.outerHTML) || '';
        const refs = [
          ...scanCookies(html),
          ...scanStorage(html),
          ...scanUrlParams(html)
        ];
        const uniq = unique(refs);
        if (!uniq.length) { console.info('[logger] no reflections found'); return; }
        sendToEndpoint(endpoint, uniq);
      } catch (e) {
        console.error('[logger] exception', e);
      }
    }
  
    // entry: check toggle + endpoint
    try {
      chrome.storage.local.get(['J4_logger', 'J4_logger_endpoint'], (res) => {
        res = res || {};
        const enabled = !!res.J4_logger;
        if (!enabled) { return; }
  
        const endpoint = res.J4_logger_endpoint ? String(res.J4_logger_endpoint).trim() : '';
        if (!endpoint) { alert('[logger] enabled but no endpoint specified'); return; }
  
        // run the scan once (optional: change to re-run on events)
        // small delay so page scripts have settled (30ms is fine)
        setTimeout(() => runLoggerOnce(endpoint), 30);
      });
    } catch (e) {
      console.error('[logger] chrome.storage read failed', e);
    }
  })();
  