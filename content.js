let detectionStats = {
  totalDetected: 0,
  blockedMessages: 0,
  perUser: {}
};

function saveStats() {
  chrome.storage.local.set({ cyberStats: detectionStats });
}

function loadStats() {
  chrome.storage.local.get(["cyberStats"], (res) => {
    if (res.cyberStats) {
      detectionStats = res.cyberStats;
    }
  });
}


let extensionSettings = {
  enabled: true,
  mode: "highlight",
  notifications: true,
  disabledSites: {}
};

function loadSettings(callback) {
  chrome.storage.sync.get(["cyberSettings"], (res) => {
    if (res.cyberSettings) {
      extensionSettings = { ...extensionSettings, ...res.cyberSettings };
    }
    callback?.();
  });
}

function isSiteDisabled() {
  return extensionSettings.disabledSites[location.hostname];
}

const enwords = [
  "idiot",
  "stupid",
  "loser",
  "trash",
  "hate",
  "worthless",
  "dumb",
  "moron",
  "jerk",
  "fool",
  "ugly",
  "useless",
  "pathetic",
  "noob",
  "scrub",
  "lazy",
  "loser",
  "suck",
  "garbage",
  "trash talk",
  "piece of trash",
  "failure",
  "annoying",
  "i hate you",
  "i hate u",
  "worthless human",
  "go kill yourself",
  "kys",
  "you should die",
  "nobody likes you",
  "get lost",
  "idiotic",
  "dumbass",
  "freak",
  "loser kid",
  "get rekt",
  "ez",
  "git gud",
  "trash player",
  "pathetic loser",
  "trash human",
  "ugly freak",
  "stupid idiot",
  "no skill",
  "weak",
  "garbage player",
  "worthless trash",
  "quit",
  "nobody cares",
  "fail",
  "hopeless",
  "worthless piece of garbage",
  "screw you",
  "trash talker",
  "you suck",
  "trash game",
  "loser scum",
  "idiot kid",
  "garbage human",
  "dumb kid",
  "moronic",
  "fail kid",
  "annoying idiot",
  "trash tier",
  "worthless loser",
  "ugly loser",
  "dumb loser",
  "idiot human",
  "useless human",
  "trash human being",
  "pathetic human",
  "loser human",
  "fool kid",
  "weakling",
  "loser freak",
  "garbage freak",
  "idiot freak",
  "trash freak",
  "stupid freak",
  "useless freak",
  "worthless freak",
  "moron kid",
  "pathetic freak",
  "dumb freak",
  "fool freak",
  "loser idiot",
  "trash idiot",
  "idiot loser",
  "garbage idiot",
  "dumb human",
  "stupid human",
  "worthless kid",
  "pathetic kid",
  "idiot kid",
  "loser trash",
  "dumb trash",
  "moron trash",
  "ugly trash",
  "fool trash",
  "trash freak",
  "nigga","nigger","ni*ga","ni**er","n1gga","n1gger",
 "faggot","fag","f*ggot","f4gg0t",
 "retard","r*tard",
 "bitch","b*tch","biatch","biotch",
 "fuck","f*ck","fuk","fk",
 "shit","sh1t","sh*t",
 "asshole","a**hole","a-hole",
 "cunt","whore","slut","hoe",
 "bastard","prick","dick","cock",
 "motherfucker","mf","mfer",
 "kill yourself","kill urself","k y s","k.y.s",
 "die already","just die","go die",
 "end yourself","rope yourself",
 "hang yourself","jump off",
 "nobody wants you","the world hates you",
 "everyone hates you",
 "you are nothing",
 "you are trash",
 "you are useless",
 "you are pathetic",
 "you are a joke",
 "you are garbage",
 "waste of space",
 "waste of oxygen",
 "human trash",
 "absolute trash",
 "delete yourself",
 "uninstall life",
 "touch grass idiot",
 "brain dead",
 "low iq",
 "npc",
 "bot",
 "you suck at life",
 "cry more",
 "stay mad",
 "cope harder",
 "ratio",
 "skill issue" 
];

