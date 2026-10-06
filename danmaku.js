// ============================================================
// DANMAKU HELL — Touhou 6 Style Bullet Hell
// Built in Material Design 3 Expressive aesthetic
// ============================================================

// === COOKIE & THEME UTILITIES ===
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days || 365) * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/';
}

let currentLang = 'ru';
const cookieLang = getCookie('snakeLang');
if (cookieLang === 'ru' || cookieLang === 'en') {
    currentLang = cookieLang;
} else {
    const bLang = navigator.language || navigator.userLanguage;
    if (bLang && bLang.toLowerCase().startsWith('en')) currentLang = 'en';
}

let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
let activeColor = document.documentElement.getAttribute('data-color') || 'neutral';

// === AUDIO SYNTHESIZER (Web Audio API, 0 dependencies) ===
let audioCtx = null;
function getAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

function playSfx(type) {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    try {
        if (type === 'shoot') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        } else if (type === 'graze') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(2200, now + 0.04);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'hit') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'explode') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.22);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'bomb') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (type === 'death') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(340, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        }
    } catch (_) {}
}

// === CANVAS & DISPLAY SETUP ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// Internal game resolution: 400 x 560 (portrait shmup ratio)
const GAME_WIDTH = 400;
const GAME_HEIGHT = 560;

function syncCanvasResolution() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
}
window.addEventListener('resize', syncCanvasResolution);
syncCanvasResolution();

// === TOUHOU 6 HITBOX CONSTANTS ===
// In Touhou 6 (EoSD), the player model is ~28px, but the actual hurtbox is a tiny 3px circle!
const HITBOX_RADIUS = 3;
const GRAZE_RADIUS = 18;

// === GAME STATE ===
let gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameover'
let score = 0;
let graze = 0;
let lives = 3;
let bombs = 2;
let gameTime = 0; // seconds
let lastFrameTime = performance.now();
let highScore = parseInt(localStorage.getItem('danmakuHighScore') || '0', 10);
let lastScore = 0;

// Entities
const player = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 70,
    w: 26,
    h: 30,
    speedNormal: 3.6,
    speedFocus: 1.7,
    focused: false,
    invincibleTimer: 0,
    shootCooldown: 0,
    optionAngle: 0
};

let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let floatingTexts = [];
let boss = null;
let bombActiveTimer = 0;

// Input tracking
const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    focus: false,
    shoot: false,
    bomb: false
};

// Touch drag support
let isTouching = false;
let touchX = 0;
let touchY = 0;

// === CONTROLS LISTENERS (Layout-independent via e.code + Cyrillic fallback) ===
function handleDanmakuKey(e, isDown) {
    const code = e.code;
    const k = (e.key || '').toLowerCase();

    let handled = false;
    if (code === 'KeyA' || code === 'ArrowLeft' || k === 'a' || k === 'ф' || k === 'arrowleft') {
        keys.left = isDown;
        handled = true;
    }
    if (code === 'KeyD' || code === 'ArrowRight' || k === 'd' || k === 'в' || k === 'arrowright') {
        keys.right = isDown;
        handled = true;
    }
    if (code === 'KeyW' || code === 'ArrowUp' || k === 'w' || k === 'ц' || k === 'arrowup') {
        keys.up = isDown;
        handled = true;
    }
    if (code === 'KeyS' || code === 'ArrowDown' || k === 's' || k === 'ы' || k === 'arrowdown') {
        keys.down = isDown;
        handled = true;
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight' || k === 'shift') {
        keys.focus = isDown;
        handled = true;
    }
    if (code === 'KeyZ' || code === 'Space' || k === 'z' || k === 'я' || k === ' ') {
        keys.shoot = isDown;
        handled = true;
    }
    if (isDown && !e.repeat && (code === 'KeyX' || k === 'x' || k === 'ч')) {
        triggerBomb();
        handled = true;
    }
    if (isDown && !e.repeat && (code === 'KeyP' || code === 'Escape' || k === 'p' || k === 'з' || k === 'escape')) {
        togglePause();
        handled = true;
    }

    if (handled && e.cancelable && code !== 'F5' && code !== 'F12') {
        e.preventDefault();
    }
}

window.addEventListener('keydown', (e) => handleDanmakuKey(e, true));
window.addEventListener('keyup', (e) => handleDanmakuKey(e, false));

// Canvas touch drag
function getCanvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('touchstart', (e) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    isTouching = true;
    const t = e.touches[0];
    const c = getCanvasCoords(t.clientX, t.clientY);
    touchX = c.x;
    touchY = c.y;
    keys.shoot = true;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    if (!isTouching || gameState !== 'playing') return;
    e.preventDefault();
    const t = e.touches[0];
    const c = getCanvasCoords(t.clientX, t.clientY);
    // Smooth relative drag
    const dx = c.x - touchX;
    const dy = c.y - touchY;
    player.x = Math.max(16, Math.min(GAME_WIDTH - 16, player.x + dx));
    player.y = Math.max(20, Math.min(GAME_HEIGHT - 20, player.y + dy));
    touchX = c.x;
    touchY = c.y;
}, { passive: false });

canvas.addEventListener('touchend', () => {
    isTouching = false;
});

// Touch buttons
const touchFocusBtn = document.getElementById('touchFocusBtn');
const touchBombBtn = document.getElementById('touchBombBtn');
if (touchFocusBtn) {
    touchFocusBtn.addEventListener('click', () => {
        keys.focus = !keys.focus;
        touchFocusBtn.classList.toggle('active', keys.focus);
    });
}
if (touchBombBtn) {
    touchBombBtn.addEventListener('click', () => {
        triggerBomb();
    });
}

