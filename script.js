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

// === ЛОКАЛИЗАЦИЯ (см. i18n.js) ===


let currentLang = 'en';

// === NICKNAME FILTERS & PROFANITY (см. profanity.js) ===

const cookieLang = getCookie('snakeLang');
if (cookieLang === 'ru' || cookieLang === 'en') {
    currentLang = cookieLang;
} else {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('ru')) currentLang = 'ru';
    setCookie('snakeLang', currentLang);
}

const langToggle = document.getElementById('langToggle');

function applyLanguage() {
    document.documentElement.lang = currentLang;
    langToggle.innerText = currentLang.toUpperCase();
    
    document.getElementById('uiScoreTitle').innerText = i18n[currentLang].scoreTitle;
    document.getElementById('uiMainTitle').innerText = i18n[currentLang].mainTitle;
    document.getElementById('playerNameInput').placeholder = i18n[currentLang].placeholder;
    document.getElementById('uiPlayBtn').innerText = i18n[currentLang].playBtn;
    document.getElementById('uiGameOverTitle').innerText = i18n[currentLang].gameOverTitle;
    document.getElementById('uiFinalScoreText').innerText = i18n[currentLang].finalScoreText;
    document.getElementById('uiRestartBtn').innerText = i18n[currentLang].restartBtn;
    document.getElementById('uiMenuBtn').innerText = i18n[currentLang].menuBtn;
    const snakeToHub = document.getElementById('uiSnakeToHubBtn');
    if (snakeToHub) snakeToHub.innerText = i18n[currentLang].allGamesBtn;
    const gameOverToHub = document.getElementById('uiGameOverToHubBtn');
    if (gameOverToHub) gameOverToHub.innerText = i18n[currentLang].allGamesBtn;
    
    document.querySelector('.leaderboard h3').innerText = i18n[currentLang].lbTitle;
    document.getElementById('uiDevTitle').innerText = i18n[currentLang].devTitle;
    document.getElementById('uiDevConfetti').innerText = i18n[currentLang].devConfetti;
    document.getElementById('uiDevGlow').innerText = i18n[currentLang].devGlow;
    document.getElementById('uiDevAddScore').innerText = i18n[currentLang].devAddScore;
    document.getElementById('uiDevFill').innerText = i18n[currentLang].devFill;
    document.getElementById('uiDevClose').innerText = i18n[currentLang].devClose;
    if (playerNameInput.disabled) {
        playerNameInput.placeholder = i18n[currentLang].devMode;
    }
    
    const lbLoading = document.getElementById('lbLoadingText');
    if (lbLoading) lbLoading.innerText = i18n[currentLang].lbLoading;
    lbShowMore.innerText = lbShowAll ? i18n[currentLang].lbShowTop : i18n[currentLang].lbShowAll;
    
    document.getElementById('fbTitle').innerText = i18n[currentLang].fbTitle;
    fbWriteBtn.innerText = i18n[currentLang].fbWriteBtn;
    document.querySelector('#fbOverlay .auth-title').innerText = i18n[currentLang].fbOverlayTitle;
    fbNameInput.placeholder = i18n[currentLang].fbNamePlaceholder;
    fbMessageInput.placeholder = i18n[currentLang].fbMsgPlaceholder;
    fbSubmit.innerText = i18n[currentLang].fbSubmitBtn;
    
    const authTitle = document.getElementById('authTitle');
    if (authTitle) authTitle.innerText = isRegisterMode ? (i18n[currentLang].authRegisterBtn || 'Register') : i18n[currentLang].authSignIn;
    const authEmail = document.getElementById('authEmail');
    if (authEmail) authEmail.placeholder = i18n[currentLang].authEmailPlaceholder || 'Email';
    const authPassword = document.getElementById('authPassword');
    if (authPassword) authPassword.placeholder = i18n[currentLang].authPassPlaceholder || 'Password';
    const authRegNick = document.getElementById('authRegNick');
    if (authRegNick) authRegNick.placeholder = i18n[currentLang].authNickPlaceholder || 'Nickname';
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    if (authSubmitBtn) authSubmitBtn.innerText = isRegisterMode ? (i18n[currentLang].authRegisterBtn || 'Register') : i18n[currentLang].authSignIn;
    const authToggleRegister = document.getElementById('authToggleRegister');
    if (authToggleRegister) authToggleRegister.innerText = isRegisterMode ? (i18n[currentLang].authSwitchSignIn || 'Already have an account? Sign In') : (i18n[currentLang].authSwitchRegister || 'No account? Register');
    const authDivider = document.getElementById('uiAuthDividerText');
    if (authDivider) authDivider.textContent = i18n[currentLang].or;
    const authAccountTitle = document.getElementById('authAccountTitle');
    if (authAccountTitle) authAccountTitle.innerText = i18n[currentLang].authAccount;
    const uiAccNickLabel = document.getElementById('uiAccNickLabel');
    if (uiAccNickLabel) uiAccNickLabel.innerText = i18n[currentLang].authNickname;
    const accNickInput = document.getElementById('accNickInput');
    if (accNickInput) accNickInput.placeholder = i18n[currentLang].authNickPlaceholder || 'Nickname';
    const accNickSave = document.getElementById('accNickSave');
    if (accNickSave) accNickSave.innerText = i18n[currentLang].authSave;
    const authSignOutBtn = document.getElementById('authSignOutBtn');
    if (authSignOutBtn) authSignOutBtn.innerText = i18n[currentLang].authSignOut;
    const authBtnEl = document.getElementById('authBtn');
    if (authBtnEl) authBtnEl.title = (authUser && !authUser.isAnonymous) ? (authUser.displayName || authUser.email || i18n[currentLang].authAccount) : (i18n[currentLang].signInTooltip || 'Sign in');
    const lbStatusSpan = document.querySelector('#lbStatus span:last-child');
    if (lbStatusSpan) lbStatusSpan.textContent = i18n[currentLang].online;
    // Update existing DOM elements with new language
    document.querySelectorAll('.fb-expand').forEach(el => {
        const textEl = el.closest('.fb-entry')?.querySelector('.fb-text');
        el.textContent = textEl && textEl.classList.contains('expanded') ? i18n[currentLang].fbShowLess : i18n[currentLang].fbShowMore;
    });
    document.querySelectorAll('.fb-reply-btn').forEach(el => el.textContent = i18n[currentLang].fbReply);
    document.querySelectorAll('.lb-entry .lb-name').forEach(el => {
        if (el.textContent === 'Anonymous' || el.textContent === 'Аноним') el.textContent = i18n[currentLang].anonymous;
    });
    document.querySelectorAll('.fb-comment-stats').forEach(el => {
        const n = parseInt(el.dataset.count) || 0;
        el.textContent = formatCommentCount(n);
    });
    document.getElementById('accNickInput').placeholder = i18n[currentLang].nicknamePlaceholder;
    document.title = i18n[currentLang].pageTitle;
    document.querySelector('.header-github').textContent = i18n[currentLang].githubLink || 'GitHub';

    const cookieTitle = document.getElementById('uiCookieTitle');
    if (cookieTitle) cookieTitle.innerText = i18n[currentLang].cookieTitle;
    const cookieDesc = document.getElementById('uiCookieDesc');
    if (cookieDesc) cookieDesc.innerText = i18n[currentLang].cookieDesc;
    const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
    if (cookieAcceptBtn) cookieAcceptBtn.innerText = i18n[currentLang].cookieAccept;
    const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');
    if (cookieSettingsBtn) cookieSettingsBtn.innerText = i18n[currentLang].cookieSettings;
    const cookieModalTitle = document.getElementById('uiCookieModalTitle');
    if (cookieModalTitle) cookieModalTitle.innerText = i18n[currentLang].cookieModalTitle;
    const cookieEssentialName = document.getElementById('uiCookieEssentialName');
    if (cookieEssentialName) cookieEssentialName.innerText = i18n[currentLang].cookieEssentialName;
    const cookieEssentialHint = document.getElementById('uiCookieEssentialHint');
    if (cookieEssentialHint) cookieEssentialHint.innerText = i18n[currentLang].cookieEssentialHint;
    const cookieScoresName = document.getElementById('uiCookieScoresName');
    if (cookieScoresName) cookieScoresName.innerText = i18n[currentLang].cookieScoresName;
    const cookieScoresHint = document.getElementById('uiCookieScoresHint');
    if (cookieScoresHint) cookieScoresHint.innerText = i18n[currentLang].cookieScoresHint;
    const cookieSaveBtn = document.getElementById('cookieSaveBtn');
    if (cookieSaveBtn) cookieSaveBtn.innerText = i18n[currentLang].cookieSave;
    
    updateHighScoreDisplay();
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    setCookie('snakeLang', currentLang);
applyLanguage();
updateNicknameInputVisibility();
// Re-fetch data with new language, no loading flash
loadLeaderboard();
loadFeedback(true);
});


