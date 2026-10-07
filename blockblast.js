// === COOKIES & HELPERS ===
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days || 365) * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}
function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax';
}

// === LOCALIZATION ===
let currentLang = 'ru';
const cookieLang = getCookie('snakeLang');
if (cookieLang === 'ru' || cookieLang === 'en') {
    currentLang = cookieLang;
} else {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('ru')) currentLang = 'ru';
    setCookie('snakeLang', currentLang);
}

// === CANVAS & RETINA SCALING ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const LOGICAL_WIDTH = 400;
const LOGICAL_HEIGHT = 560;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale((canvas.width / LOGICAL_WIDTH), (canvas.height / LOGICAL_HEIGHT));
}
window.addEventListener('resize', resizeCanvas);

// === SOUND SYNTHESIZER (Web Audio API) ===
class SoundManager {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }
    playPop() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }
    playLineClear(combo = 0) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const baseFreq = 440 * Math.pow(1.122, Math.min(combo, 8));
        [0, 4, 7, 12].forEach((semitone, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const freq = baseFreq * Math.pow(1.05946, semitone);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.04);
            gain.gain.setValueAtTime(0.18, now + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 0.24);
        });
    }
    playGameOver() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
    }
}
const sfx = new SoundManager();

// === SHAPES LIBRARY & COLOR MODES ===
const BLOCK_COLORS = {
    cyan: '#00E5FF',
    gold: '#FFD700',
    rose: '#FF4081',
    emerald: '#00E676',
    purple: '#B388FF',
    coral: '#FF5252',
    blue: '#448AFF',
    amber: '#FF9100'
};

const COLOR_MAP_REVERSE = {
    '#00E5FF': 'cyan',
    '#FFD700': 'gold',
    '#FF4081': 'rose',
    '#00E676': 'emerald',
    '#B388FF': 'purple',
    '#FF5252': 'coral',
    '#448AFF': 'blue',
    '#FF9100': 'amber'
};

// Material Design 3 Tonal Palettes for theme-matching block colors
const THEME_TONAL_MAP = {
    green: {
        dark: {
            cyan: '#82d363',
            gold: '#9cd67d',
            rose: '#69b84a',
            emerald: '#56a638',
            purple: '#b7f397',
            coral: '#438f28',
            blue: '#78c659',
            amber: '#adeb8e'
        },
        light: {
            cyan: '#3e7524',
            gold: '#4d8a2f',
            rose: '#32631b',
            emerald: '#295415',
            purple: '#5c9e3b',
            coral: '#1f430f',
            blue: '#457e29',
            amber: '#68ab45'
        }
    },
    blue: {
        dark: {
            cyan: '#89bfff',
            gold: '#9fc9ff',
            rose: '#6ba8fa',
            emerald: '#4b91f5',
            purple: '#d1e4ff',
            coral: '#347de8',
            blue: '#7cb5fc',
            amber: '#badaff'
        },
        light: {
            cyan: '#006fb6',
            gold: '#0083d6',
            rose: '#005b97',
            emerald: '#004c80',
            purple: '#1b94e8',
            coral: '#003e69',
            blue: '#0065a6',
            amber: '#36a3f2'
        }
    },
    red: {
        dark: {
            cyan: '#f49b98',
            gold: '#f2b8b5',
            rose: '#e8827e',
            emerald: '#d96763',
            purple: '#f9dedc',
            coral: '#c9514d',
            blue: '#ee908c',
            amber: '#f7ccc9'
        },
        light: {
            cyan: '#c62b23',
            gold: '#d9382f',
            rose: '#a82019',
            emerald: '#8f1610',
            purple: '#e54a41',
            coral: '#770e0a',
            blue: '#b8251e',
            amber: '#ee5d55'
        }
    },
    purple: {
        dark: {
            cyan: '#c3a5fa',
            gold: '#d0bcff',
            rose: '#b28bf7',
            emerald: '#9d6ef2',
            purple: '#eaddff',
            coral: '#8b55e8',
            blue: '#ba98f8',
            amber: '#decefc'
        },
        light: {
            cyan: '#755bb3',
            gold: '#8669c6',
            rose: '#624a9a',
            emerald: '#533b86',
            purple: '#9477d6',
            coral: '#442d72',
            blue: '#6c53a8',
            amber: '#a387e3'
        }
    },
    neutral: {
        dark: {
            cyan: '#9bb4c4',
            gold: '#b1c8d8',
            rose: '#849fb0',
            emerald: '#6f8b9d',
            purple: '#cee4f4',
            coral: '#5c7889',
            blue: '#8fa9ba',
            amber: '#c4d7e3'
        },
        light: {
            cyan: '#526673',
            gold: '#617885',
            rose: '#445561',
            emerald: '#384752',
            purple: '#718997',
            coral: '#2c3942',
            blue: '#4b5e6b',
            amber: '#819ba8'
        }
    }
};

let blockColorMode = getCookie('bbColorMode') || localStorage.getItem('bbColorMode') || 'multi'; // 'multi' or 'theme'

function setBlockColorMode(mode) {
    blockColorMode = (mode === 'theme') ? 'theme' : 'multi';
    setCookie('bbColorMode', blockColorMode, 365);
    localStorage.setItem('bbColorMode', blockColorMode);
    updateBlockColorUI();
}

function resolveBlockColor(colorOrKey) {
    if (!colorOrKey) return '#00E5FF';
    const key = COLOR_MAP_REVERSE[colorOrKey] || colorOrKey;
    if (blockColorMode === 'theme') {
        const themeColor = document.documentElement.getAttribute('data-color') || 'neutral';
        const themeMode = document.documentElement.getAttribute('data-theme') || 'dark';
        const palette = THEME_TONAL_MAP[themeColor] && THEME_TONAL_MAP[themeColor][themeMode];
        if (palette && palette[key]) {
            return palette[key];
        }
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
        return primary || '#4CAF50';
    }
    return BLOCK_COLORS[key] || colorOrKey;
}