// === THEME COLOR HELPERS ===
function getComputedThemeColors() {
    const s = getComputedStyle(document.body);
    return {
        primary: s.getPropertyValue('--md-sys-color-primary').trim() || '#2196F3',
        onPrimary: s.getPropertyValue('--md-sys-color-on-primary').trim() || '#FFFFFF',
        tertiary: s.getPropertyValue('--md-sys-color-tertiary').trim() || '#00E5FF',
        error: s.getPropertyValue('--md-sys-color-error').trim() || '#F44336',
        surface: s.getPropertyValue('--md-sys-color-surface').trim() || '#121212',
        board: s.getPropertyValue('--md-sys-color-game-board').trim() || '#181A20',
        text: s.getPropertyValue('--md-sys-color-on-surface').trim() || '#FFFFFF'
    };
}

// === GAME START / RESET / PAUSE ===
function startNewGame() {
    score = 0;
    graze = 0;
    lives = 3;
    bombs = 2;
    gameTime = 0;
    player.x = GAME_WIDTH / 2;
    player.y = GAME_HEIGHT - 70;
    player.invincibleTimer = 2.0;
    playerBullets = [];
    enemyBullets = [];
    enemies = [];
    particles = [];
    floatingTexts = [];
    boss = null;
    bombActiveTimer = 0;
    spawnTimer = 0.5;

    document.getElementById('startMenu').classList.remove('active');
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('pauseScreen').classList.remove('active');

    gameState = 'playing';
    lastFrameTime = performance.now();
    updateScoreDisplay();
}

function gameOver() {
    gameState = 'gameover';
    playSfx('death');
    lastScore = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('danmakuHighScore', highScore);
        triggerVictoryParticles();
    }
    const finalScore = document.getElementById('finalScore');
    if (finalScore) finalScore.textContent = score.toLocaleString();
    const finalGraze = document.getElementById('finalGraze');
    if (finalGraze) finalGraze.textContent = graze.toLocaleString();
    const finalTime = document.getElementById('finalTime');
    if (finalTime) finalTime.textContent = Math.floor(gameTime) + 's';

    document.getElementById('gameOverScreen').classList.add('active');
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pauseScreen').classList.add('active');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseScreen').classList.remove('active');
        lastFrameTime = performance.now();
    }
}

function updateScoreDisplay() {
    if (scoreEl) scoreEl.textContent = score.toLocaleString();
}

// === BOMBS (SPELL CARD) ===
function triggerBomb() {
    if (gameState !== 'playing' || bombs <= 0 || bombActiveTimer > 0) return;
    bombs--;
    bombActiveTimer = 1.8;
    player.invincibleTimer = 2.8;
    playSfx('bomb');

    // Clear all enemy bullets into points
    for (const b of enemyBullets) {
        createSparkle(b.x, b.y, '#00E5FF', 5);
        score += 20;
    }
    enemyBullets = [];

    // Damage all enemies
    for (const e of enemies) {
        e.hp -= 250;
        createSparkle(e.x, e.y, '#FF5252', 12);
    }
    if (boss) {
        boss.hp -= 350;
        createSparkle(boss.x, boss.y, '#FF5252', 20);
    }
    addFloatingText(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'SPELL CARD!', '#FFD700', 22);
    updateScoreDisplay();
}

// === BULLET PATTERN GENERATORS ===
function spawnBulletRing(cx, cy, count, speed, color, r = 4, shape = 'circle', offsetAngle = 0) {
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
        const angle = offsetAngle + i * step;
        enemyBullets.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r,
            color,
            shape,
            grazed: false
        });
    }
}

function spawnBulletAimed(cx, cy, count, speed, spreadAngle, color, r = 3.5, shape = 'needle') {
    const baseAngle = Math.atan2(player.y - cy, player.x - cx);
    const startAngle = baseAngle - (spreadAngle * (count - 1)) / 2;
    for (let i = 0; i < count; i++) {
        const angle = startAngle + i * spreadAngle;
        enemyBullets.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r,
            color,
            shape,
            grazed: false
        });
    }
}

// === ENEMY SPAWNING & DIFFICULTY SCALING ===
let spawnTimer = 0;

function updateEnemySpawning(dt) {
    // Difficulty tier scales with time
    const difficultyTier = 1 + gameTime / 25; // 1.0 at 0s, 2.0 at 25s, 3.0 at 50s, etc.
    const spawnRate = Math.max(0.65, 2.2 / difficultyTier);

    spawnTimer -= dt;
    if (spawnTimer <= 0 && (!boss || enemies.length < 3)) {
        spawnTimer = spawnRate;
        spawnRandomEnemy(difficultyTier);
    }

    // Boss check: boss arrives at 40s, 90s, 150s...
    if (!boss) {
        const bossMilestones = [40, 95, 160, 240];
        for (const m of bossMilestones) {
            if (gameTime >= m && gameTime < m + 3) {
                spawnBoss(m);
                break;
            }
        }
    }
}

