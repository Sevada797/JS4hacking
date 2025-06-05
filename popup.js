const toggle = document.getElementById("cookie_reflections_logging");


chrome.storage.local.get(["J4_cookie_reflections_logging"], (res) => {
  toggle.checked = res.J4_cookie_reflections_logging || false;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ J4_cookie_reflections_logging: toggle.checked });
}); // Set once in storage, then add checks in injector ;D

