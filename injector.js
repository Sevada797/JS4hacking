console.log("[injector] URL is:", chrome.runtime.getURL('main.js'));
const script = document.createElement('script');
script.src = chrome.runtime.getURL('main.js');
script.onload = () => script.remove(); // Clean up
(document.head || document.documentElement).appendChild(script);
