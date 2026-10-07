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
    speed: 2.8, // Single canonical Touhou speed
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
    shoot: false,
    bomb: false
};

// Touch drag support
let isTouching = false;
let touchX = 0;
let touchY = 0;

// === CONTROLS LISTENERS (Layout-independent via e.code + Cyrillic fallback) ===
function handleDanmakuKey(e, isDown) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
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
const touchBombBtn = document.getElementById('touchBombBtn');
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
    if (typeof playerNameInput !== 'undefined' && playerNameInput) {
        const val = (typeof sanitizeName === 'function') ? sanitizeName(playerNameInput.value.trim()) : playerNameInput.value.trim();
        if (val) {
            savedName = val;
            setCookie('snakeNick', savedName, 365);
            localStorage.setItem('danmakuNick', savedName);
        }
    }
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
    accumulator = 0;
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
    if (finalScore) finalScore.textContent = Math.floor(score).toLocaleString();
    const finalGraze = document.getElementById('finalGraze');
    if (finalGraze) finalGraze.textContent = Math.floor(graze).toLocaleString();
    const finalTime = document.getElementById('finalTime');
    if (finalTime) finalTime.textContent = Math.floor(gameTime) + 's';

    document.getElementById('gameOverScreen').classList.add('active');
    if (typeof saveScoreToLeaderboard === 'function') saveScoreToLeaderboard(true);
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pauseScreen').classList.add('active');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseScreen').classList.remove('active');
        accumulator = 0;
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
        const fairyHp = Math.round(20 + tier * 5);
        enemies.push({
            type: 'fairy',
            x: startX,
            y: -20,
            targetY: Math.random() * 120 + 50,
            hp: fairyHp,
            maxHp: fairyHp,
            w: 22,
            h: 22,
            timer: 0,
            shootCooldown: Math.random() * 0.8 + 0.6,
            side
        });
    } else if (typeRoll < 0.85) {
        // Yin-Yang Orb (Medium heavy)
        const yinyangHp = Math.round(60 + tier * 15);
        enemies.push({
            type: 'yinyang',
            x: startX,
            y: -24,
            targetY: Math.random() * 140 + 70,
            hp: yinyangHp,
            maxHp: yinyangHp,
            w: 26,
            h: 26,
            timer: 0,
            shootCooldown: 1.2,
            rot: 0
        });
    } else {
        // Phantom Star (Fast sweeper)
        const phantomHp = Math.round(35 + tier * 8);
        enemies.push({
            type: 'phantom',
            x: side === 1 ? -20 : GAME_WIDTH + 20,
            y: Math.random() * 100 + 40,
            vx: side * (1.8 + tier * 0.2),
            vy: 0.6,
            hp: phantomHp,
            maxHp: phantomHp,
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
        angle: 0,
        attackCooldown: 0.5
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

    // Player movement (Canonical Touhou Speed)
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
    player.x = Math.max(16, Math.min(GAME_WIDTH - 16, player.x + mx * player.speed));
    player.y = Math.max(20, Math.min(GAME_HEIGHT - 20, player.y + my * player.speed));

    // Satellite option rotation
    player.optionAngle += dt * 4;

    // Player shooting (Canonical Touhou Balanced Pattern)
    player.shootCooldown -= dt;
    if ((keys.shoot || isTouching) && player.shootCooldown <= 0) {
        player.shootCooldown = 0.085; // ~11 shots/sec
        playSfx('shoot');

        // Forward core talisman streams
        playerBullets.push({ x: player.x - 7, y: player.y - 14, vx: 0, vy: -15, dmg: 14, w: 4, h: 14, color: '#00E5FF' });
        playerBullets.push({ x: player.x + 7, y: player.y - 14, vx: 0, vy: -15, dmg: 14, w: 4, h: 14, color: '#00E5FF' });

        // Supportive angled needle streams
        playerBullets.push({ x: player.x - 14, y: player.y - 10, vx: -1.4, vy: -14, dmg: 10, w: 4, h: 12, color: '#4FC3F7' });
        playerBullets.push({ x: player.x + 14, y: player.y - 10, vx: 1.4, vy: -14, dmg: 10, w: 4, h: 12, color: '#4FC3F7' });
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
                    score += Math.round(e.maxHp * 15);
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
        boss.attackCooldown -= dt;
        boss.y += (boss.targetY - boss.y) * 0.04;
        boss.x = GAME_WIDTH / 2 + Math.sin(boss.timer * 1.05) * 75;
        boss.angle += dt * 1.8;

        if (boss.id === 'vespera') {
            // Vespera: Twilight Weaver (Spirals & Stardust)
            const attackCycle = boss.timer % 5.5;
            if (attackCycle < 3.4) {
                if (boss.attackCooldown <= 0) {
                    boss.attackCooldown = 0.18;
                    const spd = 2.4;
                    const a = boss.angle;
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: 4, color: '#E040FB', shape: 'star', grazed: false });
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a + Math.PI) * spd, vy: Math.sin(a + Math.PI) * spd, r: 4, color: '#00E5FF', shape: 'star', grazed: false });
                }
            } else if (attackCycle >= 3.8 && attackCycle < 4.8) {
                if (boss.attackCooldown <= 0) {
                    boss.attackCooldown = 0.38;
                    spawnBulletAimed(boss.x, boss.y, 7, 2.7, 0.18, '#B388FF', 3.5, 'needle');
                }
            }
        } else if (boss.id === 'chronos') {
            // Chronos Iris: Pulse of Eternity (Clockwork rings & Pendulums)
            const attackCycle = boss.timer % 6.0;
            if (attackCycle < 3.8) {
                if (boss.attackCooldown <= 0) {
                    boss.attackCooldown = 0.65;
                    spawnBulletRing(boss.x, boss.y, 12, 2.2, '#FFD700', 4.5, 'circle', boss.angle);
                }
            } else if (attackCycle >= 4.2 && attackCycle < 5.4) {
                if (boss.attackCooldown <= 0) {
                    boss.attackCooldown = 0.40;
                    spawnBulletAimed(boss.x, boss.y, 5, 3.2, 0.16, '#FFAB00', 4, 'needle');
                }
            }
        } else {
            // Solaria: Flare Empress (Solar corona & Supernova spreads)
            const attackCycle = boss.timer % 6.5;
            if (attackCycle < 4.2) {
                if (boss.attackCooldown <= 0) {
                    boss.attackCooldown = 0.22;
                    const spd = 2.8;
                    const a = boss.angle * 1.4;
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: 4.5, color: '#FF1744', shape: 'circle', grazed: false });
                    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(-a) * spd, vy: Math.sin(-a) * spd, r: 4.5, color: '#FF9100', shape: 'star', grazed: false });
                }
            } else if (attackCycle >= 4.6 && attackCycle < 6.0) {
                if (boss.attackCooldown <= 0) {
                    boss.attackCooldown = 0.38;
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
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 3);
        ctx.fill();
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
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

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

    // Satellite option orbs (Canonical Touhou Style)
    const optionDist = 20;
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

    // Central Core Jewel (Touhou 6 Style)
    ctx.fillStyle = colors.error;
    ctx.beginPath();
    ctx.arc(0, 2, 3, 0, Math.PI * 2);
    ctx.fill();

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

    // Background track
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.roundRect(30, 18, barWidth, 6, 3);
    ctx.fill();

    // Active Health Fill (shrinks as boss loses HP!)
    if (hpPct > 0) {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        const curW = Math.max(1, barWidth * hpPct);
        const r = Math.min(3, curW / 2);
        ctx.beginPath();
        ctx.roundRect(30, 18, curW, 6, r);
        ctx.fill();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 0;
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
    if (b.shape === 'needle') {
        ctx.save();
        ctx.translate(b.x, b.y);
        const angle = Math.atan2(b.vy, b.vx);
        ctx.rotate(angle);
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(-b.r * 1.8, -b.r * 0.8, b.r * 3.6, b.r * 1.6, 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(-b.r, -b.r * 0.4, b.r * 2, b.r * 0.8, 1);
        ctx.fill();
        ctx.restore();
    } else if (b.shape === 'star') {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.fillStyle = b.color;
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
        ctx.restore();
    } else {
        // Classic circular Danmaku bead (Direct rendering without matrix overhead)
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Bright white interior core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
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

// === MAIN LOOP (Fixed 60 FPS Timestep for 100% monitor refresh rate parity) ===
const TICK_RATE = 1 / 60; // Exact 60 Hz physics tick
let accumulator = 0;

function gameLoop(now) {
    const elapsed = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;

    if (gameState === 'playing') {
        accumulator += elapsed;
        let steps = 0;
        while (accumulator >= TICK_RATE && steps < 5) {
            update(TICK_RATE);
            accumulator -= TICK_RATE;
            steps++;
        }
        if (steps >= 5) accumulator = 0;
    } else {
        accumulator = 0;
    }

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

    const toHubBtns = document.querySelectorAll('.to-hub-btn, #uiDanmakuToHubBtn, #uiGameOverToHubBtn, #uiPauseToHubBtn');
    toHubBtns.forEach(el => el.innerText = t.allGamesBtn || (currentLang === 'ru' ? 'Все игры' : 'All games'));

    const controlsTitle = document.getElementById('uiControlsTitle');
    if (controlsTitle) controlsTitle.innerText = currentLang === 'ru' ? 'Управление' : 'Controls';
    const controlsTip = document.getElementById('uiControlsTip');
    if (controlsTip) controlsTip.innerHTML = currentLang === 'ru' 
        ? 'WASD/Стрелки — движение | <b>Z / Пробел</b> — стрельба | <b>X</b> — Бомба'
        : 'WASD/Arrows — move | <b>Z / Space</b> — shoot | <b>X</b> — Bomb';

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

    // Leaderboard
    const lbTitleEl = document.getElementById('lbTitle');
    if (lbTitleEl) lbTitleEl.innerText = t.lbTitle;
    const lbShowMoreEl = document.getElementById('lbShowMore');
    if (lbShowMoreEl) lbShowMoreEl.innerText = lbShowAll ? t.lbShowTop : t.lbShowAll;
    const lbLoading = document.getElementById('lbLoadingText');
    if (lbLoading) lbLoading.innerText = t.lbLoading;
    const pNameInput = document.getElementById('playerNameInput');
    if (pNameInput) pNameInput.placeholder = t.placeholder;

    // Feedback
    const fbTitleEl = document.getElementById('fbTitle');
    if (fbTitleEl) fbTitleEl.innerText = t.fbTitle;
    const fbWriteBtnEl = document.getElementById('fbWriteBtn');
    if (fbWriteBtnEl) fbWriteBtnEl.innerText = t.fbWriteBtn;
    const fbModalTitle = document.querySelector('#fbOverlay .auth-title');
    if (fbModalTitle) fbModalTitle.innerText = t.fbOverlayTitle;
    const fbNameInputEl = document.getElementById('fbNameInput');
    if (fbNameInputEl) fbNameInputEl.placeholder = t.fbNamePlaceholder;
    const fbMessageInputEl = document.getElementById('fbMessageInput');
    if (fbMessageInputEl) fbMessageInputEl.placeholder = t.fbMsgPlaceholder;
    const fbSubmitEl = document.getElementById('fbSubmit');
    if (fbSubmitEl) fbSubmitEl.innerText = t.fbSubmitBtn;

    // Auth
    const authTitle = document.getElementById('authTitle');
    if (authTitle) authTitle.innerText = isRegisterMode ? (t.authRegisterBtn || 'Register') : t.authSignIn;
    const authEmail = document.getElementById('authEmail');
    if (authEmail) authEmail.placeholder = t.authEmailPlaceholder || 'Email';
    const authPassword = document.getElementById('authPassword');
    if (authPassword) authPassword.placeholder = t.authPassPlaceholder || 'Password';
    const authRegNick = document.getElementById('authRegNick');
    if (authRegNick) authRegNick.placeholder = t.authNickPlaceholder || 'Nickname';
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    if (authSubmitBtn) authSubmitBtn.innerText = isRegisterMode ? (t.authRegisterBtn || 'Register') : t.authSignIn;
    const authToggleRegister = document.getElementById('authToggleRegister');
    if (authToggleRegister) authToggleRegister.innerText = isRegisterMode ? (t.authSwitchSignIn || 'Already have an account? Sign In') : (t.authSwitchRegister || 'No account? Register');
    const authDivider = document.getElementById('uiAuthDividerText');
    if (authDivider) authDivider.textContent = t.or;
    const authAccountTitle = document.getElementById('authAccountTitle');
    if (authAccountTitle) authAccountTitle.innerText = t.authAccount;
    const uiAccLinkedLabel = document.getElementById('uiAccLinkedLabel');
    if (uiAccLinkedLabel) uiAccLinkedLabel.innerText = t.authLinkedProviders || 'Linked providers';
    const uiAccLinkAnotherLabel = document.getElementById('uiAccLinkAnotherLabel');
    if (uiAccLinkAnotherLabel) uiAccLinkAnotherLabel.innerText = t.authLinkAnother || 'Link another';
    const uiAccNickLabel = document.getElementById('uiAccNickLabel');
    if (uiAccNickLabel) uiAccNickLabel.innerText = t.authNickname;
    const accNickInput = document.getElementById('accNickInput');
    if (accNickInput) accNickInput.placeholder = t.authNickPlaceholder || 'Nickname';
    const accNickSave = document.getElementById('accNickSave');
    if (accNickSave) accNickSave.innerText = t.authSave;
    const authSignOutBtn = document.getElementById('authSignOutBtn');
    if (authSignOutBtn) authSignOutBtn.innerText = t.authSignOut;

    const uiAuthLinkEmailTitle = document.getElementById('uiAuthLinkEmailTitle');
    if (uiAuthLinkEmailTitle) uiAuthLinkEmailTitle.innerText = t.authLinkEmail || 'Link Email';
    const authLinkEmailBack = document.getElementById('authLinkEmailBack');
    if (authLinkEmailBack) authLinkEmailBack.innerHTML = '&larr; ' + (t.back || 'Back');
    const authLinkEmail = document.getElementById('authLinkEmail');
    if (authLinkEmail) authLinkEmail.placeholder = t.authEmailPlaceholder || 'Email';
    const authLinkPassword = document.getElementById('authLinkPassword');
    if (authLinkPassword) authLinkPassword.placeholder = t.authPassPlaceholder || 'Password';
    const authLinkEmailLink = document.getElementById('authLinkEmailLink');
    if (authLinkEmailLink) authLinkEmailLink.innerText = t.authLinkEmailBtn || 'Link';

    const uiNickPromptTitle = document.getElementById('uiNickPromptTitle');
    if (uiNickPromptTitle) uiNickPromptTitle.innerText = t.nickPromptTitle || 'Your nickname';
    const uiNickPromptSubtitle = document.getElementById('uiNickPromptSubtitle');
    if (uiNickPromptSubtitle) uiNickPromptSubtitle.innerText = t.nickPromptSubtitle || 'Choose a nickname for records and profile';
    const nickPromptCancel = document.getElementById('nickPromptCancel');
    if (nickPromptCancel) nickPromptCancel.innerText = t.skipBtn || 'Skip';
    const nickPromptSave = document.getElementById('nickPromptSave');
    if (nickPromptSave) nickPromptSave.innerText = t.authSave || 'Save';

    if (typeof renderProviders === 'function') renderProviders();
    const authBtnEl = document.getElementById('authBtn');
    if (authBtnEl) authBtnEl.title = (typeof authUser !== 'undefined' && authUser && !authUser.isAnonymous) ? (authUser.displayName || authUser.email || t.authAccount) : (t.signInTooltip || 'Sign in');
    const lbStatusSpan = document.querySelector('#lbStatus span:last-child');
    if (lbStatusSpan) lbStatusSpan.textContent = t.online;

    // Cookie banner
    const cookieTitle = document.getElementById('uiCookieTitle');
    if (cookieTitle) cookieTitle.innerText = t.cookieTitle;
    const cookieDesc = document.getElementById('uiCookieDesc');
    if (cookieDesc) cookieDesc.innerText = t.cookieDesc;
    const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
    if (cookieAcceptBtn) cookieAcceptBtn.innerText = t.cookieAccept;
    const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');
    if (cookieSettingsBtn) cookieSettingsBtn.innerText = t.cookieSettings;
    const cookieModalTitle = document.getElementById('uiCookieModalTitle');
    if (cookieModalTitle) cookieModalTitle.innerText = t.cookieModalTitle;
    const cookieEssentialName = document.getElementById('uiCookieEssentialName');
    if (cookieEssentialName) cookieEssentialName.innerText = t.cookieEssentialName;
    const cookieEssentialHint = document.getElementById('uiCookieEssentialHint');
    if (cookieEssentialHint) cookieEssentialHint.innerText = t.cookieEssentialHint;
    const cookieScoresName = document.getElementById('uiCookieScoresName');
    if (cookieScoresName) cookieScoresName.innerText = t.cookieScoresName;
    const cookieScoresHint = document.getElementById('uiCookieScoresHint');
    if (cookieScoresHint) cookieScoresHint.innerText = t.cookieScoresHint;
    const cookieSaveBtn = document.getElementById('cookieSaveBtn');
    if (cookieSaveBtn) cookieSaveBtn.innerText = t.cookieSave;

    // Refresh feedback and leaderboard in DOM
    document.querySelectorAll('.fb-expand').forEach(el => {
        const textEl = el.closest('.fb-entry')?.querySelector('.fb-text');
        el.textContent = textEl && textEl.classList.contains('expanded') ? t.fbShowLess : t.fbShowMore;
    });
    document.querySelectorAll('.fb-reply-btn').forEach(el => el.textContent = t.fbReply);
    document.querySelectorAll('.lb-entry .lb-name').forEach(el => {
        if (el.textContent === 'Anonymous' || el.textContent === 'Аноним') el.textContent = t.anonymous;
    });
    document.querySelectorAll('.fb-comment-stats').forEach(el => {
        const n = parseInt(el.dataset.count) || 0;
        if (typeof formatCommentCount === 'function') el.textContent = formatCommentCount(n);
    });
}

// Language toggle
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        setCookie('snakeLang', currentLang);
        applyLanguage();
        if (typeof loadLeaderboard === 'function') loadLeaderboard();
        if (typeof loadFeedback === 'function') loadFeedback(true);
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

// === FIREBASE LEADERBOARD & FEEDBACK ===
function deleteCookie(name) {
    document.cookie = name + '=; path=/; max-age=0; SameSite=Lax';
}

const firebaseConfig = {
    apiKey: "AIzaSyBj5Nxq05fVgiTiNJNM17R6xrRjBmB7qDI",
    authDomain: "refyrdsite.firebaseapp.com",
    projectId: "refyrdsite",
    storageBucket: "refyrdsite.firebasestorage.app",
    messagingSenderId: "37852850018",
    appId: "1:37852850018:web:56cc3448489f4b9699ee3b"
};
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;
if (db) {
    try {
        db.settings({ experimentalAutoDetectLongPolling: true });
    } catch (e) {
        console.warn('Firestore settings error:', e);
    }
}
const auth = (typeof firebase !== 'undefined') ? firebase.auth() : null;
const LEADERBOARD_COLLECTION = 'danmaku_leaderboard';
const Fb_COLLECTION = 'danmaku_feedback';

let authUid = null;
let authUser = null;
let skipAnonSignIn = false;
let isRegisterMode = false;
let savedName = localStorage.getItem('danmakuNick') || getCookie('snakeNick') || '';

// === AUTH UI ===
const authOverlay = document.getElementById('authOverlay');
const authClose = document.getElementById('authClose');
const authBtn = document.getElementById('authBtn');
const authMainView = document.getElementById('authMainView');
const authAccountView = document.getElementById('authAccountView');
const authTitle = document.getElementById('authTitle');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authRegNick = document.getElementById('authRegNick');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authToggleRegister = document.getElementById('authToggleRegister');
const authGoogle = document.getElementById('authGoogle');
const authGithub = document.getElementById('authGithub');
const authStatus = document.getElementById('authStatus');

const accEmail = document.getElementById('accEmail');
const accProviders = document.getElementById('accProviders');
const accNickInput = document.getElementById('accNickInput');
const accNickSave = document.getElementById('accNickSave');
const accNickStatus = document.getElementById('accNickStatus');
const authSignOutBtn = document.getElementById('authSignOutBtn');

const authLinkEmailView = document.getElementById('authLinkEmailView');
const authLinkEmailBack = document.getElementById('authLinkEmailBack');
const authLinkEmailLink = document.getElementById('authLinkEmailLink');
const authLinkEmailInput = document.getElementById('authLinkEmail');
const authLinkPassInput = document.getElementById('authLinkPassword');
const authLinkEmailStat = document.getElementById('authLinkEmailStatus');

const playerNameInput = document.getElementById('playerNameInput');
if (playerNameInput) {
    playerNameInput.value = savedName;
    playerNameInput.addEventListener('input', () => {
        if (typeof sanitizeName === 'function') {
            playerNameInput.value = sanitizeName(playerNameInput.value);
        }
        savedName = playerNameInput.value.trim();
        setCookie('snakeNick', savedName, 365);
        localStorage.setItem('danmakuNick', savedName);
        if (authUid && db) {
            db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({
                name: savedName && (typeof isValidName !== 'function' || isValidName(savedName)) ? savedName : (i18n[currentLang] || i18n.ru).anonymous
            }, { merge: true }).catch(() => {});
        }
    });
    playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startNewGame();
    });
}

function showStatus(el, msg, isError) {
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)';
}
function clearStatus(el) { if (el) el.textContent = ''; }

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setAuthMode(register) {
    isRegisterMode = register;
    const t = i18n[currentLang] || i18n.ru;
    if (isRegisterMode) {
        if (authTitle) authTitle.innerText = t.authRegisterBtn || 'Регистрация';
        if (authRegNick) authRegNick.style.display = 'block';
        if (authSubmitBtn) authSubmitBtn.innerText = t.authRegisterBtn || 'Зарегистрироваться';
        if (authToggleRegister) authToggleRegister.innerText = t.authSwitchSignIn || 'Уже есть аккаунт? Войти';
    } else {
        if (authTitle) authTitle.innerText = t.authSignIn || 'Войти';
        if (authRegNick) authRegNick.style.display = 'none';
        if (authSubmitBtn) authSubmitBtn.innerText = t.authSignIn || 'Войти';
        if (authToggleRegister) authToggleRegister.innerText = t.authSwitchRegister || 'Нет аккаунта? Зарегистрироваться';
    }
    clearStatus(authStatus);
}
if (authToggleRegister) authToggleRegister.addEventListener('click', () => setAuthMode(!isRegisterMode));

const NICK_COOLDOWN = 3 * 24 * 60 * 60 * 1000;
function formatCooldownUntil(timestamp) {
    const d = new Date(timestamp);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function renderProviders() {
    if (!authUser || authUser.isAnonymous || !accProviders) return;
    const methods = (authUser.providerData || []).map(p => p.providerId);
    const t = i18n[currentLang] || i18n.ru;
    const provLabel = {
        'google.com': t.providerGoogle || 'Google',
        'github.com': t.providerGithub || 'GitHub',
        'password': t.providerEmail || 'Email'
    };
    accProviders.innerHTML = methods.map(id => `<span class="auth-prov-btn badge">${provLabel[id] || id}</span>`).join('');
    const used = new Set(methods);
    document.querySelectorAll('#authAccountView .auth-prov-btn[data-prov]').forEach(btn => {
        const prov = btn.dataset.prov;
        const target = prov === 'password' ? 'password' : prov + '.com';
        const labels = {
            google: t.providerGoogle || 'Google',
            github: t.providerGithub || 'GitHub',
            password: t.providerEmail || 'Email'
        };
        const label = labels[prov] || prov;
        const isLinked = used.has(target);
        btn.disabled = isLinked;
        btn.textContent = isLinked ? label : '+ ' + label;
    });
}

function toggleAccView(showLink) {
    if (authLinkEmailView) authLinkEmailView.style.display = showLink ? 'flex' : 'none';
    const accSections = document.querySelectorAll('#authAccountView > .auth-acc-section, #authAccountView > .auth-title, #authAccountView > .auth-info-line, #authAccountView > #authSignOutBtn');
    accSections.forEach(el => { if (el) el.style.display = showLink ? 'none' : ''; });
}

document.querySelectorAll('#authAccountView .auth-prov-btn[data-prov]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.disabled || !authUser || !auth) return;
        const prov = btn.dataset.prov;
        if (prov === 'password') { toggleAccView(true); return; }
        const user = auth.currentUser;
        if (!user) return;

        function handleLink(promise) {
            const t = i18n[currentLang] || i18n.ru;
            const pLabel = { google: t.providerGoogle || 'Google', github: t.providerGithub || 'GitHub' }[prov] || prov;
            promise.then(() => {
                authUser = auth.currentUser;
                renderProviders();
                showStatus(accNickStatus, pLabel + (t.linked || ' привязан!'), false);
            }).catch(e => {
                showStatus(accNickStatus, e.code === 'auth/credential-already-in-use' ? (t.alreadyLinked || 'Аккаунт уже привязан') : e.message, true);
            });
        }

        if (prov === 'google') handleLink(user.linkWithPopup(new firebase.auth.GoogleAuthProvider()));
        else if (prov === 'github') handleLink(user.linkWithPopup(new firebase.auth.GithubAuthProvider()));
    });
});