const arwords = [
  "أحمق", "غبي", "جاهل", "سفيه", "أهبل", "عبيط", "متخلف", "بليد",
  "حقير", "وضيع", "دنيء", "خسيس", "تافه", "ساقط", "منحط", "وضيع",
  "قبيح", "دميم", "شائه", "بشع", "مقرف", "مقزز", "مثير للاشمئزاز",
  "فاشل", "خائب", "خاسر", "مهزوم", "منهزم", "مهزوز", "واهي",
  "كاذب", "مخادع", "مراوغ", "دجال", "نصاب", "محتال", "خائن",
  "جبان", "خواف", "مهزوز", "واهن", "ضعيف", "مستضعف", "مذلول",
  "بخيل", "شحيح", "متشدد", "متزمت", "قاس", "قاسي القلب", "عديم الرحمة",
  "عبيط", "أهبل", "معفن", "وسخ", "قذر", "خول", "خنيث", "متناك",
  "ابن متناكة", "ابن وسخة", "ابن قحبة", "ابن كلب", "ابن حرام",
  "حمار", "جحش", "تيس", "كلب", "حيوان", "بهيمة", "وحش",
  "زبالة", "قمامة", "زفت", "قشطة", "متناك", "منيك", "منايك",
  "عير", "كس", "طيز", "برطمان", "بعبص", "مقرف", "مقزز",
  "فشخ", "نهب", "نهيق", "نافق", "منافق", "كذاب", "دريكة",
  "بلحة", "بلح", "معرص", "معرصين", "منيكين", "متناكة", "قحبة",
  "حمار", "تيس", "كلب", "حيوان", "بهيمة", "غبي", "أبله", "معتوه",
  "معفن", "وسخ", "قذر", "خايس", "خايسة", "خرا", "خراية", "مزبلة",
  "زبالة", "قمامة", "ابن كلب", "ابن شرموطة", "ابن قحبة", "ابن حرام",
  "خنيث", "خول", "شاذ", "شواذ", "منيك", "منايك", "متناك", "عرص",
  "كس", "طيز", "كسمك", "كسختك", "كس امك", "طيزك", "طيزختك",
  "منيوك", "منيوكة", "معفون", "وسخين", "قذرين", "خرايات",
  "حمار", "جحش", "بهيم", "حيوان", "كلب", "سبع", "غبي", "أبله",
  "معتوه", "مجنون", "مجذوم", "مريض", "وسخ", "قذر", "خايس",
  "خرا", "زبلة", "قمامة", "ابن الكلب", "ابن الحرة", "ابن القحبة",
  "ابن الحرام", "خنيث", "خوال", "شاذ", "منيوك", "منيوكة",
  "متناك", "منايك", "معفون", "قذرين", "وسخين", "يا خرا",
  "يا زبالة", "يا قمامة", "يا خايس", "يا كلب", "يا حمار",
  "حمار", "حمارة", "جحش", "كلب", "كلبة", "بهيمة", "حيوان",
  "غبي", "معتوه", "مجنون", "مخبول", "وسخ", "قحبة", "قحاب",
  "زبال", "زبالة", "قمامة", "خرا", "خرة", "خايس", "خايسة",
  "ابن الكلب", "ابن القحبة", "ابن الحرام", "ولد القحبة",
  "ولد الحرام", "خنيث", "خوال", "شاذ", "منيوك", "منيوكة",
  "مزاگ", "مزاگة", "معفن", "معفنة", "قاذورات", "قذر", "قذرة",
  "حمار", "جحش", "كلب", "سبع", "حيوان", "بهيمة", "غبي", "أبله",
  "معتوه", "مجنون", "وسخ", "قذر", "خايس", "خرا", "زبلة",
  "قمامة", "ابن كلب", "ابن قحبة", "ابن حرام", "ولد قحبة",
  "ولد حرام", "خنيث", "خوال", "شاذ", "منيوك", "منيوكة",
  "متناك", "منايك", "معفون", "قذرين", "وسخين", "يا خرا",
  "يا زبالة", "يا خايس", "يا كلب", "يا حمار", "يا جحش",
  "حمار", "جحش", "كلب", "سبع", "حيوان", "بهيمة", "غبي", "أبله",
  "معتوه", "مجنون", "وسخ", "قذر", "خايس", "خرا", "زبلة",
  "قمامة", "ابن الكلب", "ابن القحبة", "ابن الحرام", "خنيث",
  "خوال", "شاذ", "منيوك", "منيوكة", "متناك", "منايك",
  "غبي", "أحمق", "أبله", "سفيه", "جاهل", "بليد", "ساذج", "سخيف",
  "تافه", "ساقط", "منحط", "وضيع", "دنيء", "خسيس", "حقير",
  "عديم الذكاء", "قليل العقل", "ضعيف العقل", "قليل الفهم",
  "عديم الفهم", "كليل الذهن", "بطيء الفهم", "غبي قبيح",
  "أغبى من حمار", "أغبى من بهيمة", "أقل من الصفر", "ما يفهم شي",
  "ما يعرف شي", "ما يفهم كلمة", "ما يعرف حاجة", "فارغ المخ",
  "فاضي المخ", "مخه فاضي", "مخه خاوي", "مخه مفتوح", "مخه مسروق",
  "قبيح", "دميم", "شائه", "بشع", "مقرف", "مقزز", "مثير للاشمئزاز",
  "منفر", "منفور", "وسخ", "قذر", "معفن", "متسخ", "متقذر",
  "أقرع", "أصلع", "أعور", "أعور العين", "أحدب", "أعرج", "أخرس",
  "أبكم", "أصم", "أطرش", "سمين", "بدين", "تخين", "نفسه", "نحيف",
  "هزيل", "ضعيف", "واهن", "شاحب", "مصفر", "منحوس", "منحوس الشكل",
  "كاذب", "منافق", "دجال", "نصاب", "محتال", "خائن", "غادر",
  "ماكر", "مخادع", "مراوغ", "مايل", "مائل", "منحرف", "شاذ",
  "منحل", "منحل الأخلاق", "فاسد", "مفسد", "منحط", "منحط الأخلاق",
  "داعر", "عاهر", "زاني", "زانية", "قواد", "قوادة", "داعرة",
  "ساقط", "ساقطة", "منحل", "منحلة", "فاجر", "فاجرة", "فاسق",
  "فاسقة", "منحرف", "منحرفة", "شاذ", "شاذة", "منحوس", "منحوسة",
  "ابن كلب", "ابن قحبة", "ابن حرام", "ابن عاهرة", "ابن زانية",
  "ابن داعرة", "ابن ساقطة", "ابن منحطة", "ابن فاجرة", "ابن فاسقة",
  "ولد حرام", "ولد زنا", "ولد سحت", "ولد حرامي", "ولد لص",
  "ابن لص", "ابن حرامي", "ابن سارق", "ابن نباش", "ابن شحات",
  "ابن شحاذ", "ابن متسول", "ابن شحاذة", "ابن شحاذين", "ابن لصوص",
  "ابن حرامية", "ابن نصابين", "ابن محتالين", "ابن دجالين",
  "قحبة", "عاهرة", "زانية", "داعرة", "ساقطة", "منحطة", "فاجرة",
  "فاسقة", "شاذة", "منحرفة", "خنيث", "خوال", "شاذ", "شواذ",
  "لوطي", "لواطي", "لواط", "سحاق", "سحاقية", "مخنث", "متخنث",
  "مترجل", "مترجلة", "متبلطج", "متبلطجة", "متحول", "متحولة",
  "شاذ جنسياً", "منحرف جنسياً", "شاذ نفسياً", "منحرف نفسياً",
  "كافر", "مرتد", "زنديق", "منافق", "منافقين", "أبناء القردة والخنازير",
  "أحفاد القردة", "أحفاد الخنازير", "أبناء الكلاب", "أبناء الخنازير",
  "أبناء القردة", "أبناء الشياطين", "أحفاد الشياطين", "أبناء إبليس",
  "أحفاد إبليس", "عبدة الشيطان", "عبدة الأصنام", "عبدة الأوثان",
  "عبدة النار", "عبدة الشياطين", "ملحد", "ملحدين", "لاديني",
  "لادينيين", "كافرين", "مرتدين", "زنادقة", "منافقين",
  "نسوانجي", "نسوانجية", "مؤنث", "مؤنثة", "مخنث", "متخنث",
  "أنثوي", "أنثوية", "ضعيف مثل المرأة", "أضعف من امرأة",
  "مثل البنت", "مثل العجوز", "مثل العجائز", "مثل النساء",
  "نسائي", "نسائية", "مترجل", "مترجلة", "متبلطج", "متبلطجة",
  "ذكوري", "ذكورية", "متذكر", "متذكرة", "متحذلق", "متحذلقة",
  "فقير", "معدم", "معدمة", "فقراء", "معدمين", "شحات", "شحاذ",
  "متسول", "متسولة", "شحاذة", "شحاذين", "لص", "لصة", "حرامي",
  "حرامية", "سارق", "سارقة", "نباش", "نباشة", "نباشين",
  "سارقين", "حراميين", "لصوص", "لصوصية", "سراق", "سراقة",
  "أعمى", "أعمى البصيرة", "أصم", "أطرش", "أبكم", "أخرس",
  "أعرج", "أحدب", "أبرص", "أمج", "أمجاء", "مشلول", "مشلولة",
  "معاق", "معاقة", "معوق", "معوقة", "مقعد", "مقعدة", "أعرج",
  "أعرجة", "أحدب", "أحدبة", "أعمى", "عمياء", "أصم", "صماء",
  "أبكم", "بكماء", "أخرس", "خرساء", "مجنون", "مجنونة",
  "معتوه", "معتوهة", "مخبول", "مخبولة",
  "سأقتلك", "سأذبحك", "سأطعنك", "سأضربك", "سأكسر عظامك",
  "سأحطمك", "سأدمرك", "سأقضي عليك", "سأمحوك", "سأفنيك",
  "سأجعل حياتك جحيماً", "سأجعلك تندم", "سأجعلك تبكي",
  "سأجعلك تتوسل", "سأجعلك تتذلل", "سأجعل عيشك مر",
  "سأجعل حياتك بائسة", "سأجعلك تعيش في جحيم", "سأجعلك تموت",
  "سأجعل موتك بطيئاً", "سأجعل موتك مؤلماً", "سأجعلك تتعذب",
  "سأجعل عذابك طويلاً", "سأجعل عذابك شديداً", "سأجعل ألمك لا يحتمل",
  "انتحر", "اقتل نفسك", "شنق نفسك", "ارم بنفسك", "اقفز من مكان عالي",
  "تناول سماً", "اشرب سماً", "اخنق نفسك", "اغرق نفسك", "احرق نفسك",
  "اقطع عروقك", "اقطع وريدك", "اقطع شرايينك", "انتحر وريحنا",
  "موت وخلصنا", "روح اموت", "امشي اموت", "روح انتحر",
  "امشي انتحر", "انتحر علشان نرتاح", "موت علشان نرتاح",
  "خلص حياتك", "انهي حياتك", "أوقف حياتك", "اقطع حياتك",
  "انهي معاناتك", "انهي عذابك", "خلص من حياتك", "تخلص من حياتك",
  "أبناء الكلاب", "أبناء الخنازير", "أبناء القردة", "أبناء الشياطين",
  "أحفاد الكلاب", "أحفاد الخنازير", "أحفاد القردة", "أحفاد الشياطين",
  "عبدة الشيطان", "عبدة الأصنام", "عبدة الأوثان", "عبدة النار",
  "ملحدين", "كفار", "مرتدين", "زنادقة", "منافقين",
  "أبناء الحرام", "أبناء الزنا", "أبناء السحت", "أبناء الفساد",
  "أبناء الرذيلة", "أبناء الدعارة", "أبناء الرقيق", "أبناء العبيد",
  "اخرس", "اسكت", "انطم", "اقفل فمك", "سكر تمك", "اقفل بقك",
  "اخرس وشك", "اسكت وشك", "انطم وشك", "اقفل وشك", "سكر وشك",
  "اخرس فمك", "اسكت فمك", "انطم فمك", "اقفل فمك", "سكر فمك",
  "ارحل", "انقلع", "اطلع", "امشي", "روح", "اذهب", "غور",
  "غور من هنا", "اطلع من هنا", "انقلع من هنا", "ارحل من هنا",
  "امشي من هنا", "روح من هنا", "اذهب من هنا", "اختف",
  "اختف من وجهي", "اطلع من وجهي", "انقلع من وجهي", "ارحل من وجهي",
  "اللعنة عليك", "لعنة الله عليك", "لعنة ربك عليك", "تتعلق فيك",
  "ينعل دينك", "ينعل دينك", "ينعل ربك", "ينعل أمك", "ينعل أبوك",
  "ينعل أهلك", "ينعل عيلتك", "ينعل نسلك", "ينعل جيلك",
  "الله يلعنك", "ربك يلعنك", "الملائكة تلعنك", "الناس كلها تلعنك",
  "الله يخزيك", "ربك يخزيك", "الله يعاملك", "ربك يعاملك",
  "الله يفضحك", "ربك يفضحك", "الله يذللك", "ربك يذللك",
  "الله يخذلك", "ربك يخذلك", "الله يخيبك", "ربك يخيبك",
  "يا ابن الكلب", "يا ابن القحبة", "يا ابن الحرام", "يا ابن العاهرة",
  "يا حمار", "يا كلب", "يا غبي", "يا أحمق", "يا وسخ", "يا قذر",
  "يا خايس", "يا خرائي", "يا زبالة", "يا قمامة", "يا خنيث",
  "يا شاذ", "يا منيوك", "يا متناك", "يا معفن", "يا قحاب",
  "اخرس يا", "اسكت يا", "انطم يا", "اقفل تمك يا", "سكر تمك يا",
  "ارحل يا", "انقلع يا", "اطلع يا", "امشي يا", "روح يا",
  "الله يلعنك يا", "ربك يلعنك يا", "ينعل دينك يا", "ينعل أمك يا",
  "سأقتلك يا", "سأذبحك يا", "سأضربك يا", "سأكسرك يا",
  "انتحر يا", "اقتل نفسك يا", "شنق نفسك يا", "ارم نفسك يا"

];

