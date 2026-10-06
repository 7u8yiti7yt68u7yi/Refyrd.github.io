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
    
    document.getElementById('authTitle').innerText = i18n[currentLang].authSignIn;
    authEmailBtn.childNodes[1].textContent = ' ' + i18n[currentLang].authEmailBtn;
    authGoogle.childNodes[1].textContent = ' ' + i18n[currentLang].authGoogleBtn;
    authGithub.childNodes[1].textContent = ' ' + i18n[currentLang].authGithubBtn;
    document.getElementById('authEmailTitle').innerText = i18n[currentLang].authEmailTitle;
    authEmailSignIn.innerText = i18n[currentLang].authEmailSignIn;
    authEmailRegister.innerText = i18n[currentLang].authEmailRegister;
    document.getElementById('authEmail').placeholder = i18n[currentLang].authEmailPlaceholder;
    document.getElementById('authPassword').placeholder = i18n[currentLang].authPassPlaceholder;
    document.getElementById('authRegNick').placeholder = i18n[currentLang].authNickPlaceholder;
    authSignOutBtn.innerText = i18n[currentLang].authSignOut;
    document.querySelector('#authAccountView .auth-title').innerText = i18n[currentLang].authAccount;
    document.querySelectorAll('#authAccountView .auth-acc-label')[0].innerText = i18n[currentLang].authLinkedProviders;
    document.querySelectorAll('#authAccountView .auth-acc-label')[1].innerText = i18n[currentLang].authLinkAnother;
    document.querySelectorAll('#authAccountView .auth-acc-label')[2].innerText = i18n[currentLang].authNickname;
    accNickSave.innerText = i18n[currentLang].authSave;
    document.getElementById('authLinkEmail').placeholder = i18n[currentLang].authEmailPlaceholder;
    document.getElementById('authLinkPassword').placeholder = i18n[currentLang].authPassPlaceholder;
    document.querySelector('#authLinkEmailView .auth-title').innerText = i18n[currentLang].authLinkEmail;
    authLinkEmailLink.innerText = i18n[currentLang].authLinkEmailBtn;
    authBtn.title = i18n[currentLang].signInTooltip;
    const hubBtnEl = document.getElementById('hubBtn');
    if (hubBtnEl) hubBtnEl.title = i18n[currentLang].hubBtnTooltip;
    const uiHubTitle = document.getElementById('uiHubTitle');
    if (uiHubTitle) uiHubTitle.innerText = i18n[currentLang].hubTitle;
    const uiHubSubtitle = document.getElementById('uiHubSubtitle');
    if (uiHubSubtitle) uiHubSubtitle.innerText = i18n[currentLang].hubSubtitle;
    const uiGameSnakeTitle = document.getElementById('uiGameSnakeTitle');
    if (uiGameSnakeTitle) uiGameSnakeTitle.innerText = i18n[currentLang].gameSnakeTitle;
    const uiGameSnakeDesc = document.getElementById('uiGameSnakeDesc');
    if (uiGameSnakeDesc) uiGameSnakeDesc.innerText = i18n[currentLang].gameSnakeDesc;
    const uiGameSoonTitle = document.getElementById('uiGameSoonTitle');
    if (uiGameSoonTitle) uiGameSoonTitle.innerText = i18n[currentLang].gameSoonTitle;
    const uiGameSoonDesc = document.getElementById('uiGameSoonDesc');
    if (uiGameSoonDesc) uiGameSoonDesc.innerText = i18n[currentLang].gameSoonDesc;
    const uiSnakeToHubBtn = document.getElementById('uiSnakeToHubBtn');
    if (uiSnakeToHubBtn) uiSnakeToHubBtn.innerText = i18n[currentLang].allGamesBtn;
    const uiGameOverToHubBtn = document.getElementById('uiGameOverToHubBtn');
    if (uiGameOverToHubBtn) uiGameOverToHubBtn.innerText = i18n[currentLang].allGamesBtn;
    const uiBadgeClassic = document.getElementById('uiBadgeClassic');
    if (uiBadgeClassic) uiBadgeClassic.innerText = i18n[currentLang].badgeClassic;
    const uiBadgeSoon = document.getElementById('uiBadgeSoon');
    if (uiBadgeSoon) uiBadgeSoon.innerText = i18n[currentLang].badgeSoon;
    const authDivider = document.querySelector('.auth-divider span');
    if (authDivider) authDivider.textContent = i18n[currentLang].or;
    authEmailBack.innerHTML = '&larr; ' + i18n[currentLang].back;
    authLinkEmailBack.innerHTML = '&larr; ' + i18n[currentLang].back;
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