if (authLinkEmailBack) authLinkEmailBack.addEventListener('click', () => toggleAccView(false));
if (authLinkEmailLink) {
    authLinkEmailLink.addEventListener('click', () => {
        const t = i18n[currentLang] || i18n.ru;
        if (!authUser || authUser.isAnonymous || !auth) {
            showStatus(authLinkEmailStat, t.notLoggedIn || 'Не вошли', true);
            return;
        }
        const email = (authLinkEmailInput?.value || '').trim();
        const pass = (authLinkPassInput?.value || '');
        if (!email || !pass) {
            showStatus(authLinkEmailStat, t.fillEmailPass || 'Заполните email и пароль', true);
            return;
        }
        if (pass.length < 6) {
            showStatus(authLinkEmailStat, t.passMin6 || 'Пароль минимум 6 символов', true);
            return;
        }
        showStatus(authLinkEmailStat, t.linking || 'Привязка...', false);
        auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(email, pass)).then(() => {
            authUser = auth.currentUser;
            renderProviders();
            showStatus(accNickStatus, t.emailLinkedSuccess || 'Email успешно привязан!', false);
            toggleAccView(false);
            clearStatus(authLinkEmailStat);
        }).catch(e => {
            showStatus(authLinkEmailStat, e.code === 'auth/credential-already-in-use' ? (t.emailAlreadyLinked || 'Email уже используется') : e.message, true);
        });
    });
}