const slangslist = [
   "noob",
  "scrub",
  "ez",
  "git gud",
  "trash",
  "rekt",
  "ez game",
  "ez win",
  "gg noob",
  "tryhard",
  "camper",
  "feed",
  "carried",
  "salty",
  "troll",
  "op",
  "broken",
  "laggy",
  "trash player",
  "weak",
  "flick",
  "headshot",
  "clutch",
  "smurf",
  "grief",
  "afk",
  "boosted",
  "trash tier",
  "git rekt",
  "ez pz",
  "ezpz",
  "clown",
  "trash human",
  "ez noob",
  "salty kid",
  "try hard",
  "ez kid",
  "ez loser",
  "get rekt kid",
  "ez ez",
  "no skill",
  "ez trash",
  "ez idiot",
  "ez fool",
  "ez scrub",
  "ez moron",
  "ez loser",
  "ez human",
  "ez freak",
  "ez weakling",
  "kys",
  "stfu",
  "gtfo",
  "fk off",
  "trashcan",
  "dogwater",
  "npc energy",
  "bot player",
  "dead brain", 
  "brain dead bot",
  "skill diff",
  "diffed",
  "owned",
  "hard stuck",
  "inting",
  "thrower",
  "ez clap",
  "free win",
  "stay bad",
  "cry kid",
  "mad cuz bad",
  "cope",
  "seethe",
  "ni*ga",
  "n1gga",
  "f*ck",
  "f4ck",
  "sh1t",
  "a**",
  "b*tch",
  "f*ggot",
  "r*tard"
];