const SHAPE_DEFINITIONS = [
    // 1x1 Dot
    { matrix: [[1]], color: BLOCK_COLORS.gold, colorKey: 'gold', weight: 6, size: 1 },
    // 2-block lines
    { matrix: [[1, 1]], color: BLOCK_COLORS.cyan, colorKey: 'cyan', weight: 8, size: 2 },
    { matrix: [[1], [1]], color: BLOCK_COLORS.cyan, colorKey: 'cyan', weight: 8, size: 2 },
    // 3-block lines
    { matrix: [[1, 1, 1]], color: BLOCK_COLORS.emerald, colorKey: 'emerald', weight: 8, size: 3 },
    { matrix: [[1], [1], [1]], color: BLOCK_COLORS.emerald, colorKey: 'emerald', weight: 8, size: 3 },
    // 4-block lines
    { matrix: [[1, 1, 1, 1]], color: BLOCK_COLORS.blue, colorKey: 'blue', weight: 6, size: 4 },
    { matrix: [[1], [1], [1], [1]], color: BLOCK_COLORS.blue, colorKey: 'blue', weight: 6, size: 4 },
    // 5-block lines
    { matrix: [[1, 1, 1, 1, 1]], color: BLOCK_COLORS.purple, colorKey: 'purple', weight: 4, size: 5 },
    { matrix: [[1], [1], [1], [1], [1]], color: BLOCK_COLORS.purple, colorKey: 'purple', weight: 4, size: 5 },
    // 2x2 Square
    { matrix: [[1, 1], [1, 1]], color: BLOCK_COLORS.amber, colorKey: 'amber', weight: 8, size: 4 },
    // 3x3 Square
    { matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], color: BLOCK_COLORS.coral, colorKey: 'coral', weight: 3, size: 9 },
    // Small Corner L (2x2)
    { matrix: [[1, 0], [1, 1]], color: BLOCK_COLORS.rose, colorKey: 'rose', weight: 6, size: 3 },
    { matrix: [[0, 1], [1, 1]], color: BLOCK_COLORS.rose, colorKey: 'rose', weight: 6, size: 3 },
    { matrix: [[1, 1], [1, 0]], color: BLOCK_COLORS.rose, colorKey: 'rose', weight: 6, size: 3 },
    { matrix: [[1, 1], [0, 1]], color: BLOCK_COLORS.rose, colorKey: 'rose', weight: 6, size: 3 },
    // Big L (3x3)
    { matrix: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], color: BLOCK_COLORS.gold, colorKey: 'gold', weight: 4, size: 5 },
    { matrix: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], color: BLOCK_COLORS.gold, colorKey: 'gold', weight: 4, size: 5 },
    { matrix: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], color: BLOCK_COLORS.gold, colorKey: 'gold', weight: 4, size: 5 },
    { matrix: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], color: BLOCK_COLORS.gold, colorKey: 'gold', weight: 4, size: 5 },
    // T-shapes
    { matrix: [[1, 1, 1], [0, 1, 0]], color: BLOCK_COLORS.purple, colorKey: 'purple', weight: 5, size: 4 },
    { matrix: [[0, 1, 0], [1, 1, 1]], color: BLOCK_COLORS.purple, colorKey: 'purple', weight: 5, size: 4 },
    { matrix: [[1, 0], [1, 1], [1, 0]], color: BLOCK_COLORS.purple, colorKey: 'purple', weight: 5, size: 4 },
    { matrix: [[0, 1], [1, 1], [0, 1]], color: BLOCK_COLORS.purple, colorKey: 'purple', weight: 5, size: 4 },
    // Z / S shapes
    { matrix: [[1, 1, 0], [0, 1, 1]], color: BLOCK_COLORS.emerald, colorKey: 'emerald', weight: 4, size: 4 },
    { matrix: [[0, 1, 1], [1, 1, 0]], color: BLOCK_COLORS.emerald, colorKey: 'emerald', weight: 4, size: 4 },
    { matrix: [[1, 0], [1, 1], [0, 1]], color: BLOCK_COLORS.emerald, colorKey: 'emerald', weight: 4, size: 4 },
    { matrix: [[0, 1], [1, 1], [1, 0]], color: BLOCK_COLORS.emerald, colorKey: 'emerald', weight: 4, size: 4 },
    // Plus / Cross
    { matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], color: BLOCK_COLORS.cyan, colorKey: 'cyan', weight: 3, size: 5 }
];

function getRandomShape() {
    const totalWeight = SHAPE_DEFINITIONS.reduce((acc, s) => acc + s.weight, 0);
    let r = Math.random() * totalWeight;
    for (const def of SHAPE_DEFINITIONS) {
        if (r < def.weight) {
            return {
                matrix: def.matrix.map(row => [...row]),
                color: def.color,
                colorKey: def.colorKey,
                rows: def.matrix.length,
                cols: def.matrix[0].length,
                size: def.size || 4
            };
        }
        r -= def.weight;
    }
    return {
        matrix: SHAPE_DEFINITIONS[0].matrix.map(row => [...row]),
        color: SHAPE_DEFINITIONS[0].color,
        colorKey: SHAPE_DEFINITIONS[0].colorKey,
        rows: SHAPE_DEFINITIONS[0].matrix.length,
        cols: SHAPE_DEFINITIONS[0].matrix[0].length,
        size: SHAPE_DEFINITIONS[0].size || 1
    };
}

// === BOARD & GAMEPLAY CONSTANTS ===
const GRID_SIZE = 8;
const BOARD_X = 22;
const BOARD_Y = 16;
const CELL_SIZE = 41;
const CELL_GAP = 4;
const BOARD_WIDTH = GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_GAP; // 356px

let grid = [];
for (let r = 0; r < GRID_SIZE; r++) {
    grid[r] = new Array(GRID_SIZE).fill(null);
}

// 3 Dock slots
const DOCK_Y = 460;
const DOCK_SLOTS = [
    { cx: 75, cy: DOCK_Y, piece: null, scale: 0, scaleTarget: 1 },
    { cx: 200, cy: DOCK_Y, piece: null, scale: 0, scaleTarget: 1 },
    { cx: 325, cy: DOCK_Y, piece: null, scale: 0, scaleTarget: 1 }
];

let gameState = 'playing'; // 'playing', 'gameover'
let score = 0;
let highScore = parseInt(localStorage.getItem('blockblastHighScore') || '0', 10);
let comboCount = 0;
let particles = [];
let floatingTexts = [];

// Interaction state
let draggingSlotIndex = -1;
let dragX = 0;
let dragY = 0;
let selectedSlotIndex = -1; // for tap-to-select support

// === SMART SOLVABLE BATCH GENERATOR ===
function countOccupiedCells() {
    let count = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] !== null) count++;
        }
    }
    return count;
}

function cloneShapeDef(def) {
    return {
        matrix: def.matrix.map(row => [...row]),
        color: def.color,
        colorKey: def.colorKey,
        rows: def.matrix.length,
        cols: def.matrix[0].length,
        size: def.size || 4
    };
}

function canPlaceShapeOnSimGrid(simGrid, matrix, targetRow, targetCol) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    if (targetRow < 0 || targetCol < 0) return false;
    if (targetRow + rows > GRID_SIZE || targetCol + cols > GRID_SIZE) return false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                if (simGrid[targetRow + r][targetCol + c] !== null) {
                    return false;
                }
            }
        }
    }
    return true;
}

function hasAnyPlacementOnSimGrid(simGrid, matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    for (let r = 0; r <= GRID_SIZE - rows; r++) {
        for (let c = 0; c <= GRID_SIZE - cols; c++) {
            if (canPlaceShapeOnSimGrid(simGrid, matrix, r, c)) {
                return true;
            }
        }
    }
    return false;
}

function simulatePlaceAndClearOnSimGrid(simGrid, matrix, targetRow, targetCol) {
    const nextGrid = simGrid.map(row => [...row]);
    const rows = matrix.length;
    const cols = matrix[0].length;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                nextGrid[targetRow + r][targetCol + c] = 1;
            }
        }
    }
    const fullRows = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        if (nextGrid[r].every(c => c !== null)) fullRows.push(r);
    }
    const fullCols = [];
    for (let c = 0; c < GRID_SIZE; c++) {
        let full = true;
        for (let r = 0; r < GRID_SIZE; r++) {
            if (nextGrid[r][c] === null) { full = false; break; }
        }
        if (full) fullCols.push(c);
    }
    for (const r of fullRows) {
        for (let c = 0; c < GRID_SIZE; c++) nextGrid[r][c] = null;
    }
    for (const c of fullCols) {
        for (let r = 0; r < GRID_SIZE; r++) nextGrid[r][c] = null;
    }
    return nextGrid;
}