function updateAuthUI() {
    const isLoggedIn = (authUser && !authUser.isAnonymous) || getCookie('isLoggedIn') === '1';
    const t = i18n[currentLang] || i18n.ru;
    if (isLoggedIn) {
        if (authBtn) {
            authBtn.title = (authUser && (authUser.displayName || authUser.email)) || savedName || getCookie('authEmail') || t.authAccount;
        }
        const email = (authUser && (authUser.email || (authUser.providerData[0] ? authUser.providerData[0].email : ''))) || getCookie('authEmail') || '';
        if (accEmail) accEmail.textContent = email;
        if (accNickInput) accNickInput.value = savedName || (authUser && authUser.displayName) || '';
        if (authMainView) authMainView.style.display = 'none';
        if (authAccountView) authAccountView.style.display = 'flex';
        toggleAccView(false);
        renderProviders();
        loadNicknameFromFirestore();
    } else {
        if (authBtn) {
            authBtn.title = t.signInTooltip || 'Войти';
        }
        if (authMainView) authMainView.style.display = 'flex';
        if (authAccountView) authAccountView.style.display = 'none';
        setAuthMode(false);
    }
}

function openAuthModal() {
    updateAuthUI();
    if (authOverlay) authOverlay.classList.add('active');
    if (authBtn) authBtn.classList.add('active');
}
function closeAuthModal() {
    if (authOverlay) authOverlay.classList.remove('active');
    if (authBtn) authBtn.classList.remove('active');
}
if (authBtn) authBtn.addEventListener('click', openAuthModal);
if (authClose) authClose.addEventListener('click', closeAuthModal);
if (authOverlay) authOverlay.addEventListener('click', e => { if (e.target === authOverlay) closeAuthModal(); });