const allWords = {
  en: [...new Set([...enwords, ...slangslist])].filter(word => {

    return !["kys", "kill yourself", "kill urself", "k y s", "k.y.s"].includes(word.toLowerCase());
  }),
  ar: [...new Set([...arwords])]
};


const SELF_HARM_PATTERNS = {
  en: [
    /\b(go\s+)?kill\s+(yourself|urself)\b/gi,
    /\bk\s*y\s*s\b/gi,
    /\bkys\b/gi,
    /\byou\s+should\s+die\b/gi,
    /\b(just\s+)?die\s+(already)?\b/gi,
    /\bgo\s+die\b/gi,
    /\b(end|rope|hang)\s+yourself\b/gi,
    /\bjump\s+off\b/gi,
    /\bdelete\s+yourself\b/gi,
    /\buninstall\s+life\b/gi,
    /\bnobody\s+(wants|likes)\s+you\b/gi,
    /\b(the\s+world|everyone)\s+hates\s+you\b/gi,
    /\byou\s+are\s+nothing\b/gi,
    /\bwaste\s+of\s+(space|oxygen)\b/gi,
    /\b(touch\s+grass\s+)?idiot\b/gi
  ],
  ar: [
    /اقتل\s+نفسك/giu,
    /يجب\s+أن\s+تموت/giu,
    /انتحر/giu,
    /(روح|امشي)\s+موت/giu,
    /خلص\s+حياتك/giu,
    /(شنق|ارم)\s+نفسك/giu
  ]
};

