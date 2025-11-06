const mainj4script = document.createElement('script');
mainj4script.src = chrome.runtime.getURL('main.js');
mainj4script.onload = () => mainj4script.remove();
(document.head || document.documentElement).appendChild(mainj4script);

const modules = [
    { key: "J4_cookie_reflections_logging", path: "Modules/cookie_reflections_logger.js" },
    { key: "J4_storage_reflections_logging", path: "Modules/storage_reflections_logger.js" },
    { key: "J4_url_params_reflections_logging", path: "Modules/url_params_reflections_logger.js" },
    { key: "J4_golden_bug_detector", path: "Modules/golden_bug_detector.js" }
//    { key: "J4_logger", path: "Modules/logger.js" }  # we will load this as content script
];

chrome.storage.local.get(modules.map(m => m.key), (res) => {
    modules.forEach(({ key, path }) => {
        if (res[key]) {
            const eachj4script = document.createElement('script');
            eachj4script.src = chrome.runtime.getURL(path);
            (document.head || document.documentElement).appendChild(eachj4script);
            eachj4script.onload = () => eachj4script.remove();
        }
    });
});