function spawnRandomEnemy(tier) {
    const typeRoll = Math.random();
    const side = Math.random() < 0.5 ? -1 : 1;
    const startX = Math.random() * (GAME_WIDTH - 80) + 40;

    if (typeRoll < 0.55) {
        // Fairy (Standard scout)
        enemies.push({
            type: 'fairy',
            x: startX,
            y: -20,
            targetY: Math.random() * 120 + 50,
            hp: 20 + tier * 5,
            maxHp: 20 + tier * 5,
            w: 22,
            h: 22,
            timer: 0,
            shootCooldown: Math.random() * 0.8 + 0.6,
            side
        });
    } else if (typeRoll < 0.85) {
        // Yin-Yang Orb (Medium heavy)
        enemies.push({
            type: 'yinyang',
            x: startX,
            y: -24,
            targetY: Math.random() * 140 + 70,
            hp: 60 + tier * 15,
            maxHp: 60 + tier * 15,
            w: 26,
            h: 26,
            timer: 0,
            shootCooldown: 1.2,
            rot: 0
        });
    } else {
        // Phantom Star (Fast sweeper)
        enemies.push({
            type: 'phantom',
            x: side === 1 ? -20 : GAME_WIDTH + 20,
            y: Math.random() * 100 + 40,
            vx: side * (1.8 + tier * 0.2),
            vy: 0.6,
            hp: 35 + tier * 8,
            maxHp: 35 + tier * 8,
            w: 20,
            h: 20,
            timer: 0,
            shootCooldown: 0.8
        });
    }
}

function spawnBoss(milestone) {
    const t = i18n[currentLang] || i18n.ru;
    let bId = 'vespera';
    let bName = t.bossVespera || 'Веспера, Ткачиха Сумерек';
    let spell = currentLang === 'ru' ? 'Сумеречная Паутина' : 'Twilight Filament';
    let bHp = 1400;
    let bColor = '#E040FB';

    if (milestone > 120) {
        bId = 'solaria';
        bName = t.bossSolaria || 'Солярия, Императрица Вспышек';
        spell = currentLang === 'ru' ? 'Мандала Сверхновой' : 'Supernova Mandala';
        bHp = 3400;
        bColor = '#FF1744';
    } else if (milestone > 60) {
        bId = 'chronos';
        bName = t.bossChronos || 'Хронос Ирис, Пульс Вечности';
        spell = currentLang === 'ru' ? 'Горизонт Сингулярности' : 'Singularity Horizon';
        bHp = 2300;
        bColor = '#FFD700';
    }

    boss = {
        id: bId,
        name: bName,
        spellName: spell,
        color: bColor,
        x: GAME_WIDTH / 2,
        y: -50,
        targetY: 90,
        hp: bHp,
        maxHp: bHp,
        w: 46,
        h: 46,
        timer: 0,
        phaseTimer: 0,
        phase: 1,
        angle: 0
    };
    addFloatingText(GAME_WIDTH / 2, 70, (currentLang === 'ru' ? 'ПРИБЛИЖЕНИЕ БОССА!' : 'BOSS WARNING!'), bColor, 20);
}

// === PARTICLES & FLOATING TEXTS ===
function createSparkle(x, y, color, count = 6, speedMult = 1) {
    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = (Math.random() * 2.5 + 1) * speedMult;
        particles.push({
            x,
            y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            life: 1.0,
            decay: Math.random() * 1.8 + 1.2,
            color,
            size: Math.random() * 3 + 2
        });
    }
}

function addFloatingText(x, y, text, color = '#FFFFFF', size = 13) {
    floatingTexts.push({
        x,
        y,
        text,
        color,
        size,
        life: 1.0,
        vy: -1.2
    });
}

function triggerVictoryParticles() {
    const colors = ['#00E5FF', '#FFD700', '#FF4081', '#76FF03', '#B388FF'];
    for (let i = 0; i < 40; i++) {
        createSparkle(GAME_WIDTH / 2, GAME_HEIGHT / 2, colors[i % colors.length], 1, 2.5);
    }
}

