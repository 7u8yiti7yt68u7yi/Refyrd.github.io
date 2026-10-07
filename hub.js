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
function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
}

// === HTML ESCAPING ===
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// === ЛОКАЛИЗАЦИЯ (i18n) ===
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

    const paletteBtnEl = document.getElementById('paletteBtn');
    if (paletteBtnEl) paletteBtnEl.title = t.paletteTooltip || (currentLang === 'ru' ? 'Цветовая тема' : 'Theme color');
    const palettePopoverEl = document.getElementById('palettePopover');
    if (palettePopoverEl) {
        palettePopoverEl.querySelectorAll('.color-btn').forEach(btn => {
            const c = btn.getAttribute('data-c');
            const cap = c.charAt(0).toUpperCase() + c.slice(1);
            btn.title = t['color' + cap] || c;
        });
    }

    const themeModeText = document.getElementById('uiThemeModeText');
    if (themeModeText) themeModeText.textContent = isDark ? (t.themeModeDark || 'Темная тема') : (t.themeModeLight || 'Светлая тема');

    const uiNickPromptTitle = document.getElementById('uiNickPromptTitle');
    if (uiNickPromptTitle) uiNickPromptTitle.innerText = t.nickPromptTitle || 'Твой никнейм';
    const uiNickPromptSubtitle = document.getElementById('uiNickPromptSubtitle');
    if (uiNickPromptSubtitle) uiNickPromptSubtitle.innerText = t.nickPromptSubtitle || 'Придумай никнейм для рекордов и профиля';
    const nickPromptCancel = document.getElementById('nickPromptCancel');
    if (nickPromptCancel) nickPromptCancel.innerText = t.skipBtn || 'Пропустить';
    const nickPromptSave = document.getElementById('nickPromptSave');
    if (nickPromptSave) nickPromptSave.innerText = t.authSave || 'Сохранить';
    
    const snakeTitle = document.getElementById('uiGameSnakeTitle');
    if (snakeTitle) snakeTitle.innerText = t.gameSnakeTitle;
    const snakeDesc = document.getElementById('uiGameSnakeDesc');
    if (snakeDesc) snakeDesc.innerText = t.gameSnakeDesc;
    const playBtnSnake = document.getElementById('uiPlayBtnSnake');
    if (playBtnSnake) playBtnSnake.innerText = t.badgePlayable;
    const badgeClassic = document.getElementById('uiBadgeClassic');
    if (badgeClassic) badgeClassic.innerText = t.badgeClassic;

    const danmakuTitle = document.getElementById('uiGameDanmakuTitle');
    if (danmakuTitle) danmakuTitle.innerText = t.gameDanmakuTitle;
    const danmakuDesc = document.getElementById('uiGameDanmakuDesc');
    if (danmakuDesc) danmakuDesc.innerText = t.gameDanmakuDesc;
    const playBtnDanmaku = document.getElementById('uiPlayBtnDanmaku');
    if (playBtnDanmaku) playBtnDanmaku.innerText = t.badgePlayable;
    const badgeBulletHell = document.getElementById('uiBadgeBulletHell');
    if (badgeBulletHell) badgeBulletHell.innerText = t.badgeBulletHell;

    const bbTitle = document.getElementById('uiGameBlockBlastTitle');
    if (bbTitle) bbTitle.innerText = t.gameBlockBlastTitle;
    const bbDesc = document.getElementById('uiGameBlockBlastDesc');
    if (bbDesc) bbDesc.innerText = t.gameBlockBlastDesc;
    const playBtnBb = document.getElementById('uiPlayBtnBlockBlast');
    if (playBtnBb) playBtnBb.innerText = t.badgePlayable;
    const badgeBb = document.getElementById('uiBadgeBlockBlast');
    if (badgeBb) badgeBb.innerText = t.badgePuzzle;

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

    const fbHubTitle = document.getElementById('uiFbHubTitle');
    if (fbHubTitle) fbHubTitle.innerText = t.fbHubTitle;
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
    const authEmail = document.getElementById('authEmail');
    if (authEmail) authEmail.placeholder = t.authEmailPlaceholder || 'Email';
    const authPassword = document.getElementById('authPassword');
    if (authPassword) authPassword.placeholder = t.authPassPlaceholder || 'Password';
    const authRegNick = document.getElementById('authRegNick');
    if (authRegNick) authRegNick.placeholder = t.authNickPlaceholder || 'Nickname';
    const uiAuthDividerText = document.getElementById('uiAuthDividerText');
    if (uiAuthDividerText) uiAuthDividerText.textContent = t.or || 'or';
    const authAccountTitle = document.getElementById('authAccountTitle');
    if (authAccountTitle) authAccountTitle.innerText = t.authAccount || 'Account';
    const uiAccLinkedLabel = document.getElementById('uiAccLinkedLabel');
    if (uiAccLinkedLabel) uiAccLinkedLabel.innerText = t.authLinkedProviders || 'Linked providers';
    const uiAccLinkAnotherLabel = document.getElementById('uiAccLinkAnotherLabel');
    if (uiAccLinkAnotherLabel) uiAccLinkAnotherLabel.innerText = t.authLinkAnother || 'Link another';
    const uiAccNickLabel = document.getElementById('uiAccNickLabel');
    if (uiAccNickLabel) uiAccNickLabel.innerText = t.authNickname || 'Nickname';
    const accNickInput = document.getElementById('accNickInput');
    if (accNickInput) accNickInput.placeholder = t.authNickPlaceholder || 'Nickname';
    const accNickSave = document.getElementById('accNickSave');
    if (accNickSave) accNickSave.innerText = t.authSave || 'Save';
    const authSignOutBtn = document.getElementById('authSignOutBtn');
    if (authSignOutBtn) authSignOutBtn.innerText = t.authSignOut || 'Sign Out';

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

    renderProviders();
    setAuthMode(isRegisterMode);

    // Cookie banner translations
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

    // Refresh feedback texts in DOM
    if (typeof renderHubFeedbackList === 'function' && typeof fbHubCacheDocs !== 'undefined' && fbHubCacheDocs.length > 0) {
        renderHubFeedbackList();
    } else {
        document.querySelectorAll('.fb-expand').forEach(el => {
            const textEl = el.closest('.fb-entry')?.querySelector('.fb-text');
            el.textContent = textEl && textEl.classList.contains('expanded') ? t.fbShowLess : t.fbShowMore;
        });
        document.querySelectorAll('.fb-reply-btn').forEach(el => el.textContent = t.fbReply);
    }
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        setCookie('snakeLang', currentLang);
        applyLanguage();
        loadHubFeedback(true);
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

