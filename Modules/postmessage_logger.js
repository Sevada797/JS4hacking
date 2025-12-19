(function() {
//    console.log("%c[J4H] PostMessage Logger ACTIVE", "color:#ffdc60;font-weight:bold;");

    const IGNORE_KEYWORDS = [
        "wappalyzer",
        "webpack",
        "react-devtools",
        "probe",
        "content-script",
        "__ym__promise"
    ];

    function shouldIgnore(origin, data) {
        // convert undefined/null origin to string 'null' so startsWith works
        origin = origin || "null";
    
        let d;
        try {
            // Handle undefined, functions, symbols safely
            d = (typeof data === "undefined") ? "" : JSON.stringify(data) || "";
            d = d.toLowerCase();
        } catch (e) {
            d = ""; // fallback if JSON.stringify fails
        }
    
        return (
            origin === "null" ||
            origin.startsWith("chrome-extension://") ||
            origin.startsWith("moz-extension://") ||
            origin.startsWith("edge-extension://") ||
            origin.startsWith("opera-extension://") ||
            IGNORE_KEYWORDS.some(k => d.includes(k))
        );
    }
    

    // ---- Incoming messages ----
    window.addEventListener("message", (event) => {
        if (shouldIgnore(event.origin, event.data)) return;

        try {
            const msg = event.data;
            const shown = (typeof msg === "string") ? msg : JSON.stringify(msg, null, 2);

            const info =
`📥 Incoming PostMessage
🌍 Origin: ${event.origin}
📌 Data:
${shown}`;

            //alert(info);

            console.log("%c[J4H-POSTMSG-IN]", "color:#00d08f;font-weight:bold;", {
                origin: event.origin,
                data: msg
            });
        } catch (e) {
            console.error("[J4H] Incoming decode error:", e);
        }
    });


    // ---- Outgoing messages ----
    const origPostMessage = window.postMessage;
    window.postMessage = function(message, targetOrigin, transfer) {
        if (!shouldIgnore(targetOrigin, message)) {
            try {
                const shown = (typeof message === "string") ? message : JSON.stringify(message, null, 2);

                const infoOut =
`📤 Outgoing PostMessage
➡ Target: ${targetOrigin}
📌 Data:
${shown}`;

              //  alert(infoOut);

                console.log("%c[J4H-POSTMSG-OUT]", "color:#ff7777;font-weight:bold;", {
                    target: targetOrigin,
                    data: message
                });
            } catch (e) {
                console.error("[J4H] Outgoing decode error:", e);
            }
        }

        return origPostMessage.apply(this, arguments);
    };

})();