// === UPDATE LOOP ===
function update(dt) {
    if (gameState !== 'playing') return;

    gameTime += dt;

    // Bomb shockwave
    if (bombActiveTimer > 0) {
        bombActiveTimer -= dt;
    }

    // Player invincibility
    if (player.invincibleTimer > 0) {
        player.invincibleTimer -= dt;
    }

    // Player focus & movement
    player.focused = keys.focus;
    const curSpeed = (player.focused ? player.speedFocus : player.speedNormal);
    let mx = 0;
    let my = 0;
    if (keys.left) mx -= 1;
    if (keys.right) mx += 1;
    if (keys.up) my -= 1;
    if (keys.down) my += 1;

    if (mx !== 0 && my !== 0) {
        mx *= 0.7071;
        my *= 0.7071;
    }
    player.x = Math.max(16, Math.min(GAME_WIDTH - 16, player.x + mx * curSpeed));
    player.y = Math.max(20, Math.min(GAME_HEIGHT - 20, player.y + my * curSpeed));

    // Satellite option rotation
    player.optionAngle += dt * (player.focused ? 6 : 3.5);

    // Player shooting
    player.shootCooldown -= dt;
    if ((keys.shoot || isTouching) && player.shootCooldown <= 0) {
        player.shootCooldown = 0.085; // ~11 shots/sec
        playSfx('shoot');

        if (player.focused) {
            // High-damage concentrated forward streams (Touhou Focused Shot)
            playerBullets.push({ x: player.x - 7, y: player.y - 14, vx: 0, vy: -15, dmg: 14, w: 4, h: 14, color: '#00E5FF' });
            playerBullets.push({ x: player.x + 7, y: player.y - 14, vx: 0, vy: -15, dmg: 14, w: 4, h: 14, color: '#00E5FF' });
            playerBullets.push({ x: player.x - 2, y: player.y - 18, vx: 0, vy: -16, dmg: 16, w: 4, h: 16, color: '#FFFFFF' });
            playerBullets.push({ x: player.x + 2, y: player.y - 18, vx: 0, vy: -16, dmg: 16, w: 4, h: 16, color: '#FFFFFF' });
        } else {
            // Wide-angled fan spread (Touhou Unfocused Shot)
            playerBullets.push({ x: player.x - 6, y: player.y - 14, vx: 0, vy: -14, dmg: 11, w: 5, h: 12, color: '#29B6F6' });
            playerBullets.push({ x: player.x + 6, y: player.y - 14, vx: 0, vy: -14, dmg: 11, w: 5, h: 12, color: '#29B6F6' });
            playerBullets.push({ x: player.x - 14, y: player.y - 10, vx: -2.2, vy: -13, dmg: 9, w: 5, h: 12, color: '#4FC3F7' });
            playerBullets.push({ x: player.x + 14, y: player.y - 10, vx: 2.2, vy: -13, dmg: 9, w: 5, h: 12, color: '#4FC3F7' });
        }
    }

    // Update Player Bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const b = playerBullets[i];
        b.x += b.vx;
        b.y += b.vy;
        if (b.y < -30 || b.x < -30 || b.x > GAME_WIDTH + 30) {
            playerBullets.splice(i, 1);
            continue;
        }

        // Check collision with regular enemies
        let hit = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];
            if (Math.abs(b.x - e.x) < e.w / 2 + b.w / 2 && Math.abs(b.y - e.y) < e.h / 2 + b.h / 2) {
                e.hp -= b.dmg;
                hit = true;
                playSfx('hit');
                createSparkle(b.x, b.y, b.color, 2);
                if (e.hp <= 0) {
                    playSfx('explode');
                    createSparkle(e.x, e.y, '#FFD700', 14);
                    score += e.maxHp * 15;
                    updateScoreDisplay();
                    enemies.splice(j, 1);
                }
                break;
            }
        }

        // Check collision with Boss
        if (!hit && boss) {
            if (Math.abs(b.x - boss.x) < boss.w / 2 + b.w / 2 && Math.abs(b.y - boss.y) < boss.h / 2 + b.h / 2) {
                boss.hp -= b.dmg;
                hit = true;
                playSfx('hit');
                createSparkle(b.x, b.y, b.color, 2);
                if (boss.hp <= 0) {
                    playSfx('explode');
                    triggerVictoryParticles();
                    score += 25000;
                    bombs = Math.min(3, bombs + 1); // Reward bomb
                    addFloatingText(boss.x, boss.y - 20, 'SPELL BREAK! +25000', '#FFD700', 16);
                    updateScoreDisplay();
                    boss = null;
                }
            }
        }

        if (hit) {
            playerBullets.splice(i, 1);
        }
    }

    // Update Enemy Spawning
    updateEnemySpawning(dt);

    // Update Regular Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.timer += dt;
        e.shootCooldown -= dt;

        if (e.type === 'fairy') {
            // Sinuous curve to targetY, then drift down
            e.y += (e.targetY - e.y) * 0.05 + 0.4;
            e.x += Math.sin(e.timer * 2.5) * 1.8;

            if (e.shootCooldown <= 0 && e.y < GAME_HEIGHT - 120) {
                e.shootCooldown = Math.max(0.9, 2.0 - gameTime * 0.01);
                spawnBulletAimed(e.x, e.y + 10, 3, 2.6, 0.22, '#FF1744', 3.5, 'needle');
            }
        } else if (e.type === 'yinyang') {
            e.y += (e.targetY - e.y) * 0.04 + 0.25;
            e.rot = (e.rot || 0) + dt * 2;

            if (e.shootCooldown <= 0 && e.y < GAME_HEIGHT - 140) {
                e.shootCooldown = Math.max(1.1, 2.2 - gameTime * 0.012);
                const bulletCount = 8 + Math.min(10, Math.floor(gameTime / 18));
                spawnBulletRing(e.x, e.y, bulletCount, 2.2, '#00E5FF', 4, 'circle', e.rot);
            }
        } else if (e.type === 'phantom') {
            e.x += e.vx;
            e.y += e.vy;
            if (e.shootCooldown <= 0) {
                e.shootCooldown = 1.0;
                spawnBulletAimed(e.x, e.y, 2, 3.2, 0.15, '#FFD600', 3, 'needle');
            }
        }

        if (e.y > GAME_HEIGHT + 40 || e.x < -60 || e.x > GAME_WIDTH + 60) {
            enemies.splice(i, 1);
        }
    }

    // Update Boss
    if (boss) {
        boss.timer += dt;
        boss.phaseTimer += dt;
        boss.y += (boss.targetY - boss.y) * 0.04;
        boss.x = GAME_WIDTH / 2 + Math.sin(boss.timer * 1.05) * 75;
        boss.angle += dt * 1.8;

        if (boss.id === 'vespera') {
            // Vespera: Twilight Weaver (Spirals & Stardust)
            const attackCycle = boss.timer % 5.5;
            if (attackCycle < 3.4) {
                if (Math.floor(boss.timer * 20) % 4 === 0) {
                    const spd = 2.4;
                    const a = boss.angle;
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: 4, color: '#E040FB', shape: 'star', grazed: false });
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a + Math.PI) * spd, vy: Math.sin(a + Math.PI) * spd, r: 4, color: '#00E5FF', shape: 'star', grazed: false });
                }
            } else if (attackCycle >= 3.8 && attackCycle < 4.8) {
                if (Math.floor(boss.timer * 10) % 3 === 0) {
                    spawnBulletAimed(boss.x, boss.y, 7, 2.7, 0.18, '#B388FF', 3.5, 'needle');
                }
            }
        } else if (boss.id === 'chronos') {
            // Chronos Iris: Pulse of Eternity (Clockwork rings & Pendulums)
            const attackCycle = boss.timer % 6.0;
            if (attackCycle < 3.8) {
                if (Math.floor(boss.timer * 12) % 4 === 0) {
                    spawnBulletRing(boss.x, boss.y, 12, 2.2, '#FFD700', 4.5, 'circle', boss.angle);
                }
            } else if (attackCycle >= 4.2 && attackCycle < 5.4) {
                if (Math.floor(boss.timer * 10) % 2 === 0) {
                    spawnBulletAimed(boss.x, boss.y, 5, 3.2, 0.16, '#FFAB00', 4, 'needle');
                }
            }
        } else {
            // Solaria: Flare Empress (Solar corona & Supernova spreads)
            const attackCycle = boss.timer % 6.5;
            if (attackCycle < 4.2) {
                if (Math.floor(boss.timer * 16) % 3 === 0) {
                    const spd = 2.8;
                    const a = boss.angle * 1.4;
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: 4.5, color: '#FF1744', shape: 'circle', grazed: false });
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(-a) * spd, vy: Math.sin(-a) * spd, r: 4.5, color: '#FF9100', shape: 'star', grazed: false });
                }
            } else if (attackCycle >= 4.6 && attackCycle < 6.0) {
                if (Math.floor(boss.timer * 10) % 2 === 0) {
                    spawnBulletAimed(boss.x, boss.y, 9, 3.1, 0.16, '#D50000', 4, 'needle');
                }
            }
        }
    }

    // Update Enemy Bullets & Check TOUHOU 6 HITBOX
    const playerHitboxR = HITBOX_RADIUS; // exactly 3px
    const playerGrazeR = GRAZE_RADIUS;   // 18px

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        b.x += b.vx;
        b.y += b.vy;

        // Offscreen check
        if (b.y < -40 || b.y > GAME_HEIGHT + 40 || b.x < -40 || b.x > GAME_WIDTH + 40) {
            enemyBullets.splice(i, 1);
            continue;
        }

        const dx = b.x - player.x;
        const dy = b.y - player.y;
        const distSq = dx * dx + dy * dy;

        // 1. Touhou 6 CORE HITBOX COLLISION
        const hitThreshold = b.r + playerHitboxR;
        if (distSq < hitThreshold * hitThreshold) {
            if (player.invincibleTimer <= 0) {
                // PLAYER HIT!
                enemyBullets.splice(i, 1);
                playerHit();
                break;
            }
            continue;
        }

        // 2. TOUHOU GRAZE CHECK
        // If bullet enters graze radius (18px) but misses 3px core, award Graze!
        if (!b.grazed && distSq < (b.r + playerGrazeR) * (b.r + playerGrazeR)) {
            b.grazed = true;
            graze++;
            score += 100;
            playSfx('graze');
            createSparkle(b.x, b.y, '#FFFFFF', 3, 0.8);
            updateScoreDisplay();
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay * dt;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Update floating texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.life -= dt * 0.9;
        if (ft.life <= 0) {
            floatingTexts.splice(i, 1);
        }
    }
}

