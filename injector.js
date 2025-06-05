const script = document.createElement('script');
script.src = chrome.runtime.getURL('main.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

chrome.storage.local.get(["J4_cookie_reflections_logging"], (res) => {
    if (res.J4_cookie_reflections_logging) {
    // Inject a script into the page context to set the global variable
    const script2 = document.createElement('script');
    script2.src = chrome.runtime.getURL('Modules/cookie_reflections_logger.js');
    (document.head || document.documentElement).appendChild(script2);
    script2.onload = () =>script2.remove(); // optional clean up
    }
});