const sunPathSvg = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
const moonPathSvg = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';

function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const modeIcon = document.getElementById('themeModeIcon');
    if (modeIcon) modeIcon.innerHTML = isDark ? moonPathSvg : sunPathSvg;
    const modeText = document.getElementById('uiThemeModeText');
    if (modeText) {
        const t = (typeof i18n !== 'undefined' && i18n[currentLang]) ? i18n[currentLang] : null;
        modeText.textContent = isDark ? (t?.themeModeDark || 'Темная тема') : (t?.themeModeLight || 'Светлая тема');
    }
    const themeToggleEl = document.getElementById('themeToggle');
    if (themeToggleEl) {
        themeToggleEl.title = isDark ? (currentLang === 'ru' ? 'Светлая тема' : 'Light theme') : (currentLang === 'ru' ? 'Темная тема' : 'Dark theme');
        themeToggleEl.innerHTML = isDark
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">' + moonPathSvg + '</svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">' + sunPathSvg + '</svg>';
    }
}
applyTheme();

const themeModeToggle = document.getElementById('themeModeToggle') || document.getElementById('themeToggle');
if (themeModeToggle) {
    themeModeToggle.addEventListener('click', () => {
        isDark = !isDark;
        setCookie('snakeTheme', isDark ? 'dark' : 'light');
        applyTheme();
    });
}

// === ЦВЕТОВАЯ ТЕМА (ПАЛИТРА) ===
const paletteBtn = document.getElementById('paletteBtn');
const palettePopover = document.getElementById('palettePopover');
let currentColor = getCookie('snakeColor') || 'neutral';

function applyColor(color) {
    currentColor = color;
    document.documentElement.setAttribute('data-color', currentColor);
    body.setAttribute('data-color', currentColor);
    setCookie('snakeColor', currentColor, 365);

    if (palettePopover) {
        palettePopover.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-c') === currentColor);
        });
    }
}
applyColor(currentColor);

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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && palettePopover.classList.contains('active')) {
            palettePopover.classList.remove('active');
            paletteBtn.classList.remove('active');
        }
    });
}

// === COOKIE CONSENT BANNER ===
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const modal = document.getElementById('cookieModal');
    if (!banner) return;
    const consent = getCookie('cookieConsent');
    if (!consent) {
        banner.style.display = 'flex';
    }
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const settingsBtn = document.getElementById('cookieSettingsBtn');
    const modalClose = document.getElementById('cookieModalClose');
    const saveBtn = document.getElementById('cookieSaveBtn');
    const scoresPref = document.getElementById('cookieScoresPref');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setCookie('cookieConsent', 'all', 365);
            banner.style.display = 'none';
        });
    }
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('active');
        });
    }
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const allowScores = scoresPref ? scoresPref.checked : true;
            setCookie('cookieConsent', allowScores ? 'all' : 'essential', 365);
            if (modal) modal.classList.remove('active');
            banner.style.display = 'none';
        });
    }
}
initCookieBanner();

// === FIREBASE ИНИЦИАЛИЗАЦИЯ ===
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
try {
    db.settings({ experimentalAutoDetectLongPolling: true });
} catch (e) {
    console.warn('Firestore settings error:', e);
}
const auth = firebase.auth();

let authUid = null;
let authUser = null;

// === AUTH MODAL & CONTROLS ===
let isRegisterMode = false;
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

const NICK_COOLDOWN = 3 * 24 * 60 * 60 * 1000; // 3 days

function formatCooldownUntil(timestamp) {
    const d = new Date(timestamp);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function renderProviders() {
    if (!authUser || authUser.isAnonymous || !accProviders) return;
    const methods = (authUser.providerData || []).map(p => p.providerId);
    const provLabel = {
        'google.com': (i18n[currentLang] || i18n.ru).providerGoogle || 'Google',
        'github.com': (i18n[currentLang] || i18n.ru).providerGithub || 'GitHub',
        'password': (i18n[currentLang] || i18n.ru).providerEmail || 'Email'
    };
    accProviders.innerHTML = methods.map(id => {
        return `<span class="auth-prov-btn badge">${provLabel[id] || id}</span>`;
    }).join('');
    const used = new Set(methods);
    document.querySelectorAll('#authAccountView .auth-prov-btn[data-prov]').forEach(btn => {
        const prov = btn.dataset.prov;
        const target = prov === 'password' ? 'password' : prov + '.com';
        const labels = {
            google: (i18n[currentLang] || i18n.ru).providerGoogle || 'Google',
            github: (i18n[currentLang] || i18n.ru).providerGithub || 'GitHub',
            password: (i18n[currentLang] || i18n.ru).providerEmail || 'Email'
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
        if (btn.disabled || !authUser) return;
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
                if (accNickStatus) {
                    accNickStatus.textContent = pLabel + (t.linked || ' привязан!');
                    accNickStatus.style.color = 'var(--md-sys-color-primary)';
                }
            }).catch(e => {
                if (accNickStatus) {
                    accNickStatus.textContent = e.code === 'auth/credential-already-in-use' ? (t.alreadyLinked || 'Аккаунт уже привязан') : e.message;
                    accNickStatus.style.color = 'var(--md-sys-color-error)';
                }
            });
        }

        if (prov === 'google') {
            handleLink(user.linkWithPopup(new firebase.auth.GoogleAuthProvider()));
        } else if (prov === 'github') {
            handleLink(user.linkWithPopup(new firebase.auth.GithubAuthProvider()));
        }
    });
});