function applyTheme() {
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
}
applyTheme();

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    setCookie('snakeTheme', isDark ? 'dark' : 'light');
    applyTheme();
});

// === ВЫБОР ЦВЕТА И РАЗМЕРА ===
const colorBtns = document.querySelectorAll('.color-btn');
const savedColor = getCookie('snakeColor') || 'green';
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
        ['snake', { id: 'snake', title: 'RefyrdSnake', path: '/Snake' }],
        ['breakout', { id: 'breakout', title: 'Breakout', path: '/Breakout', disabled: true }]
    ]),
    register(id, config) {
        this.games.set(id, config);
    },
    switchGame(id) {
        if (!this.games.has(id)) return;
        this.activeGame = id;
        if (typeof openGame === 'function') openGame(id, true);
    },
    showHub() {
        if (typeof showHub === 'function') showHub(true);
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
const authOverlay = document.getElementById('authOverlay');
const authClose = document.getElementById('authClose');
const authBtn = document.getElementById('authBtn');
const authMainView = document.getElementById('authMainView');
const authEmailView = document.getElementById('authEmailView');
const authEmailBack = document.getElementById('authEmailBack');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authEmailSignIn = document.getElementById('authEmailSignIn');
const authEmailRegister = document.getElementById('authEmailRegister');
const authRegNick = document.getElementById('authRegNick');
const authEmailBtn = document.getElementById('authEmailBtn');
const authGoogle = document.getElementById('authGoogle');
const authGithub = document.getElementById('authGithub');
const authStatus = document.getElementById('authStatus');
const authEmailStatus = document.getElementById('authEmailStatus');
const authSignOutBtn = document.getElementById('authSignOutBtn');
const authAccountView = document.getElementById('authAccountView');
const accEmail = document.getElementById('accEmail');
const accProviders = document.getElementById('accProviders');
const accNickInput = document.getElementById('accNickInput');
const accNickSave = document.getElementById('accNickSave');
const accNickStatus = document.getElementById('accNickStatus');

const providerBtns = document.querySelectorAll('.auth-prov-btn[data-prov]');

function showStatus(el, msg, isError) {
	el.textContent = msg;
	el.style.color = isError ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)';
}
function clearStatus(el) { el.textContent = ''; }

function showEmailView() {
    authMainView.style.display = 'none';
    authEmailView.style.display = 'flex';
    authEmail.value = '';
    authPassword.value = '';
    authRegNick.value = '';
    authRegNick.style.display = 'none';
    clearStatus(authEmailStatus);
    authEmail.focus();
}

function hideEmailView() {
    authMainView.style.display = '';
    authEmailView.style.display = 'none';
    clearStatus(authEmailStatus);
}

authBtn.addEventListener('click', () => {
    hideEmailView();
    authOverlay.classList.add('active');
    updateAuthUI();
});

authClose.addEventListener('click', () => authOverlay.classList.remove('active'));
authOverlay.addEventListener('click', e => { if (e.target === authOverlay) authOverlay.classList.remove('active'); });
authEmailBack.addEventListener('click', hideEmailView);

function renderProviders() {
    if (!authUser || authUser.isAnonymous) return;
    const methods = authUser.providerData.map(p => p.providerId);
    const provLabel = { 'google.com': i18n[currentLang].providerGoogle, 'github.com': i18n[currentLang].providerGithub, 'password': i18n[currentLang].providerEmail };
    accProviders.innerHTML = methods.map(id => {
        return `<span class="auth-prov-btn badge">${provLabel[id] || id}</span>`;
    }).join('');
    const used = new Set(methods);
    providerBtns.forEach(btn => {
        const prov = btn.dataset.prov;
        const target = prov === 'password' ? 'password' : prov + '.com';
        const labels = { google: i18n[currentLang].providerGoogle, github: i18n[currentLang].providerGithub, password: i18n[currentLang].providerEmail };
        const label = labels[prov] || prov;
        btn.disabled = used.has(target);
        btn.textContent = used.has(target) ? label : '+ ' + label;
    });
}

