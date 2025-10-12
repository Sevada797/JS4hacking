
// doko(searchString) — require a string; searches raw/urlenc/urldec/minimal-base64 variants
async function doko(searchString) {
  const css = {
    hdr: "color:#fff;background:#111;padding:5px 8px;border-radius:6px;font-weight:700",
    ok: "color:#bada55;font-weight:700",
    src: "color:#0ff",
    info: "color:#ccc"
  };

  if (!searchString || typeof searchString !== "string" || searchString.trim() === "") {
    console.log("%cUsage: doko('string_to_lookup') — provide a non-empty string to search for.", css.hdr);
    return { error: "usage", message: "doko('string_to_lookup')" };
  }
  const needleRaw = searchString;
  // safe encode/decode
  const safeEncode = s => {
    try { return encodeURIComponent(s); } catch (e) { return s; }
  };
  const safeDecode = s => {
    try { return decodeURIComponent(s); } catch (e) { return s; }
  };

  // m64 logic translated exactly from your bash: base64(s), base64("a"+s), base64("aa"+s)
  function m64Variants(s) {
    if (!s) return [];
    function b64(inp) {
      try {
        // handle unicode -> UTF-8 safe btoa
        return btoa(unescape(encodeURIComponent(inp)));
      } catch (e) {
        try { return btoa(inp); } catch (ee) { return ""; }
      }
    }
    const aaaRaw = b64(s) || "";
    const bbbRaw = b64("a" + s) || "";
    const cccRaw = b64("aa" + s) || "";

    const aaa = aaaRaw.replace(/=+$/, "");
    const bbb = bbbRaw.replace(/=+$/, "");
    const ccc = cccRaw.replace(/=+$/, "");

    const out = new Set();
    if (aaa.length > 1) out.add(aaa.slice(0, aaa.length - 1));          // ${aaa:0:${#aaa}-1}
    if (bbb.length > 3) out.add(bbb.slice(2, bbb.length - 1));         // ${bbb:2:${#bbb}-1-2}
    if (ccc.length > 4) out.add(ccc.slice(3, ccc.length - 1));         // ${ccc:3:${#ccc}-1-3}
    return Array.from(out);
  }

  // generate variants to search for
  const variantsSet = new Set();
  variantsSet.add(needleRaw);
  variantsSet.add(safeDecode(needleRaw));
  variantsSet.add(safeEncode(needleRaw));
  try {
    // full base64 without padding
    const fullb = btoa(unescape(encodeURIComponent(needleRaw))).replace(/=+$/, "");
    if (fullb) variantsSet.add(fullb);
  } catch (e) {}
  m64Variants(safeDecode(needleRaw)).forEach(v => variantsSet.add(v));

  // canonicalize variants array
  const variants = Array.from(variantsSet).filter(Boolean);

  // helper to test if any variant exists in text
  function findVariantsInText(text) {
    if (!text) return [];
    const found = new Set();
    for (const v of variants) {
      if (!v || v.length < 3) continue; // skip tiny to reduce noise
      if (text.indexOf(v) !== -1) found.add(v);
    }
    return Array.from(found);
  }

  // gather sync sources
  const sources = {};
  try { sources["location.href"] = location.href || ""; } catch (e) { sources["location.href"] = "[inaccessible]"; }
  try { sources["location.search"] = location.search || ""; } catch (e) { sources["location.search"] = "[inaccessible]"; }
  try { sources["location.hash"] = location.hash || ""; } catch (e) { sources["location.hash"] = "[inaccessible]"; }
  try { sources["location.pathname"] = location.pathname || ""; } catch (e) { sources["location.pathname"] = "[inaccessible]"; }

  try { sources["document.outerHTML"] = document.documentElement ? document.documentElement.outerHTML : ""; } catch (e) { sources["document.outerHTML"] = "[inaccessible]"; }

  try { sources["document.cookie"] = document.cookie || ""; } catch (e) { sources["document.cookie"] = "[inaccessible]"; }

  try { sources["localStorage"] = JSON.stringify(localStorage); } catch (e) { sources["localStorage"] = "[inaccessible]"; }
  try { sources["sessionStorage"] = JSON.stringify(sessionStorage); } catch (e) { sources["sessionStorage"] = "[inaccessible]"; }

  // indexedDB best-effort: enumerate DBs and try to peek a few values (non-blocking)
  async function gatherIndexedDBSnippets() {
    const out = [];
    try {
      if (typeof indexedDB !== "undefined" && typeof indexedDB.databases === "function") {
        const dbs = await indexedDB.databases();
        for (const dbInfo of dbs) {
          const name = dbInfo.name || "[unknown]";
          try {
            const openReq = indexedDB.open(name);
            const db = await new Promise((res) => {
              openReq.onsuccess = () => res(openReq.result);
              openReq.onerror = () => res(null);
              // versionchange blocked? fallback later
            });
            if (!db) { out.push(`${name} :: [open failed]`); continue; }
            const storeNames = Array.from(db.objectStoreNames);
            if (storeNames.length === 0) { out.push(`${name} :: [no stores]`); db.close(); continue; }
            // try to read first value from first store (lightweight)
            const txn = db.transaction(storeNames[0], "readonly");
            const store = txn.objectStore(storeNames[0]);
            const first = await new Promise((res) => {
              const cur = store.openCursor();
              cur.onsuccess = e => {
                const c = cur.result;
                if (!c) res(null);
                else res(c.value);
              };
              cur.onerror = () => res(null);
            });
            out.push(`${name} :: stores=${storeNames.join(",")} :: sample=${first ? JSON.stringify(first).slice(0,200) : "[no-sample]"}`);
            db.close();
          } catch (e) {
            out.push(`${name} :: [error reading DB]`);
          }
        }
      } else {
        out.push("[indexedDB.databases() not supported]");
      }
    } catch (e) {
      out.push("[indexedDB access error]");
    }
    return out.join("\n");
  }

  // get indexedDB content (best-effort)
  sources["indexedDB_snippets"] = await gatherIndexedDBSnippets();

  // run search across sources
  const results = { query: needleRaw, variants, bySource: {} };
  for (const [k, v] of Object.entries(sources)) {
    results.bySource[k] = { found: [], sample: (typeof v === "string" && v.length > 0) ? String(v).slice(0, 300) : v };
    try {
      const f = findVariantsInText(String(v || ""));
      if (f.length) results.bySource[k].found = f;
    } catch (e) {
      results.bySource[k].error = "scan error";
    }
  }

  // also check direct storage keys (local/session) names for the raw query
  try {
    results.bySource["localStorage_keys"] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (variants.some(x => key.indexOf(x) !== -1)) {
        results.bySource["localStorage_keys"].push({ key, valueSample: (localStorage.getItem(key) || "").slice(0,200) });
      }
    }
  } catch (e) { /* ignore */ }

  try {
    results.bySource["sessionStorage_keys"] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      if (variants.some(x => key.indexOf(x) !== -1)) {
        results.bySource["sessionStorage_keys"].push({ key, valueSample: (sessionStorage.getItem(key) || "").slice(0,200) });
      }
    }
  } catch (e) { /* ignore */ }