if (authSignOutBtn) {
    authSignOutBtn.addEventListener('click', () => {
        deleteCookie('authUid');
        deleteCookie('authEmail');
        deleteCookie('isLoggedIn');
        auth?.signOut();
        closeAuthModal();
    });
}

function updateNicknameInputVisibility() {
    if (playerNameInput) {
        playerNameInput.style.display = (authUser && !authUser.isAnonymous) ? 'none' : '';
    }
}

function loadNicknameFromFirestore() {
    if (!authUser || authUser.isAnonymous || !db) return;
    const userRef = db.collection('users').doc(authUser.uid);
    const t = i18n[currentLang] || i18n.ru;
    userRef.get().then(doc => {
        if (doc.exists && doc.data().nickname) {
            if (accNickInput) accNickInput.value = doc.data().nickname;
            savedName = doc.data().nickname;
            if (playerNameInput) playerNameInput.value = savedName;
            setCookie('snakeNick', savedName, 365);
        } else if (accNickInput) {
            accNickInput.value = savedName || '';
        }
        const lastChange = doc.exists ? (doc.data().nicknameLastChange || 0) : 0;
        const remaining = lastChange + NICK_COOLDOWN - Date.now();
        if (remaining > 0) {
            if (accNickStatus) {
                accNickStatus.textContent = (t.cantChangeUntil || 'Нельзя сменить до ') + formatCooldownUntil(new Date(Date.now() + remaining));
                accNickStatus.style.color = 'var(--md-sys-color-outline)';
            }
            if (accNickSave) accNickSave.disabled = true;
            if (accNickInput) accNickInput.disabled = true;
        } else {
            if (accNickStatus) {
                accNickStatus.textContent = t.cooldownDaysNotice || 'Смена никнейма доступна раз в 3 дня.';
                accNickStatus.style.color = 'var(--md-sys-color-outline)';
            }
            if (accNickSave) accNickSave.disabled = false;
            if (accNickInput) accNickInput.disabled = false;
        }
    }).catch(e => {
        if (accNickStatus) {
            accNickStatus.textContent = e.message;
            accNickStatus.style.color = 'var(--md-sys-color-error)';
        }
    });
}

if (accNickSave) {
    accNickSave.addEventListener('click', () => {
        if (!authUser || authUser.isAnonymous || !db) return;
        const nick = (typeof sanitizeName === 'function') ? sanitizeName(accNickInput.value.trim()) : accNickInput.value.trim();
        const t = i18n[currentLang] || i18n.ru;
        if (typeof isValidName === 'function' && !isValidName(nick)) {
            accNickStatus.textContent = t.invalidNickname || 'Недопустимый никнейм';
            accNickStatus.style.color = 'var(--md-sys-color-error)';
            return;
        }
        const userRef = db.collection('users').doc(authUser.uid);
        accNickSave.disabled = true;
        userRef.get().then(doc => {
            const lastChange = doc.exists ? (doc.data().nicknameLastChange || 0) : 0;
            if (Date.now() - lastChange < NICK_COOLDOWN) {
                accNickStatus.textContent = (t.cantChangeUntil || 'Нельзя сменить до ') + formatCooldownUntil(new Date(lastChange + NICK_COOLDOWN));
                accNickStatus.style.color = 'var(--md-sys-color-error)';
                accNickSave.disabled = accNickInput.disabled = true;
                return;
            }
            const now = Date.now();
            userRef.set({ nickname: nick, nicknameLastChange: now }, { merge: true }).then(() => {
                savedName = nick;
                setCookie('snakeNick', savedName);
                localStorage.setItem('danmakuNick', savedName);
                if (playerNameInput) playerNameInput.value = savedName;
                if (authUser.updateProfile) authUser.updateProfile({ displayName: nick }).catch(() => {});
                accNickStatus.textContent = (t.cantChangeUntil || 'Нельзя сменить до ') + formatCooldownUntil(new Date(now + NICK_COOLDOWN));
                accNickStatus.style.color = 'var(--md-sys-color-primary)';
                accNickSave.disabled = accNickInput.disabled = true;
                if (authUid) db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({ name: savedName }, { merge: true }).catch(() => {});
                loadLeaderboard();
            }).catch(e => {
                accNickSave.disabled = false;
                accNickStatus.textContent = e.message;
                accNickStatus.style.color = 'var(--md-sys-color-error)';
            });
        }).catch(e => {
            accNickSave.disabled = false;
            accNickStatus.textContent = e.message;
            accNickStatus.style.color = 'var(--md-sys-color-error)';
        });
    });
}

