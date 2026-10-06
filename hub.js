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
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
    const uiAccNickLabel = document.getElementById('uiAccNickLabel');
    if (uiAccNickLabel) uiAccNickLabel.innerText = t.authNickname || 'Nickname';
    const accNickInput = document.getElementById('accNickInput');
    if (accNickInput) accNickInput.placeholder = t.authNickPlaceholder || 'Nickname';
    const accNickSave = document.getElementById('accNickSave');
    if (accNickSave) accNickSave.innerText = t.authSave || 'Save';
    const authSignOutBtn = document.getElementById('authSignOutBtn');
    if (authSignOutBtn) authSignOutBtn.innerText = t.authSignOut || 'Sign Out';

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
    document.querySelectorAll('.fb-expand').forEach(el => {
        const textEl = el.closest('.fb-entry')?.querySelector('.fb-text');
        el.textContent = textEl && textEl.classList.contains('expanded') ? t.fbShowLess : t.fbShowMore;
    });
    document.querySelectorAll('.fb-reply-btn').forEach(el => el.textContent = t.fbReply);
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

function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeToggle) {
        themeToggle.title = isDark ? (currentLang === 'ru' ? 'Светлая тема' : 'Light theme') : (currentLang === 'ru' ? 'Темная тема' : 'Dark theme');
        themeToggle.innerHTML = isDark
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>';
    }
}
applyTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        setCookie('snakeTheme', isDark ? 'dark' : 'light');
        applyTheme();
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

const accEmail = document.getElementById('accEmail');
const accNickInput = document.getElementById('accNickInput');
const accNickSave = document.getElementById('accNickSave');
const accNickStatus = document.getElementById('accNickStatus');
const authSignOutBtn = document.getElementById('authSignOutBtn');

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
        if (accEmail) accEmail.textContent = authUser.email || (authUser.providerData[0] ? authUser.providerData[0].email : '');
        if (accNickInput) accNickInput.value = getCookie('snakeNick') || authUser.displayName || '';
        if (accNickStatus) accNickStatus.textContent = '';
    } else {
        if (authMainView) authMainView.style.display = 'flex';
        if (authAccountView) authAccountView.style.display = 'none';
        setAuthMode(false);
    }
}

function openAuthModal() {
    updateAuthViews();
    if (authOverlay) authOverlay.classList.add('active');
}
function closeAuthModal() {
    if (authOverlay) authOverlay.classList.remove('active');
}
if (authBtn) authBtn.addEventListener('click', openAuthModal);
if (authClose) authClose.addEventListener('click', closeAuthModal);

function handleSocialAuth(provider) {
    if (authStatus) { authStatus.textContent = ''; }
    auth.signInWithPopup(provider)
        .then(() => { closeAuthModal(); })
        .catch(e => {
            if (authStatus) { authStatus.textContent = e.message; authStatus.style.color = 'var(--md-sys-color-error)'; }
        });
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

        try {
            authSubmitBtn.disabled = true;
            if (authStatus) { authStatus.textContent = (isRegisterMode ? (t.creatingAccount || 'Создание аккаунта...') : (t.signingIn || 'Вход...')); authStatus.style.color = 'var(--md-sys-color-on-surface)'; }
            
            if (isRegisterMode) {
                const cred = await auth.createUserWithEmailAndPassword(email, pass);
                if (nick) {
                    setCookie('snakeNick', nick, 365);
                    await cred.user.updateProfile({ displayName: nick }).catch(() => {});
                }
            } else {
                await auth.signInWithEmailAndPassword(email, pass);
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
        const nick = (accNickInput?.value || '').trim();
        const t = i18n[currentLang] || i18n.ru;
        if (!nick) return;
        setCookie('snakeNick', nick, 365);
        if (authUser) {
            await authUser.updateProfile({ displayName: nick }).catch(() => {});
        }
        if (accNickStatus) {
            accNickStatus.textContent = t.authSaveSuccess || 'Сохранено!';
            accNickStatus.style.color = 'var(--md-sys-color-primary)';
            setTimeout(() => { if (accNickStatus) accNickStatus.textContent = ''; }, 2000);
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
            authBtn.style.color = 'var(--md-sys-color-primary)';
            authBtn.title = user.displayName || user.email || (i18n[currentLang] || i18n.ru).authAccount;
        }
        loadHubFeedback(true);
    } else if (user && user.isAnonymous) {
        authUser = user;
        authUid = user.uid;
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
        auth.signInAnonymously().catch(() => {});
        loadHubFeedback(true);
    }
});

// === HUB FEEDBACK SYSTEM (FEEDBACK_HUB) ===
const FEEDBACK_HUB_COLLECTION = 'feedback_hub';
const fbList = document.getElementById('fbList');
const fbOverlay = document.getElementById('fbOverlay');
const fbClose = document.getElementById('fbClose');
const fbWriteBtn = document.getElementById('fbWriteBtn');
const fbSubmit = document.getElementById('fbSubmit');
const fbNameInput = document.getElementById('fbNameInput');
const fbMessageInput = document.getElementById('fbMessageInput');
const fbStatus = document.getElementById('fbStatus');

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
            // EXACT FIELDS ALLOWED BY FIRESTORE RULES:
            const currentUid = authUid || getCookie('authUid') || '';
            await db.collection(FEEDBACK_HUB_COLLECTION).add({
                name: name,
                message: msg,
                uid: currentUid,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                likes: 0,
                dislikes: 0,
                commentCount: 0
            });
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
    if (!silent) fbList.innerHTML = `<div class="lb-loading">${t.lbLoading}</div>`;
    try {
        const snap = await db.collection(FEEDBACK_HUB_COLLECTION).orderBy('time', 'desc').limit(50).get();
        if (snap.empty) {
            fbList.innerHTML = `<div class="lb-empty">${t.fbNoFeedback}</div>`;
            return;
        }
        const feedbackIds = [];
        snap.forEach(doc => feedbackIds.push(doc.id));

        const userVotes = {};
        try {
            const cached = JSON.parse(localStorage.getItem('fbHubVotes') || '{}');
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
    } catch (e) {
        fbList.innerHTML = `<div class="lb-empty">${t.fbLoadFail}</div>`;
    }
}

// Voting logic
const _votingLock = {};
async function voteFeedback(docId, type) {
    const voteKey = authUid;
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

    const ref = db.collection(FEEDBACK_HUB_COLLECTION).doc(docId);
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
        const snap = await db.collection(FEEDBACK_HUB_COLLECTION).doc(docId).collection('comments').orderBy('time', 'asc').limit(20).get();
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
    const msg = (input.value || '').trim();
    if (!msg) return;
    const t = i18n[currentLang] || i18n.ru;
    const name = getCookie('snakeNick') || (authUser && authUser.displayName) || t.anonymous;
    const uid = authUid || getCookie('authUid') || '';
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
        await db.collection(FEEDBACK_HUB_COLLECTION).doc(docId).collection('comments').add({
            name, message: msg, uid,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection(FEEDBACK_HUB_COLLECTION).doc(docId).update({
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
        await db.collection(FEEDBACK_HUB_COLLECTION).doc(docId).collection('comments').doc(cid).delete();
        await db.collection(FEEDBACK_HUB_COLLECTION).doc(docId).update({
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
    try {
        await db.collection(FEEDBACK_HUB_COLLECTION).doc(docId).delete();
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