if (authLinkEmailBack) authLinkEmailBack.addEventListener('click', () => toggleAccView(false));

if (authLinkEmailLink) {
    authLinkEmailLink.addEventListener('click', () => {
        const t = i18n[currentLang] || i18n.ru;
        if (!authUser || authUser.isAnonymous) {
            if (authLinkEmailStat) authLinkEmailStat.textContent = t.notLoggedIn || 'Не вошли';
            return;
        }
        const email = (authLinkEmailInput?.value || '').trim();
        const pass = (authLinkPassInput?.value || '');
        if (!email || !pass) {
            if (authLinkEmailStat) authLinkEmailStat.textContent = t.fillEmailPass || 'Заполните email и пароль';
            return;
        }
        if (pass.length < 6) {
            if (authLinkEmailStat) authLinkEmailStat.textContent = t.passMin6 || 'Пароль минимум 6 символов';
            return;
        }
        if (authLinkEmailStat) {
            authLinkEmailStat.textContent = t.linking || 'Привязка...';
            authLinkEmailStat.style.color = 'var(--md-sys-color-on-surface)';
        }
        auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(email, pass)).then(() => {
            authUser = auth.currentUser;
            renderProviders();
            if (accNickStatus) {
                accNickStatus.textContent = t.emailLinkedSuccess || 'Email успешно привязан!';
                accNickStatus.style.color = 'var(--md-sys-color-primary)';
            }
            toggleAccView(false);
            if (authLinkEmailStat) authLinkEmailStat.textContent = '';
        }).catch(e => {
            if (authLinkEmailStat) {
                authLinkEmailStat.textContent = e.code === 'auth/credential-already-in-use' ? (t.emailAlreadyLinked || 'Email уже используется') : e.message;
                authLinkEmailStat.style.color = 'var(--md-sys-color-error)';
            }
        });
    });
}