const aiScoreCache = new Map();
let requestQueue = Promise.resolve();


const processedElements = new WeakSet();
const processedTextNodes = new WeakSet();

class RangeTracker {
  constructor() {
    this.ranges = [];
  }

  add(start, end, htmlStart, htmlEnd) {
    this.ranges.push({ start, end, htmlStart, htmlEnd });
  }

  overlaps(start, end) {
    return this.ranges.some(range => 
      start < range.end && end > range.start
    );
  }

  getHtmlOffset(originalPos) {
    let offset = 0;
    for (const range of this.ranges) {
      if (range.start < originalPos) {
        offset += (range.htmlEnd - range.htmlStart) - (range.end - range.start);
      }
    }
    return offset;
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function advancedNormalize(text) {
  return text
    .toLowerCase()
    .replace(/[0]/g,"o")
    .replace(/[1!|]/g,"i")
    .replace(/[3]/g,"e")
    .replace(/[4@]/g,"a")
    .replace(/[5$]/g,"s")
    .replace(/[7]/g,"t")
    .replace(/[^a-z\u0600-\u06FF\s]/gi,"")
    .replace(/\s+/g," ")
    .trim();
}


function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getWordCategory(word, lang) {
  const normalized = advancedNormalize(word);
  

  const selfHarmIndicators = ["kys", "die", "kill", "suicide", "hang", "jump", "rope", "unalive"];
  if (selfHarmIndicators.some(indicator => normalized.includes(indicator))) {
    return "SELF_HARM";
  }

  const checks = [
    { category: "HATEFUL", terms: ["nigga", "nigger", "faggot", "retard", "bitch", "whore", "slut", "cunt"] },
    { category: "PROFANITY", terms: ["fuck", "shit", "asshole", "bastard", "prick", "dick", "cock", "motherfucker"] },
    { category: "BULLYING", terms: ["worthless", "loser", "useless", "trash", "garbage", "nobody", "you suck", "pathetic"] },
    { category: "TOXIC_SLANG", terms: ["noob", "ez", "rekt", "git gud", "gg", "skill issue", "ratio", "scrub", "toxic"] }
  ];
  
  for (const check of checks) {
    if (check.terms.some(term => normalized.includes(term))) {
      return check.category;
    }
  }
  
  return "INSULT";
}

function getTooltipText(category, severity = 0) {
  const names = {
    INSULT: "Insult/Harassment",
    BULLYING: "Cyberbullying",
    SELF_HARM: "⚠️ Self-harm encouragement",
    HATEFUL: "Hate speech",
    TOXIC_SLANG: "Toxic behavior",
    PROFANITY: "Profanity",
    SELF_HARM_INDICATOR: "⚠️ Self-harm related"
  };
  
  let tooltip = names[category] || "Harmful content";
  return tooltip;
}

function getToxicSpanClass(category, severity = 0) {
  let className = "cyber-toxic";
  
  switch(category) {
    case "SELF_HARM":
      className += " severe-toxic";
      break;
    case "HATEFUL":
      className += " hateful-toxic";
      break;
    case "BULLYING":
      className += " bullying-toxic";
      break;
    case "PROFANITY":
      className += " profanity-toxic";
      break;
    case "TOXIC_SLANG":
      className += " toxic-slang";
      break;
    default:
      className += " insult-toxic";
  }
  
  return className;
}


const wordPatterns = {
  en: allWords.en.map(word => {
    const category = getWordCategory(word, "en");

    if (category === "SELF_HARM") return null;
    
    return {
      word,
      regex: new RegExp(`\\b${escapeRegex(word)}\\b`, "gi"),
      category: category
    };
  }).filter(Boolean),
  
  ar: allWords.ar.map(word => {
    const category = getWordCategory(word, "ar");
    if (category === "SELF_HARM") return null;
    
    return {
      word,
      regex: new RegExp(`${escapeRegex(word)}`, "giu"),
      category: category
    };
  }).filter(Boolean)
};

function detectLanguage(text) {
  return /[\u0600-\u06FF]/.test(text) ? "ar" : "en";
}

function getToxicSpanClass(category) {
  let className = "cyber-toxic";

  if (extensionSettings.mode === "blur") {
    className += " blur-toxic";
    return className;
  }

  switch(category) {
    case "SELF_HARM": return className + " severe-toxic";
    case "HATEFUL": return className + " hateful-toxic";
    case "BULLYING": return className + " bullying-toxic";
    case "PROFANITY": return className + " profanity-toxic";
    case "TOXIC_SLANG": return className + " toxic-slang";
    default: return className + " insult-toxic";
  }
}


function highlightText(text, lang) {
  if (!text || text.length === 0) return text;

  const tracker = new RangeTracker();
  let result = text;

  // --- Self-harm patterns ---
  const selfPatterns = SELF_HARM_PATTERNS[lang] || [];
  const sortedSelfPatterns = [...selfPatterns].sort((a,b) => b.toString().length - a.toString().length);

  for (const pattern of sortedSelfPatterns) {
    let match;
    pattern.lastIndex = 0;

    const matches = [];
    while ((match = pattern.exec(text)) !== null) {
      matches.push({start: match.index, end: match.index + match[0].length, text: match[0]});
    }
    matches.sort((a,b) => b.start - a.start);

    for (const m of matches) {
      if (tracker.overlaps(m.start,m.end)) continue;

      const htmlOffset = tracker.getHtmlOffset(m.start);
      const pos = m.start + htmlOffset;
      const before = result.substring(0,pos);
      const after = result.substring(pos + m.text.length);

      if (before.split('<').length > before.split('>').length) continue;

      const span = `<span class="${getToxicSpanClass("SELF_HARM")}" title="${getTooltipText("SELF_HARM")}">${m.text}</span>`;
      result = before + span + after;

      tracker.add(m.start,m.end,pos,pos+span.length);
    }
  }

  // --- Other words (non-self-harm) ---
  const patterns = wordPatterns[lang];
  if (!patterns) return result;

  const sortedPatterns = [...patterns].sort((a,b) => b.word.length - a.word.length);

  for (const pattern of sortedPatterns) {
    let match;
    pattern.regex.lastIndex = 0;

    const matches = [];
    while ((match = pattern.regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        category: pattern.category
      });
    }
    matches.sort((a,b) => b.start - a.start);

    for (const m of matches) {
      if (tracker.overlaps(m.start,m.end)) continue;

      const htmlOffset = tracker.getHtmlOffset(m.start);
      const pos = m.start + htmlOffset;
      const before = result.substring(0,pos);
      const after = result.substring(pos + m.text.length);

      if (before.split('<').length > before.split('>').length) continue;
      if (before.includes('<span class="cyber-toxic')) {
        const lastSpanStart = before.lastIndexOf('<span class="cyber-toxic');
        const lastSpanEnd = before.lastIndexOf('</span>');
        if (lastSpanStart > lastSpanEnd) continue;
      }

      const span = `<span class="${getToxicSpanClass(m.category)}" title="${getTooltipText(m.category)}">${m.text}</span>`;
      result = before + span + after;
      tracker.add(m.start,m.end,pos,pos+span.length);
    }
  }

  return result;
}



function highlightToxicWords(el) {
  if (!el || !el.innerText || processedElements.has(el) || el.innerText.length > 5000) {
    return;
  }
  

  processedElements.add(el);
  
  try {
    const lang = detectLanguage(el.innerText);
    

    if (el.querySelector('.cyber-toxic')) {
      return;
    }
    

    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {

          if (!node.textContent.trim() || 
              node.parentNode.classList && 
              node.parentNode.classList.contains('cyber-toxic')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    
    let hasChanges = false;
    const nodes = [];
    let node;
    

    while (node = walker.nextNode()) {
      if (!processedTextNodes.has(node)) {
        nodes.push(node);
        processedTextNodes.add(node);
      }
    }

    for (const textNode of nodes) {
      const originalText = textNode.textContent;
      if (originalText.trim().length === 0) continue;
      
      const highlighted = highlightText(originalText, lang);
      if (highlighted !== originalText) {
        const span = document.createElement('span');
        span.innerHTML = highlighted;
        textNode.parentNode.replaceChild(span, textNode);
        hasChanges = true;
      }
    }
    

    if (hasChanges) {
  requestAIAnalysis(el);

  showCyberNotification(
    "⚠️ Toxic Content Detected",
    "Harmful words were found on this page.",
    "warning"
  );
}    
  } catch (err) {
    console.error("Error highlighting toxic words:", err);

    processedElements.delete(el);
  }
}


const throttledAnalyzeElement = debounce((el) => {

  if (!el || processedElements.has(el) || el.querySelector('.cyber-toxic')) {
    return;
  }
  
  highlightToxicWords(el);
}, 150);


async function requestAIAnalysis(el) {
  const hasToxicContent = el.querySelector(".cyber-toxic");
  if (!hasToxicContent) return;
  
  const text = el.innerText;
  if (aiScoreCache.has(text)) {
    updateAIScoreVisuals(el, aiScoreCache.get(text));
    return;
  }
  
  requestQueue = requestQueue.then(async () => {
    try {
      const aiScore = await getAIScore(text);
      aiScoreCache.set(text, aiScore);
      updateAIScoreVisuals(el, aiScore);
    } catch (err) {
      console.error("AI score error:", err);
    }
  });
}

function updateAIScoreVisuals(el, aiScore) {
  if (aiScore > 0) {
    el.querySelectorAll(".cyber-toxic").forEach(span => {
      const currentTitle = span.title || "";
      const categoryMatch = currentTitle.match(/^(.*?)(?:\s*\(|$)/);
      const categoryText = categoryMatch ? categoryMatch[1] : "Harmful content";
      span.title = `${categoryText} | AI Toxicity: ${aiScore.toFixed(0)}%`;
      

      if (aiScore > 70) {
        span.style.setProperty('--toxic-intensity', '0.3');
      } else if (aiScore > 40) {
        span.style.setProperty('--toxic-intensity', '0.2');
      }
    });
  }
}


function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {

      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            highlightToxicWords(node);
          }
          if (node.nodeType === 3) {
            highlightToxicWords(node.parentNode);
          }
        });
      }