// === ТЕМА И СИСТЕМНЫЙ ЦВЕТ ===
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
let isDark = true;
const cookieTheme = getCookie('snakeTheme');
if (cookieTheme === 'dark' || cookieTheme === 'light') {
    isDark = cookieTheme === 'dark';
} else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) isDark = false;
    setCookie('snakeTheme', isDark ? 'dark' : 'light');
}

function getResolvedColor(cssVarName) {
    const varName = cssVarName.startsWith('var(')
        ? cssVarName.slice(4, -1).trim()
        : cssVarName;
    return getComputedStyle(document.body).getPropertyValue(varName).trim() || cssVarName;
}

const sunSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
const moonSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.3 2a10 10 0 0 0-.19 14 9.92 9.92 0 0 0 7.9 3.99 10.14 10.14 0 0 0 1.9-.18 10 10 0 1 1-9.61-17.81z"/></svg>`;

function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? sunSvg : moonSvg;
}
applyTheme();

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    setCookie('snakeTheme', isDark ? 'dark' : 'light');
    applyTheme();
});

// === ВЫБОР ЦВЕТА И РАЗМЕРА ===
const colorBtns = document.querySelectorAll('.color-btn');
const savedColor = getCookie('snakeColor') || 'neutral';
colorBtns.forEach(btn => {
    if (btn.getAttribute('data-c') === savedColor) {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        body.setAttribute('data-color', savedColor);
    }
    btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const c = btn.getAttribute('data-c');
        body.setAttribute('data-color', c);
        setCookie('snakeColor', c);
    });
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let tileCount = 20;
let gridSize = 20;
const sizeBtns = document.querySelectorAll('.size-btn');

let lastCanvasW = 0, lastCanvasH = 0;
function syncCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (w !== lastCanvasW || h !== lastCanvasH) {
        canvas.width = w;
        canvas.height = h;
        lastCanvasW = w;
        lastCanvasH = h;
        const side = Math.min(canvas.width, canvas.height);
        gridSize = side / tileCount;
    }
}
syncCanvasSize();
window.addEventListener('resize', syncCanvasSize);
if (window.visualViewport) window.visualViewport.addEventListener('resize', syncCanvasSize);

sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tileCount = parseInt(btn.getAttribute('data-size'));
        gridSize = canvas.width / tileCount;
    });
});

// === КАРКАС МИНИ-ИГР (Game Hub Registry) ===
const GameHub = {
    activeGame: 'snake',
    games: new Map([
        ['snake', { id: 'snake', title: 'RefyrdSnake' }]
    ]),
    register(id, config) {
        this.games.set(id, config);
    },
    switchGame(id) {
        if (!this.games.has(id)) return;
        this.activeGame = id;
    }
};
window.GameHub = GameHub;

// === FIREBASE LEADERBOARD ===
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
const LEADERBOARD_COLLECTION = 'leaderboard';

let authUid = null;
let authUser = null;
let skipAnonSignIn = false;

// === AUTH UI ===
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

function showStatus(el, msg, isError) {
	if (!el) return;
	el.textContent = msg;
	el.style.color = isError ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)';
}
function clearStatus(el) { if (el) el.textContent = ''; }

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

if (authToggleRegister) {
    authToggleRegister.addEventListener('click', () => {
        setAuthMode(!isRegisterMode);
    });
}

function updateAuthUI() {
    const isLoggedIn = (authUser && !authUser.isAnonymous) || getCookie('isLoggedIn') === '1';
    if (isLoggedIn) {
        if (authBtn) {
            authBtn.style.color = 'var(--md-sys-color-primary)';
            authBtn.title = (authUser && (authUser.displayName || authUser.email)) || getCookie('snakeNick') || getCookie('authEmail') || (i18n[currentLang] || i18n.ru).authAccount;
        }
        const email = (authUser && (authUser.email || (authUser.providerData[0] ? authUser.providerData[0].email : ''))) || getCookie('authEmail') || '';
        if (accEmail) accEmail.textContent = email;
        if (accNickInput) accNickInput.value = savedName || (authUser && authUser.displayName) || getCookie('snakeNick') || '';
        if (authMainView) authMainView.style.display = 'none';
        if (authAccountView) authAccountView.style.display = 'flex';
        loadNicknameFromFirestore();
    } else {
        if (authBtn) {
            authBtn.style.color = '';
            authBtn.title = (i18n[currentLang] || i18n.ru).signInTooltip || 'Sign in';
        }
        if (authMainView) authMainView.style.display = 'flex';
        if (authAccountView) authAccountView.style.display = 'none';
        setAuthMode(false);
    }
}

function openAuthModal() {
    updateAuthUI();
    if (authOverlay) authOverlay.classList.add('active');
}
function closeAuthModal() {
    if (authOverlay) authOverlay.classList.remove('active');
}
if (authBtn) authBtn.addEventListener('click', openAuthModal);
if (authClose) authClose.addEventListener('click', closeAuthModal);
if (authOverlay) authOverlay.addEventListener('click', e => { if (e.target === authOverlay) closeAuthModal(); });

if (authSignOutBtn) {
    authSignOutBtn.addEventListener('click', () => {
        deleteCookie('authUid');
        deleteCookie('authEmail');
        deleteCookie('isLoggedIn');
        auth.signOut();
        closeAuthModal();
    });
}

function upgradeFromAnonymous(action) {
    if (authUser && authUser.isAnonymous) {
        const s = score;
        skipAnonSignIn = true;
        return auth.signOut().then(() => action()).then(result => {
            skipAnonSignIn = false;
            const u = auth.currentUser;
            if (u && !u.isAnonymous) {
                if (s > 0) {
                    db.collection(LEADERBOARD_COLLECTION).doc(u.uid).set({
                        name: savedName && isValidName(savedName) ? savedName : i18n[currentLang].anonymous,
                        score: s
                    }, { merge: true });
                }
            }
            return result;
        }).catch(e => {
            skipAnonSignIn = false;
            auth.signInAnonymously().catch(() => {});
            throw e;
        });
    }
    return action();
}