function canSolveBatch(simGrid, pieces, step = 0, usedMask = 0, targetCount = 3) {
    if (step >= targetCount) return true;
    for (let i = 0; i < pieces.length; i++) {
        if ((usedMask & (1 << i)) !== 0) continue;
        const matrix = pieces[i].matrix;
        const rows = matrix.length;
        const cols = matrix[0].length;
        for (let r = 0; r <= GRID_SIZE - rows; r++) {
            for (let c = 0; c <= GRID_SIZE - cols; c++) {
                if (canPlaceShapeOnSimGrid(simGrid, matrix, r, c)) {
                    const nextGrid = simulatePlaceAndClearOnSimGrid(simGrid, matrix, r, c);
                    if (canSolveBatch(nextGrid, pieces, step + 1, usedMask | (1 << i), targetCount)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function pickWeightedShape(pool) {
    const totalWeight = pool.reduce((acc, s) => acc + s.weight, 0);
    let r = Math.random() * totalWeight;
    for (const def of pool) {
        if (r < def.weight) return def;
        r -= def.weight;
    }
    return pool[0];
}

function generateSmartDockPieces() {
    const occupied = countOccupiedCells();
    const freeCells = 64 - occupied;

    // Filter available shapes pool based on board occupancy
    let pool = SHAPE_DEFINITIONS;
    if (freeCells < 18) {
        // High saturation: prohibit large pieces, favor small shapes (1-4 blocks)
        pool = SHAPE_DEFINITIONS.filter(s => s.size <= 4 && s.matrix.length <= 3 && s.matrix[0].length <= 3);
    } else if (freeCells < 28) {
        // Moderate saturation: exclude 3x3 square
        pool = SHAPE_DEFINITIONS.filter(s => s.size <= 6 && (s.matrix.length < 3 || s.matrix[0].length < 3 || s.size < 9));
    }

    let bestTrio = null;
    let bestScore = -1;

    // Try up to 40 times to generate a trio that is 100% solvable in sequence
    for (let attempt = 0; attempt < 40; attempt++) {
        const candidateTrio = [];
        let bigCount = 0;

        for (let i = 0; i < 3; i++) {
            let def = pickWeightedShape(pool);
            if (def.size >= 5) {
                if (bigCount >= 1) {
                    const smallerPool = pool.filter(s => s.size < 5);
                    def = pickWeightedShape(smallerPool.length ? smallerPool : pool);
                } else {
                    bigCount++;
                }
            }
            candidateTrio.push(def);
        }

        const fitCount = candidateTrio.filter(d => hasAnyPlacementOnSimGrid(grid, d.matrix)).length;
        if (fitCount === 0) continue; // Must have at least 1 placeable right away

        if (canSolveBatch(grid, candidateTrio, 0, 0, 3)) {
            // If 2 or 3 fit immediately, perfect!
            if (fitCount >= 2 || freeCells < 20) {
                return candidateTrio.map(cloneShapeDef);
            }
            // Keep as best fallback
            if (fitCount > bestScore) {
                bestScore = fitCount;
                bestTrio = candidateTrio;
            }
        }
    }

    if (bestTrio) {
        return bestTrio.map(cloneShapeDef);
    }

    // Fallback: If 3-in-a-row isn't found (very cramped board), ensure at least 2 can be placed
    const fittingPool = pool.filter(s => hasAnyPlacementOnSimGrid(grid, s.matrix));
    if (fittingPool.length > 0) {
        for (let attempt = 0; attempt < 25; attempt++) {
            const p1 = pickWeightedShape(fittingPool);
            const p2 = pickWeightedShape(pool.filter(s => s.size <= 4));
            const p3 = pickWeightedShape(pool.filter(s => s.size <= 3));
            const candidateTrio = [p1, p2, p3];
            if (canSolveBatch(grid, candidateTrio, 0, 0, 2)) {
                return candidateTrio.map(cloneShapeDef);
            }
        }
    }

    // Ultimate fallback: Guarantee at least piece 0 fits!
    const ultimateFit = SHAPE_DEFINITIONS.filter(s => hasAnyPlacementOnSimGrid(grid, s.matrix));
    if (ultimateFit.length > 0) {
        const p1 = pickWeightedShape(ultimateFit);
        const smallShapes = SHAPE_DEFINITIONS.filter(s => s.size <= 3);
        const p2 = pickWeightedShape(smallShapes);
        const p3 = pickWeightedShape(smallShapes);
        return [p1, p2, p3].map(cloneShapeDef);
    }

    // Absolutely no shapes fit (board is full/locked): return minimal shapes
    return [SHAPE_DEFINITIONS[0], SHAPE_DEFINITIONS[1], SHAPE_DEFINITIONS[2]].map(cloneShapeDef);
}

function spawnNewDockPieces() {
    const pieces = generateSmartDockPieces();
    for (let i = 0; i < DOCK_SLOTS.length; i++) {
        DOCK_SLOTS[i].piece = pieces[i] || getRandomShape();
        DOCK_SLOTS[i].scale = 0;
        DOCK_SLOTS[i].scaleTarget = 1;
    }
}

function canPlaceShape(matrix, targetRow, targetCol) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    if (targetRow < 0 || targetCol < 0) return false;
    if (targetRow + rows > GRID_SIZE || targetCol + cols > GRID_SIZE) return false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                if (grid[targetRow + r][targetCol + c] !== null) {
                    return false;
                }
            }
        }
    }
    return true;
}

function hasAnyValidPlacement(matrix) {
    for (let r = 0; r <= GRID_SIZE - matrix.length; r++) {
        for (let c = 0; c <= GRID_SIZE - matrix[0].length; c++) {
            if (canPlaceShape(matrix, r, c)) {
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    let hasAvailable = false;
    for (const slot of DOCK_SLOTS) {
        if (slot.piece) {
            hasAvailable = true;
            if (hasAnyValidPlacement(slot.piece.matrix)) {
                return false; // Can still place at least one piece!
            }
        }
    }
    return hasAvailable; // Game over if pieces exist but none can fit!
}

// Particle explosion
function createBlockExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 2,
            color,
            life: 1.0,
            decay: Math.random() * 2 + 1.2
        });
    }
}

function addFloatingText(x, y, text, color = '#FFD700', size = 18) {
    floatingTexts.push({ x, y, text, color, size, life: 1.0, vy: -1.2 });
}

// Placement and Line Clearing
function placeShape(slotIndex, row, col) {
    const slot = DOCK_SLOTS[slotIndex];
    if (!slot || !slot.piece) return false;
    const piece = slot.piece;
    if (!canPlaceShape(piece.matrix, row, col)) return false;

    sfx.playPop();

    // 1. Commit to grid
    let placedCount = 0;
    for (let r = 0; r < piece.rows; r++) {
        for (let c = 0; c < piece.cols; c++) {
            if (piece.matrix[r][c] === 1) {
                grid[row + r][col + c] = piece.colorKey || COLOR_MAP_REVERSE[piece.color] || 'cyan';
                placedCount++;
            }
        }
    }

    score += placedCount;
    slot.piece = null;
    selectedSlotIndex = -1;

    // 2. Check full rows & columns
    const fullRows = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        if (grid[r].every(c => c !== null)) fullRows.push(r);
    }
    const fullCols = [];
    for (let c = 0; c < GRID_SIZE; c++) {
        let full = true;
        for (let r = 0; r < GRID_SIZE; r++) {
            if (grid[r][c] === null) { full = false; break; }
        }
        if (full) fullCols.push(c);
    }

    const totalLines = fullRows.length + fullCols.length;
    if (totalLines > 0) {
        comboCount++;
        sfx.playLineClear(comboCount);

        let linePoints = 0;
        if (totalLines === 1) linePoints = 10;
        else if (totalLines === 2) linePoints = 30;
        else if (totalLines === 3) linePoints = 60;
        else linePoints = 100 + (totalLines - 4) * 50;

        const comboBonus = comboCount > 1 ? (comboCount * 15) : 0;
        const awarded = (linePoints + comboBonus);
        score += awarded;

        // Clear cells and spawn particles
        const cellsToClear = new Set();
        fullRows.forEach(r => {
            for (let c = 0; c < GRID_SIZE; c++) cellsToClear.add(`${r},${c}`);
        });
        fullCols.forEach(c => {
            for (let r = 0; r < GRID_SIZE; r++) cellsToClear.add(`${r},${c}`);
        });

        cellsToClear.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            const cx = BOARD_X + c * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
            const cy = BOARD_Y + r * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
            createBlockExplosion(cx, cy, resolveBlockColor(grid[r][c] || piece.colorKey || piece.color));
            grid[r][c] = null;
        });

        // Floating message
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        if (comboCount > 1) {
            addFloatingText(LOGICAL_WIDTH / 2, BOARD_Y + BOARD_WIDTH / 2 - 20, (t.bbCombo || 'COMBO x') + comboCount + ' (+' + awarded + ')', '#FFD700', 22);
            if (typeof fireConfettiBurst === 'function' && comboCount >= 3) fireConfettiBurst();
        } else {
            addFloatingText(LOGICAL_WIDTH / 2, BOARD_Y + BOARD_WIDTH / 2, '+' + awarded, '#00E5FF', 20);
        }
    } else {
        comboCount = 0;
    }

    // High score check
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('blockblastHighScore', highScore);
        const menuHigh = document.getElementById('menuHighScoreText');
        if (menuHigh) {
            const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
            menuHigh.innerText = (t.bestScore || 'Лучший счет: ') + highScore.toLocaleString();
        }
    }
    updateScoreDisplay();

    // Check if dock is empty -> spawn next wave
    const allUsed = DOCK_SLOTS.every(s => s.piece === null);
    if (allUsed) {
        spawnNewDockPieces();
    }

    // Check game over
    if (checkGameOver()) {
        triggerGameOver();
    }

    return true;
}

