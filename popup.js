const toggles = [
    { id: "cookie_reflections_logging", key: "J4_cookie_reflections_logging" },
    { id: "storage_reflections_logging", key: "J4_storage_reflections_logging" },
    { id: "url_params_reflections_logging", key: "J4_url_params_reflections_logging" },
    { id: "golden_bug_detector", key: "J4_golden_bug_detector" }
];

toggles.forEach(({ id, key }) => {
    const el = document.getElementById(id);

    chrome.storage.local.get([key], (res) => {
        el.checked = res[key] || false;
    });

    el.addEventListener("change", () => {
        chrome.storage.local.set({ [key]: el.checked });
    });
});
