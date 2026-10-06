// === COOKIES ===
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days || 365) * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/';
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// === ЛОКАЛИЗАЦИЯ ===
let currentLang = 'ru';
const cookieLang = getCookie('snakeLang');
if (cookieLang === 'ru' || cookieLang === 'en') {
    currentLang = cookieLang;
} else {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('en')) currentLang = 'en';
    setCookie('snakeLang', currentLang);
}

const langToggle = document.getElementById('langToggle');

function applyLanguage() {
    document.documentElement.lang = currentLang;
    if (langToggle) langToggle.innerText = currentLang.toUpperCase();

    const t = i18n[currentLang] || i18n.ru;
    
    document.title = t.pageTitle;
    const heroTitle = document.getElementById('uiHubHeroTitle');
    if (heroTitle) heroTitle.innerText = t.hubHeroTitle;
    const heroSubtitle = document.getElementById('uiHubHeroSubtitle');
    if (heroSubtitle) heroSubtitle.innerText = t.hubHeroSubtitle;
    
    const snakeTitle = document.getElementById('uiGameSnakeTitle');
    if (snakeTitle) snakeTitle.innerText = t.gameSnakeTitle;
    const snakeDesc = document.getElementById('uiGameSnakeDesc');
    if (snakeDesc) snakeDesc.innerText = t.gameSnakeDesc;
    const playBtnSnake = document.getElementById('uiPlayBtnSnake');
    if (playBtnSnake) playBtnSnake.innerText = t.badgePlayable;
    const badgeClassic = document.getElementById('uiBadgeClassic');
    if (badgeClassic) badgeClassic.innerText = t.badgeClassic;

    const soonTitle = document.getElementById('uiGameSoonTitle');
    if (soonTitle) soonTitle.innerText = t.gameSoonTitle;
    const soonDesc = document.getElementById('uiGameSoonDesc');
    if (soonDesc) soonDesc.innerText = t.gameSoonDesc;
    const badgeSoon = document.getElementById('uiBadgeSoon');
    if (badgeSoon) badgeSoon.innerText = t.badgeSoon;

    const pongTitle = document.getElementById('uiGamePongTitle');
    if (pongTitle) pongTitle.innerText = t.gamePongTitle;
    const pongDesc = document.getElementById('uiGamePongDesc');
    if (pongDesc) pongDesc.innerText = t.gamePongDesc;
    const badgePlanned = document.getElementById('uiBadgePlanned');
    if (badgePlanned) badgePlanned.innerText = t.badgePlanned;

    const fbTitle = document.getElementById('fbTitle');
    if (fbTitle) fbTitle.innerText = t.fbTitle;
    const fbWriteBtn = document.getElementById('fbWriteBtn');
    if (fbWriteBtn) fbWriteBtn.innerText = t.fbWriteBtn;
    const fbModalTitle = document.querySelector('#fbOverlay .auth-title');
    if (fbModalTitle) fbModalTitle.innerText = t.fbOverlayTitle;
    const fbNameInput = document.getElementById('fbNameInput');
    if (fbNameInput) fbNameInput.placeholder = t.fbNamePlaceholder;
    const fbMessageInput = document.getElementById('fbMessageInput');
    if (fbMessageInput) fbMessageInput.placeholder = t.fbMsgPlaceholder;
    const fbSubmit = document.getElementById('fbSubmit');
    if (fbSubmit) fbSubmit.innerText = t.fbSubmitBtn;

    const authBtn = document.getElementById('authBtn');
    if (authBtn) authBtn.title = t.signInTooltip;
    const authTitle = document.getElementById('authTitle');
    if (authTitle) authTitle.innerText = t.authSignIn;
    const authEmailBtn = document.getElementById('authEmailBtn');
    if (authEmailBtn && authEmailBtn.childNodes[1]) authEmailBtn.childNodes[1].textContent = ' ' + t.authEmailBtn;
    const authGoogle = document.getElementById('authGoogle');
    if (authGoogle && authGoogle.childNodes[1]) authGoogle.childNodes[1].textContent = ' ' + t.authGoogleBtn;
    const authGithub = document.getElementById('authGithub');
    if (authGithub && authGithub.childNodes[1]) authGithub.childNodes[1].textContent = ' ' + t.authGithubBtn;
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        setCookie('snakeLang', currentLang);
        applyLanguage();
    });
}