function triggerGameOver() {
    gameState = 'gameover';
    sfx.playGameOver();
    const finalScoreEl = document.getElementById('finalScore');
    if (finalScoreEl) finalScoreEl.innerText = score.toLocaleString();
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) gameOverScreen.classList.add('active');
    if (typeof saveScoreToLeaderboard === 'function') {
        saveScoreToLeaderboard(true);
    }
}

function restartGame() {
    for (let r = 0; r < GRID_SIZE; r++) {
        grid[r].fill(null);
    }
    score = 0;
    comboCount = 0;
    particles = [];
    floatingTexts = [];
    gameState = 'playing';
    selectedSlotIndex = -1;
    draggingSlotIndex = -1;
    updateScoreDisplay();
    spawnNewDockPieces();
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) gameOverScreen.classList.remove('active');
    const startMenu = document.getElementById('startMenu');
    if (startMenu) startMenu.classList.remove('active');
}

function updateScoreDisplay() {
    const scoreVal = document.getElementById('score');
    if (scoreVal) scoreVal.innerText = score.toLocaleString();
    const menuHigh = document.getElementById('menuHighScoreText');
    if (menuHigh) {
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        menuHigh.innerText = (t.bestScore || 'Лучший счет: ') + highScore.toLocaleString();
    }
}

// === INPUT COORDINATE CONVERSION ===
function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (clientX - rect.left) * (LOGICAL_WIDTH / rect.width),
        y: (clientY - rect.top) * (LOGICAL_HEIGHT / rect.height)
    };
}

function getDockSlotAtCoords(x, y) {
    for (let i = 0; i < DOCK_SLOTS.length; i++) {
        const s = DOCK_SLOTS[i];
        if (!s.piece) continue;
        const dx = x - s.cx;
        const dy = y - s.cy;
        if (Math.abs(dx) < 55 && Math.abs(dy) < 55) {
            return i;
        }
    }
    return -1;
}

function getTargetGridCell(piece, dropCenterX, dropCenterY) {
    const piecePixelW = piece.cols * (CELL_SIZE + CELL_GAP) - CELL_GAP;
    const piecePixelH = piece.rows * (CELL_SIZE + CELL_GAP) - CELL_GAP;
    const leftX = dropCenterX - piecePixelW / 2;
    const topY = dropCenterY - piecePixelH / 2;

    const col = Math.round((leftX - BOARD_X) / (CELL_SIZE + CELL_GAP));
    const row = Math.round((topY - BOARD_Y) / (CELL_SIZE + CELL_GAP));
    return { row, col };
}

// Event Listeners for Touch / Mouse
let isPointerDown = false;
let startX = 0;
let startY = 0;
let isDraggingMoved = false;

function onPointerDown(e) {
    if (gameState !== 'playing') return;
    sfx.init();
    const coords = getCanvasCoords(e);
    startX = coords.x;
    startY = coords.y;
    isPointerDown = true;
    isDraggingMoved = false;

    const slotIdx = getDockSlotAtCoords(coords.x, coords.y);
    if (slotIdx !== -1) {
        draggingSlotIndex = slotIdx;
        dragX = coords.x;
        dragY = e.touches ? coords.y - 50 : coords.y; // Finger offset on mobile!
    }
}

function onPointerMove(e) {
    if (!isPointerDown) return;
    const coords = getCanvasCoords(e);
    if (Math.hypot(coords.x - startX, coords.y - startY) > 8) {
        isDraggingMoved = true;
    }
    if (draggingSlotIndex !== -1) {
        dragX = coords.x;
        dragY = e.touches ? coords.y - 50 : coords.y;
    }
}

function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;

    if (draggingSlotIndex !== -1) {
        const slot = DOCK_SLOTS[draggingSlotIndex];
        if (slot && slot.piece) {
            if (isDraggingMoved) {
                // Drag and drop placement
                const { row, col } = getTargetGridCell(slot.piece, dragX, dragY);
                if (canPlaceShape(slot.piece.matrix, row, col)) {
                    placeShape(draggingSlotIndex, row, col);
                }
            } else {
                // Simple tap to select
                if (selectedSlotIndex === draggingSlotIndex) {
                    selectedSlotIndex = -1; // Deselect
                } else {
                    selectedSlotIndex = draggingSlotIndex; // Select
                }
            }
        }
        draggingSlotIndex = -1;
        return;
    }

    // If a piece is already selected, tapping the board places it!
    if (selectedSlotIndex !== -1 && !isDraggingMoved) {
        const slot = DOCK_SLOTS[selectedSlotIndex];
        if (slot && slot.piece) {
            const coords = { x: startX, y: startY };
            const col = Math.floor((coords.x - BOARD_X) / (CELL_SIZE + CELL_GAP));
            const row = Math.floor((coords.y - BOARD_Y) / (CELL_SIZE + CELL_GAP));
            if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
                if (canPlaceShape(slot.piece.matrix, row, col)) {
                    placeShape(selectedSlotIndex, row, col);
                }
            }
        }
    }
}