const NICK_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 1 week

function formatCooldownUntil(timestamp) {
	const d = new Date(timestamp);
	const pad = n => String(n).padStart(2, '0');
	return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// === NICKNAME FROM FIRESTORE ===
function loadNicknameFromFirestore() {
	if (!authUser || authUser.isAnonymous) return;
	const userRef = db.collection('users').doc(authUser.uid);
	userRef.get().then(doc => {
		if (doc.exists && doc.data().nickname) {
			accNickInput.value = savedName = doc.data().nickname;
			playerNameInput.value = savedName;
		} else {
			accNickInput.value = savedName || '';
		}
		const remaining = (doc.exists ? (doc.data().nicknameLastChange || 0) : 0) + NICK_COOLDOWN - Date.now();
		if (remaining > 0) {
			accNickStatus.textContent = i18n[currentLang].cantChangeUntil + formatCooldownUntil(new Date(Date.now() + remaining));
			accNickStatus.style.color = '';
			accNickSave.disabled = accNickInput.disabled = true;
		} else {
			accNickStatus.textContent = '';
			accNickSave.disabled = accNickInput.disabled = false;
		}
	}).catch(e => {
		accNickStatus.textContent = e.message;
		accNickStatus.style.color = 'var(--md-sys-color-error)';
	});
}

if (accNickSave) {
    accNickSave.addEventListener('click', () => {
        if (!authUser || authUser.isAnonymous) return;
        const nick = sanitizeName(accNickInput.value.trim());
        if (!isValidName(nick)) { accNickStatus.textContent = i18n[currentLang].invalidNickname; accNickStatus.style.color = 'var(--md-sys-color-error)'; return; }
        const userRef = db.collection('users').doc(authUser.uid);
        userRef.get().then(doc => {
            const lastChange = doc.exists ? (doc.data().nicknameLastChange || 0) : 0;
            if (Date.now() - lastChange < NICK_COOLDOWN) {
                accNickStatus.textContent = i18n[currentLang].cantChangeUntil + formatCooldownUntil(new Date(lastChange + NICK_COOLDOWN));
                accNickStatus.style.color = '';
                return;
            }
            const now = Date.now();
            userRef.set({ nickname: nick, nicknameLastChange: now }, { merge: true }).then(() => {
                savedName = nick;
                setCookie('snakeNick', savedName);
                playerNameInput.value = savedName;
                if (authUser.updateProfile) authUser.updateProfile({ displayName: nick }).catch(() => {});
                const msg = i18n[currentLang].cantChangeUntil + formatCooldownUntil(new Date(now + NICK_COOLDOWN));
                accNickStatus.textContent = msg;
                accNickStatus.style.color = '';
                accNickSave.disabled = accNickInput.disabled = true;
                if (authUid) db.collection(LEADERBOARD_COLLECTION).doc(authUid).set({ name: savedName && isValidName(savedName) ? savedName : i18n[currentLang].anonymous }, { merge: true });
            }).catch(e => {
                accNickStatus.textContent = e.message;
                accNickStatus.style.color = 'var(--md-sys-color-error)';
            });
        }).catch(e => {
            accNickStatus.textContent = e.message;
            accNickStatus.style.color = 'var(--md-sys-color-error)';
        });
    });
}

// === HIDE NICKNAME INPUT WHEN LOGGED IN ===
function updateNicknameInputVisibility() {
    if (authUser && !authUser.isAnonymous) {
        playerNameInput.style.display = 'none';
    } else {
        playerNameInput.style.display = '';
    }
}

if (authPassword) {
    authPassword.addEventListener('keydown', e => {
        if (e.key === 'Enter') authSubmitBtn.click();
    });
}
if (authEmail) {
    authEmail.addEventListener('keydown', e => {
        if (e.key === 'Enter') authPassword.focus();
    });
}
if (authRegNick) {
    authRegNick.addEventListener('input', () => { authRegNick.value = sanitizeName(authRegNick.value); });
}

if (authSubmitBtn) {
    authSubmitBtn.addEventListener('click', async () => {
        const email = (authEmail?.value || '').trim();
        const pass = (authPassword?.value || '');
        const nick = sanitizeName(authRegNick?.value || '').trim();
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
                if (nick && isValidName(nick)) {
                    savedName = nick;
                    setCookie('snakeNick', savedName);
                    playerNameInput.value = savedName;
                }
                const cred = await upgradeFromAnonymous(() => auth.createUserWithEmailAndPassword(email, pass));
                if (nick && cred && cred.user) {
                    await cred.user.updateProfile({ displayName: nick }).catch(() => {});
                }
            } else {
                await upgradeFromAnonymous(() => auth.signInWithEmailAndPassword(email, pass));
            }
            authSubmitBtn.disabled = false;
            closeAuthModal();
            clearStatus(authStatus);
        } catch (e) {
            authSubmitBtn.disabled = false;
            showStatus(authStatus, e.message, true);
        }
    });
}

// === SOCIAL AUTH ===
function handleSocialAuth(provider) {
	showStatus(authStatus, (i18n[currentLang] || i18n.ru).signingIn || 'Вход...', false);
	upgradeFromAnonymous(() => auth.signInWithPopup(provider))
		.then(() => { closeAuthModal(); clearStatus(authStatus); })
		.catch(e => {
			if (e.code === 'auth/account-exists-with-different-credential') {
				const email = e.email;
				const labels = { password: i18n[currentLang].providerEmailPassword, 'google.com': i18n[currentLang].providerGoogle, 'github.com': i18n[currentLang].providerGithub };
				auth.fetchSignInMethodsForEmail(email).then(methods => {
					const method = methods.find(m => labels[m]);
					showStatus(authStatus, method ? i18n[currentLang].accountExists + labels[method] + '.' : i18n[currentLang].accountExistsFallback, true);
				}).catch(() => {
					showStatus(authStatus, i18n[currentLang].accountExistsFallback, true);
				});
			} else {
				showStatus(authStatus, e.message, true);
			}
		});
}

if (authGoogle) authGoogle.addEventListener('click', () => handleSocialAuth(new firebase.auth.GoogleAuthProvider()));
if (authGithub) authGithub.addEventListener('click', () => handleSocialAuth(new firebase.auth.GithubAuthProvider()));

// Auth state
async function syncBestScoreFromServer() {
    if (!authUid) return;
    try {
        const doc = await db.collection(LEADERBOARD_COLLECTION).doc(authUid).get();
        if (doc.exists) {
            const serverScore = doc.data().score || 0;
            if (serverScore > bestScore) {
                bestScore = serverScore;
                localStorage.setItem('snakeHighScore', bestScore);
                updateHighScoreDisplay();
            }
        }
    } catch (e) { /* ignore */ }
}

auth.onAuthStateChanged(user => {
    if (user && !user.isAnonymous) {
        authUser = user;
        authUid = user.uid;
        setCookie('authUid', user.uid, 365);
        if (user.email) setCookie('authEmail', user.email, 365);
        if (user.displayName) setCookie('snakeNick', user.displayName, 365);
        setCookie('isLoggedIn', '1', 365);
        loadLeaderboard();
        syncBestScoreFromServer();
        loadFeedback();
    } else if (user && user.isAnonymous) {
        authUser = user;
        authUid = user.uid;
        if (!getCookie('authUid')) {
            setCookie('authUid', user.uid, 365);
        }
        loadLeaderboard();
        syncBestScoreFromServer();
        loadFeedback();
    } else {
        authUser = null;
        authUid = null;
        deleteCookie('isLoggedIn');
        if (!skipAnonSignIn) {
            auth.signInAnonymously().catch(() => {});
        }
    }
    updateAuthUI();
    updateNicknameInputVisibility();
});