// count matches and print pretty console output
let totalMatches = 0;
console.log("%cdoko() report", css.hdr);
console.log("%cQuery:%c " + needleRaw, css.src, css.info);

for (const [sName, info] of Object.entries(results.bySource)) {
  const hits = (info.found && info.found.length) ? info.found.length : 0;
  if (hits > 0) {
    totalMatches += hits;
    console.log("%cSource: " + sName + "  |  matches: " + hits, css.ok);
    info.found.forEach(x => console.log("%c  • " + x, css.ok));
  }
}

// also list key matches
if (results.bySource.localStorage_keys && results.bySource.localStorage_keys.length) {
  console.log("%clocalStorage keys matching variants:", css.src);
  results.bySource.localStorage_keys.forEach(k =>
    console.log("%c  • " + k.key + " → " + k.valueSample, css.ok)
  );
  totalMatches += results.bySource.localStorage_keys.length;
}
if (results.bySource.sessionStorage_keys && results.bySource.sessionStorage_keys.length) {
  console.log("%csessionStorage keys matching variants:", css.src);
  results.bySource.sessionStorage_keys.forEach(k =>
    console.log("%c  • " + k.key + " → " + k.valueSample, css.ok)
  );
  totalMatches += results.bySource.sessionStorage_keys.length;
}

if (totalMatches === 0) {
  console.log("%cNo matches found for provided string in scanned sources.", css.info);
} else {
  console.log("%cTotal matches: " + totalMatches, css.ok);
}


  // return full structured results for extension use
  results.summary = { totalMatches, sourcesScanned: Object.keys(sources).length };
  return results;
}