function playerHit() {
    playSfx('death');
    lives--;
    createSparkle(player.x, player.y, '#FF1744', 30, 2.5);

    // Bullet clear on death
    for (const b of enemyBullets) {
        createSparkle(b.x, b.y, '#00E5FF', 2);
    }
    enemyBullets = [];

    if (lives < 0) {
        gameOver();
    } else {
        // Respawn at bottom center with invincibility
        player.x = GAME_WIDTH / 2;
        player.y = GAME_HEIGHT - 70;
        player.invincibleTimer = 2.5;
        bombs = Math.max(bombs, 2); // Touhou gives back default bombs
        addFloatingText(player.x, player.y - 30, 'MISS!', '#FF5252', 18);
    }
}

// === RENDERING (CANVAS 2D) ===
function draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale canvas context to virtual resolution (400x560)
    const scaleX = canvas.width / GAME_WIDTH;
    const scaleY = canvas.height / GAME_HEIGHT;
    ctx.scale(scaleX, scaleY);

    const colors = getComputedThemeColors();

    // 1. Background (deep space / starry shrine atmosphere)
    drawBackground(colors);

    // 2. Bomb Shockwave
    if (bombActiveTimer > 0) {
        const waveProgress = 1 - (bombActiveTimer / 1.8);
        const radius = waveProgress * GAME_HEIGHT * 1.3;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 215, 0, ' + (1 - waveProgress) * 0.7 + ')';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, ' + (1 - waveProgress) * 0.12 + ')';
        ctx.fill();
        ctx.restore();
    }

    // 3. Player Bullets
    for (const b of playerBullets) {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 3);
        ctx.fill();
        ctx.restore();
    }

    // 4. Enemies
    for (const e of enemies) {
        drawEnemy(e, colors);
    }

    // 5. Boss
    if (boss) {
        drawBoss(boss, colors);
    }

    // 6. Enemy Bullets
    for (const b of enemyBullets) {
        drawBullet(b);
    }

    // 7. Player Character & TOUHOU 6 HITBOX
    if (lives >= 0) {
        drawPlayer(colors);
    }

    // 8. Particles
    for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // 9. Floating Texts
    for (const ft of floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.font = '700 ' + ft.size + 'px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }

    // 10. In-Game Minimalist HUD
    drawHUD(colors);

    ctx.restore();
}