canvas.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);

canvas.addEventListener('touchstart', onPointerDown, { passive: false });
window.addEventListener('touchmove', onPointerMove, { passive: false });
window.addEventListener('touchend', onPointerUp, { passive: false });

// === RENDERING ENGINE ===
function drawRoundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
}

function renderBlock(x, y, size, color, alpha = 1.0) {
    ctx.save();
    ctx.globalAlpha = alpha;

    // Base colored body
    ctx.fillStyle = color;
    drawRoundedRect(x, y, size, size, 8);
    ctx.fill();

    // Top subtle bevel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    drawRoundedRect(x + 2, y + 2, size - 4, (size - 4) * 0.45, 6);
    ctx.fill();

    // Subtle dark border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    drawRoundedRect(x, y, size, size, 8);
    ctx.stroke();

    ctx.restore();
}

function renderPieceMatrix(matrix, color, centerX, centerY, blockSize, alpha = 1.0) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const totalW = cols * blockSize + (cols - 1) * 3;
    const totalH = rows * blockSize + (rows - 1) * 3;
    const startX = centerX - totalW / 2;
    const startY = centerY - totalH / 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                const bx = startX + c * (blockSize + 3);
                const by = startY + r * (blockSize + 3);
                renderBlock(bx, by, blockSize, color, alpha);
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // 1. Board Background (8x8 Grid Container)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    drawRoundedRect(BOARD_X - 6, BOARD_Y - 6, BOARD_WIDTH + 12, BOARD_WIDTH + 12, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 2. Grid Empty Cells
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const x = BOARD_X + c * (CELL_SIZE + CELL_GAP);
            const y = BOARD_Y + r * (CELL_SIZE + CELL_GAP);
            const filledColor = grid[r][c];

            if (filledColor) {
                renderBlock(x, y, CELL_SIZE, resolveBlockColor(filledColor));
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                drawRoundedRect(x, y, CELL_SIZE, CELL_SIZE, 8);
                ctx.fill();
            }
        }
    }

    // 3. Ghost Placement Preview (when dragging or selected)
    let previewPiece = null;
    let previewTarget = null;
    if (draggingSlotIndex !== -1 && DOCK_SLOTS[draggingSlotIndex].piece) {
        previewPiece = DOCK_SLOTS[draggingSlotIndex].piece;
        previewTarget = getTargetGridCell(previewPiece, dragX, dragY);
    } else if (selectedSlotIndex !== -1 && DOCK_SLOTS[selectedSlotIndex].piece) {
        // Can preview hovering if applicable
    }

    if (previewPiece && previewTarget) {
        const { row, col } = previewTarget;
        if (canPlaceShape(previewPiece.matrix, row, col)) {
            // Draw ghost blocks
            for (let pr = 0; pr < previewPiece.rows; pr++) {
                for (let pc = 0; pc < previewPiece.cols; pc++) {
                    if (previewPiece.matrix[pr][pc] === 1) {
                        const gx = BOARD_X + (col + pc) * (CELL_SIZE + CELL_GAP);
                        const gy = BOARD_Y + (row + pr) * (CELL_SIZE + CELL_GAP);
                        renderBlock(gx, gy, CELL_SIZE, resolveBlockColor(previewPiece.colorKey || previewPiece.color), 0.45);
                    }
                }
            }

            // Highlight lines that would clear with glowing aura
            const testGrid = grid.map(r => [...r]);
            for (let pr = 0; pr < previewPiece.rows; pr++) {
                for (let pc = 0; pc < previewPiece.cols; pc++) {
                    if (previewPiece.matrix[pr][pc] === 1) testGrid[row + pr][col + pc] = true;
                }
            }
            ctx.save();
            ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
            for (let r = 0; r < GRID_SIZE; r++) {
                if (testGrid[r].every(c => c !== null)) {
                    drawRoundedRect(BOARD_X - 2, BOARD_Y + r * (CELL_SIZE + CELL_GAP) - 2, BOARD_WIDTH + 4, CELL_SIZE + 4, 8);
                    ctx.fill();
                }
            }
            for (let c = 0; c < GRID_SIZE; c++) {
                let full = true;
                for (let r = 0; r < GRID_SIZE; r++) {
                    if (testGrid[r][c] === null) { full = false; break; }
                }
                if (full) {
                    drawRoundedRect(BOARD_X + c * (CELL_SIZE + CELL_GAP) - 2, BOARD_Y - 2, CELL_SIZE + 4, BOARD_WIDTH + 4, 8);
                    ctx.fill();
                }
            }
            ctx.restore();
        }
    }

    // 4. Dock Pieces
    for (let i = 0; i < DOCK_SLOTS.length; i++) {
        const slot = DOCK_SLOTS[i];
        if (!slot.piece) continue;

        // Smooth scale-in animation
        slot.scale += (slot.scaleTarget - slot.scale) * 0.15;

        // If being dragged, don't draw in the dock slot!
        if (i === draggingSlotIndex) continue;

        // Highlight if selected
        if (i === selectedSlotIndex) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 215, 0, 0.18)';
            ctx.beginPath();
            ctx.arc(slot.cx, slot.cy, 52, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        const canFitNow = hasAnyValidPlacement(slot.piece.matrix);
        ctx.save();
        if (!canFitNow) {
            ctx.globalAlpha = 0.38;
        }
        renderPieceMatrix(slot.piece.matrix, resolveBlockColor(slot.piece.colorKey || slot.piece.color), slot.cx, slot.cy, 22 * slot.scale);
        ctx.restore();
    }

    // 5. Dragged Piece (rendered at full cell size at drag position)
    if (draggingSlotIndex !== -1 && DOCK_SLOTS[draggingSlotIndex].piece) {
        const p = DOCK_SLOTS[draggingSlotIndex].piece;
        renderPieceMatrix(p.matrix, resolveBlockColor(p.colorKey || p.color), dragX, dragY, CELL_SIZE, 0.95);
    }

    // 6. Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.02 * pt.decay;
        if (pt.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        ctx.save();
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // 7. Floating Texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.life -= 0.025;
        if (ft.life <= 0) {
            floatingTexts.splice(i, 1);
            continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.font = '800 ' + ft.size + 'px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }

    requestAnimationFrame(render);
}

// === CONFETTI CANNON ===
function fireConfettiBurst() {
    const cCanvas = document.getElementById('confettiCanvas');
    if (!cCanvas) return;
    const cCtx = cCanvas.getContext('2d');
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;
    const confettiPieces = [];
    const colors = ['#00E5FF', '#FFD700', '#FF4081', '#00E676', '#B388FF', '#FF5252'];
    for (let i = 0; i < 45; i++) {
        confettiPieces.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 3,
            vx: (Math.random() - 0.5) * 12,
            vy: Math.random() * -10 - 4,
            size: Math.random() * 8 + 4,
            color: colors[i % colors.length],
            life: 1.0
        });
    }
    function updateConfetti() {
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        let active = false;
        for (const p of confettiPieces) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // gravity
            p.life -= 0.015;
            if (p.life > 0) {
                active = true;
                cCtx.save();
                cCtx.globalAlpha = Math.max(0, p.life);
                cCtx.fillStyle = p.color;
                cCtx.fillRect(p.x, p.y, p.size, p.size);
                cCtx.restore();
            }
        }
        if (active) requestAnimationFrame(updateConfetti);
        else cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    }
    requestAnimationFrame(updateConfetti);
}