function updateAuthUI() {
    if (authUser && !authUser.isAnonymous) {
        authBtn.textContent = '✓';
        authBtn.style.color = 'var(--md-sys-color-primary)';
        accEmail.textContent = authUser.email || authUser.displayName || i18n[currentLang].loggedIn;
        authMainView.style.display = 'none';
        authEmailView.style.display = 'none';
        authAccountView.style.display = 'flex';
        renderProviders();
        loadNicknameFromFirestore();
    } else {
        authBtn.textContent = '👤';
        authBtn.style.color = '';
        authMainView.style.display = '';
        authEmailView.style.display = 'none';
        authAccountView.style.display = 'none';
    }
}

authSignOutBtn.addEventListener('click', () => {
    auth.signOut();
    authOverlay.classList.remove('active');
});

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

// === LINK PROVIDERS ===
const authLinkEmailViewEl = document.getElementById('authLinkEmailView');
const accChildren = document.querySelectorAll('#authAccountView > .auth-acc-section, #authAccountView > .auth-title, #authAccountView > .auth-info-line, #authAccountView > .auth-social-btn, #authAccountView > hr');

function toggleAccView(showLink) {
	authLinkEmailViewEl.style.display = showLink ? '' : 'none';
	accChildren.forEach(el => { if (el) el.style.display = showLink ? 'none' : ''; });
}

providerBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		if (btn.disabled || !authUser) return;
		const prov = btn.dataset.prov;
		if (prov === 'password') { toggleAccView(true); return; }
		const user = auth.currentUser;
		if (!user) return;

			function handleLink(promise) {
				const pLabel = { google: i18n[currentLang].providerGoogle, github: i18n[currentLang].providerGithub }[prov] || prov;
				promise.then(() => {
					authUser = auth.currentUser;
					renderProviders();
					accNickStatus.textContent = pLabel + i18n[currentLang].linked;
					accNickStatus.style.color = 'var(--md-sys-color-primary)';
				}).catch(e => {
					accNickStatus.textContent = e.code === 'auth/credential-already-in-use' ? i18n[currentLang].alreadyLinked : e.message;
					accNickStatus.style.color = 'var(--md-sys-color-error)';
				});
		}

		if (prov === 'google') {
			handleLink(user.linkWithPopup(new firebase.auth.GoogleAuthProvider()));
		} else if (prov === 'github') {
			handleLink(user.linkWithPopup(new firebase.auth.GithubAuthProvider()));
		}
	});
});

// === LINK EMAIL VIEW ===
const authLinkEmailBack = document.getElementById('authLinkEmailBack');
const authLinkEmailLink = document.getElementById('authLinkEmailLink');
const authLinkEmailInput = document.getElementById('authLinkEmail');
const authLinkPassInput = document.getElementById('authLinkPassword');
const authLinkEmailStat = document.getElementById('authLinkEmailStatus');

authLinkEmailBack.addEventListener('click', () => toggleAccView(false));

authLinkEmailLink.addEventListener('click', () => {
	if (!authUser || authUser.isAnonymous) { authLinkEmailStat.textContent = i18n[currentLang].notLoggedIn; return; }
	const email = authLinkEmailInput.value.trim();
	const pass = authLinkPassInput.value;
	if (!email || !pass) { authLinkEmailStat.textContent = i18n[currentLang].fillEmailPass; return; }
	if (pass.length < 6) { authLinkEmailStat.textContent = i18n[currentLang].passMin6; return; }
	authLinkEmailStat.textContent = i18n[currentLang].linking;
	authLinkEmailStat.style.color = '';
	auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(email, pass)).then(() => {
		authUser = auth.currentUser;
		renderProviders();
		accNickStatus.textContent = i18n[currentLang].emailLinked;
		accNickStatus.style.color = 'var(--md-sys-color-primary)';
		authLinkEmailStat.textContent = i18n[currentLang].emailLinkedSuccess;
		authLinkEmailStat.style.color = 'var(--md-sys-color-primary)';
		authLinkEmailBack.click();
	}).catch(e => {
		authLinkEmailStat.textContent = e.code === 'auth/credential-already-in-use' ? i18n[currentLang].emailAlreadyLinked : e.message;
		authLinkEmailStat.style.color = 'var(--md-sys-color-error)';
	});
});