if (authPassword) authPassword.addEventListener('keydown', e => { if (e.key === 'Enter') authSubmitBtn?.click(); });
if (authEmail) authEmail.addEventListener('keydown', e => { if (e.key === 'Enter') authPassword?.focus(); });
if (authRegNick) authRegNick.addEventListener('input', () => { if (typeof sanitizeName === 'function') authRegNick.value = sanitizeName(authRegNick.value); });

async function upgradeFromAnonymous(action) {
    if (auth && auth.currentUser && auth.currentUser.isAnonymous) {
        skipAnonSignIn = true;
        const prevUid = auth.currentUser.uid;
        try {
            const cred = await action();
            await syncGuestScoreToUser(cred.user.uid);
            if (db) await db.collection(LEADERBOARD_COLLECTION).doc(prevUid).delete().catch(() => {});
            return cred;
        } finally {
            skipAnonSignIn = false;
        }
    }
    return action();
}

if (authSubmitBtn) {
    authSubmitBtn.addEventListener('click', async () => {
        if (!auth) return;
        const email = (authEmail?.value || '').trim();
        const pass = (authPassword?.value || '');
        const nick = (typeof sanitizeName === 'function') ? sanitizeName(authRegNick?.value || '').trim() : (authRegNick?.value || '').trim();
        const t = i18n[currentLang] || i18n.ru;

        if (!email || !pass) {
            showStatus(authStatus, t.fillAllFields || 'Заполните все поля', true);
            return;
        }
        if (pass.length < 6) {
            showStatus(authStatus, t.passMin6 || 'Пароль минимум 6 символов', true);
            return;
        }

        try {
            authSubmitBtn.disabled = true;
            showStatus(authStatus, isRegisterMode ? (t.creatingAccount || 'Создание аккаунта...') : (t.signingIn || 'Вход...'), false);

            if (isRegisterMode) {
                if (nick && (typeof isValidName !== 'function' || isValidName(nick))) {
                    savedName = nick;
                    setCookie('snakeNick', savedName);
                    localStorage.setItem('danmakuNick', savedName);
                    if (playerNameInput) playerNameInput.value = savedName;
                }
                const cred = await upgradeFromAnonymous(() => auth.createUserWithEmailAndPassword(email, pass));
                if (cred && cred.user) {
                    if (nick) {
                        await cred.user.updateProfile({ displayName: nick }).catch(() => {});
                        if (db) {
                            await db.collection('users').doc(cred.user.uid).set({
                                nickname: nick,
                                nicknameLastChange: Date.now()
                            }, { merge: true });
                            if (authUid) await db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({ name: nick }, { merge: true }).catch(() => {});
                        }
                    }
                }
            } else {
                await upgradeFromAnonymous(() => auth.signInWithEmailAndPassword(email, pass));
            }
            closeAuthModal();
        } catch (e) {
            let msg = e.message;
            if (e.code === 'auth/user-not-found') msg = t.userNotFound || 'Пользователь не найден';
            else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') msg = t.wrongPassword || 'Неверный пароль';
            else if (e.code === 'auth/email-already-in-use') msg = t.emailInUse || 'Email уже используется';
            showStatus(authStatus, msg, true);
        } finally {
            authSubmitBtn.disabled = false;
        }
    });
}

if (authGoogle) {
    authGoogle.addEventListener('click', () => {
        if (!auth) return;
        upgradeFromAnonymous(() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))
            .then(() => closeAuthModal())
            .catch(e => showStatus(authStatus, e.message, true));
    });
}
if (authGithub) {
    authGithub.addEventListener('click', () => {
        if (!auth) return;
        upgradeFromAnonymous(() => auth.signInWithPopup(new firebase.auth.GithubAuthProvider()))
            .then(() => closeAuthModal())
            .catch(e => showStatus(authStatus, e.message, true));
    });
}

function promptNickname(user) {
    const overlay = document.getElementById('nickPromptOverlay');
    const input = document.getElementById('nickPromptInput');
    const status = document.getElementById('nickPromptStatus');
    const cancel = document.getElementById('nickPromptCancel');
    const save = document.getElementById('nickPromptSave');
    if (!overlay || !input || !save) return;
    overlay.classList.add('active');
    input.value = savedName || user.displayName || '';
    input.focus();

    const finish = (nick) => {
        overlay.classList.remove('active');
        if (nick) {
            savedName = nick;
            setCookie('snakeNick', savedName, 365);
            localStorage.setItem('danmakuNick', savedName);
            if (playerNameInput) playerNameInput.value = savedName;
            if (accNickInput) accNickInput.value = savedName;
            if (db) {
                db.collection('users').doc(user.uid).set({ nickname: nick, nicknameLastChange: Date.now() }, { merge: true }).catch(() => {});
                if (authUid) db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({ name: nick }, { merge: true }).catch(() => {});
            }
            loadLeaderboard();
        }
    };

    save.onclick = () => {
        const nick = (typeof sanitizeName === 'function') ? sanitizeName(input.value.trim()) : input.value.trim();
        const t = i18n[currentLang] || i18n.ru;
        if (!nick || (typeof isValidName === 'function' && !isValidName(nick))) {
            showStatus(status, t.invalidNickname || 'Недопустимый никнейм', true);
            return;
        }
        finish(nick);
    };
    if (cancel) cancel.onclick = () => finish('');
}

if (auth) {
    auth.onAuthStateChanged(async user => {
        if (user) {
            authUser = user;
            authUid = user.uid;
            setCookie('authUid', authUid, 365);
            if (!user.isAnonymous) {
                setCookie('isLoggedIn', '1', 365);
                if (user.email) setCookie('authEmail', user.email, 365);
                if (db) {
                    try {
                        const userDoc = await db.collection('users').doc(user.uid).get();
                        if (userDoc.exists && userDoc.data().nickname) {
                            savedName = userDoc.data().nickname;
                            setCookie('snakeNick', savedName, 365);
                            localStorage.setItem('danmakuNick', savedName);
                            if (playerNameInput) playerNameInput.value = savedName;
                        } else if (!savedName) {
                            promptNickname(user);
                        }
                    } catch (_) {}
                }
            } else {
                setCookie('guestUid', authUid, 365);
            }
        } else {
            authUser = null;
            authUid = null;
            if (!skipAnonSignIn) {
                auth.signInAnonymously().catch(e => {
                    console.warn('Anonymous sign-in error:', e);
                });
            }
        }
        updateAuthUI();
        updateNicknameInputVisibility();
        syncBestScoreFromServer();
        loadLeaderboard();
        loadFeedback(true);
    });
}

// === LEADERBOARD SYSTEM (DANMAKU_LEADERBOARD) ===
async function syncBestScoreFromServer() {
    const currentUid = authUid || (auth && auth.currentUser ? auth.currentUser.uid : null);
    if (!currentUid || !db) return;
    try {
        const doc = await db.collection(LEADERBOARD_COLLECTION).doc(currentUid).get();
        if (doc.exists) {
            const serverScore = parseInt(doc.data().score, 10) || 0;
            if (serverScore > highScore) {
                highScore = serverScore;
                localStorage.setItem('danmakuHighScore', highScore);
                const t = i18n[currentLang] || i18n.ru;
                const menuHigh = document.getElementById('menuHighScoreText');
                if (menuHigh) menuHigh.innerText = t.bestScore + highScore.toLocaleString();
            }
        }
    } catch (e) { /* ignore */ }
}