function drawBackground(colors) {
    // Subtle gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    grad.addColorStop(0, colors.board);
    grad.addColorStop(1, colors.surface);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Drifting starfield
    const starCount = 35;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < starCount; i++) {
        const sx = ((i * 137.5) % GAME_WIDTH);
        const sy = ((i * 93.3 + gameTime * (20 + (i % 3) * 15)) % GAME_HEIGHT);
        const sSize = (i % 3 === 0) ? 1.8 : 1.0;
        ctx.fillRect(sx, sy, sSize, sSize);
    }
}

// === VECTOR MODEL: PLAYER ===
function drawPlayer(colors) {
    // Blinking during invincibility
    if (player.invincibleTimer > 0 && Math.floor(player.invincibleTimer * 14) % 2 === 0) {
        return;
    }

    ctx.save();
    ctx.translate(player.x, player.y);

    // Satellite focus option orbs (spread wide in normal mode, drawn close in focus)
    const optionDist = player.focused ? 13 : 26;
    const optY = Math.sin(player.optionAngle) * 3;
    for (let side of [-1, 1]) {
        const ox = side * optionDist;
        const oy = optY;
        ctx.fillStyle = colors.tertiary;
        ctx.shadowColor = colors.tertiary;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ox, oy, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Main Craft / Shrine Heroine Wings
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.primary;

    // Outer swept wings
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(13, 10);
    ctx.lineTo(8, 14);
    ctx.lineTo(0, 8);
    ctx.lineTo(-8, 14);
    ctx.lineTo(-13, 10);
    ctx.closePath();
    ctx.fill();

    // Inner hull
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(5, 4);
    ctx.lineTo(0, 10);
    ctx.lineTo(-5, 4);
    ctx.closePath();
    ctx.fill();

    // Central Ribbon / Bow
    ctx.fillStyle = colors.error;
    ctx.beginPath();
    ctx.arc(0, 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // ========================================================
    // TOUHOU 6 HITBOX RENDERING
    // In Touhou 6, during Focus Mode (Shift), the exact central
    // 3px micro-hitbox is prominently highlighted with high contrast!
    // ========================================================
    if (player.focused) {
        // Outer pulsing focus reticle
        const pulse = Math.sin(gameTime * 12) * 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 9 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Exact Touhou 6 Hitbox Core (radius = 3px)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = '#FF1744';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, HITBOX_RADIUS + 1, 0, Math.PI * 2);
        ctx.fill();

        // Exact center red jewel point (Touhou 6 icon)
        ctx.fillStyle = '#FF1744';
        ctx.beginPath();
        ctx.arc(0, 0, HITBOX_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// === VECTOR MODEL: ENEMIES ===
function drawEnemy(e, colors) {
    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.type === 'fairy') {
        // Floating spirit with radiant animated wings
        const wingFlap = Math.sin(e.timer * 8) * 0.3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        // Left wing
        ctx.beginPath();
        ctx.ellipse(-9, -2, 9, 4 + wingFlap * 2, -0.4, 0, Math.PI * 2);
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.ellipse(9, -2, 9, 4 + wingFlap * 2, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Core fairy body
        ctx.fillStyle = colors.error;
        ctx.shadowColor = colors.error;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, -2, 3.5, 0, Math.PI * 2);
        ctx.fill();
    } else if (e.type === 'yinyang') {
        // Rotating Yin-Yang Danmaku Sphere
        ctx.rotate(e.rot || 0);
        ctx.shadowColor = colors.tertiary;
        ctx.shadowBlur = 10;

        // Base circle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        // Dark half
        ctx.fillStyle = '#1A237E';
        ctx.beginPath();
        ctx.arc(0, 0, 11, Math.PI / 2, Math.PI * 1.5);
        ctx.fill();

        // Inner swirls
        ctx.beginPath();
        ctx.arc(0, -5.5, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 5.5, 5.5, 0, Math.PI * 2);
        ctx.fill();
    } else if (e.type === 'phantom') {
        // Sharp diamond sweeper
        ctx.fillStyle = '#FFD600';
        ctx.shadowColor = '#FFD600';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(9, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-9, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Enemy mini HP bar
    if (e.hp < e.maxHp) {
        ctx.restore();
        ctx.save();
        const barW = 20;
        const hpPct = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - barW / 2, e.y - e.h / 2 - 6, barW, 2.5);
        ctx.fillStyle = colors.error;
        ctx.fillRect(e.x - barW / 2, e.y - e.h / 2 - 6, barW * hpPct, 2.5);
    }

    ctx.restore();
}

// === VECTOR MODEL: BOSS ===
function drawBoss(b, colors) {
    ctx.save();
    ctx.translate(b.x, b.y);

    if (b.id === 'vespera') {
        // Vespera: The Twilight Weaver (Amethyst Astral Mandala)
        ctx.save();
        ctx.rotate(b.angle);
        ctx.strokeStyle = 'rgba(224, 64, 251, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 4; i++) {
            const a = (i * Math.PI) / 2;
            const ox = Math.cos(a) * 32;
            const oy = Math.sin(a) * 32;
            ctx.fillStyle = '#00E5FF';
            ctx.shadowColor = '#00E5FF';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(ox, oy - 5);
            ctx.lineTo(ox + 4, oy);
            ctx.lineTo(ox, oy + 5);
            ctx.lineTo(ox - 4, oy);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        ctx.shadowColor = '#E040FB';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#7B1FA2';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#EA80FC';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (b.id === 'chronos') {
        // Chronos Iris: Pulse of Eternity (Clockwork Halos & Pendulums)
        ctx.save();
        ctx.rotate(b.angle);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 171, 0, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 38, 0, Math.PI * 2);
        ctx.stroke();

        // 8 clockwork gear teeth
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(Math.cos(a) * 30 - 2, Math.sin(a) * 30 - 2, 4, 4);
        }
        ctx.restore();

        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#FF8F00';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFE082';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Solaria: The Flare Empress (Blazing Solar Corona)
        ctx.save();
        ctx.rotate(-b.angle * 1.5);
        ctx.fillStyle = 'rgba(255, 87, 34, 0.4)';
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * 16, Math.sin(a) * 16);
            ctx.lineTo(Math.cos(a + 0.2) * 36, Math.sin(a + 0.2) * 36);
            ctx.lineTo(Math.cos(a + 0.4) * 16, Math.sin(a + 0.4) * 16);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        ctx.shadowColor = '#FF1744';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#D50000';
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF6D00';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

    // Boss Top Health Bar & Spell Banner
    const hpPct = Math.max(0, b.hp / b.maxHp);
    const barWidth = GAME_WIDTH - 60;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.roundRect(30, 18, barWidth, 6, 3);
    ctx.fill();

    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 8;
    ctx.roundRect(30, 18, barWidth * hpPct, 6, 3);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(b.name, 32, 14);

    ctx.fillStyle = b.color;
    ctx.textAlign = 'right';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText(b.spellName, GAME_WIDTH - 32, 14);
    ctx.restore();
}

// === VECTOR MODEL: BULLETS ===
function drawBullet(b) {
    ctx.save();
    ctx.translate(b.x, b.y);

    if (b.shape === 'needle') {
        const angle = Math.atan2(b.vy, b.vx);
        ctx.rotate(angle);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-b.r * 1.8, -b.r * 0.8, b.r * 3.6, b.r * 1.6, 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(-b.r, -b.r * 0.4, b.r * 2, b.r * 0.8, 1);
        ctx.fill();
    } else if (b.shape === 'star') {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const aInner = a + Math.PI / 5;
            const rOuter = b.r * 1.4;
            const rInner = b.r * 0.6;
            if (i === 0) ctx.moveTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
            else ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
            ctx.lineTo(Math.cos(aInner) * rInner, Math.sin(aInner) * rInner);
        }
        ctx.closePath();
        ctx.fill();
    } else {
        // Classic circular Danmaku bead
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Bright white interior core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, b.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// === IN-GAME HUD ===
function drawHUD(colors) {
    ctx.save();
    // Bottom status strip: Lives & Bombs
    const bottomY = GAME_HEIGHT - 12;

    // Lives: Hearts
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    let livesStr = '';
    for (let i = 0; i < Math.max(0, lives); i++) livesStr += '❤️ ';
    ctx.fillText(livesStr || '💀', 12, bottomY);

    // Bombs: Stars/Gems
    ctx.textAlign = 'right';
    let bombsStr = '';
    for (let i = 0; i < bombs; i++) bombsStr += '💣 ';
    ctx.fillText(bombsStr, GAME_WIDTH - 12, bottomY);

    // Top subtle graze counter
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('GRAZE: ' + graze, 12, 22);

    ctx.textAlign = 'right';
    ctx.fillText(Math.floor(gameTime) + 's', GAME_WIDTH - 12, 22);

    ctx.restore();
}

// === MAIN LOOP ===
function gameLoop(now) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05); // Cap to 50ms to prevent spiral of death
    lastFrameTime = now;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// === LOCALIZATION & MENU BUTTONS ===
function applyLanguage() {
    document.documentElement.lang = currentLang;
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();

    const t = i18n[currentLang] || i18n.ru;
    const scoreTitle = document.getElementById('uiScoreTitle');
    if (scoreTitle) scoreTitle.innerText = t.scoreTitle;
    const mainTitle = document.getElementById('uiMainTitle');
    if (mainTitle) mainTitle.innerText = t.danmakuTitle || 'ДАНМАКУ ХЕЛЛ';
    const playBtn = document.getElementById('uiPlayBtn');
    if (playBtn) playBtn.innerText = t.playBtn;
    const restartBtn = document.getElementById('uiRestartBtn');
    if (restartBtn) restartBtn.innerText = t.restartBtn;
    const menuBtn = document.getElementById('uiMenuBtn');
    if (menuBtn) menuBtn.innerText = t.menuBtn;
    const gameOverTitle = document.getElementById('uiGameOverTitle');
    if (gameOverTitle) gameOverTitle.innerText = t.gameOverTitle;
    const finalScoreText = document.getElementById('uiFinalScoreText');
    if (finalScoreText) finalScoreText.innerText = t.finalScoreText;
    const finalGrazeText = document.getElementById('uiFinalGrazeText');
    if (finalGrazeText) finalGrazeText.innerText = t.danmakuGraze || 'Грейз: ';
    const finalTimeText = document.getElementById('uiFinalTimeText');
    if (finalTimeText) finalTimeText.innerText = t.danmakuTime || 'Время: ';
    const pauseTitle = document.getElementById('uiPauseTitle');
    if (pauseTitle) pauseTitle.innerText = currentLang === 'ru' ? 'Пауза' : 'Pause';
    const resumeBtn = document.getElementById('uiResumeBtn');
    if (resumeBtn) resumeBtn.innerText = currentLang === 'ru' ? 'Продолжить' : 'Resume';
    const pauseRestart = document.getElementById('uiPauseRestartBtn');
    if (pauseRestart) pauseRestart.innerText = t.restartBtn;

    const toHubBtns = document.querySelectorAll('#uiDanmakuToHubBtn, #uiGameOverToHubBtn');
    toHubBtns.forEach(el => el.innerText = t.allGamesBtn);

    const controlsTitle = document.getElementById('uiControlsTitle');
    if (controlsTitle) controlsTitle.innerText = currentLang === 'ru' ? 'Управление' : 'Controls';
    const controlsTip = document.getElementById('uiControlsTip');
    if (controlsTip) controlsTip.innerHTML = currentLang === 'ru' 
        ? 'WASD/Стрелки — движение<br><b>Shift</b> — Точный фокус (хитбокс 3px)<br><b>Z / Пробел</b> — стрельба | <b>X</b> — Бомба'
        : 'WASD/Arrows — move<br><b>Shift</b> — Precision focus (3px hitbox)<br><b>Z / Space</b> — shoot | <b>X</b> — Bomb';

    const touchFocus = document.getElementById('touchFocusBtn');
    if (touchFocus) touchFocus.innerText = t.danmakuFocusBtn || 'Фокус (Shift)';
    const touchBomb = document.getElementById('touchBombBtn');
    if (touchBomb) touchBomb.innerText = t.danmakuBombBtn || 'Бомба (X)';

    const menuHigh = document.getElementById('menuHighScoreText');
    if (menuHigh) menuHigh.innerText = t.bestScore + highScore.toLocaleString();
    const menuLast = document.getElementById('menuLastScoreText');
    if (menuLast) menuLast.innerText = t.lastScore + lastScore.toLocaleString();

    const homeBtnEl = document.getElementById('homeBtn');
    if (homeBtnEl) homeBtnEl.title = t.homeTooltip || 'Home';
    const paletteBtnEl = document.getElementById('paletteBtn');
    if (paletteBtnEl) paletteBtnEl.title = t.paletteTooltip || 'Theme & Palette';
    const modeText = document.getElementById('uiThemeModeText');
    if (modeText) modeText.textContent = isDark ? (t.themeModeDark || 'Dark mode') : (t.themeModeLight || 'Light mode');
}

// Language toggle
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        setCookie('snakeLang', currentLang);
        applyLanguage();
    });
}