const leaderboardList = document.getElementById('leaderboardList');
const lbStatus = document.getElementById('lbStatus');

function setLbStatus(state, msg) {
    lbStatus.innerHTML = `<span class="dot ${state}"></span><span>${escapeHtml(msg)}</span>`;
}

let lastScoreSaveTime = 0;
async function saveScoreToLeaderboard() {
    if (score <= 0 || !authUid) return;
    const maxPossible = tileCount * tileCount;
    if (score > maxPossible || score > 50000) return;
    const now = Date.now();
    if (now - lastScoreSaveTime < 2000) return;
    lastScoreSaveTime = now;
    const displayName = savedName && savedName !== 'Refyrd.dev' ? savedName : i18n[currentLang].anonymous;
    try {
        const docRef = db.collection(LEADERBOARD_COLLECTION).doc(authUid);
        const existing = await docRef.get();

        const existingScore = existing.exists ? (existing.data().score || 0) : 0;
        const existingName = existing.exists ? (existing.data().name || '') : '';

        if (score <= existingScore && displayName === existingName) {
            loadLeaderboard();
            return;
        }

        await docRef.set({
            name: displayName,
            score: Math.max(score, existingScore)
        });
    } catch (e) {
        console.warn('Firebase save error:', e);
    }
    loadLeaderboard();
}