// === FIREBASE LEADERBOARD & FEEDBACK ===
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
const LEADERBOARD_COLLECTION = 'blockblast_leaderboard';
const Fb_COLLECTION = 'blockblast_feedback';

let authUid = null;
let authUser = null;
let skipAnonSignIn = false;
let isRegisterMode = false;
let savedName = localStorage.getItem('blockblastNick') || getCookie('snakeNick') || '';

// Nickname sanitization
function sanitizeName(name) {
    if (!name) return '';
    return name.replace(/[^\p{L}\p{N}\s_.-]/gu, '').slice(0, 12).trim();
}
function isValidName(name) {
    if (!name || name.length < 2 || name.length > 12) return false;
    if (typeof hasProfanity === 'function' && hasProfanity(name)) return false;
    return true;
}

// Auth UI binding
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

function showStatus(el, msg, isError) {
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)';
}
function clearStatus(el) { if (el) el.textContent = ''; }

function updateAuthUI() {
    if (!authBtn) return;
    const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
    if (authUser && !authUser.isAnonymous) {
        authBtn.title = authUser.displayName || authUser.email || (t.authAccount || 'Account');
        authBtn.classList.add('logged-in');
    } else {
        authBtn.title = t.signInTooltip || 'Войти';
        authBtn.classList.remove('logged-in');
    }
}

function updateNicknameInputVisibility() {
    const pInput = document.getElementById('playerNameInput');
    if (!pInput) return;
    if (authUser && !authUser.isAnonymous) {
        pInput.style.display = 'none';
    } else {
        pInput.style.display = 'block';
        if (savedName) pInput.value = savedName;
    }
}

if (authBtn) {
    authBtn.addEventListener('click', () => {
        if (!authOverlay) return;
        authOverlay.classList.add('active');
        clearStatus(authStatus);
        if (authUser && !authUser.isAnonymous) {
            authMainView.style.display = 'none';
            authAccountView.style.display = 'flex';
            const accEmail = document.getElementById('accEmail');
            if (accEmail) accEmail.textContent = authUser.email || (authUser.displayName || '');
            const accNick = document.getElementById('accNickInput');
            if (accNick) accNick.value = savedName || authUser.displayName || '';
        } else {
            authMainView.style.display = 'flex';
            authAccountView.style.display = 'none';
        }
    });
}
if (authClose) {
    authClose.addEventListener('click', () => {
        if (authOverlay) authOverlay.classList.remove('active');
    });
}

if (authToggleRegister) {
    authToggleRegister.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        if (authTitle) authTitle.textContent = isRegisterMode ? (t.authEmailRegister || 'Register') : (t.authSignIn || 'Sign In');
        if (authSubmitBtn) authSubmitBtn.textContent = isRegisterMode ? (t.authEmailRegister || 'Register') : (t.authSignIn || 'Sign In');
        if (authRegNick) authRegNick.style.display = isRegisterMode ? 'block' : 'none';
        authToggleRegister.textContent = isRegisterMode ? (t.authEmailSignIn || 'Have account? Sign In') : (t.authEmailRegister || 'No account? Register');
        clearStatus(authStatus);
    });
}

if (authSubmitBtn) {
    authSubmitBtn.addEventListener('click', async () => {
        const email = authEmail.value.trim();
        const pass = authPassword.value;
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        if (!email || !pass) {
            showStatus(authStatus, t.fillAllFields || 'Fill all fields', true);
            return;
        }
        try {
            if (isRegisterMode) {
                const cred = await auth.createUserWithEmailAndPassword(email, pass);
                const nick = sanitizeName(authRegNick.value.trim());
                if (nick && isValidName(nick)) {
                    savedName = nick;
                    setCookie('snakeNick', nick, 365);
                    localStorage.setItem('blockblastNick', nick);
                    await cred.user.updateProfile({ displayName: nick });
                }
            } else {
                await auth.signInWithEmailAndPassword(email, pass);
            }
            authOverlay.classList.remove('active');
        } catch (e) {
            showStatus(authStatus, e.message, true);
        }
    });
}

async function upgradeFromAnonymous(action) {
    if (auth && auth.currentUser && auth.currentUser.isAnonymous) {
        skipAnonSignIn = true;
        const prevUid = auth.currentUser.uid;
        try {
            const cred = await action();
            if (db && prevUid) {
                await db.collection(LEADERBOARD_COLLECTION).doc(prevUid).delete().catch(() => {});
            }
            return cred;
        } finally {
            skipAnonSignIn = false;
        }
    }
    return action();
}

if (authGoogle) {
    authGoogle.addEventListener('click', () => {
        if (!auth) return;
        upgradeFromAnonymous(() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))
            .then(() => { if (authOverlay) authOverlay.classList.remove('active'); })
            .catch(e => showStatus(authStatus, e.message, true));
    });
}

if (authGithub) {
    authGithub.addEventListener('click', () => {
        if (!auth) return;
        upgradeFromAnonymous(() => auth.signInWithPopup(new firebase.auth.GithubAuthProvider()))
            .then(() => { if (authOverlay) authOverlay.classList.remove('active'); })
            .catch(e => showStatus(authStatus, e.message, true));
    });
}

const accNickSave = document.getElementById('accNickSave');
const accNickInput = document.getElementById('accNickInput');
const accNickStatus = document.getElementById('accNickStatus');
if (accNickSave && accNickInput) {
    accNickSave.addEventListener('click', async () => {
        const val = sanitizeName(accNickInput.value.trim());
        accNickInput.value = val;
        if (!val || !isValidName(val)) {
            if (accNickStatus) showStatus(accNickStatus, '2-12 символов без мата', true);
            return;
        }
        savedName = val;
        setCookie('snakeNick', val, 365);
        localStorage.setItem('blockblastNick', val);
        if (authUser && !authUser.isAnonymous) {
            await authUser.updateProfile({ displayName: val }).catch(() => {});
        }
        if (authUid && db) {
            await db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({ name: val }, { merge: true }).catch(() => {});
            await db.collection('users').doc(authUid).set({ nickname: val, nicknameLastChange: Date.now() }, { merge: true }).catch(() => {});
        }
        if (accNickStatus) showStatus(accNickStatus, 'Сохранено!', false);
        updateNicknameInputVisibility();
        loadLeaderboard();
    });
}

const authSignOutBtn = document.getElementById('authSignOutBtn');
if (authSignOutBtn) {
    authSignOutBtn.addEventListener('click', async () => {
        skipAnonSignIn = true;
        await auth.signOut();
        skipAnonSignIn = false;
        authOverlay.classList.remove('active');
    });
}

// Auth state observer
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
                            localStorage.setItem('blockblastNick', savedName);
                            const pInput = document.getElementById('playerNameInput');
                            if (pInput) pInput.value = savedName;
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

