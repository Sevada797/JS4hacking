const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const candyImages = {
    images: [],
    loaded: 0,
    totalImages: 3
};

const playerImage = {
    image: new Image(),
    loaded: false
};

for (let i = 1; i <= 3; i++) {
    const img = new Image();
    img.onload = () => {
        candyImages.loaded++;
    };
    img.src = `candy${i}.png`;
    candyImages.images.push(img);
}

playerImage.image.onload = () => {
    playerImage.loaded = true;
};
playerImage.image.src = 'player.png';

let gameState = {
    isActive: false,
    timeRemaining: 10,
    candiesCollected: 0,
    player: {
        x: 375,
        y: 472,
        width: 83,
        height: 128
    },
    candies: [],
    keys: {},
    gameTimer: null,
    candyDropTimer: null,
    candiesDropped: 0
};

let socket;
let sessionKey = null;
let sessionKeyHex = null;
let sessionIV = null;
let currentNonce = null;

// Crypto functions - AES-256-CBC compatible with server
function hexToArrayBuffer(hex) {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex");
    const len = hex.length / 2;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return arr.buffer;
}

async function encrypt(text, key, iv) {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        data
    );

    return Array.from(new Uint8Array(encrypted))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function decrypt(encrypted, key, iv) {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        hexToArrayBuffer(encrypted)
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

async function generateNonce(previousNonce, key) {
    const data = previousNonce ? (previousNonce + key) : key;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize Socket.IO connection
function initSocket() {
    socket = io({
        transports: ['websocket']
    });

    socket.on('connect', () => {
        console.log('Connected to server');
        document.getElementById('startBtn').disabled = false;
    });

    socket.on('handshake', (data) => {
        sessionKey = new Uint8Array(data.key);
        sessionKeyHex = Array.from(new Uint8Array(data.key)).map(b => b.toString(16).padStart(2, '0')).join('');
        sessionIV = new Uint8Array(data.iv);
        currentNonce = null;
        console.log('Received session key and IV');
        startGameLoop();
    });

    socket.on('candy_dropped', async (encryptedData) => {
        try {
            const decryptedData = await decrypt(atob(encryptedData), sessionKey, sessionIV);
            const data = JSON.parse(decryptedData);

            const candy = {
                id: data.candy.id,
                x: data.candy.x,
                y: 0,
                speed: data.candy.speed,
                imageIndex: data.candy.imageIndex
            };

            gameState.candies.push(candy);
        } catch (error) {
            console.error('Error processing candy_dropped:', error);
        }
    });

    socket.on('timer_update', async (encryptedData) => {
        try {
            const decryptedData = await decrypt(atob(encryptedData), sessionKey, sessionIV);
            const data = JSON.parse(decryptedData);
            gameState.timeRemaining = data.timeRemaining;
            updateDisplay();
        } catch (error) {
            console.error('Error processing timer_update:', error);
        }
    });

    socket.on('candy_collected', async (encryptedData) => {
        try {
            const decryptedData = await decrypt(atob(encryptedData), sessionKey, sessionIV);
            const data = JSON.parse(decryptedData);
            gameState.candiesCollected = data.score;
            updateDisplay();
        } catch (error) {
            console.error('Error processing candy_collected:', error);
        }
    });

    socket.on('game_ended', async () => {
        try {
            endGame();
        } catch (error) {
            console.error('Error processing game_ended:', error);
        }
    });

    socket.on('flag_response', async (encryptedData) => {
        try {
            const decryptedData = await decrypt(atob(encryptedData), sessionKey, sessionIV);
            const data = JSON.parse(decryptedData);

            if (data.success) {
                showFlag(data.flag);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error processing flag_response:', error);
        }
    });
}

function drawPlayer() {
    ctx.drawImage(playerImage.image, gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
}

function drawCandy(candy) {
    const candyImage = candyImages.images[candy.imageIndex];
    ctx.drawImage(candyImage, candy.x, candy.y, 30, 30);
}

function updatePlayer() {
    if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) {
        gameState.player.x -= 5;
    }
    if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) {
        gameState.player.x += 5;
    }

    if (gameState.player.x < 0) gameState.player.x = 0;
    if (gameState.player.x > canvas.width - gameState.player.width) {
        gameState.player.x = canvas.width - gameState.player.width;
    }
}

function updateCandies() {
    for (let i = gameState.candies.length - 1; i >= 0; i--) {
        const candy = gameState.candies[i];
        candy.y += candy.speed;

        if (candy.y > canvas.height) {
            gameState.candies.splice(i, 1);
            continue;
        }

        if (checkCollision(gameState.player, candy)) {
            onCollectCandy(candy.id);
            gameState.candies.splice(i, 1);
        }
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + 30 &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + 30 &&
        rect1.y + rect1.height > rect2.y;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    gameState.candies.forEach(drawCandy);

    if (gameState.isActive) {
        updatePlayer();
        updateCandies();
        requestAnimationFrame(draw);
    }
}

function startGameLoop() {
    gameState.isActive = true;
    gameState.timeRemaining = 10;
    gameState.candiesCollected = 0;
    gameState.candies = [];
    gameState.candiesDropped = 0;
    gameState.player.x = 375;

    document.getElementById('startBtn').disabled = true;
    document.getElementById('buyFlagBtn').style.display = 'none';
    document.getElementById('flagMessage').style.display = 'none';

    updateDisplay();
    draw();
}

async function onCollectCandy(candyId) {
    if (!sessionKey || !sessionIV) return;

    currentNonce = await generateNonce(currentNonce, sessionKeyHex);

    const collectData = {
        candyId: candyId,
        nonce: currentNonce
    };

    try {
        const encryptedHex = await encrypt(JSON.stringify(collectData), sessionKey, sessionIV);
        const encryptedData = btoa(encryptedHex);
        socket.emit('collect', encryptedData);
    } catch (error) {
        console.error('Error encrypting collect data:', error);
    }
}

function endGame() {
    gameState.isActive = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('buyFlagBtn').disabled = gameState.candiesCollected < 10;
    document.getElementById('buyFlagBtn').style.display = 'inline-block';
}

async function buyFlag() {
    if (!sessionKey || !sessionIV) return;

    const flagData = {};

    try {
        const encryptedHex = await encrypt(JSON.stringify(flagData), sessionKey, sessionIV);
        const encryptedData = btoa(encryptedHex);
        socket.emit('buy_flag', encryptedData);
    } catch (error) {
        console.error('Error encrypting buy_flag data:', error);
    }
}

function showFlag(flagText) {
    document.getElementById('buyFlagBtn').style.display = 'none';
    document.getElementById('flagMessage').textContent = `🎉 Congratulations! Your flag is: ${flagText}`;
    document.getElementById('flagMessage').style.display = 'block';
}

function startGame() {
    if (socket && socket.connected) {
        socket.emit('start');
    }
}

function updateDisplay() {
    document.getElementById('timeDisplay').textContent = gameState.timeRemaining;
    document.getElementById('candyCount').textContent = gameState.candiesCollected;
}

document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

// Initialize everything when page loads
window.addEventListener('load', () => {
    initSocket();
    draw();
});