let _lbLangAtStart = '';
async function loadLeaderboard() {
    _lbLangAtStart = currentLang;
    try {
        const snapshot = await db.collection(LEADERBOARD_COLLECTION)
            .orderBy('score', 'desc')
            .limit(lbLimit)
            .get();
        if (currentLang !== _lbLangAtStart) return;
        setLbStatus('online', i18n[currentLang].online);
        if (snapshot.empty) {
            leaderboardList.innerHTML = `<div class="lb-empty">${i18n[currentLang].lbNoScores}</div>`;
            return;
        }
        let html = '';
        let rank = 1;
        snapshot.forEach(doc => {
            const d = doc.data();
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            html += `<div class="lb-entry">
                <span class="lb-rank">${medal || rank}</span>
                <span class="lb-name">${escapeHtml(d.name && d.name.trim() ? d.name : i18n[currentLang].anonymous)}</span>
                <span class="lb-score">${d.score || 0}</span>
            </div>`;
            rank++;
        });
        leaderboardList.innerHTML = html;
        if (!window._lbHeightFixed) {
            const lb = document.getElementById('leaderboard');
            if (lb) {
                window._lbHeightFixed = true;
                if (window.getComputedStyle(lb).position === 'fixed') {
                    lb.style.height = lb.offsetHeight + 'px';
                } else if (lb.offsetHeight > 0) {
                    lb.style.height = Math.min(lb.offsetHeight, window.innerHeight * 0.6) + 'px';
                }
            }
        }
    } catch (e) {
        if (currentLang !== _lbLangAtStart) return;
        console.warn('Firebase load error:', e);
        setLbStatus('error', i18n[currentLang].errorPrefix + e.message);
        leaderboardList.innerHTML = `<div class="lb-empty">${i18n[currentLang].lbOffline}</div>`;
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

let lbLimit = 10;
let lbShowAll = false;
const lbShowMore = document.getElementById('lbShowMore');
lbShowMore.addEventListener('click', () => {
    lbShowAll = !lbShowAll;
    lbLimit = lbShowAll ? 1000 : 10;
    lbShowMore.innerText = lbShowAll ? i18n[currentLang].lbShowTop : i18n[currentLang].lbShowAll;
    leaderboardList.innerHTML = `<div class="lb-loading">${i18n[currentLang].lbLoading}</div>`;
    document.getElementById('leaderboard').classList.toggle('lb-show-all', lbShowAll);
    loadLeaderboard();
});

setInterval(() => { if (authUid) loadLeaderboard(); }, 5000);

setInterval(() => {
    if (isRunning && authUid && score > 0) saveScoreToLeaderboard();
}, 3000);

// === FEEDBACK PANEL ===
const Fb_COLLECTION = 'feedback';
const fbPanel = document.getElementById('feedbackPanel');
const fbList = document.getElementById('feedbackList');
const fbWriteBtn = document.getElementById('fbWriteBtn');
const fbOverlay = document.getElementById('fbOverlay');
const fbOverlayClose = document.getElementById('fbOverlayClose');
const fbNameInput = document.getElementById('fbNameInput');
const fbMessageInput = document.getElementById('fbMessageInput');
const fbSubmit = document.getElementById('fbSubmit');
const fbStatus = document.getElementById('fbStatus');

function updateFbNameField() {
	const hasName = savedName && isValidName(savedName);
	fbNameInput.value = hasName ? savedName : '';
	fbNameInput.disabled = !!hasName;
	fbNameInput.placeholder = hasName ? '' : i18n[currentLang].fbNamePlaceholder;
}

async function loadComments(entry) {
	const docId = entry.dataset.id;
	const list = entry.querySelector('.fb-comments-list');
	const statsBtn = entry.querySelector('.fb-comment-stats');
	try {
		const snap = await db.collection(Fb_COLLECTION).doc(docId).collection('comments').orderBy('time', 'asc').limit(20).get();
		if (snap.empty) {
			list.innerHTML = `<div class="lb-empty">${i18n[currentLang].fbNoComments}</div>`;
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
				<span class="fb-comment-name">${escapeHtml(d.name || i18n[currentLang].anonymous)}</span>
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
		list.innerHTML = `<div class="lb-empty">${i18n[currentLang].fbLoadFail}</div>`;
	}
}

async function submitComment(entry) {
	const docId = entry.dataset.id;
	const input = entry.querySelector('.fb-comment-input');
	const msg = input.value.trim();
	if (!msg || msg.length < 1) return;
	const name = (authUid && savedName && isValidName(savedName)) ? savedName : i18n[currentLang].anonymous;
	const uid = authUid || getCookie('authUid') || '';
	const list = entry.querySelector('.fb-comments-list');
	const statsBtn = entry.querySelector('.fb-comment-stats');

	// Optimistic: add comment immediately
	const tempId = '_' + Date.now();
	const emptyMsg = list.querySelector('.lb-empty');
	if (emptyMsg) emptyMsg.remove();
	const escName = escapeHtml(name);
	const escMsg = escapeHtml(msg);
	list.insertAdjacentHTML('beforeend',
		`<div class="fb-comment fb-comment-pending" data-cid="${tempId}">
			<span class="fb-comment-name">${escName}</span>
			<span class="fb-comment-msg">${escMsg}</span>
			${uid ? '<button class="fb-comment-edit">✎</button><button class="fb-comment-del">✕</button>' : ''}
		</div>`
	);
	input.value = '';
	input.disabled = true;

	// Update count optimistically
	const cur = parseInt(statsBtn.dataset.count) || 0;
	const newCount = cur + 1;
	statsBtn.dataset.count = newCount;
	statsBtn.textContent = formatCommentCount(newCount);
	statsBtn.style.display = '';

	try {
		await db.collection(Fb_COLLECTION).doc(docId).collection('comments').add({
			name, message: msg, uid,
			time: firebase.firestore.FieldValue.serverTimestamp()
		});
		await db.collection(Fb_COLLECTION).doc(docId).update({
			commentCount: firebase.firestore.FieldValue.increment(1)
		});
		// Reload from Firestore to sync IDs and remove pending state
		await loadComments(entry);
	} catch (_) {
		// Remove optimistic comment on failure
		list.querySelectorAll('.fb-comment-pending').forEach(el => el.remove());
		const cur2 = parseInt(statsBtn.dataset.count) || 1;
		const newCount2 = cur2 - 1;
		statsBtn.dataset.count = newCount2;
		statsBtn.textContent = formatCommentCount(newCount2);
		if (newCount2 <= 0) statsBtn.style.display = 'none';
	}
	input.disabled = false;
}

function formatCommentCount(n) {
	if (currentLang === 'ru') {
		if (n % 10 === 1 && n % 100 !== 11) return n + ' ответ';
		if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return n + ' ответа';
		return n + ' ответов';
	}
	return n + ' ' + (n === 1 ? i18n[currentLang].fbReplyOne : i18n[currentLang].fbReplyFew);
}

async function deleteFeedback(docId) {
	if (!docId) return;
	const confirmMsg = currentLang === 'ru' ? 'Удалить этот отзыв?' : 'Delete this feedback?';
	if (!confirm(confirmMsg)) return;
	const entry = fbList ? fbList.querySelector(`.fb-entry[data-id="${docId}"]`) : null;
	if (entry) entry.remove();
	try {
		await db.collection(Fb_COLLECTION).doc(docId).delete();
		loadFeedback(true);
	} catch (e) {
		console.error('Error deleting feedback:', e);
		alert(currentLang === 'ru' ? 'Ошибка при удалении: ' + e.message : 'Delete error: ' + e.message);
		loadFeedback(true);
	}
}

async function deleteComment(entry, cid) {
	if (!cid) return;
	const docId = entry.dataset.id;
	const commentEl = entry.querySelector(`[data-cid="${cid}"]`);
	if (commentEl) commentEl.remove();
	const statsBtn = entry.querySelector('.fb-comment-stats');
	const cur = parseInt(statsBtn.dataset.count) || 1;
	const newCount = cur - 1;
	statsBtn.dataset.count = newCount;
	statsBtn.textContent = formatCommentCount(newCount);
	if (newCount <= 0) statsBtn.style.display = 'none';
	try {
		await db.collection(Fb_COLLECTION).doc(docId).collection('comments').doc(cid).delete();
		await db.collection(Fb_COLLECTION).doc(docId).update({
			commentCount: firebase.firestore.FieldValue.increment(-1)
		});
	} catch (_) {}
}

function startEditComment(entry, commentEl) {
	const msgEl = commentEl.querySelector('.fb-comment-msg');
	if (!msgEl) return;
	const curText = msgEl.textContent;
	const input = document.createElement('input');
	input.className = 'fb-comment-edit-input';
	input.value = curText;
	input.maxLength = 500;
	msgEl.replaceWith(input);
	input.focus();
	input.select();
	const finish = async () => {
		const newMsg = input.value.trim();
		if (newMsg && newMsg !== curText) {
			const cid = commentEl.dataset.cid;
			if (cid) {
				try {
					await db.collection(Fb_COLLECTION).doc(entry.dataset.id).collection('comments').doc(cid).update({ message: newMsg });
				} catch (_) {}
			}
			const newSpan = document.createElement('span');
			newSpan.className = 'fb-comment-msg';
			newSpan.textContent = newMsg;
			input.replaceWith(newSpan);
		} else if (!newMsg) {
			const newSpan = document.createElement('span');
			newSpan.className = 'fb-comment-msg';
			newSpan.textContent = curText;
			input.replaceWith(newSpan);
		}
	};
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
	});
	input.addEventListener('blur', finish);
}

let _fbLangAtStart = '';
async function loadFeedback(silent) {
	_fbLangAtStart = currentLang;
	if (!silent) fbList.innerHTML = `<div class="lb-loading">${i18n[currentLang].lbLoading}</div>`;
	try {
		const snap = await db.collection(Fb_COLLECTION).orderBy('time', 'desc').limit(50).get();
		if (currentLang !== _fbLangAtStart) return;
		if (snap.empty) {
			fbList.innerHTML = `<div class="lb-empty">${i18n[currentLang].fbNoFeedback}</div>`;
			return;
		}
		const feedbackIds = [];
		snap.forEach(doc => feedbackIds.push(doc.id));
		// Instant UI from localStorage cache
		const userVotes = {};
		try {
			const cached = JSON.parse(localStorage.getItem('fbVotes') || '{}');
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
				${isOwner ? `<button class="fb-del-btn" title="${i18n[currentLang].deleteBtn || 'Удалить'}">✕</button>` : ''}
				<div class="fb-text${long ? ' collapsed' : ''}">${msg}</div>
				<div class="fb-expand-row">
					${long ? '<button class="fb-expand">' + i18n[currentLang].fbShowMore + '</button>' : ''}
					${long ? '<span class="fb-sep">·</span>' : ''}
					<button class="fb-reply-btn">${i18n[currentLang].fbReply}</button>
				</div>
				<div class="fb-actions">
					<button class="fb-like${userVote === 'like' ? ' active' : ''}">👍 <span>${likes}</span></button>
					<button class="fb-dislike${userVote === 'dislike' ? ' active' : ''}">👎 <span>${dislikes}</span></button>
				</div>
				<button class="fb-comment-stats" data-count="${d.commentCount ?? 0}"${d.commentCount ? '' : ' style="display:none"'}>${formatCommentCount(d.commentCount ?? 0)}</button>
				<div class="fb-time">${escapeHtml(d.name || i18n[currentLang].anonymous)} · ${time}</div>
				<div class="fb-comments" style="display:none">
					<div class="fb-comments-header"><button class="fb-comments-close">✕</button></div>
					<div class="fb-comments-list"></div>
					<div class="fb-comment-form">
						<input class="fb-comment-input" placeholder="${i18n[currentLang].fbWriteComment}">
						<button class="fb-comment-send">${i18n[currentLang].fbSendComment}</button>
					</div>
				</div>
			</div>`;
		});
		fbList.innerHTML = html;
		window._fbCachedHtml = html;
		// Sync votes from Firestore in background, update DOM if differs from cache
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
				if (!entry) return;
				if (_recentVotes[id]) return;
				const likeBtn = entry.querySelector('.fb-like');
				const dislikeBtn = entry.querySelector('.fb-dislike');
				if (fbVotes[id]) {
					likeBtn.classList.toggle('active', fbVotes[id] === 'like');
					dislikeBtn.classList.toggle('active', fbVotes[id] === 'dislike');
				} else if (userVotes[id]) {
					likeBtn.classList.remove('active');
					dislikeBtn.classList.remove('active');
				}
			});
			// Update cache
			try { localStorage.setItem('fbVotes', JSON.stringify(fbVotes)); } catch (_) {}
		}
		// Lock feedback panel height like leaderboard
		if (!window._fbHeightFixed) {
			const fp = document.getElementById('feedbackPanel');
			if (fp && fp.offsetHeight > 0) {
				window._fbHeightFixed = true;
				fp.style.height = Math.min(fp.offsetHeight, window.innerHeight * 0.75) + 'px';
			}
		}
	} catch (e) {
		if (currentLang !== _fbLangAtStart) return;
		fbList.innerHTML = `<div class="lb-empty">${i18n[currentLang].fbLoadFail}</div>`;
	}
}

fbList.addEventListener('click', (e) => {
	const fbDelBtn = e.target.closest('.fb-del-btn');
	if (fbDelBtn) {
		const entry = fbDelBtn.closest('.fb-entry');
		if (!entry) return;
		const docId = entry.dataset.id;
		deleteFeedback(docId);
		return;
	}
	const expandBtn = e.target.closest('.fb-expand');
	if (expandBtn) {
		const entry = expandBtn.closest('.fb-entry');
		if (!entry) return;
		const textEl = entry.querySelector('.fb-text');
		textEl.classList.toggle('expanded');
		textEl.classList.toggle('collapsed');
		expandBtn.textContent = textEl.classList.contains('expanded') ? i18n[currentLang].fbShowLess : i18n[currentLang].fbShowMore;
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
	const editBtn = e.target.closest('.fb-comment-edit');
	if (editBtn) {
		const comment = editBtn.closest('.fb-comment');
		const entry = comment.closest('.fb-entry');
		startEditComment(entry, comment);
		return;
	}
	const delBtn = e.target.closest('.fb-comment-del');
	if (delBtn) {
		const comment = delBtn.closest('.fb-comment');
		const entry = comment.closest('.fb-entry');
		deleteComment(entry, comment.dataset.cid);
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
			if (entry) { submitComment(entry); }
		}
	}
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		document.querySelectorAll('.fb-comments').forEach(s => s.style.display = 'none');
	}
});

const _votingLock = {};
const _recentVotes = {}; // docId → timestamp of last in-progress vote
async function voteFeedback(docId, type) {
	const voteKey = authUid;
	if (!voteKey) return;
	if (_votingLock[docId]) return;
	_votingLock[docId] = true;
	// Clean stale locks (older than 30s)
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
	// Optimistic DOM update (instant)
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
		// Sync localStorage with confirmed Firestore state
		const cache = JSON.parse(localStorage.getItem('fbVotes') || '{}');
		if (existingType === type) delete cache[docId];
		else cache[docId] = type;
		localStorage.setItem('fbVotes', JSON.stringify(cache));
	} catch (e) {
		// Revert UI on failure
		likeBtn.classList.toggle('active', wasLiked);
		dislikeBtn.classList.toggle('active', wasDisliked);
		likeCount.textContent = prevLikes;
		dislikeCount.textContent = prevDislikes;
		// Revert localStorage
		const cache = JSON.parse(localStorage.getItem('fbVotes') || '{}');
		if (wasLiked) cache[docId] = 'like';
		else if (wasDisliked) cache[docId] = 'dislike';
		else delete cache[docId];
		localStorage.setItem('fbVotes', JSON.stringify(cache));
	}
	_votingLock[docId] = false;
	delete _recentVotes[docId];
}

loadFeedback();

fbWriteBtn.addEventListener('click', () => {
	updateFbNameField();
	fbMessageInput.value = '';
	fbStatus.textContent = '';
	fbOverlay.classList.add('active');
});

fbOverlayClose.addEventListener('click', () => fbOverlay.classList.remove('active'));
fbOverlay.addEventListener('click', e => { if (e.target === fbOverlay) fbOverlay.classList.remove('active'); });

fbSubmit.addEventListener('click', async () => {
	const name = fbNameInput.value.trim();
	const message = fbMessageInput.value.trim();
	if (!name) { fbStatus.textContent = i18n[currentLang].fbNameRequired; fbStatus.style.color = 'var(--md-sys-color-error)'; return; }
	if (!message || message.length < 3) { fbStatus.textContent = i18n[currentLang].fbMsgShort; fbStatus.style.color = 'var(--md-sys-color-error)'; return; }
	fbStatus.textContent = i18n[currentLang].fbSending;
	fbStatus.style.color = '';
	try {
		const currentUid = authUid || getCookie('authUid') || '';
		await db.collection(Fb_COLLECTION).add({
			name: name,
			message: message,
			uid: currentUid,
			time: firebase.firestore.FieldValue.serverTimestamp()
		});
		// sync nickname
		if (name !== savedName) {
			if (!authUser || authUser.isAnonymous) {
				savedName = name;
				setCookie('snakeNick', savedName);
				playerNameInput.value = savedName;
			} else {
				const userRef = db.collection('users').doc(authUid);
				const doc = await userRef.get();
				if (!doc.exists || !doc.data().nickname) {
					userRef.set({ nickname: name, nicknameLastChange: Date.now() }, { merge: true });
					savedName = name;
					playerNameInput.value = savedName;
				}
			}
		}
		fbStatus.textContent = i18n[currentLang].fbSent;
		fbStatus.style.color = 'var(--md-sys-color-primary)';
		fbMessageInput.value = '';
		updateFbNameField();
		setTimeout(() => fbOverlay.classList.remove('active'), 1500);
		loadFeedback();
	} catch (e) {
		fbStatus.textContent = e.message;
		fbStatus.style.color = 'var(--md-sys-color-error)';
	}
});

const confettiCanvas = document.getElementById('confettiCanvas');
const cCtx = confettiCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startMenu = document.getElementById('startMenu');
const gameOverScreen = document.getElementById('gameOverScreen');
const menuHighScoreText = document.getElementById('menuHighScoreText');
const menuLastScoreText = document.getElementById('menuLastScoreText');
const playerNameInput = document.getElementById('playerNameInput');

const initialSpeed = 150; 

let snake = [];
let food = {};
let dx = 0, dy = 0;
let score = 0;

let bestScore = localStorage.getItem('snakeHighScore') || 0;
let lastScore = localStorage.getItem('snakeLastScore') || 0; 
let savedName = getCookie('snakeNick') || '';
let lastNickChange = 0;
playerNameInput.value = savedName;

let currentSpeed = initialSpeed;
let isRunning = false;
let lastTickTime = 0;
let inputQueue = [];
let particles = [];

let glows = []; 

function updateHighScoreDisplay() {
    const displayName = savedName && savedName.trim() ? savedName : i18n[currentLang].anonymous;
    const nameDisplay = ` (${displayName})`;
    menuHighScoreText.innerText = `${i18n[currentLang].bestScore}${bestScore}${nameDisplay}`;
    if (lastScore > 0) {
        menuLastScoreText.style.display = 'block';
        menuLastScoreText.innerText = `${i18n[currentLang].lastScore}${lastScore}`;
    } else {
        menuLastScoreText.style.display = 'none';
    }
}

applyLanguage();

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

setInterval(() => {
    if (isRunning) advanceLogic(performance.now());
}, 50);

function showMenu() {
    gameOverScreen.classList.remove('active');
    devMenu.classList.remove('active');
    playerNameInput.disabled = false;
    playerNameInput.placeholder = i18n[currentLang].placeholder;
    startMenu.classList.add('active');
    isRunning = false;
    updateHighScoreDisplay();
    resetGameState();
    document.body.classList.remove('gameplay');
}

function startGame() {
    const now = Date.now();
    const raw = sanitizeName(playerNameInput.value);
    playerNameInput.value = raw;
    if (raw && raw.toLowerCase() !== 'refyrd.dev') {
        if (raw !== savedName && now - lastNickChange < 3000) return;
        savedName = isValidName(raw) ? raw : '';
        if (savedName) setCookie('snakeNick', savedName);
        if (raw) lastNickChange = now;
    }
    
    startMenu.classList.remove('active');
    gameOverScreen.classList.remove('active');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    
    resetGameState();
    syncCanvasSize();
    placeFood();
    isRunning = true;
    lastTickTime = performance.now();
    document.body.classList.add('gameplay');
}

// === МЕНЮ РАЗРАБОТЧИКА ===
const devMenu = document.getElementById('devMenu');

playerNameInput.addEventListener('input', () => {
    playerNameInput.value = sanitizeName(playerNameInput.value);
    if (playerNameInput.value.toLowerCase() === 'refyrd.dev') {
        devMenu.classList.add('active');
        playerNameInput.disabled = true;
        savedName = '';
        playerNameInput.value = '';
        playerNameInput.placeholder = i18n[currentLang].devMode;
    }
});

playerNameInput.addEventListener('blur', () => {
	const raw = sanitizeName(playerNameInput.value);
	playerNameInput.value = raw;
	if (raw && raw.toLowerCase() !== 'refyrd.dev') {
		const now = Date.now();
		if (raw !== savedName && now - lastNickChange < 3000) {
			playerNameInput.value = savedName || '';
			return;
		}
		savedName = isValidName(raw) ? raw : '';
		if (savedName) setCookie('snakeNick', savedName);
		if (raw) lastNickChange = now;
		updateHighScoreDisplay();
	}
});

function closeDevMenu() {
    devMenu.classList.remove('active');
    playerNameInput.disabled = false;
    playerNameInput.placeholder = i18n[currentLang].placeholder;
    playerNameInput.value = savedName || '';
}

function devGlow() {
    glows = [{ pos: 0 }];
}

function devAddScore() {
    score += 10;
    scoreElement.innerText = score;
    triggerConfetti();
}

function devFillSnake() {
    score += 10;
    scoreElement.innerText = score;
    if (score % 10 === 0) triggerConfetti();
    const tail = snake[snake.length - 1];
    for (let i = 0; i < 10; i++) {
        snake.push({ x: tail.x, y: tail.y, rx: tail.x, ry: tail.y });
    }
}

// === CLOSE POPUPS ON ESC / ANDROID BACK ===
function closeTopOverlay() {
	if (devMenu.classList.contains('active')) { closeDevMenu(); return true; }
	if (fbOverlay.classList.contains('active')) { fbOverlay.classList.remove('active'); return true; }
	if (authOverlay.classList.contains('active')) { authOverlay.classList.remove('active'); return true; }
	if (gameOverScreen.classList.contains('active')) {
		gameOverScreen.classList.remove('active');
		startMenu.classList.add('active');
		updateHighScoreDisplay();
		return true;
	}
	return false;
}

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') closeTopOverlay();
});

history.pushState(null, '');
window.addEventListener('popstate', () => {
	if (!closeTopOverlay()) history.pushState(null, '');
});

function resetGameState() {
    syncCanvasSize();
    const center = Math.floor(tileCount / 2);
    snake = [
        { x: center, y: center, rx: center, ry: center },
        { x: center, y: center + 1, rx: center, ry: center + 1 },
        { x: center, y: center + 2, rx: center, ry: center + 2 }
    ];
    dx = 0; dy = -1;
    score = 0;
    currentSpeed = initialSpeed;
    glows = [];
    scoreElement.innerText = score;
}

function advanceLogic(now) {
    if (!isRunning) return;
    let guard = 0;
    while (now - lastTickTime >= currentSpeed && guard < 2000) {
        updateLogic();
        lastTickTime += currentSpeed;
        guard++;
        if (!isRunning) break;
    }
}

function animationLoop(timestamp) {
    if (isRunning) {
        advanceLogic(timestamp);
        
        glows.forEach(g => g.pos += 0.12);
        glows = glows.filter(g => g.pos < snake.length + 4);
    }

    for (let s of snake) {
        s.rx += (s.x - s.rx) * 0.6;
        s.ry += (s.y - s.ry) * 0.6;
    }
    
    drawGame();
    updateConfetti();
    requestAnimationFrame(animationLoop);
}

function updateLogic() {
    if (inputQueue.length > 0) {
        const next = inputQueue.shift();
        dx = next.dx;
        dy = next.dy;
    }
    const head = { x: snake[0].x + dx, y: snake[0].y + dy, rx: snake[0].x, ry: snake[0].y };
    const ate = head.x === food.x && head.y === food.y;

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkSelfCollision(head, ate)) {
        handleGameOver();
        return;
    }

    snake.unshift(head);

    if (ate) {
        score++;
        scoreElement.innerText = score;
        if (score > 0 && score % 10 === 0) triggerConfetti();
        
        glows = [{ pos: 0 }];
        placeFood();
    } else {
        snake.pop();
    }
}

function checkSelfCollision(head, ate) {
    const len = ate ? snake.length : snake.length - 1;
    for (let i = 0; i < len; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function drawGrid() {
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
}

function toRGBA(color, alpha) {
    tempColorCtx.fillStyle = color;
    const computed = tempColorCtx.fillStyle;
    if (computed.startsWith('#')) {
        let hex = computed.slice(1);
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    const m = computed.match(/rgba?\(([^)]+)\)/);
    if (m) {
        const parts = m[1].split(',').map(s => parseFloat(s));
        return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
    }
    return color;
}

function lightenColor(color, amount) {
    if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        if (hex.length === 6) {
            const r = Math.min(255, parseInt(hex.slice(0,2),16) + Math.round(amount * 255));
            const g = Math.min(255, parseInt(hex.slice(2,4),16) + Math.round(amount * 255));
            const b = Math.min(255, parseInt(hex.slice(4,6),16) + Math.round(amount * 255));
            return `rgb(${r},${g},${b})`;
        }
    }
    const m = color.match(/(\d+)/g);
    if (!m || m.length < 3) return color;
    const r = Math.min(255, parseInt(m[0]) + Math.round(amount * 255));
    const g = Math.min(255, parseInt(m[1]) + Math.round(amount * 255));
    const b = Math.min(255, parseInt(m[2]) + Math.round(amount * 255));
    return `rgb(${r},${g},${b})`;
}

const tempColorCanvas = document.createElement('canvas');
const tempColorCtx = tempColorCanvas.getContext('2d');
let cachedPrimary = '';
function getPrimary() {
    if (!cachedPrimary) {
        const s = getComputedStyle(document.body);
        cachedPrimary = s.getPropertyValue('--md-sys-color-primary').trim();
        if (cachedPrimary === '') cachedPrimary = getResolvedColor('var(--md-sys-color-primary)');
    }
    return cachedPrimary;
}
function clearPrimaryCache() { cachedPrimary = ''; }
const observer = new MutationObserver(clearPrimaryCache);
observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'data-color'] });

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); 
    
    const rawPrimary = getPrimary();

    if (food.x !== undefined) {
        const pulse = 1 + Math.sin(performance.now() / 300) * 0.06;
        const foodSize = gridSize * 0.80 * pulse; 
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, foodSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    const total = snake.length;
    for (let i = snake.length - 1; i >= 0; i--) {
        const segment = snake[i];
        const t = total > 1 ? i / (total - 1) : 0;
        const sizeFactor = 0.85 - t * 0.40;
        const size = gridSize * sizeFactor;
        const padding = (gridSize - size) / 2;
        
        const cx = segment.rx * gridSize + gridSize / 2;
        const cy = segment.ry * gridSize + gridSize / 2;
        
        let maxGlowIntensity = 0;
        for (let g of glows) {
            let dist = Math.abs(g.pos - i);
            if (dist < 3.5) {
                let intensity = 1 - (dist / 3.5);
                if (intensity > maxGlowIntensity) maxGlowIntensity = intensity;
            }
        }
        
        if (maxGlowIntensity > 0) {
            const glowR = size * 0.95;
            const grad = ctx.createRadialGradient(cx, cy, size * 0.3, cx, cy, glowR);
            grad.addColorStop(0, toRGBA(rawPrimary, 0.6 * maxGlowIntensity));
            grad.addColorStop(0.5, toRGBA(rawPrimary, 0.25 * maxGlowIntensity));
            grad.addColorStop(1, toRGBA(rawPrimary, 0));
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = i === 0 ? lightenColor(rawPrimary, 0.05) : rawPrimary;
        ctx.beginPath();
        const radius = size * (i === 0 ? 0.40 : 0.30);
        ctx.roundRect(cx - size / 2, cy - size / 2, size, size, radius);
        ctx.fill();
    }
}

function placeFood() {
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) { placeFood(); break; }
    }
}

function handleGameOver() {
    isRunning = false;
    
    lastScore = score;
    localStorage.setItem('snakeLastScore', lastScore);

    if (score > bestScore) { 
        localStorage.setItem('snakeHighScore', score); 
        bestScore = score; 
    }
    document.getElementById('finalScore').innerText = score;
    gameOverScreen.classList.add('active');
    saveScoreToLeaderboard();
    document.body.classList.remove('gameplay');
}

function changeDirection(newDx, newDy) {
    if (inputQueue.length >= 4) return;
    const last = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : { dx, dy };
    const valid = (newDx === 1 && last.dx !== -1) || (newDx === -1 && last.dx !== 1) ||
                  (newDy === -1 && last.dy !== 1) || (newDy === 1 && last.dy !== -1);
    if (!valid) return;
    inputQueue.push({ dx: newDx, dy: newDy });
}

const _heldKeys = new Set();
document.addEventListener('keydown', (e) => {
    if (document.activeElement === playerNameInput) {
        if (e.key === 'Enter') startGame();
        return;
    }
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", " "].indexOf(e.code) > -1) e.preventDefault();
    let ndx = 0, ndy = 0;
    switch(e.key) {
        case 'ArrowLeft': case 'a': case 'A': case 'ф': case 'Ф': ndx = -1; break;
        case 'ArrowRight': case 'd': case 'D': case 'в': case 'В': ndx = 1; break;
        case 'ArrowUp': case 'w': case 'W': case 'ц': case 'Ц': ndy = -1; break;
        case 'ArrowDown': case 's': case 'S': case 'ы': case 'Ы': ndy = 1; break;
    }
    if (ndx === 0 && ndy === 0) return;
    const key = `${ndx},${ndy}`;
    if (_heldKeys.has(key)) return;
    _heldKeys.add(key);
    changeDirection(ndx, ndy);
});
document.addEventListener('keyup', (e) => {
    let ndx = 0, ndy = 0;
    switch(e.key) {
        case 'ArrowLeft': case 'a': case 'A': case 'ф': case 'Ф': ndx = -1; break;
        case 'ArrowRight': case 'd': case 'D': case 'в': case 'В': ndx = 1; break;
        case 'ArrowUp': case 'w': case 'W': case 'ц': case 'Ц': ndy = -1; break;
        case 'ArrowDown': case 's': case 'S': case 'ы': case 'Ы': ndy = 1; break;
    }
    if (ndx === 0 && ndy === 0) return;
    _heldKeys.delete(`${ndx},${ndy}`);
});

// === TOUCH ===
const gameContainer = document.getElementById('gameContainer');
let touchStartX = 0;
let touchStartY = 0;

gameContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

gameContainer.addEventListener('touchmove', e => {
    if (!isRunning) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    const diffX = touch.screenX - touchStartX;
    const diffY = touch.screenY - touchStartY;
    if (Math.max(Math.abs(diffX), Math.abs(diffY)) < 30) return;
    const dirX = Math.abs(diffX) > Math.abs(diffY) ? (diffX > 0 ? 1 : -1) : 0;
    const dirY = Math.abs(diffY) > Math.abs(diffX) ? (diffY > 0 ? 1 : -1) : 0;
    if (dirX) changeDirection(dirX, 0);
    else if (dirY) changeDirection(0, dirY);
    touchStartX = touch.screenX;
    touchStartY = touch.screenY;
}, { passive: false });

gameContainer.addEventListener('touchend', e => {
    if (!isRunning) return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    if (Math.max(Math.abs(diffX), Math.abs(diffY)) < 30) return;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) changeDirection(1, 0); 
        else changeDirection(-1, 0); 
    } else {
        if (diffY > 0) changeDirection(0, 1); 
        else changeDirection(0, -1);
    }
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

// === BUTTON EVENTS ===
document.getElementById('uiPlayBtn').addEventListener('click', startGame);
document.getElementById('uiRestartBtn').addEventListener('click', startGame);
document.getElementById('uiMenuBtn').addEventListener('click', showMenu);
document.getElementById('uiDevConfetti').addEventListener('click', triggerConfetti);
document.getElementById('uiDevGlow').addEventListener('click', devGlow);
document.getElementById('uiDevAddScore').addEventListener('click', devAddScore);
document.getElementById('uiDevFill').addEventListener('click', devFillSnake);
document.getElementById('uiDevClose').addEventListener('click', closeDevMenu);

// === CONFETTI ===
function triggerConfetti() {
    const colors = ['#ffb4ab', '#b7f397', '#9cd67d', '#ffffff', '#386a20'];
    const W = window.innerWidth, H = window.innerHeight;
    const corners = [
        { x: 0, y: 0, dx: 1, dy: 1 },
        { x: W, y: 0, dx: -1, dy: 1 },
        { x: 0, y: H, dx: 1, dy: -1 },
        { x: W, y: H, dx: -1, dy: -1 }
    ];
    for (const c of corners) {
        for (let i = 0; i < 25; i++) {
            const ox = c.dx * Math.random() * 60;
            const oy = c.dy * Math.random() * 60;
            particles.push(createParticle(c.x + ox, c.y + oy, c.dx, c.dy, colors));
        }
    }
}

function createParticle(x, y, dirX, dirY, colors) {
    return {
        x: x, y: y,
        vx: (Math.random() * 4 + 2) * dirX,
        vy: (Math.random() * 4 + 2) * dirY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 9, rotation: Math.random() * 360, rs: (Math.random() - 0.5) * 8
    };
}

function updateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rotation += p.rs;
        
        cCtx.save();
        cCtx.translate(p.x, p.y); cCtx.rotate(p.rotation * Math.PI / 180);
        cCtx.fillStyle = p.color;
        cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cCtx.restore();
        
        if (p.y > confettiCanvas.height + 20) particles.splice(i, 1);
    }
}

resetGameState();
requestAnimationFrame(animationLoop);

// === COOKIE BANNER ===
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

