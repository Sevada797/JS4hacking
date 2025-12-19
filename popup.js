const toggles = [
    { id: "cookie_reflections_logging", key: "J4_cookie_reflections_logging" },
    { id: "storage_reflections_logging", key: "J4_storage_reflections_logging" },
    { id: "url_params_reflections_logging", key: "J4_url_params_reflections_logging" },
    { id: "golden_bug_detector", key: "J4_golden_bug_detector" },
    { id: "csrf_detector", key: "J4_csrf_detector" },
    { id: "logger", key: "J4_logger" },
    { id: "postmessage_logger", key: "J4_postmessage_logger" }
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

document.addEventListener('DOMContentLoaded', () => {
    const endpointInput = document.getElementById("logger_endpoint");
    const saveBtn = document.getElementById('save_logger');
  
    // Load saved endpoint
    chrome.storage.local.get('J4_logger_endpoint', (data) => {
      endpointInput.value = data.J4_logger_endpoint || "";
    });
  
    // Save new endpoint
    saveBtn.addEventListener('click', () => {
      const endpoint = endpointInput.value.trim();
      chrome.storage.local.set({ J4_logger_endpoint: endpoint }, () => {
        alert("Logger endpoint saved: " + endpoint);
      });
    });
  });
  