// === ТЕМА (СВЕТЛАЯ / ТЕМНАЯ) ===
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let isDark = true;
const savedTheme = getCookie('snakeTheme');
if (savedTheme) {
    isDark = savedTheme === 'dark';
} else {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme() {
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeToggle) themeToggle.innerText = isDark ? '🌙' : '☀️';
}
applyTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        setCookie('snakeTheme', isDark ? 'dark' : 'light');
        applyTheme();
    });
}

// === FIREBASE ИНИЦИАЛИЗАЦИЯ (ОТЗЫВЫ И АВТОРИЗАЦИЯ) ===
const firebaseConfig = {
    apiKey: "AIzaSyBj5Nxq05fVgiTiNJNM17R6xrRjBmB7qDI",
    authDomain: "refyrdsite.firebaseapp.com",
    projectId: "refyrdsite",
    storageBucket: "refyrdsite.firebasestorage.app",
    messagingSenderId: "37852850018",
    appId: "1:37852850018:web:56cc3448489f4b9699ee3b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let authUid = null;
let authUser = null;

// Auth modal
const authOverlay = document.getElementById('authOverlay');
const authClose = document.getElementById('authClose');
const authBtn = document.getElementById('authBtn');

function openAuthModal() {
    if (authOverlay) authOverlay.classList.add('active');
}
function closeAuthModal() {
    if (authOverlay) authOverlay.classList.remove('active');
}
if (authBtn) authBtn.addEventListener('click', openAuthModal);
if (authClose) authClose.addEventListener('click', closeAuthModal);

// Feedback overlay
const fbOverlay = document.getElementById('fbOverlay');
const fbClose = document.getElementById('fbClose');
const fbWriteBtn = document.getElementById('fbWriteBtn');
const fbSubmit = document.getElementById('fbSubmit');
const fbNameInput = document.getElementById('fbNameInput');
const fbMessageInput = document.getElementById('fbMessageInput');
const fbStatus = document.getElementById('fbStatus');

if (fbWriteBtn) {
    fbWriteBtn.addEventListener('click', () => {
        if (fbOverlay) {
            fbOverlay.classList.add('active');
            if (fbNameInput) fbNameInput.value = getCookie('snakeNick') || '';
            if (fbStatus) fbStatus.textContent = '';
        }
    });
}
if (fbClose) {
    fbClose.addEventListener('click', () => {
        if (fbOverlay) fbOverlay.classList.remove('active');
    });
}

// Send feedback
if (fbSubmit) {
    fbSubmit.addEventListener('click', async () => {
        const name = (fbNameInput?.value || '').trim();
        const msg = (fbMessageInput?.value || '').trim();
        const t = i18n[currentLang] || i18n.ru;
        if (!name) {
            if (fbStatus) { fbStatus.textContent = t.fbNameRequired; fbStatus.style.color = 'var(--md-sys-color-error)'; }
            return;
        }
        if (msg.length < 3) {
            if (fbStatus) { fbStatus.textContent = t.fbMsgShort; fbStatus.style.color = 'var(--md-sys-color-error)'; }
            return;
        }
        try {
            fbSubmit.disabled = true;
            if (fbStatus) { fbStatus.textContent = t.fbSending; fbStatus.style.color = 'var(--md-sys-color-on-surface)'; }
            await db.collection('feedback').add({
                name: name,
                message: msg,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            if (fbStatus) { fbStatus.textContent = t.fbSent; fbStatus.style.color = 'var(--md-sys-color-primary)'; }
            if (fbMessageInput) fbMessageInput.value = '';
            setTimeout(() => {
                if (fbOverlay) fbOverlay.classList.remove('active');
                if (fbSubmit) fbSubmit.disabled = false;
            }, 1200);
        } catch (e) {
            if (fbSubmit) fbSubmit.disabled = false;
            if (fbStatus) { fbStatus.textContent = e.message; fbStatus.style.color = 'var(--md-sys-color-error)'; }
        }
    });
}

// Close on ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (fbOverlay && fbOverlay.classList.contains('active')) fbOverlay.classList.remove('active');
        if (authOverlay && authOverlay.classList.contains('active')) authOverlay.classList.remove('active');
    }
});

applyLanguage();