function formatCooldownUntil(timestamp) {
	const d = new Date(timestamp);
	const pad = n => String(n).padStart(2, '0');
	return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// === NICKNAME FROM FIRESTORE ===
const NICK_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 1 week

function loadNicknameFromFirestore() {
	if (!authUser || authUser.isAnonymous) return;
	const userRef = db.collection('users').doc(authUser.uid);
	const lockIcon = document.getElementById('accNickLock');
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
			if (lockIcon) lockIcon.style.display = '';
		} else {
			accNickStatus.textContent = '';
			accNickSave.disabled = accNickInput.disabled = false;
			if (lockIcon) lockIcon.style.display = 'none';
		}
	}).catch(e => {
		accNickStatus.textContent = e.message;
		accNickStatus.style.color = 'var(--md-sys-color-error)';
	});
}

accNickSave.addEventListener('click', () => {
	if (!authUser || authUser.isAnonymous) return;
	const nick = sanitizeName(accNickInput.value.trim());
	if (!isValidName(nick)) { accNickStatus.textContent = i18n[currentLang].invalidNickname; accNickStatus.style.color = 'var(--md-sys-color-error)'; return; }
	const lockIcon = document.getElementById('accNickLock');
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
			const msg = i18n[currentLang].cantChangeUntil + formatCooldownUntil(new Date(now + NICK_COOLDOWN));
			accNickStatus.textContent = msg;
			accNickStatus.style.color = '';
			accNickSave.disabled = accNickInput.disabled = true;
			if (lockIcon) lockIcon.style.display = '';
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

// === HIDE NICKNAME INPUT WHEN LOGGED IN ===
function updateNicknameInputVisibility() {
    if (authUser && !authUser.isAnonymous) {
        playerNameInput.style.display = 'none';
    } else {
        playerNameInput.style.display = '';
    }
}

// === Email button → show email view ===
authEmailBtn.addEventListener('click', showEmailView);

// Toggle nickname field — show for Register, hide for Sign In
authEmailSignIn.addEventListener('focus', () => { authRegNick.style.display = 'none'; }, true);
authEmailRegister.addEventListener('focus', () => { authRegNick.style.display = 'block'; }, true);

authPassword.addEventListener('keydown', e => {
    if (e.key === 'Enter') authEmailSignIn.click();
});
authEmail.addEventListener('keydown', e => {
    if (e.key === 'Enter') authPassword.focus();
});
authRegNick.addEventListener('input', () => { authRegNick.value = sanitizeName(authRegNick.value); });

// Email Sign In
authEmailSignIn.addEventListener('click', () => {
    const email = authEmail.value.trim();
    const pass = authPassword.value;
    if (!email || !pass) { showStatus(authEmailStatus,i18n[currentLang].fillAllFields, true); return; }
    showStatus(authEmailStatus,i18n[currentLang].signingIn, false);
    upgradeFromAnonymous(() => auth.signInWithEmailAndPassword(email, pass))
        .then(() => { authOverlay.classList.remove('active'); clearStatus(authEmailStatus); })
        .catch(e => showStatus(authEmailStatus,e.message, true));
});

// Email Register
authEmailRegister.addEventListener('click', () => {
    const email = authEmail.value.trim();
    const pass = authPassword.value;
    const nick = sanitizeName(authRegNick.value.trim());
    if (!email || !pass) { showStatus(authEmailStatus,i18n[currentLang].fillAllFields, true); return; }
    if (pass.length < 6) { showStatus(authEmailStatus,i18n[currentLang].passMin6, true); return; }
    if (nick && isValidName(nick)) {
        savedName = nick;
        setCookie('snakeNick', savedName);
        playerNameInput.value = savedName;
    }
    showStatus(authEmailStatus,i18n[currentLang].creatingAccount, false);
    upgradeFromAnonymous(() => auth.createUserWithEmailAndPassword(email, pass))
        .then(() => { authOverlay.classList.remove('active'); clearStatus(authEmailStatus); })
        .catch(e => showStatus(authEmailStatus,e.message, true));
});

// === SOCIAL AUTH ===
function handleSocialAuth(provider) {
	showStatus(authStatus, i18n[currentLang].signingIn, false);
	upgradeFromAnonymous(() => auth.signInWithPopup(provider))
		.then(() => { authOverlay.classList.remove('active'); clearStatus(authStatus); })
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

authGoogle.addEventListener('click', () => handleSocialAuth(new firebase.auth.GoogleAuthProvider()));
authGithub.addEventListener('click', () => handleSocialAuth(new firebase.auth.GithubAuthProvider()));

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
    if (user) {
        authUser = user;
        authUid = user.uid;
        loadLeaderboard();
        syncBestScoreFromServer();
        loadFeedback();
    } else {
        authUser = null;
        authUid = null;
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
		let html = '';
		let count = 0;
		snap.forEach(doc => {
			const d = doc.data();
			const ct = d.time ? new Date(d.time.seconds * 1000).toLocaleDateString() : '';
			const isOwner = authUid && d.uid === authUid;
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
	const uid = authUid || '';
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
			html += `<div class="fb-entry" data-id="${id}">
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
		await db.collection(Fb_COLLECTION).add({
			name: name,
			message: message,
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
const hubMenu = document.getElementById('hubMenu');
const hubBtn = document.getElementById('hubBtn');
const hubCardSnake = document.getElementById('hubCardSnake');
const uiSnakeToHubBtn = document.getElementById('uiSnakeToHubBtn');
const uiGameOverToHubBtn = document.getElementById('uiGameOverToHubBtn');
const menuHighScoreText = document.getElementById('menuHighScoreText');
const menuLastScoreText = document.getElementById('menuLastScoreText');
const playerNameInput = document.getElementById('playerNameInput');

function updateRouteUrl(path, stateId) {
    try {
        if (window.location.protocol.startsWith('http')) {
            window.history.pushState({ game: stateId }, '', path);
        } else {
            window.location.hash = stateId === 'menu' ? '' : stateId;
        }
    } catch (e) {
        window.location.hash = stateId === 'menu' ? '' : stateId;
    }
}

function showHub(pushState = true) {
    isRunning = false;
    document.body.classList.remove('gameplay');
    gameOverScreen.classList.remove('active');
    startMenu.classList.remove('active');
    devMenu.classList.remove('active');
    if (hubMenu) hubMenu.classList.add('active');
    document.title = i18n[currentLang]?.pageTitle || 'Refyrd Games';
    if (pushState) updateRouteUrl('/', 'menu');
}

function openGame(gameId, pushState = true) {
    if (gameId === 'snake') {
        GameHub.activeGame = 'snake';
        if (hubMenu) hubMenu.classList.remove('active');
        gameOverScreen.classList.remove('active');
        devMenu.classList.remove('active');
        startMenu.classList.add('active');
        updateHighScoreDisplay();
        resetGameState();
        document.title = 'RefyrdSnake';
        if (pushState) updateRouteUrl('/Snake', 'snake');
    }
}

function resolveRoute() {
    const path = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase().replace('#', '');
    const search = new URLSearchParams(window.location.search);
    const gameParam = (search.get('game') || '').toLowerCase();

    if (path.endsWith('/snake') || hash === 'snake' || gameParam === 'snake') {
        openGame('snake', false);
    } else {
        showHub(false);
    }
}

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
    if (hubMenu) hubMenu.classList.remove('active');
    playerNameInput.disabled = false;
    playerNameInput.placeholder = i18n[currentLang].placeholder;
    startMenu.classList.add('active');
    isRunning = false;
    updateHighScoreDisplay();
    resetGameState();
    document.body.classList.remove('gameplay');
    updateRouteUrl('/Snake', 'snake');
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
	if (isRunning) {
		isRunning = false;
		document.body.classList.remove('gameplay');
		startMenu.classList.add('active');
		return true;
	}
	if (startMenu.classList.contains('active') && (!hubMenu || !hubMenu.classList.contains('active'))) {
		showHub(true);
		return true;
	}
	return false;
}

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') closeTopOverlay();
});

window.addEventListener('popstate', () => {
	if (!closeTopOverlay()) {
		resolveRoute();
	}
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

if (hubCardSnake) {
    hubCardSnake.addEventListener('click', () => openGame('snake', true));
    hubCardSnake.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGame('snake', true);
        }
    });
}
if (hubBtn) hubBtn.addEventListener('click', () => showHub(true));
if (uiSnakeToHubBtn) uiSnakeToHubBtn.addEventListener('click', () => showHub(true));
if (uiGameOverToHubBtn) uiGameOverToHubBtn.addEventListener('click', () => showHub(true));

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
resolveRoute();
