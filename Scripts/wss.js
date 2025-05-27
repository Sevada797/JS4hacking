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