// === LEADERBOARD SYSTEM (BLOCKBLAST_LEADERBOARD) ===
async function syncBestScoreFromServer() {
    const currentUid = authUid || (auth && auth.currentUser ? auth.currentUser.uid : null);
    if (!currentUid || !db) return;
    try {
        const doc = await db.collection(LEADERBOARD_COLLECTION).doc(currentUid).get();
        if (doc.exists) {
            const serverScore = parseInt(doc.data().score, 10) || 0;
            if (serverScore > highScore) {
                highScore = serverScore;
                localStorage.setItem('blockblastHighScore', highScore);
                updateScoreDisplay();
            }
        }
    } catch (_) {}
}

let lastScoreSaveTime = 0;
async function saveScoreToLeaderboard(force = false) {
    const currentUid = authUid || (auth && auth.currentUser ? auth.currentUser.uid : null);
    const intScore = Math.floor(score);
    if (intScore <= 0 || !currentUid || !db) return;
    const now = Date.now();
    if (!force && (now - lastScoreSaveTime < 2000)) return;
    lastScoreSaveTime = now;
    const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
    const displayName = savedName && isValidName(savedName) ? savedName : (t.anonymous || 'Аноним');
    try {
        const docRef = db.collection(LEADERBOARD_COLLECTION).doc(currentUid);
        const existing = await docRef.get();
        const existingScore = existing.exists ? (parseInt(existing.data().score, 10) || 0) : 0;
        const existingName = existing.exists ? (existing.data().name || '') : '';

        if (intScore <= existingScore && displayName === existingName) return;

        const newBest = Math.max(intScore, existingScore);
        await docRef.set({ name: displayName, score: newBest }, { merge: true });
        if (newBest > highScore) {
            highScore = newBest;
            localStorage.setItem('blockblastHighScore', highScore);
            updateScoreDisplay();
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
    const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
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
        setLbStatus('online', t.online || 'Онлайн');
        if (snapshot.empty) {
            leaderboardList.innerHTML = `<div class="lb-empty">${t.lbNoScores || 'Нет рекордов'}</div>`;
            return;
        }
        let html = '';
        let rank = 1;
        const DEV_UID = 'YVCdKKKiLXUzSl5ZRCbAep6aYiv2';
        snapshot.forEach(doc => {
            const d = doc.data();
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            const isDev = doc.id === DEV_UID || d.uid === DEV_UID;
            const devBadge = isDev ? '<span class="dev-badge">DEV</span>' : '';
            html += `<div class="lb-entry">
                <span class="lb-rank">${medal || rank}</span>
                <span class="lb-name">${escapeHtml(d.name && d.name.trim() ? d.name : (t.anonymous || 'Аноним'))}${devBadge}</span>
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
        setLbStatus('error', (t.errorPrefix || 'Ошибка: ') + e.message);
        leaderboardList.innerHTML = `<div class="lb-empty">${t.lbOffline || 'Офлайн'}</div>`;
    }
}
loadLeaderboard();

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
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        lbShowMore.innerText = lbShowAll ? (t.lbShowTop || 'Показать топ 10') : (t.lbShowAll || 'Показать все');
        const leaderboardList = document.getElementById('leaderboardList');
        if (leaderboardList) leaderboardList.innerHTML = `<div class="lb-loading">${t.lbLoading || 'Загрузка...'}</div>`;
        document.getElementById('leaderboard')?.classList.toggle('lb-show-all', lbShowAll);
        loadLeaderboard();
    });
}

setInterval(() => {
    if (document.visibilityState === 'visible') loadLeaderboard();
}, 3000);

setInterval(() => {
    const currentUid = authUid || (auth && auth.currentUser ? auth.currentUser.uid : null);
    if (gameState === 'playing' && currentUid && score > 0) {
        saveScoreToLeaderboard();
    }
}, 3000);

// === FEEDBACK SYSTEM (BLOCKBLAST_FEEDBACK) ===
const fbList = document.getElementById('feedbackList');
const fbWriteBtn = document.getElementById('fbWriteBtn');
const fbOverlay = document.getElementById('fbOverlay');
const fbOverlayClose = document.getElementById('fbOverlayClose');
const fbSubmit = document.getElementById('fbSubmit');
const fbNameInput = document.getElementById('fbNameInput');
const fbMessageInput = document.getElementById('fbMessageInput');
const fbStatus = document.getElementById('fbStatus');

if (fbWriteBtn) {
    fbWriteBtn.addEventListener('click', () => {
        if (!fbOverlay) return;
        fbOverlay.classList.add('active');
        clearStatus(fbStatus);
        if (fbNameInput) {
            if (authUser && !authUser.isAnonymous) {
                fbNameInput.value = authUser.displayName || savedName;
                fbNameInput.disabled = true;
            } else {
                fbNameInput.value = savedName || '';
                fbNameInput.disabled = false;
            }
        }
    });
}
if (fbOverlayClose) {
    fbOverlayClose.addEventListener('click', () => {
        if (fbOverlay) fbOverlay.classList.remove('active');
    });
}
if (fbSubmit) {
    fbSubmit.addEventListener('click', async () => {
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        const msg = fbMessageInput.value.trim();
        const name = (fbNameInput.value.trim()) || savedName || t.anonymous || 'Аноним';
        if (msg.length < 3) {
            showStatus(fbStatus, t.fbMsgShort || 'Сообщение слишком короткое', true);
            return;
        }
        showStatus(fbStatus, t.fbSending || 'Отправка...', false);
        try {
            if (!auth.currentUser) {
                await auth.signInAnonymously();
            }
            const uid = auth.currentUser ? auth.currentUser.uid : null;
            await db.collection(Fb_COLLECTION).add({
                name,
                message: msg,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                likes: 0,
                dislikes: 0,
                commentCount: 0,
                uid
            });
            fbMessageInput.value = '';
            fbOverlay.classList.remove('active');
            loadFeedback(true);
        } catch (e) {
            showStatus(fbStatus, e.message, true);
        }
    });
}

async function loadFeedback(silent) {
    if (!db || !fbList) return;
    _fbLangAtStart = currentLang;
    const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
    if (!silent) fbList.innerHTML = `<div class="lb-loading">${t.lbLoading || 'Загрузка...'}</div>`;
    try {
        const queryPromise = db.collection(Fb_COLLECTION).orderBy('time', 'desc').limit(50).get();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), 10000)
        );
        const snap = await Promise.race([queryPromise, timeoutPromise]);
        if (currentLang !== _fbLangAtStart) return;
        if (snap.empty) {
            fbList.innerHTML = `<div class="lb-empty">${t.fbNoFeedback || 'Пока нет отзывов'}</div>`;
            return;
        }
        let html = '';
        snap.forEach(doc => {
            const d = doc.data();
            const time = d.time ? new Date(d.time.seconds * 1000).toLocaleDateString() : '';
            const isDev = doc.id === DEV_UID || d.uid === DEV_UID;
            const devBadge = isDev ? '<span class="dev-badge">DEV</span>' : '';
            html += `<div class="fb-entry" data-id="${doc.id}">
                <div class="fb-text">${escapeHtml(d.message)}</div>
                <div class="fb-time">${escapeHtml(d.name || (t.anonymous || 'Аноним'))}${devBadge} · ${time}</div>
            </div>`;
        });
        fbList.innerHTML = html;
    } catch (e) {
        if (currentLang !== _fbLangAtStart) return;
        fbList.innerHTML = `<div class="lb-empty">${t.fbLoadFail || 'Не удалось загрузить отзывы'}</div>`;
    }
}
loadFeedback();

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// === BUTTONS & MODALS ===
const uiRestartBtn = document.getElementById('uiRestartBtn');
if (uiRestartBtn) uiRestartBtn.addEventListener('click', restartGame);
const uiPlayBtn = document.getElementById('uiPlayBtn');
if (uiPlayBtn) uiPlayBtn.addEventListener('click', restartGame);
const uiMenuBtn = document.getElementById('uiMenuBtn');
if (uiMenuBtn) uiMenuBtn.addEventListener('click', () => {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) gameOverScreen.classList.remove('active');
    const startMenu = document.getElementById('startMenu');
    if (startMenu) startMenu.classList.add('active');
});

// Name input change
const playerNameInput = document.getElementById('playerNameInput');
if (playerNameInput) {
    playerNameInput.addEventListener('change', () => {
        const raw = sanitizeName(playerNameInput.value);
        playerNameInput.value = raw;
        if (raw && isValidName(raw)) {
            savedName = raw;
            setCookie('snakeNick', raw, 365);
            localStorage.setItem('blockblastNick', raw);
            if (authUid && db) {
                db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({ name: raw }, { merge: true }).catch(() => {});
            }
        }
    });
}

// Language toggle
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        setCookie('snakeLang', currentLang);
        langToggle.innerText = currentLang.toUpperCase();
        applyLanguage();
        loadLeaderboard();
        loadFeedback(true);
    });
}

function applyLanguage() {
    document.documentElement.lang = currentLang;
    if (langToggle) langToggle.innerText = currentLang.toUpperCase();
    const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
    const scoreTitle = document.getElementById('uiScoreTitle');
    if (scoreTitle) scoreTitle.innerText = t.bbScore || 'СЧЕТ';
    const mainTitle = document.getElementById('uiMainTitle');
    if (mainTitle) mainTitle.innerText = t.blockBlastTitle || 'БЛОК БЛАСТ';
    const playBtn = document.getElementById('uiPlayBtn');
    if (playBtn) playBtn.innerText = t.playBtn || 'Играть';
    const restartBtn = document.getElementById('uiRestartBtn');
    if (restartBtn) restartBtn.innerText = t.restartBtn || 'Заново';
    const menuBtn = document.getElementById('uiMenuBtn');
    if (menuBtn) menuBtn.innerText = t.menuBtn || 'Меню';
    const lbTitle = document.getElementById('lbTitle');
    if (lbTitle) lbTitle.innerText = t.lbTitle || 'LEADERBOARD';
    const fbTitle = document.getElementById('fbTitle');
    if (fbTitle) fbTitle.innerText = t.fbTitle || 'FEEDBACK';
    const tip = document.getElementById('uiControlsTip');
    if (tip) tip.innerText = t.bbControlsTip || 'Перетаскивай или кликай фигуры для расстановки на поле 8x8';
    const controlsTitle = document.getElementById('uiControlsTitle');
    if (controlsTitle) controlsTitle.innerText = currentLang === 'ru' ? 'Как играть' : 'How to play';

    const gameOverTitle = document.getElementById('uiGameOverTitle');
    if (gameOverTitle) gameOverTitle.innerText = t.gameOverTitle || 'Game Over';
    const finalScoreText = document.getElementById('uiFinalScoreText');
    if (finalScoreText) finalScoreText.innerText = t.finalScoreText || (currentLang === 'ru' ? 'Счет: ' : 'Score: ');

    const toHubBtns = document.querySelectorAll('.to-hub-btn, #uiStartToHubBtn, #uiGameOverToHubBtn');
    toHubBtns.forEach(el => el.innerText = t.allGamesBtn || (currentLang === 'ru' ? 'Все игры' : 'All games'));

    const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const modeText = document.getElementById('uiThemeModeText');
    if (modeText) modeText.textContent = curTheme === 'dark' ? (t.themeModeDark || 'Темная') : (t.themeModeLight || 'Светлая');

    updateBlockColorUI();
    updateScoreDisplay();
}

// Theme popover
const paletteBtn = document.getElementById('paletteBtn');
const palettePopover = document.getElementById('palettePopover');
if (paletteBtn && palettePopover) {
    paletteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        palettePopover.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!palettePopover.contains(e.target) && e.target !== paletteBtn) {
            palettePopover.classList.remove('active');
        }
    });
}

const themeModeToggle = document.getElementById('themeModeToggle');
if (themeModeToggle) {
    themeModeToggle.addEventListener('click', () => {
        const curTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', curTheme);
        document.body.setAttribute('data-theme', curTheme);
        setCookie('snakeTheme', curTheme);
        const modeText = document.getElementById('uiThemeModeText');
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
        if (modeText) modeText.textContent = curTheme === 'dark' ? (t.themeModeDark || 'Темная') : (t.themeModeLight || 'Светлая');
        updateBlockColorUI();
    });
}

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const col = btn.getAttribute('data-c');
        document.documentElement.setAttribute('data-color', col);
        document.body.setAttribute('data-color', col);
        setCookie('snakeColor', col);
        updateBlockColorUI();
    });
});

// Block color mode UI & listeners
function updateBlockColorUI() {
    const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : {};
    const isTheme = blockColorMode === 'theme';

    const toggleBtn = document.getElementById('blockColorModeToggle');
    const icon = document.getElementById('blockColorModeIcon');
    const text = document.getElementById('uiBlockColorModeText');
    if (toggleBtn) {
        toggleBtn.title = t.bbBlockColorToggleTip || 'Оформление блоков: Разноцветные / В цвет темы';
    }
    if (icon) {
        icon.textContent = isTheme ? '💎' : '🎨';
    }
    if (text) {
        text.textContent = isTheme ? (t.bbColorTheme || 'В цвет темы') : (t.bbColorMulti || 'Разноцветные');
    }

    const label = document.getElementById('uiBlockColorLabel');
    if (label) {
        label.textContent = t.bbBlockColorLabel || 'Цвет блоков:';
    }
    const pillMulti = document.getElementById('pillMulti');
    const pillTheme = document.getElementById('pillTheme');
    if (pillMulti) {
        pillMulti.classList.toggle('active', !isTheme);
        pillMulti.textContent = '🎨 ' + (t.bbColorMulti || 'Разноцветные');
    }
    if (pillTheme) {
        pillTheme.classList.toggle('active', isTheme);
        pillTheme.textContent = '💎 ' + (t.bbColorTheme || 'В цвет темы');
    }
}

const blockColorToggle = document.getElementById('blockColorModeToggle');
if (blockColorToggle) {
    blockColorToggle.addEventListener('click', () => {
        setBlockColorMode(blockColorMode === 'multi' ? 'theme' : 'multi');
    });
}

const pillMulti = document.getElementById('pillMulti');
if (pillMulti) {
    pillMulti.addEventListener('click', () => {
        setBlockColorMode('multi');
    });
}

const pillTheme = document.getElementById('pillTheme');
if (pillTheme) {
    pillTheme.addEventListener('click', () => {
        setBlockColorMode('theme');
    });
}

// Start game
resizeCanvas();
spawnNewDockPieces();
applyLanguage();
updateBlockColorUI();
requestAnimationFrame(render);
