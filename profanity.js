// === PROFANITY FILTER & NICKNAME VALIDATION ===

// 1. Очистка Zalgo, эмодзи и спецсимволов
const zalgoRegex = /[\u0300-\u036f\u0483-\u0489\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u0901-\u0903\u093c\u093e-\u094d\u0951-\u0954\u0962-\u0963\u0981-\u0983\u09bc\u09be-\u09cc\u09d7\u09e2-\u09e3\u0a01-\u0a03\u0abc\u0abe-\u0acc\u0b01-\u0b03\u0b3c\u0b3e-\u0b4c\u0b56-\u0b57\u0b82\u0bbe-\u0bcc\u0bd7\u0c01-\u0c03\u0c3e-\u0c4c\u0c55-\u0c56\u0c82-\u0c83\u0cbc\u0cbe-\u0ccc\u0cd5-\u0cd6\u0d02-\u0d03\u0d3e-\u0d4c\u0d57\u0d82-\u0d83\u0dca\u0dcf-\u0ddf\u0df2-\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f3f\u0f71-\u0f84\u0f86-\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1056-\u1059\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1dc0-\u1dcf\u1dfe-\u1dff\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\ua66f\ua67c-\ua67d\ua6f0-\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa7b\uaab0\uaab2-\uaab4\uaab5-\uaab6\uaab9-\uaabd\uaac1\uabe3-\uabea\uabec\uabed\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e-\uff9f]/g;
const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;
const badSymbolsRegex = /[^\w\sа-яА-ЯёЁa-zA-Z0-9_.\-]/g;

// 2. Таблицы гомоглифов и leetspeak
const latToCyrMap = {
    'a': 'а', 'b': 'в', 'c': 'с', 'e': 'е', 'h': 'н',
    'k': 'к', 'm': 'м', 'o': 'о', 'p': 'р', 't': 'т',
    'x': 'х', 'y': 'у', 'u': 'у'
};

const cyrToLatMap = {
    'а': 'a', 'в': 'b', 'с': 'c', 'е': 'e', 'н': 'h',
    'к': 'k', 'м': 'm', 'о': 'o', 'р': 'p', 'т': 't',
    'х': 'x', 'у': 'y'
};

const leetToCyrMap = {
    '0': 'о', '1': 'и', '!': 'и', '|': 'и',
    '3': 'е', '4': 'а', '@': 'а',
    '5': 'с', '$': 'с', '6': 'б', '7': 'т', '+': 'т', '8': 'в'
};

const leetToLatMap = {
    '0': 'o', '1': 'i', '!': 'i', '|': 'i',
    '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's',
    '6': 'g', '7': 't', '+': 't', '8': 'b', '9': 'g'
};

// Базовая нормализация текста для проверки
function normalizeForCheck(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(zalgoRegex, '').replace(emojiRegex, '').toLowerCase();
}

function normalizeCyr(text) {
    let s = normalizeForCheck(text);
    s = s.replace(/uy|ui/g, 'уй');
    s = s.replace(/[01!|34@5$67+8]/g, m => leetToCyrMap[m] || m);
    s = s.replace(/[abcehkmoptxyu]/g, m => latToCyrMap[m] || m);
    return s;
}

function normalizeLat(text) {
    let s = normalizeForCheck(text);
    s = s.replace(/[01!|34@5$67+89]/g, m => leetToLatMap[m] || m);
    s = s.replace(/[авсенкмортху]/g, m => cyrToLatMap[m] || m);
    return s;
}

// 3. Списки запрещенных корней (только реальный мат и тяжелые оскорбления)
// Строгие корни (проверяются в любой части слова / с любыми приставками/суффиксами)
const ruStrictRoots = [
    'хуй', 'хуя', 'хуе', 'хую', 'хуи', 'хуё',
    'пизд',
    'ебал', 'ебат', 'ебет', 'ебут', 'ебаш', 'ебан', 'заеб', 'наеб', 'выеб', 'доеб', 'уебищ', 'отъеб',
    'бляд', 'бля', 'блять', 'блят',
    'мудак', 'муда',
    'залуп', 'шлюх', 'шалав', 'шмар',
    'гондон', 'гандон', 'дрочит', 'дроч',
    'пидор', 'пидар', 'пидр', 'нигер'
];