async function syncGuestScoreToUser(targetUid) {
    if (!targetUid || !db) return;
    const localBest = parseInt(localStorage.getItem('danmakuHighScore') || '0', 10);
    const guestUid = getCookie('guestUid');
    let guestScore = 0;
    if (guestUid && guestUid !== targetUid) {
        try {
            const guestDoc = await db.collection(LEADERBOARD_COLLECTION).doc(guestUid).get();
            if (guestDoc.exists) guestScore = guestDoc.data().score || 0;
        } catch (_) {}
    }
    const finalScore = Math.floor(Math.max(localBest, guestScore, score));
    if (finalScore > 0) {
        try {
            const userLbRef = db.collection(LEADERBOARD_COLLECTION).doc(targetUid);
            const userLbDoc = await userLbRef.get();
            const curScore = userLbDoc.exists ? (parseInt(userLbDoc.data().score, 10) || 0) : 0;
            const myNick = savedName || getCookie('snakeNick') || authUser?.displayName || (i18n[currentLang] || i18n.ru).anonymous;
            if (finalScore > curScore) {
                await userLbRef.set({ name: myNick, score: finalScore }, { merge: true });
                highScore = finalScore;
                localStorage.setItem('danmakuHighScore', highScore);
                const t = i18n[currentLang] || i18n.ru;
                const menuHigh = document.getElementById('menuHighScoreText');
                if (menuHigh) menuHigh.innerText = t.bestScore + highScore.toLocaleString();
            }
        } catch (e) {
            console.warn('Sync score error:', e);
        }
    }
}

let lastScoreSaveTime = 0;
async function saveScoreToLeaderboard(force = false) {
    const currentUid = authUid || (auth && auth.currentUser ? auth.currentUser.uid : null);
    const intScore = Math.floor(score);
    if (intScore <= 0 || !currentUid || !db) return;
    if (intScore > 10000000) return;
    const now = Date.now();
    if (!force && (now - lastScoreSaveTime < 2000)) return;
    lastScoreSaveTime = now;
    const t = i18n[currentLang] || i18n.ru;
    const displayName = savedName && (typeof isValidName !== 'function' || isValidName(savedName)) ? savedName : t.anonymous;
    try {
        const docRef = db.collection(LEADERBOARD_COLLECTION).doc(currentUid);
        const existing = await docRef.get();
        const existingScore = existing.exists ? (parseInt(existing.data().score, 10) || 0) : 0;
        const existingName = existing.exists ? (existing.data().name || '') : '';

        if (intScore <= existingScore && displayName === existingName) {
            return;
        }

        const newBest = Math.max(intScore, existingScore);
        await docRef.set({
            name: displayName,
            score: newBest
        }, { merge: true });
        if (newBest > highScore) {
            highScore = newBest;
            localStorage.setItem('danmakuHighScore', highScore);
            const menuHigh = document.getElementById('menuHighScoreText');
            if (menuHigh) menuHigh.innerText = t.bestScore + highScore.toLocaleString();
        }
    } catch (e) {
        console.warn('Firebase save score error:', e);
    }
    loadLeaderboard();
}

let lbLimit = 10;
let lbShowAll = false;
let _lbLangAtStart = '';
async function loadLeaderboard() {
    if (!db) return;
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    _lbLangAtStart = currentLang;
    const t = i18n[currentLang] || i18n.ru;
    try {
        const queryPromise = db.collection(LEADERBOARD_COLLECTION)
            .orderBy('score', 'desc')
            .limit(lbLimit)
            .get();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 10000)
        );
        const snapshot = await Promise.race([queryPromise, timeoutPromise]);
        if (currentLang !== _lbLangAtStart) return;
        setLbStatus('online', t.online);
        if (snapshot.empty) {
            leaderboardList.innerHTML = `<div class="lb-empty">${t.lbNoScores}</div>`;
            return;
        }
        let html = '';
        let rank = 1;
        snapshot.forEach(doc => {
            const d = doc.data();
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            html += `<div class="lb-entry">
                <span class="lb-rank">${medal || rank}</span>
                <span class="lb-name">${escapeHtml(d.name && d.name.trim() ? d.name : t.anonymous)}</span>
                <span class="lb-score">${(parseInt(d.score, 10) || 0).toLocaleString()}</span>
            </div>`;
            rank++;
        });
        if (leaderboardList.innerHTML !== html) {
            leaderboardList.innerHTML = html;
        }
    } catch (e) {
        if (currentLang !== _lbLangAtStart) return;
        console.warn('Firebase load lb error:', e);
        setLbStatus('error', (t.errorPrefix || 'Error: ') + e.message);
        leaderboardList.innerHTML = `<div class="lb-empty">${t.lbOffline}</div>`;
    }
}

function setLbStatus(state, msg) {
    const lbStatus = document.getElementById('lbStatus');
    if (lbStatus) {
        const newHtml = `<span class="dot ${state}"></span><span>${escapeHtml(msg)}</span>`;
        if (lbStatus.innerHTML !== newHtml) lbStatus.innerHTML = newHtml;
    }
}

const lbShowMore = document.getElementById('lbShowMore');
if (lbShowMore) {
    lbShowMore.addEventListener('click', () => {
        lbShowAll = !lbShowAll;
        lbLimit = lbShowAll ? 1000 : 10;
        const t = i18n[currentLang] || i18n.ru;
        lbShowMore.innerText = lbShowAll ? t.lbShowTop : t.lbShowAll;
        const leaderboardList = document.getElementById('leaderboardList');
        if (leaderboardList) leaderboardList.innerHTML = `<div class="lb-loading">${t.lbLoading}</div>`;
        document.getElementById('leaderboard')?.classList.toggle('lb-show-all', lbShowAll);
        loadLeaderboard();
    });
}
loadLeaderboard();

setInterval(() => {
    if (document.visibilityState === 'visible') loadLeaderboard();
}, 3000);

setInterval(() => {
    const currentUid = authUid || (auth && auth.currentUser ? auth.currentUser.uid : null);
    if (gameState === 'playing' && currentUid && score > 0) saveScoreToLeaderboard();
}, 3000);

// === FEEDBACK SYSTEM (DANMAKU_FEEDBACK) ===
const fbList = document.getElementById('feedbackList');
const fbWriteBtn = document.getElementById('fbWriteBtn');
const fbOverlay = document.getElementById('fbOverlay');
const fbOverlayClose = document.getElementById('fbOverlayClose');
const fbNameInput = document.getElementById('fbNameInput');
const fbMessageInput = document.getElementById('fbMessageInput');
const fbSubmit = document.getElementById('fbSubmit');
const fbStatus = document.getElementById('fbStatus');

function updateFbNameField() {
    if (!fbNameInput) return;
    const hasName = savedName && (typeof isValidName !== 'function' || isValidName(savedName));
    fbNameInput.value = hasName ? savedName : '';
    fbNameInput.disabled = !!hasName;
    const t = i18n[currentLang] || i18n.ru;
    fbNameInput.placeholder = hasName ? '' : t.fbNamePlaceholder;
}

function formatCommentCount(n) {
    const t = i18n[currentLang] || i18n.ru;
    if (currentLang === 'ru') {
        if (n % 10 === 1 && n % 100 !== 11) return n + ' ответ';
        if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return n + ' ответа';
        return n + ' ответов';
    }
    return n + ' ' + (n === 1 ? (t.fbReplyOne || 'reply') : (t.fbReplyFew || 'replies'));
}

async function loadComments(entry) {
    if (!db) return;
    const docId = entry.dataset.id;
    const list = entry.querySelector('.fb-comments-list');
    const statsBtn = entry.querySelector('.fb-comment-stats');
    const t = i18n[currentLang] || i18n.ru;
    try {
        const snap = await db.collection(Fb_COLLECTION).doc(docId).collection('comments').orderBy('time', 'asc').limit(20).get();
        if (snap.empty) {
            list.innerHTML = `<div class="lb-empty">${t.fbNoComments}</div>`;
            statsBtn.style.display = 'none';
            return;
        }
        const myUid = authUid || getCookie('authUid') || '';
        let html = '';
        let count = 0;
        snap.forEach(doc => {
            const d = doc.data();
            const ct = d.time ? new Date(d.time.seconds * 1000).toLocaleDateString() : '';
            const isOwner = Boolean(myUid && d.uid && d.uid === myUid);
            html += `<div class="fb-comment" data-cid="${doc.id}">
                <span class="fb-comment-name">${escapeHtml(d.name || t.anonymous)}</span>
                <span class="fb-comment-msg">${escapeHtml(d.message)}</span>
                <span class="fb-time">${ct}</span>
                ${isOwner ? '<button class="fb-comment-edit">✎</button><button class="fb-comment-del">✕</button>' : ''}
            </div>`;
            count++;
        });
        list.innerHTML = html;
        statsBtn.textContent = formatCommentCount(count);
        statsBtn.style.display = '';
    } catch (_) {
        list.innerHTML = `<div class="lb-empty">${t.fbLoadFail}</div>`;
    }
}

