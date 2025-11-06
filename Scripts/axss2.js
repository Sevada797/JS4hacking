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