function loadNicknameFromFirestore() {
    if (!authUser || authUser.isAnonymous) return;
    const userRef = db.collection('users').doc(authUser.uid);
    const t = i18n[currentLang] || i18n.ru;
    userRef.get().then(doc => {
        if (doc.exists && doc.data().nickname) {
            if (accNickInput) accNickInput.value = doc.data().nickname;
            setCookie('snakeNick', doc.data().nickname, 365);
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
    if (authStatus) authStatus.textContent = '';
}

if (authToggleRegister) {
    authToggleRegister.addEventListener('click', () => {
        setAuthMode(!isRegisterMode);
    });
}

function updateAuthViews() {
    const isLoggedIn = authUser && !authUser.isAnonymous;
    if (isLoggedIn) {
        if (authMainView) authMainView.style.display = 'none';
        if (authAccountView) authAccountView.style.display = 'flex';
        toggleAccView(false);
        if (authUser && authUser.uid === 'YVCdKKKiLXUzSl5ZRCbAep6aYiv2') {
            const rawEmail = authUser.email || (authUser.providerData[0] ? authUser.providerData[0].email : '');
            if (accEmail) accEmail.innerHTML = escapeHtml(rawEmail) + ' <span class="dev-badge">DEV</span>';
        } else {
            if (accEmail) accEmail.textContent = authUser.email || (authUser.providerData[0] ? authUser.providerData[0].email : '');
        }
        if (accNickInput) accNickInput.value = getCookie('snakeNick') || authUser.displayName || '';
        renderProviders();
        loadNicknameFromFirestore();
    } else {
        if (authMainView) authMainView.style.display = 'flex';
        if (authAccountView) authAccountView.style.display = 'none';
        setAuthMode(false);
    }
}

function openAuthModal() {
    updateAuthViews();
    if (authOverlay) authOverlay.classList.add('active');
    if (authBtn) authBtn.classList.add('active');
}
function closeAuthModal() {
    if (authOverlay) authOverlay.classList.remove('active');
    if (authBtn) authBtn.classList.remove('active');
}
if (authBtn) authBtn.addEventListener('click', openAuthModal);
if (authClose) authClose.addEventListener('click', closeAuthModal);
if (authOverlay) authOverlay.addEventListener('click', (e) => { if (e.target === authOverlay) closeAuthModal(); });

async function syncGuestScoreToUser(targetUid) {
    if (!targetUid) return;
    const localBest = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
    const guestUid = getCookie('guestUid');
    let guestScore = 0;
    let guestDoc = null;
    if (guestUid && guestUid !== targetUid) {
        try {
            guestDoc = await db.collection('leaderboard').doc(guestUid).get();
            if (guestDoc.exists) guestScore = guestDoc.data().score || 0;
        } catch (_) {}
    }
    const finalScore = Math.max(localBest, guestScore);
    if (finalScore > 0) {
        try {
            const userLbRef = db.collection('leaderboard').doc(targetUid);
            const userLbDoc = await userLbRef.get();
            const curScore = userLbDoc.exists ? (userLbDoc.data().score || 0) : 0;
            const myNick = getCookie('snakeNick') || authUser?.displayName || (i18n[currentLang] || i18n.ru).anonymous;
            if (finalScore > curScore) {
                await userLbRef.set({ name: myNick, score: finalScore }, { merge: true });
                localStorage.setItem('snakeHighScore', finalScore);
            }
        } catch (e) {
            console.warn('Sync score error:', e);
        }
    }
}

function requestNicknameModal(defaultNick = '') {
    const overlay = document.getElementById('nickPromptOverlay');
    const input = document.getElementById('nickPromptInput');
    const status = document.getElementById('nickPromptStatus');
    const cancelBtn = document.getElementById('nickPromptCancel');
    const saveBtn = document.getElementById('nickPromptSave');

    if (!overlay || !input || !saveBtn || !cancelBtn) {
        return Promise.resolve(defaultNick || '');
    }

    return new Promise((resolve) => {
        input.value = defaultNick || '';
        if (status) status.textContent = '';
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 50);

        function cleanup() {
            overlay.classList.remove('active');
            saveBtn.removeEventListener('click', onSave);
            cancelBtn.removeEventListener('click', onCancel);
            input.removeEventListener('keydown', onKey);
        }

        function onCancel() {
            cleanup();
            resolve(defaultNick || '');
        }

        function onSave() {
            const raw = (input.value || '').trim();
            if (!raw) {
                cleanup();
                resolve(defaultNick || '');
                return;
            }
            const clean = typeof sanitizeName === 'function' ? sanitizeName(raw) : raw;
            if (typeof isValidName === 'function' && !isValidName(clean)) {
                if (status) {
                    const t = i18n[currentLang] || i18n.ru;
                    status.textContent = t.invalidNickname || 'Недопустимый никнейм';
                    status.style.color = 'var(--md-sys-color-error)';
                }
                return;
            }
            cleanup();
            resolve(clean);
        }

        function onKey(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                onSave();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
        }

        saveBtn.addEventListener('click', onSave);
        cancelBtn.addEventListener('click', onCancel);
        input.addEventListener('keydown', onKey);
    });
}

async function handleSocialAuth(provider) {
    if (authStatus) { authStatus.textContent = ''; }
    try {
        let nick = (authRegNick?.value || '').trim();
        if (nick) {
            nick = typeof sanitizeName === 'function' ? sanitizeName(nick) : nick;
            if (typeof isValidName === 'function' && !isValidName(nick)) nick = '';
        }
        if (!nick) {
            const defaultPrompt = getCookie('snakeNick') || '';
            nick = await requestNicknameModal(defaultPrompt);
        }

        const cred = await auth.signInWithPopup(provider);
        if (cred && cred.user) {
            const targetNick = nick || cred.user.displayName || getCookie('snakeNick') || '';
            if (targetNick) {
                setCookie('snakeNick', targetNick, 365);
                await cred.user.updateProfile({ displayName: targetNick }).catch(() => {});
                await db.collection('users').doc(cred.user.uid).set({
                    nickname: targetNick,
                    nicknameLastChange: Date.now()
                }, { merge: true }).catch(() => {});
            }
            await syncGuestScoreToUser(cred.user.uid);
        }
        closeAuthModal();
    } catch (e) {
        if (authStatus) { authStatus.textContent = e.message; authStatus.style.color = 'var(--md-sys-color-error)'; }
    }
}
if (authGoogle) authGoogle.addEventListener('click', () => handleSocialAuth(new firebase.auth.GoogleAuthProvider()));
if (authGithub) authGithub.addEventListener('click', () => handleSocialAuth(new firebase.auth.GithubAuthProvider()));

if (authSubmitBtn) {
    authSubmitBtn.addEventListener('click', async () => {
        const email = (authEmail?.value || '').trim();
        const pass = (authPassword?.value || '');
        const nick = (authRegNick?.value || '').trim();
        const t = i18n[currentLang] || i18n.ru;

        if (!email || !pass) {
            if (authStatus) { authStatus.textContent = t.fillAllFields || 'Заполните все поля'; authStatus.style.color = 'var(--md-sys-color-error)'; }
            return;
        }
        if (pass.length < 6) {
            if (authStatus) { authStatus.textContent = t.passMin6 || 'Пароль минимум 6 символов'; authStatus.style.color = 'var(--md-sys-color-error)'; }
            return;
        }

        if (isRegisterMode && nick) {
            const cleanNick = typeof sanitizeName === 'function' ? sanitizeName(nick) : nick;
            if (typeof isValidName === 'function' && !isValidName(cleanNick)) {
                if (authStatus) { authStatus.textContent = t.invalidNickname || 'Недопустимый никнейм'; authStatus.style.color = 'var(--md-sys-color-error)'; }
                return;
            }
        }

        try {
            authSubmitBtn.disabled = true;
            if (authStatus) { authStatus.textContent = (isRegisterMode ? (t.creatingAccount || 'Создание аккаунта...') : (t.signingIn || 'Вход...')); authStatus.style.color = 'var(--md-sys-color-on-surface)'; }
            
            if (isRegisterMode) {
                const cred = await auth.createUserWithEmailAndPassword(email, pass);
                if (nick) {
                    const cleanNick = typeof sanitizeName === 'function' ? sanitizeName(nick) : nick;
                    setCookie('snakeNick', cleanNick, 365);
                    await cred.user.updateProfile({ displayName: cleanNick }).catch(() => {});
                    await db.collection('users').doc(cred.user.uid).set({
                        nickname: cleanNick,
                        nicknameLastChange: Date.now()
                    }, { merge: true }).catch(() => {});
                }
                await syncGuestScoreToUser(cred.user.uid);
            } else {
                const cred = await auth.signInWithEmailAndPassword(email, pass);
                if (cred && cred.user) {
                    await syncGuestScoreToUser(cred.user.uid);
                }
            }
            authSubmitBtn.disabled = false;
            closeAuthModal();
        } catch (e) {
            authSubmitBtn.disabled = false;
            if (authStatus) { authStatus.textContent = e.message; authStatus.style.color = 'var(--md-sys-color-error)'; }
        }
    });
}

if (accNickSave) {
    accNickSave.addEventListener('click', async () => {
        if (!authUser || authUser.isAnonymous) return;
        const rawNick = (accNickInput?.value || '').trim();
        const nick = typeof sanitizeName === 'function' ? sanitizeName(rawNick) : rawNick;
        const t = i18n[currentLang] || i18n.ru;
        if (!nick) return;
        if (typeof isValidName === 'function' && !isValidName(nick)) {
            if (accNickStatus) {
                accNickStatus.textContent = t.invalidNickname || 'Недопустимый никнейм';
                accNickStatus.style.color = 'var(--md-sys-color-error)';
            }
            return;
        }

        try {
            accNickSave.disabled = true;
            const userRef = db.collection('users').doc(authUser.uid);
            const doc = await userRef.get();
            const lastChange = doc.exists ? (doc.data().nicknameLastChange || 0) : 0;
            if (Date.now() - lastChange < NICK_COOLDOWN) {
                if (accNickStatus) {
                    accNickStatus.textContent = (t.cantChangeUntil || 'Нельзя сменить до ') + formatCooldownUntil(new Date(lastChange + NICK_COOLDOWN));
                    accNickStatus.style.color = 'var(--md-sys-color-error)';
                }
                accNickSave.disabled = accNickInput.disabled = true;
                return;
            }

            const now = Date.now();
            await userRef.set({ nickname: nick, nicknameLastChange: now }, { merge: true });
            setCookie('snakeNick', nick, 365);
            await authUser.updateProfile({ displayName: nick }).catch(() => {});
            await db.collection('leaderboard').doc(authUser.uid).set({ name: nick }, { merge: true }).catch(() => {});

            if (accNickStatus) {
                accNickStatus.textContent = (t.cantChangeUntil || 'Нельзя сменить до ') + formatCooldownUntil(new Date(now + NICK_COOLDOWN));
                accNickStatus.style.color = 'var(--md-sys-color-primary)';
            }
            accNickSave.disabled = accNickInput.disabled = true;
        } catch (e) {
            accNickSave.disabled = false;
            if (accNickStatus) {
                accNickStatus.textContent = e.message;
                accNickStatus.style.color = 'var(--md-sys-color-error)';
            }
        }
    });
}

if (authSignOutBtn) {
    authSignOutBtn.addEventListener('click', async () => {
        deleteCookie('authUid');
        deleteCookie('authEmail');
        deleteCookie('isLoggedIn');
        await auth.signOut();
        closeAuthModal();
    });
}

auth.onAuthStateChanged(user => {
    if (user && !user.isAnonymous) {
        authUser = user;
        authUid = user.uid;
        setCookie('authUid', user.uid, 365);
        if (user.email) setCookie('authEmail', user.email, 365);
        if (user.displayName) setCookie('snakeNick', user.displayName, 365);
        setCookie('isLoggedIn', '1', 365);
        if (authBtn) {
            authBtn.title = user.displayName || user.email || (i18n[currentLang] || i18n.ru).authAccount;
        }
        loadHubFeedback(true);
    } else if (user && user.isAnonymous) {
        authUser = user;
        authUid = user.uid;
        setCookie('guestUid', user.uid, 365);
        if (!getCookie('authUid')) {
            setCookie('authUid', user.uid, 365);
        }
        if (getCookie('isLoggedIn') !== '1') {
            if (authBtn) {
                authBtn.style.color = '';
                authBtn.title = (i18n[currentLang] || i18n.ru).signInTooltip || 'Sign in';
            }
        }
        loadHubFeedback(true);
    } else {
        authUser = null;
        authUid = null;
        deleteCookie('isLoggedIn');
        if (authBtn) {
            authBtn.style.color = '';
            authBtn.title = (i18n[currentLang] || i18n.ru).signInTooltip || 'Sign in';
        }
        if (auth) {
            auth.signInAnonymously().catch(e => {
                console.warn('Anonymous sign-in failed in hub auth listener', e);
            });
        }
        loadHubFeedback(true);
    }
});

// === HUB FEEDBACK SYSTEM (FEEDBACK_HUB) ===
const FEEDBACK_HUB_COLLECTION = 'feedback_hub';
const DEV_UID = 'YVCdKKKiLXUzSl5ZRCbAep6aYiv2';
let fbHubCacheDocs = [];
let fbHubShowAll = false;
let fbHubActiveCollection = FEEDBACK_HUB_COLLECTION;

const fbList = document.getElementById('fbList');
const fbOverlay = document.getElementById('fbOverlay');
const fbClose = document.getElementById('fbClose');
const fbWriteBtn = document.getElementById('fbWriteBtn');
const fbSubmit = document.getElementById('fbSubmit');
const fbNameInput = document.getElementById('fbNameInput');
const fbMessageInput = document.getElementById('fbMessageInput');
const fbStatus = document.getElementById('fbStatus');
const hubFbShowMoreWrap = document.getElementById('hubFbShowMoreWrap');
const hubFbShowMoreBtn = document.getElementById('hubFbShowMoreBtn');

if (hubFbShowMoreBtn) {
    hubFbShowMoreBtn.addEventListener('click', () => {
        fbHubShowAll = !fbHubShowAll;
        renderHubFeedbackList();
    });
}

function formatCommentCount(n) {
    if (currentLang === 'ru') {
        if (n % 10 === 1 && n % 100 !== 11) return n + ' ответ';
        if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return n + ' ответа';
        return n + ' ответов';
    }
    const t = i18n[currentLang] || i18n.en;
    return n + ' ' + (n === 1 ? t.fbReplyOne : t.fbReplyFew);
}

if (fbWriteBtn) {
    fbWriteBtn.addEventListener('click', () => {
        if (fbOverlay) {
            fbOverlay.classList.add('active');
            if (fbNameInput) fbNameInput.value = getCookie('snakeNick') || (authUser && authUser.displayName) || '';
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
        const rawName = (fbNameInput?.value || '').trim();
        const rawMsg = (fbMessageInput?.value || '').trim();
        const t = i18n[currentLang] || i18n.ru;
        if (!rawName) {
            if (fbStatus) { fbStatus.textContent = t.fbNameRequired; fbStatus.style.color = 'var(--md-sys-color-error)'; }
            return;
        }
        if (rawMsg.length < 3) {
            if (fbStatus) { fbStatus.textContent = t.fbMsgShort; fbStatus.style.color = 'var(--md-sys-color-error)'; }
            return;
        }
        const name = typeof censorProfanity === 'function' ? censorProfanity(rawName) : rawName;
        const msg = typeof censorProfanity === 'function' ? censorProfanity(rawMsg) : rawMsg;
        try {
            fbSubmit.disabled = true;
            if (fbStatus) { fbStatus.textContent = t.fbSending; fbStatus.style.color = 'var(--md-sys-color-on-surface)'; }
            if (auth && !auth.currentUser) {
                await auth.signInAnonymously();
            }
            const currentUid = auth.currentUser ? auth.currentUser.uid : (authUid || getCookie('authUid') || '');
            const targetCollection = fbHubActiveCollection || FEEDBACK_HUB_COLLECTION;
            const newFeedback = {
                name: name,
                message: msg,
                uid: currentUid,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                likes: 0,
                dislikes: 0,
                commentCount: 0
            };
            try {
                await db.collection(targetCollection).add(newFeedback);
            } catch (addErr) {
                if (targetCollection !== 'feedback') {
                    await db.collection('feedback').add(newFeedback);
                    fbHubActiveCollection = 'feedback';
                } else {
                    throw addErr;
                }
            }
            setCookie('snakeNick', name, 365);
            if (fbStatus) { fbStatus.textContent = t.fbSent; fbStatus.style.color = 'var(--md-sys-color-primary)'; }
            if (fbMessageInput) fbMessageInput.value = '';
            setTimeout(() => {
                if (fbOverlay) fbOverlay.classList.remove('active');
                if (fbSubmit) fbSubmit.disabled = false;
                loadHubFeedback(true);
            }, 1000);
        } catch (e) {
            if (fbSubmit) fbSubmit.disabled = false;
            if (fbStatus) { fbStatus.textContent = e.message; fbStatus.style.color = 'var(--md-sys-color-error)'; }
        }
    });
}

// Load Hub Feedback
async function loadHubFeedback(silent) {
    if (!fbList) return;
    const t = i18n[currentLang] || i18n.ru;
    if (!silent && !fbHubCacheDocs.length) fbList.innerHTML = `<div class="lb-loading">${t.lbLoading}</div>`;
    try {
        if (auth && !auth.currentUser) {
            try {
                await auth.signInAnonymously();
            } catch (anonErr) {
                console.warn('Anonymous sign-in before loadHubFeedback failed:', anonErr);
            }
        }
        let snap;
        let usedCollection = fbHubActiveCollection || FEEDBACK_HUB_COLLECTION;
        try {
            snap = await db.collection(usedCollection).orderBy('time', 'desc').limit(50).get();
        } catch (e1) {
            console.warn('Feedback query with orderBy failed:', e1);
            try {
                snap = await db.collection(usedCollection).limit(50).get();
            } catch (e2) {
                console.warn('feedback_hub failed, falling back to feedback collection:', e2);
                usedCollection = 'feedback';
                try {
                    snap = await db.collection(usedCollection).orderBy('time', 'desc').limit(50).get();
                } catch (e3) {
                    snap = await db.collection(usedCollection).limit(50).get();
                }
            }
        }
        fbHubActiveCollection = usedCollection;

        if (snap.empty) {
            fbHubCacheDocs = [];
            fbList.innerHTML = `<div class="lb-empty">${t.fbNoFeedback}</div>`;
            if (hubFbShowMoreWrap) hubFbShowMoreWrap.style.display = 'none';
            return;
        }

        const docs = [];
        snap.forEach(doc => docs.push(doc));

        // Sort by likes descending, then net likes, then timestamp descending
        docs.sort((a, b) => {
            const da = a.data(), db = b.data();
            const likesA = da.likes ?? da.likeCount ?? 0;
            const likesB = db.likes ?? db.likeCount ?? 0;
            if (likesB !== likesA) return likesB - likesA;
            const netA = likesA - (da.dislikes ?? da.dislikeCount ?? 0);
            const netB = likesB - (db.dislikes ?? db.dislikeCount ?? 0);
            if (netB !== netA) return netB - netA;
            const timeA = da.time?.seconds || 0;
            const timeB = db.time?.seconds || 0;
            return timeB - timeA;
        });

        fbHubCacheDocs = docs;
        renderHubFeedbackList();
    } catch (e) {
        console.error('loadHubFeedback error:', e);
        if (!fbHubCacheDocs.length) {
            fbList.innerHTML = `<div class="lb-empty">${t.fbLoadFail}</div>`;
            if (hubFbShowMoreWrap) hubFbShowMoreWrap.style.display = 'none';
        }
    }
}

function renderHubFeedbackList() {
    if (!fbList) return;
    const t = i18n[currentLang] || i18n.ru;
    if (!fbHubCacheDocs.length) {
        fbList.innerHTML = `<div class="lb-empty">${t.fbNoFeedback}</div>`;
        if (hubFbShowMoreWrap) hubFbShowMoreWrap.style.display = 'none';
        return;
    }

    const feedbackIds = fbHubCacheDocs.map(doc => doc.id);
    const userVotes = {};
    try {
        const cached = JSON.parse(localStorage.getItem('fbHubVotes') || '{}');
        Object.keys(cached).forEach(id => { if (feedbackIds.includes(id)) userVotes[id] = cached[id]; });
    } catch (_) {}

    const myUid = authUid || getCookie('authUid') || (auth.currentUser ? auth.currentUser.uid : '');
    const displayDocs = fbHubShowAll ? fbHubCacheDocs : fbHubCacheDocs.slice(0, 3);
    let html = '';

    displayDocs.forEach(doc => {
        const d = doc.data();
        const id = doc.id;
        const time = d.time ? new Date(d.time.seconds * 1000).toLocaleDateString() : '';
        const userVote = userVotes[id] || '';
        const likes = d.likes ?? d.likeCount ?? 0;
        const dislikes = d.dislikes ?? d.dislikeCount ?? 0;
        const msg = escapeHtml(d.message || '');
        const long = msg.length > 100;
        const isOwner = Boolean(myUid && d.uid && d.uid === myUid);
        const isDev = id === DEV_UID || d.uid === DEV_UID;
        const devBadge = isDev ? '<span class="dev-badge">DEV</span>' : '';
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
            <div class="fb-time">${escapeHtml(d.name || t.anonymous)}${devBadge} · ${time}</div>
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

    if (hubFbShowMoreWrap && hubFbShowMoreBtn) {
        if (fbHubCacheDocs.length > 3) {
            hubFbShowMoreWrap.style.display = 'flex';
            if (fbHubShowAll) {
                hubFbShowMoreBtn.textContent = t.fbHubShowTop3 || 'Показать топ 3';
            } else {
                const remaining = fbHubCacheDocs.length - 3;
                hubFbShowMoreBtn.textContent = (t.fbHubShowMore || 'Показать ещё') + ` (${remaining})`;
            }
        } else {
            hubFbShowMoreWrap.style.display = 'none';
        }
    }
}

// Voting logic
const _votingLock = {};
async function voteFeedback(docId, type) {
    const voteKey = authUid || getCookie('authUid') || (auth.currentUser ? auth.currentUser.uid : '');
    if (!voteKey || _votingLock[docId]) return;
    _votingLock[docId] = true;

    const entry = fbList.querySelector(`.fb-entry[data-id="${docId}"]`);
    if (!entry) { _votingLock[docId] = false; return; }

    const likeBtn = entry.querySelector('.fb-like');
    const dislikeBtn = entry.querySelector('.fb-dislike');
    const likeCount = likeBtn.querySelector('span');
    const dislikeCount = dislikeBtn.querySelector('span');
    const wasLiked = likeBtn.classList.contains('active');
    const wasDisliked = dislikeBtn.classList.contains('active');
    const prevLikes = parseInt(likeCount.textContent) || 0;
    const prevDislikes = parseInt(dislikeCount.textContent) || 0;

    let newVote = type;
    if (type === 'like') {
        if (wasLiked) {
            newVote = '';
            likeBtn.classList.remove('active');
            likeCount.textContent = Math.max(0, prevLikes - 1);
        } else {
            likeBtn.classList.add('active');
            likeCount.textContent = prevLikes + 1;
            if (wasDisliked) {
                dislikeBtn.classList.remove('active');
                dislikeCount.textContent = Math.max(0, prevDislikes - 1);
            }
        }
    } else {
        if (wasDisliked) {
            newVote = '';
            dislikeBtn.classList.remove('active');
            dislikeCount.textContent = Math.max(0, prevDislikes - 1);
        } else {
            dislikeBtn.classList.add('active');
            dislikeCount.textContent = prevDislikes + 1;
            if (wasLiked) {
                likeBtn.classList.remove('active');
                likeCount.textContent = Math.max(0, prevLikes - 1);
            }
        }
    }

    try {
        const cached = JSON.parse(localStorage.getItem('fbHubVotes') || '{}');
        if (newVote) cached[docId] = newVote; else delete cached[docId];
        localStorage.setItem('fbHubVotes', JSON.stringify(cached));
    } catch (_) {}

    const cachedDoc = fbHubCacheDocs.find(d => d.id === docId);
    if (cachedDoc) {
        const cd = cachedDoc.data();
        if (type === 'like') {
            if (wasLiked) cd.likes = Math.max(0, (cd.likes ?? 0) - 1);
            else {
                cd.likes = (cd.likes ?? 0) + 1;
                if (wasDisliked) cd.dislikes = Math.max(0, (cd.dislikes ?? 0) - 1);
            }
        } else {
            if (wasDisliked) cd.dislikes = Math.max(0, (cd.dislikes ?? 0) - 1);
            else {
                cd.dislikes = (cd.dislikes ?? 0) + 1;
                if (wasLiked) cd.likes = Math.max(0, (cd.likes ?? 0) - 1);
            }
        }
    }

    const ref = db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId);
    const voteRef = ref.collection('votes').doc(voteKey);

    try {
        const voteDoc = await voteRef.get();
        const existingType = voteDoc.exists ? voteDoc.data().type : '';
        const batch = db.batch();

        if (existingType === type) {
            batch.delete(voteRef);
            batch.update(ref, {
                [type === 'like' ? 'likes' : 'dislikes']: firebase.firestore.FieldValue.increment(-1)
            });
        } else {
            batch.set(voteRef, { type });
            const updates = {
                [type === 'like' ? 'likes' : 'dislikes']: firebase.firestore.FieldValue.increment(1)
            };
            if (existingType) {
                updates[existingType === 'like' ? 'likes' : 'dislikes'] = firebase.firestore.FieldValue.increment(-1);
            }
            batch.update(ref, updates);
        }
        await batch.commit();
    } catch (e) {
        console.warn('Vote failed', e);
    } finally {
        _votingLock[docId] = false;
    }
}

// Comments loading & submission
async function loadComments(entry) {
    const docId = entry.dataset.id;
    const list = entry.querySelector('.fb-comments-list');
    const statsBtn = entry.querySelector('.fb-comment-stats');
    const t = i18n[currentLang] || i18n.ru;
    try {
        const snap = await db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId).collection('comments').orderBy('time', 'asc').limit(20).get();
        if (snap.empty) {
            list.innerHTML = `<div class="lb-empty">${t.fbNoComments}</div>`;
            statsBtn.style.display = 'none';
            return;
        }
        const myUid = authUid || getCookie('authUid') || (auth.currentUser ? auth.currentUser.uid : '');
        let html = '';
        let count = 0;
        snap.forEach(doc => {
            const d = doc.data();
            const ct = d.time ? new Date(d.time.seconds * 1000).toLocaleDateString() : '';
            const isOwner = Boolean(myUid && d.uid && d.uid === myUid);
            const isDev = doc.id === DEV_UID || d.uid === DEV_UID;
            const devBadge = isDev ? '<span class="dev-badge">DEV</span>' : '';
            html += `<div class="fb-comment" data-cid="${doc.id}">
                <span class="fb-comment-name">${escapeHtml(d.name || t.anonymous)}${devBadge}</span>
                <span class="fb-comment-msg">${escapeHtml(d.message)}</span>
                <span class="fb-time">${ct}</span>
                ${isOwner ? '<button class="fb-comment-del">✕</button>' : ''}
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
    const docId = entry.dataset.id;
    const input = entry.querySelector('.fb-comment-input');
    const rawMsg = (input.value || '').trim();
    if (!rawMsg) return;
    const msg = typeof censorProfanity === 'function' ? censorProfanity(rawMsg) : rawMsg;
    const t = i18n[currentLang] || i18n.ru;
    const rawName = getCookie('snakeNick') || (authUser && authUser.displayName) || t.anonymous;
    const name = typeof censorProfanity === 'function' ? censorProfanity(rawName) : rawName;
    const uid = authUid || getCookie('authUid') || (auth.currentUser ? auth.currentUser.uid : '');
    const list = entry.querySelector('.fb-comments-list');
    const statsBtn = entry.querySelector('.fb-comment-stats');

    const tempId = '_' + Date.now();
    const emptyMsg = list.querySelector('.lb-empty');
    if (emptyMsg) emptyMsg.remove();
    list.insertAdjacentHTML('beforeend',
        `<div class="fb-comment fb-comment-pending" data-cid="${tempId}">
            <span class="fb-comment-name">${escapeHtml(name)}</span>
            <span class="fb-comment-msg">${escapeHtml(msg)}</span>
            ${uid ? '<button class="fb-comment-del">✕</button>' : ''}
        </div>`
    );
    input.value = '';
    input.disabled = true;

    const cur = parseInt(statsBtn.dataset.count) || 0;
    const newCount = cur + 1;
    statsBtn.dataset.count = newCount;
    statsBtn.textContent = formatCommentCount(newCount);
    statsBtn.style.display = '';

    try {
        await db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId).collection('comments').add({
            name, message: msg, uid,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId).update({
            commentCount: firebase.firestore.FieldValue.increment(1)
        });
        await loadComments(entry);
    } catch (_) {
        list.querySelectorAll('.fb-comment-pending').forEach(el => el.remove());
    } finally {
        input.disabled = false;
    }
}

async function deleteComment(entry, cid) {
    if (!cid) return;
    const docId = entry.dataset.id;
    const commentEl = entry.querySelector(`[data-cid="${cid}"]`);
    if (commentEl) commentEl.remove();
    const statsBtn = entry.querySelector('.fb-comment-stats');
    const cur = parseInt(statsBtn.dataset.count) || 1;
    const newCount = Math.max(0, cur - 1);
    statsBtn.dataset.count = newCount;
    statsBtn.textContent = formatCommentCount(newCount);
    if (newCount <= 0) statsBtn.style.display = 'none';
    try {
        await db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId).collection('comments').doc(cid).delete();
        await db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId).update({
            commentCount: firebase.firestore.FieldValue.increment(-1)
        });
    } catch (_) {}
}

async function deleteFeedback(docId) {
    if (!docId) return;
    const confirmMsg = currentLang === 'ru' ? 'Удалить этот отзыв?' : 'Delete this feedback?';
    if (!confirm(confirmMsg)) return;
    const entry = fbList ? fbList.querySelector(`.fb-entry[data-id="${docId}"]`) : null;
    if (entry) entry.remove();
    fbHubCacheDocs = fbHubCacheDocs.filter(d => d.id !== docId);
    if (fbHubCacheDocs.length <= 3 && fbHubShowAll) {
        fbHubShowAll = false;
    }
    renderHubFeedbackList();
    try {
        await db.collection(fbHubActiveCollection || FEEDBACK_HUB_COLLECTION).doc(docId).delete();
    } catch (e) {
        console.warn('Delete feedback failed', e);
        alert(currentLang === 'ru' ? 'Ошибка при удалении: ' + e.message : 'Delete error: ' + e.message);
        loadHubFeedback(true);
    }
}

// Delegation for feedback interactions
if (fbList) {
    fbList.addEventListener('click', (e) => {
        const t = i18n[currentLang] || i18n.ru;
        const commentDelBtn = e.target.closest('.fb-comment-del');
        if (commentDelBtn) {
            const comment = commentDelBtn.closest('.fb-comment');
            const entry = comment.closest('.fb-entry');
            deleteComment(entry, comment.dataset.cid);
            return;
        }
        const delBtn = e.target.closest('.fb-del-btn');
        if (delBtn) {
            const entry = delBtn.closest('.fb-entry');
            if (!entry) return;
            deleteFeedback(entry.dataset.id);
            return;
        }
        const expandBtn = e.target.closest('.fb-expand');
        if (expandBtn) {
            const entry = expandBtn.closest('.fb-entry');
            if (!entry) return;
            const textEl = entry.querySelector('.fb-text');
            textEl.classList.toggle('expanded');
            textEl.classList.toggle('collapsed');
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
            entry.querySelector('.fb-comment-input').focus();
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
            if (!entry) return;
            submitComment(entry);
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

// Close on ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (fbOverlay && fbOverlay.classList.contains('active')) fbOverlay.classList.remove('active');
        if (authOverlay && authOverlay.classList.contains('active')) authOverlay.classList.remove('active');
        const cookieModal = document.getElementById('cookieModal');
        if (cookieModal && cookieModal.classList.contains('active')) cookieModal.classList.remove('active');
        document.querySelectorAll('.fb-comments').forEach(s => s.style.display = 'none');
    }
});

applyLanguage();
loadHubFeedback();