async function submitComment(entry) {
    if (!db) return;
    const input = entry.querySelector('.fb-comment-input');
    if (!input) return;
    const rawMsg = input.value.trim();
    if (!rawMsg || rawMsg.length < 1) return;
    const msg = typeof censorProfanity === 'function' ? censorProfanity(rawMsg) : rawMsg;
    const t = i18n[currentLang] || i18n.ru;
    const name = (authUid && savedName && (typeof isValidName !== 'function' || isValidName(savedName))) ? savedName : t.anonymous;
    const uid = authUid || getCookie('authUid') || '';
    const docId = entry.dataset.id;

    input.value = '';
    input.disabled = true;

    try {
        await db.collection(Fb_COLLECTION).doc(docId).collection('comments').add({
            name, message: msg, uid,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection(Fb_COLLECTION).doc(docId).update({
            commentCount: firebase.firestore.FieldValue.increment(1)
        });
        await loadComments(entry);
    } catch (_) {}
    input.disabled = false;
}

async function deleteFeedback(docId) {
    if (!docId || !db) return;
    const confirmMsg = currentLang === 'ru' ? 'Удалить этот отзыв?' : 'Delete this feedback?';
    if (!confirm(confirmMsg)) return;
    const entry = fbList ? fbList.querySelector(`.fb-entry[data-id="${docId}"]`) : null;
    if (entry) entry.remove();
    try {
        await db.collection(Fb_COLLECTION).doc(docId).delete();
        loadFeedback(true);
    } catch (e) {
        console.error('Error deleting feedback:', e);
        loadFeedback(true);
    }
}

async function deleteComment(entry, cid) {
    if (!cid || !db) return;
    const docId = entry.dataset.id;
    const commentEl = entry.querySelector(`[data-cid="${cid}"]`);
    if (commentEl) commentEl.remove();
    try {
        await db.collection(Fb_COLLECTION).doc(docId).collection('comments').doc(cid).delete();
        await db.collection(Fb_COLLECTION).doc(docId).update({
            commentCount: firebase.firestore.FieldValue.increment(-1)
        });
    } catch (_) {}
}

const _votingLock = {};
const _recentVotes = {};
async function voteFeedback(docId, type) {
    if (!db) return;
    const voteKey = authUid;
    if (!voteKey) return;
    if (_votingLock[docId]) return;
    _votingLock[docId] = true;
    const now = Date.now();
    Object.keys(_recentVotes).forEach(k => { if (now - _recentVotes[k] > 30000) delete _recentVotes[k]; });
    _recentVotes[docId] = now;
    const entry = document.querySelector(`.fb-entry[data-id="${docId}"]`);
    if (!entry) { _votingLock[docId] = false; delete _recentVotes[docId]; return; }
    const likeBtn = entry.querySelector('.fb-like');
    const dislikeBtn = entry.querySelector('.fb-dislike');
    const likeCount = likeBtn.querySelector('span');
    const dislikeCount = dislikeBtn.querySelector('span');
    const wasLiked = likeBtn.classList.contains('active');
    const wasDisliked = dislikeBtn.classList.contains('active');
    const prevLikes = parseInt(likeCount.textContent) || 0;
    const prevDislikes = parseInt(dislikeCount.textContent) || 0;

    if (type === 'like') {
        if (wasLiked) { likeBtn.classList.remove('active'); likeCount.textContent = prevLikes - 1; }
        else { likeBtn.classList.add('active'); likeCount.textContent = prevLikes + 1;
            if (wasDisliked) { dislikeBtn.classList.remove('active'); dislikeCount.textContent = prevDislikes - 1; } }
    } else {
        if (wasDisliked) { dislikeBtn.classList.remove('active'); dislikeCount.textContent = prevDislikes - 1; }
        else { dislikeBtn.classList.add('active'); dislikeCount.textContent = prevDislikes + 1;
            if (wasLiked) { likeBtn.classList.remove('active'); likeCount.textContent = prevLikes - 1; } }
    }

    const ref = db.collection(Fb_COLLECTION).doc(docId);
    const voteRef = ref.collection('votes').doc(voteKey);
    try {
        const voteDoc = await voteRef.get();
        const existingType = voteDoc.exists ? voteDoc.data().type : '';
        const batch = db.batch();
        if (existingType === type) {
            batch.delete(voteRef);
            batch.update(ref, { [type + 's']: firebase.firestore.FieldValue.increment(-1) });
        } else {
            batch.set(voteRef, {
                userId: voteKey, type, feedbackId: docId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            if (existingType) batch.update(ref, { [existingType + 's']: firebase.firestore.FieldValue.increment(-1) });
            batch.update(ref, { [type + 's']: firebase.firestore.FieldValue.increment(1) });
        }
        await batch.commit();
        const cache = JSON.parse(localStorage.getItem('danmakuFbVotes') || '{}');
        if (existingType === type) delete cache[docId];
        else cache[docId] = type;
        localStorage.setItem('danmakuFbVotes', JSON.stringify(cache));
    } catch (e) {
        likeBtn.classList.toggle('active', wasLiked);
        dislikeBtn.classList.toggle('active', wasDisliked);
        likeCount.textContent = prevLikes;
        dislikeCount.textContent = prevDislikes;
    }
    _votingLock[docId] = false;
    delete _recentVotes[docId];
}

let _fbLangAtStart = '';
async function loadFeedback(silent) {
    if (!db || !fbList) return;
    _fbLangAtStart = currentLang;
    const t = i18n[currentLang] || i18n.ru;
    if (!silent) fbList.innerHTML = `<div class="lb-loading">${t.lbLoading}</div>`;
    try {
        const snap = await db.collection(Fb_COLLECTION).orderBy('time', 'desc').limit(50).get();
        if (currentLang !== _fbLangAtStart) return;
        if (snap.empty) {
            fbList.innerHTML = `<div class="lb-empty">${t.fbNoFeedback}</div>`;
            return;
        }
        const feedbackIds = [];
        snap.forEach(doc => feedbackIds.push(doc.id));
        const userVotes = {};
        try {
            const cached = JSON.parse(localStorage.getItem('danmakuFbVotes') || '{}');
            Object.keys(cached).forEach(id => { if (feedbackIds.includes(id)) userVotes[id] = cached[id]; });
        } catch (_) {}
        const myUid = authUid || getCookie('authUid') || '';
        let html = '';
        snap.forEach(doc => {
            const d = doc.data();
            const id = doc.id;
            const time = d.time ? new Date(d.time.seconds * 1000).toLocaleDateString() : '';
            const userVote = userVotes[id] || '';
            const likes = d.likes ?? d.likeCount ?? 0;
            const dislikes = d.dislikes ?? d.dislikeCount ?? 0;
            const msg = escapeHtml(d.message);
            const long = msg.length > 100;
            const isOwner = Boolean(myUid && d.uid && d.uid === myUid);
            html += `<div class="fb-entry" data-id="${id}" data-uid="${escapeHtml(d.uid || '')}">
                ${isOwner ? `<button class="fb-del-btn" title="${t.deleteBtn || 'Удалить'}">✕</button>` : ''}
                <div class="fb-text${long ? ' collapsed' : ''}">${msg}</div>
                <div class="fb-expand-row">
                    ${long ? '<button class="fb-expand">' + t.fbShowMore + '</button>' : ''}
                    ${long ? '<span class="fb-sep">·</span>' : ''}
                    <button class="fb-reply-btn">${t.fbReply}</button>
                </div>
                <div class="fb-actions">
                    <button class="fb-like${userVote === 'like' ? ' active' : ''}">👍 <span>${likes}</span></button>
                    <button class="fb-dislike${userVote === 'dislike' ? ' active' : ''}">👎 <span>${dislikes}</span></button>
                </div>
                <button class="fb-comment-stats" data-count="${d.commentCount ?? 0}"${d.commentCount ? '' : ' style="display:none"'}>${formatCommentCount(d.commentCount ?? 0)}</button>
                <div class="fb-time">${escapeHtml(d.name || t.anonymous)} · ${time}</div>
                <div class="fb-comments" style="display:none">
                    <div class="fb-comments-header"><button class="fb-comments-close">✕</button></div>
                    <div class="fb-comments-list"></div>
                    <div class="fb-comment-form">
                        <input class="fb-comment-input" placeholder="${t.fbWriteComment}">
                        <button class="fb-comment-send">${t.fbSendComment}</button>
                    </div>
                </div>
            </div>`;
        });
        fbList.innerHTML = html;
        if (authUid) {
            const voteResults = await Promise.allSettled(
                feedbackIds.map(id => db.collection(Fb_COLLECTION).doc(id).collection('votes').doc(authUid).get())
            );
            const fbVotes = {};
            voteResults.forEach((r, i) => {
                if (r.status === 'fulfilled' && r.value.exists) fbVotes[feedbackIds[i]] = r.value.data().type;
            });
            feedbackIds.forEach(id => {
                const entry = fbList.querySelector(`.fb-entry[data-id="${id}"]`);
                if (!entry || _recentVotes[id]) return;
                const likeBtn = entry.querySelector('.fb-like');
                const dislikeBtn = entry.querySelector('.fb-dislike');
                if (fbVotes[id]) {
                    likeBtn?.classList.toggle('active', fbVotes[id] === 'like');
                    dislikeBtn?.classList.toggle('active', fbVotes[id] === 'dislike');
                }
            });
            try { localStorage.setItem('danmakuFbVotes', JSON.stringify(fbVotes)); } catch (_) {}
        }
    } catch (e) {
        if (currentLang !== _fbLangAtStart) return;
        fbList.innerHTML = `<div class="lb-empty">${t.fbLoadFail}</div>`;
    }
}

if (fbList) {
    fbList.addEventListener('click', (e) => {
        const fbDelBtn = e.target.closest('.fb-del-btn');
        if (fbDelBtn) {
            const entry = fbDelBtn.closest('.fb-entry');
            if (entry) deleteFeedback(entry.dataset.id);
            return;
        }
        const expandBtn = e.target.closest('.fb-expand');
        if (expandBtn) {
            const entry = expandBtn.closest('.fb-entry');
            if (!entry) return;
            const textEl = entry.querySelector('.fb-text');
            textEl.classList.toggle('expanded');
            textEl.classList.toggle('collapsed');
            const t = i18n[currentLang] || i18n.ru;
            expandBtn.textContent = textEl.classList.contains('expanded') ? t.fbShowLess : t.fbShowMore;
            return;
        }
        const voteBtn = e.target.closest('.fb-like, .fb-dislike');
        if (voteBtn) {
            const entry = voteBtn.closest('.fb-entry');
            if (!entry) return;
            const docId = entry.dataset.id;
            const type = voteBtn.classList.contains('fb-like') ? 'like' : 'dislike';
            voteFeedback(docId, type);
            return;
        }
        const replyBtn = e.target.closest('.fb-reply-btn');
        if (replyBtn) {
            const entry = replyBtn.closest('.fb-entry');
            if (!entry) return;
            const section = entry.querySelector('.fb-comments');
            section.style.display = '';
            if (!section.dataset.loaded) { section.dataset.loaded = '1'; loadComments(entry); }
            entry.querySelector('.fb-comment-input')?.focus();
            return;
        }
        const statsBtn = e.target.closest('.fb-comment-stats');
        if (statsBtn) {
            const entry = statsBtn.closest('.fb-entry');
            if (!entry) return;
            const section = entry.querySelector('.fb-comments');
            if (section.style.display === 'none') {
                section.style.display = '';
                if (!section.dataset.loaded) { section.dataset.loaded = '1'; loadComments(entry); }
            } else {
                section.style.display = 'none';
            }
            return;
        }
        const sendBtn = e.target.closest('.fb-comment-send');
        if (sendBtn) {
            const entry = sendBtn.closest('.fb-entry');
            if (entry) submitComment(entry);
            return;
        }
        const delCommentBtn = e.target.closest('.fb-comment-del');
        if (delCommentBtn) {
            const comment = delCommentBtn.closest('.fb-comment');
            const entry = comment?.closest('.fb-entry');
            if (entry && comment) deleteComment(entry, comment.dataset.cid);
            return;
        }
        const closeBtn = e.target.closest('.fb-comments-close');
        if (closeBtn) {
            const section = closeBtn.closest('.fb-comments');
            if (section) section.style.display = 'none';
        }
    });

    fbList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = e.target.closest('.fb-comment-input');
            if (input) {
                const entry = input.closest('.fb-entry');
                if (entry) submitComment(entry);
            }
        }
    });
}

if (fbWriteBtn) {
    fbWriteBtn.addEventListener('click', () => {
        updateFbNameField();
        if (fbMessageInput) fbMessageInput.value = '';
        if (fbStatus) fbStatus.textContent = '';
        if (fbOverlay) fbOverlay.classList.add('active');
    });
}
if (fbOverlayClose) fbOverlayClose.addEventListener('click', () => fbOverlay?.classList.remove('active'));
if (fbOverlay) fbOverlay.addEventListener('click', e => { if (e.target === fbOverlay) fbOverlay.classList.remove('active'); });

if (fbSubmit) {
    fbSubmit.addEventListener('click', async () => {
        const rawName = (fbNameInput?.value || '').trim();
        const rawMsg = (fbMessageInput?.value || '').trim();
        const t = i18n[currentLang] || i18n.ru;
        if (!rawName) { showStatus(fbStatus, t.fbNameRequired, true); return; }
        if (!rawMsg || rawMsg.length < 3) { showStatus(fbStatus, t.fbMsgShort, true); return; }
        const name = typeof censorProfanity === 'function' ? censorProfanity(rawName) : rawName;
        const message = typeof censorProfanity === 'function' ? censorProfanity(rawMsg) : rawMsg;
        showStatus(fbStatus, t.fbSending, false);
        try {
            if (auth && !auth.currentUser) await auth.signInAnonymously();
            const currentUid = auth?.currentUser ? auth.currentUser.uid : (authUid || getCookie('authUid') || '');
            await db.collection(Fb_COLLECTION).add({
                name, message, uid: currentUid,
                time: firebase.firestore.FieldValue.serverTimestamp()
            });
            if (name !== savedName) {
                savedName = name;
                setCookie('snakeNick', savedName, 365);
                localStorage.setItem('danmakuNick', savedName);
                if (playerNameInput) playerNameInput.value = savedName;
            }
            showStatus(fbStatus, t.fbSent, false);
            setTimeout(() => {
                if (fbOverlay) fbOverlay.classList.remove('active');
                loadFeedback(true);
            }, 800);
        } catch (e) {
            showStatus(fbStatus, e.message, true);
        }
    });
}

// === COOKIE BANNER ===
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const modal = document.getElementById('cookieModal');
    if (!banner) return;
    const consent = getCookie('cookieConsent');
    if (!consent) banner.style.display = 'flex';
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const settingsBtn = document.getElementById('cookieSettingsBtn');
    const modalClose = document.getElementById('cookieModalClose');
    const saveBtn = document.getElementById('cookieSaveBtn');
    const scoresPref = document.getElementById('cookieScoresPref');

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        setCookie('cookieConsent', 'all', 365);
        banner.style.display = 'none';
    });
    if (settingsBtn) settingsBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('active');
    });
    if (modalClose) modalClose.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
    });
    if (saveBtn) saveBtn.addEventListener('click', () => {
        const allowScores = scoresPref ? scoresPref.checked : true;
        setCookie('cookieConsent', allowScores ? 'all' : 'essential', 365);
        if (modal) modal.classList.remove('active');
        banner.style.display = 'none';
    });
}

// Initialize on load
applyTheme();
applyColor(activeColor);
applyLanguage();
initCookieBanner();