      if (mutation.type === "characterData") {
        if (mutation.target && mutation.target.parentNode) {
          highlightToxicWords(mutation.target.parentNode);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}


function addToxicStyles() {
  if (document.getElementById('cyber-toxic-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'cyber-toxic-styles';
  style.textContent = `
     .cyber-toxic {
      position: relative;
      cursor: help;
      border-radius: 2px;
      padding: 0 1px;
      margin: 0 1px;
      transition: all 0.2s ease;
      display: inline-block;
      --toxic-intensity: 0.15;
    }

  
    .blur-toxic {
      background: none !important;
      border: none !important;
      animation: none !important;
      color: transparent !important;
      text-shadow: 0 0 8px rgba(255, 0, 0, 0.7) !important;
      filter: blur(4px) !important;
    }
    
    .blur-toxic:hover {
      filter: blur(0px) !important;
      color: inherit !important;
      text-shadow: none !important;
      background: rgba(255, 0, 0, 0.1) !important;
    }
    
    .cyber-toxic:hover {
      transform: translateY(-1px);
      z-index: 1000;
    }
    
    .severe-toxic {
      background: rgba(255, 0, 0, var(--toxic-intensity, 0.15));
      border-bottom: 1px solid #ff0000;
      animation: pulse 2s infinite;
    }
    
    .hateful-toxic {
      background: rgba(139, 0, 0, var(--toxic-intensity, 0.15));
      border-bottom: 1px solid #8b0000;
    }
    
    .bullying-toxic {
      background: rgba(255, 140, 0, var(--toxic-intensity, 0.15));
      border-bottom: 1px solid #ff8c00;
    }
    
    .profanity-toxic {
      background: rgba(148, 0, 211, var(--toxic-intensity, 0.15));
      border-bottom: 1px solid #9400d3;
    }
    
    .toxic-slang {
      background: rgba(255, 215, 0, var(--toxic-intensity, 0.15));
      border-bottom: 1px solid #ffd700;
    }
    
    .insult-toxic {
      background: rgba(255, 69, 0, var(--toxic-intensity, 0.15));
      border-bottom: 1px solid #ff4500;
    }
    .cyber-blocked{
      background: rgba(0,0,0,0.6) !important;
      border-radius:12px;
      padding:12px;
      color:white !important;
      text-align:center;
      backdrop-filter: blur(8px);
    }

    .cyber-block-banner button{
      margin-top:8px;
      padding:6px 12px;
      border:none;
      border-radius:8px;
      background:#6366f1;
     color:white;
     cursor:pointer;
    }

    
    .severe-toxic::after {
      content: '⚠️';
      font-size: 0.8em;
      margin-left: 2px;
      opacity: 0.8;
    }
    .cyber-toxic:hover::before {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
      z-index: 1001;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-family: Arial, sans-serif;
      min-width: 120px;
      text-align: center;
    }
    
    @keyframes pulse {
      0% { opacity: 0.8; }
      50% { opacity: 1; }
      100% { opacity: 0.8; }
    }
    
    .cyber-toxic .cyber-toxic {
      background: none !important;
      border: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(style);
}

function blockElement(el, reason="Excessive Toxicity") {
  if (el.classList.contains("cyber-blocked")) return;

  el.classList.add("cyber-blocked");
  el.innerHTML = `
    <div class="cyber-block-banner">
      🚫 Content Hidden (${reason})
      <button class="cyber-unblock-btn">View Anyway</button>
    </div>
  `;

  el.querySelector(".cyber-unblock-btn").onclick = () => {
    el.classList.remove("cyber-blocked");
    location.reload();
  };

  detectionStats.blockedMessages++;
  saveStats();
}


async function getAIScore(text) {
  if (aiScoreCache.has(text)) {
    return aiScoreCache.get(text);
  }

  const API_KEY = "AIzaSyC1ZUp-6WDMpUnIiy9Rdbo63TfOcuooNaw";
  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

  if (text.length > 1000) return 0;

  const body = {
    comment: { text: text.substring(0, 1000) },
    languages: ["en", "ar"],
    requestedAttributes: {
      TOXICITY: {},
      INSULT: {},
      SEVERE_TOXICITY: {},
      THREAT: {}
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("Perspective API HTTP Error:", res.status);
      return 0;
    }

    const data = await res.json();

    if (!data.attributeScores) {
      console.warn("Perspective API returned no attributeScores");
      return 0;
    }

    const scores = Object.values(data.attributeScores).map(a => a.summaryScore.value);
    const score = Math.max(...scores) * 100;
    
    return score;

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error("AI Score Error:", err);
    }
    return 0;
  }
}

let cyberNotificationContainer = null;
const activeNotifications = new Set();

function createNotificationContainer() {
  if (cyberNotificationContainer) return;

  cyberNotificationContainer = document.createElement("div");
  cyberNotificationContainer.id = "cyber-notification-container";
  document.body.appendChild(cyberNotificationContainer);
}

function addNotificationStyles() {
  if (document.getElementById("cyber-notification-styles")) return;

  const style = document.createElement("style");
  style.id = "cyber-notification-styles";

  style.textContent = `
    :root {
      --cyber-success: #22c55e;
      --cyber-warning: #f59e0b;
      --cyber-bg: rgba(17, 24, 39, 0.75);
      --cyber-border: rgba(255, 255, 255, 0.08);
    }

    #cyber-notification-container {
      position: fixed;
      top: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      z-index: 999999;
      pointer-events: none;
    }

    .cyber-notification {
      position: relative;
      min-width: 280px;
      max-width: 360px;
      padding: 14px 16px;
      border-radius: 14px;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      background: var(--cyber-bg);
      border: 1px solid var(--cyber-border);
      box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      transform: translateX(120%);
      opacity: 0;
      animation: slideIn 0.35s cubic-bezier(.21,1,.36,1) forwards;
      transition: transform .25s ease, box-shadow .25s ease;
      pointer-events: auto;
      overflow: hidden;
    }

    .cyber-notification:hover {
      transform: translateX(0) scale(1.02);
      box-shadow: 
        0 18px 40px rgba(0, 0, 0, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .cyber-notification.success {
      border-left: 4px solid var(--cyber-success);
    }

    .cyber-notification.warning {
      border-left: 4px solid var(--cyber-warning);
    }

    .cyber-notification .title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
      letter-spacing: 0.3px;
    }

    .cyber-notification .message {
      font-size: 12.5px;
      opacity: 0.85;
      line-height: 1.4;
    }

    /* Progress Bar */
    .cyber-notification::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      animation: progressBar linear forwards;
      animation-duration: var(--duration, 4s);
    }

    .cyber-notification.success::after {
      background: linear-gradient(90deg, #16a34a, #22c55e);
    }

    .cyber-notification.warning::after {
      background: linear-gradient(90deg, #d97706, #f59e0b);
    }

    .cyber-notification.hide {
      animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      to {
        transform: translateX(120%);
        opacity: 0;
      }
    }

    @keyframes progressBar {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;

  document.head.appendChild(style);
}

function showCyberNotification(title, message, type = "warning", duration = 4000) {
  if (!extensionSettings.notifications) return;

  createNotificationContainer();
  addNotificationStyles();

  const id = title + message;
  if (activeNotifications.has(id)) return;
  activeNotifications.add(id);

  const notif = document.createElement("div");
  notif.className = `cyber-notification ${type}`;

  notif.innerHTML = `
    <div class="title">${title}</div>
    <div class="message">${message}</div>
  `;

  cyberNotificationContainer.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("hide");
    setTimeout(() => {
      notif.remove();
      activeNotifications.delete(id);
    }, 350);
  }, duration);
}


function initialScan() {
  highlightToxicWords(document.body);
}

function initCyberExtension() {
  loadSettings(() => {
    if (!extensionSettings.enabled || isSiteDisabled()) return;

    addToxicStyles();
    loadStats();

    initialScan();
    setupObserver(); 
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCyberExtension);
} else {
  initCyberExtension();
}

(function init() {
  loadSettings(() => {

    if (!extensionSettings.enabled) return;
    if (isSiteDisabled()) return;

    addToxicStyles();

    highlightToxicWords(document.body);
    setupObserver();

    console.log("CyberShield active on", location.hostname);
  });
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CYBER_SETTINGS_UPDATED") {
    location.reload();
  }
});  
})();