// Palette Dropdown
const paletteBtn = document.getElementById('paletteBtn');
const palettePopover = document.getElementById('palettePopover');
if (paletteBtn && palettePopover) {
    paletteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willBeActive = !palettePopover.classList.contains('active');
        palettePopover.classList.toggle('active', willBeActive);
        paletteBtn.classList.toggle('active', willBeActive);
    });

    palettePopover.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const c = btn.getAttribute('data-c');
            applyColor(c);
            setTimeout(() => {
                palettePopover.classList.remove('active');
                paletteBtn.classList.remove('active');
            }, 180);
        });
    });

    document.addEventListener('click', (e) => {
        if (!palettePopover.contains(e.target) && e.target !== paletteBtn && !paletteBtn.contains(e.target)) {
            palettePopover.classList.remove('active');
            paletteBtn.classList.remove('active');
        }
    });
}

function applyColor(c) {
    activeColor = c;
    document.documentElement.setAttribute('data-color', c);
    document.body.setAttribute('data-color', c);
    setCookie('snakeColor', c, 365);
    document.querySelectorAll('.color-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-c') === c);
    });
}

// Theme Toggle (Dark / Light)
const sunPathSvg = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 000-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
const moonPathSvg = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';

function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    setCookie('snakeTheme', isDark ? 'dark' : 'light', 365);

    const modeIcon = document.getElementById('themeModeIcon');
    if (modeIcon) modeIcon.innerHTML = isDark ? moonPathSvg : sunPathSvg;
    const modeText = document.getElementById('uiThemeModeText');
    if (modeText) {
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : null;
        modeText.textContent = isDark ? (t?.themeModeDark || 'Dark mode') : (t?.themeModeLight || 'Light mode');
    }
}

const themeModeToggle = document.getElementById('themeModeToggle') || document.getElementById('themeToggle');
if (themeModeToggle) {
    themeModeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isDark = !isDark;
        applyTheme();
    });
}

// Menu button bindings
const playBtn = document.getElementById('uiPlayBtn');
if (playBtn) playBtn.addEventListener('click', startNewGame);

const restartBtn = document.getElementById('uiRestartBtn');
if (restartBtn) restartBtn.addEventListener('click', startNewGame);

const pauseResume = document.getElementById('uiResumeBtn');
if (pauseResume) pauseResume.addEventListener('click', togglePause);

const pauseRestart = document.getElementById('uiPauseRestartBtn');
if (pauseRestart) pauseRestart.addEventListener('click', startNewGame);

const menuBtn = document.getElementById('uiMenuBtn');
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('pauseScreen').classList.remove('active');
        document.getElementById('startMenu').classList.add('active');
        applyLanguage();
        gameState = 'menu';
    });
}

// Initialize on load
applyTheme();
applyColor(activeColor);
applyLanguage();