// Корни с обязательными границами слов (lookaround), чтобы не задевать нормальные слова
const ruBoundedWords = [
    'сука', 'суки', 'суку', 'суке', 'сук',
    'говн', 'говно', 'гавно',
    'гей', 'геи', 'геев',
    'лох', 'лохи', 'лоха', 'лоху',
    'чмо', 'чма', 'чмош',
    'член', 'члена',
    'сиськи', 'сися', 'сисек',
    'пися', 'писюн', 'письк'
];

const enStrictRoots = [
    'fuck', 'fck', 'fuk', 'nigger', 'nigga', 'nigg', 'niga',
    'bitch', 'cunt', 'dick', 'pussy', 'faggot', 'fag', 'retard',
    'blowjob', 'handjob', 'dildo', 'asshole'
];

const enBoundedWords = [
    'shit', 'ass', 'slut', 'whore', 'cock', 'bastard'
];

// Регулярные выражения с lookaround без захвата окружающих символов
const ruStrictRegex = new RegExp(ruStrictRoots.join('|'), 'iu');
const ruBoundedRegex = new RegExp('(?<!\\p{L})(' + ruBoundedWords.join('|') + ')(?!\\p{L})', 'iu');

const enStrictRegex = new RegExp(enStrictRoots.join('|'), 'iu');
const enBoundedRegex = new RegExp('(?<!\\p{L})(' + enBoundedWords.join('|') + ')(?!\\p{L})', 'iu');

const fullCensorRegex = new RegExp(`(?<!\\p{L})(${[...ruBoundedWords, ...enBoundedWords].join('|')})(?!\\p{L})|${[...ruStrictRoots, ...enStrictRoots].join('|')}`, 'giu');

function checkVariant(strictRegex, boundedRegex, text) {
    if (strictRegex.test(text) || boundedRegex.test(text)) return true;
    // Схлопывание 2+ повторяющихся букв (сууука -> сука, niiigggaa -> niga)
    const collapsed = text.replace(/(.)\1+/gu, '$1');
    if (strictRegex.test(collapsed) || boundedRegex.test(collapsed)) return true;
    // Проверка со снятием внутрисловных символов-разделителей (n.1.g.g.a, х_у_й)
    const noPunct = text.replace(/[^\p{L}\p{N}]+/gu, '');
    if (strictRegex.test(noPunct) || boundedRegex.test(noPunct)) return true;
    const noPunctCollapsed = noPunct.replace(/(.)\1+/gu, '$1');
    if (strictRegex.test(noPunctCollapsed) || boundedRegex.test(noPunctCollapsed)) return true;
    return false;
}

function checkRussian(text) {
    const cyr = normalizeCyr(text);
    return checkVariant(ruStrictRegex, ruBoundedRegex, cyr);
}

function checkEnglish(text) {
    const lat = normalizeLat(text);
    return checkVariant(enStrictRegex, enBoundedRegex, lat);
}

// 4. Основные экспортируемые функции
function sanitizeName(raw) {
    if (typeof raw !== 'string') return '';
    let val = raw.replace(zalgoRegex, '');
    val = val.replace(emojiRegex, '');
    val = val.replace(badSymbolsRegex, '');
    val = val.replace(/\s+/g, '');
    return val;
}

function hasProfanity(text) {
    if (!text || typeof text !== 'string') return false;
    return checkRussian(text) || checkEnglish(text);
}

function censorProfanity(text, replacement = '***') {
    if (!text || typeof text !== 'string') return '';
    let out = text.replace(fullCensorRegex, replacement);
    out = out.replace(/\S+/g, token => {
        const clean = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
        if (clean && hasProfanity(clean)) {
            return token.replace(clean, replacement);
        }
        return token;
    });
    return out;
}

function isValidName(raw) {
    if (typeof raw !== 'string') return false;
    if (hasProfanity(raw)) return false;
    const clean = sanitizeName(raw);
    if (!clean || clean.length < 2 || clean.length > 16) return false;
    if (hasProfanity(clean)) return false;
    return true;
}
