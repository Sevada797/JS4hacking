const script = document.createElement('script');
script.src = chrome.runtime.getURL('main.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

const modules = [
    { key: "J4_cookie_reflections_logging", path: "Modules/cookie_reflections_logger.js" },
    { key: "J4_storage_reflections_logging", path: "Modules/storage_reflections_logger.js" },
    { key: "J4_url_params_reflections_logging", path: "Modules/url_params_reflections_logger.js" }
];

chrome.storage.local.get(modules.map(m => m.key), (res) => {
    modules.forEach(({ key, path }) => {
        if (res[key]) {
            const s = document.createElement('script');
            s.src = chrome.runtime.getURL(path);
            (document.head || document.documentElement).appendChild(s);
            s.onload = () => s.remove();
        }
    });
});
