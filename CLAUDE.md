# Daniel Bakery | דניאל בייקרי — הקשר פרויקט

## מה זה

אתר קטלוג פרימיום בעברית (RTL) למאפייה הביתית של דניאל (בן 11), בהשראת חוויית
הקנייה של shop.dallal.co.il/maincatalogpage/bakery (מבנה/UX בלבד — מותג, תוכן,
צבעים ותמונות מקוריים לגמרי). אין תשלום אונליין: ההזמנה מסתיימת בהודעת
WhatsApp מוכנה מראש לדניאל, שמתאם תשלום ידנית לאחר מכן. גילו של דניאל מופיע
ברמז עדין רק בדף האודות, לא בדף הבית.

התוכנית המלאה (כולל תהליך התכנון והשאלות שנשאלו) נמצאת בהיסטוריית השיחה שיצרה
את הפרויקט; מסמך זה הוא מקור האמת המתעדכן להמשך עבודה.

## החלטות שאושרו

1. **טכנולוגיה:** React 19 + TypeScript + Vite, ללא backend/שרת
2. **ניתוב:** `react-router-dom` עם `HashRouter` (נמנע מבעיות 404 ב-GitHub
   Pages בלי צורך בהגדרת 404.html)
3. **סגנון:** CSS Modules פר-קומפוננטה + `src/index.css` לטוקני עיצוב גלובליים
   ומחלקות utility (`.btn`, `.section`, `.container`, `.eyebrow` וכו')
4. **תמונות:** תמונות סטוק חינמיות מ-Unsplash, **הורדו ונשמרות מקומית** תחת
   `public/images/` (לא hotlinking) כדי שהאתר יהיה עצמאי לחלוטין
5. **אחסון:** GitHub Pages, דרך `.github/workflows/deploy.yml` (build אוטומטי
   בכל push ל-`main`). `vite.config.ts` משתמש ב-`base: './'` (נתיבים יחסיים)
   כדי לעבוד תחת כל תת-נתיב ריפו בלי תלות בשם הריפו
6. **פונטים:** Heebo (כותרות 900 + טקסט) ו-Frank Ruhl Libre (ציטוט), Google
   Fonts ב-`index.html`. (Assistant הוחלף ב-02/10/2026.)
7. **מספר וואטסאפ:** `972547887754` — מוגדר במקום אחד בלבד:
   `src/config/siteConfig.ts` (`whatsappNumber`)
8. **לוגו:** אין לוגו גרפי — טיפוגרפיה בלבד ("Daniel Bakery" + "דניאל בייקרי")
9. **Git:** ריפו git מקומי אותחל מתחילת הפרויקט, מחובר ל-
   `https://github.com/tbarak770/Daniel-Bakery`, `git config` המקומי מוגדר עם
   `tbarak80@gmail.com`. **הרשאת קבע מהמשתמש: לבצע `git push` אוטומטית בכל
   שינוי, בלי לשאול קודם** (ניתנה ב-24/09/2026).
10. **אתר חי:** `https://tbarak770.github.io/Daniel-Bakery/` (GitHub Pages,
    `build_type: workflow`, מופעל דרך API)

## שפת עיצוב — אימוץ מלא של crussant.vercel.app (עודכן 02/10/2026)

המשתמש ביקש לאמץ את **כל** עקרונות העיצוב של https://crussant.vercel.app/
כולל צבעים. הערכים נלקחו ישירות מה-CSS של הרפרנס (לא הערכה). זה **מחליף**
את ערכת "זהב על כהה" הקודמת ואת הכלל "משטחי תוכן קנייתי נשארים בהירים" -
עכשיו **הכל כהה**, כולל כרטיסי מוצר, עגלה וטופס (משטחי זכוכית).

- **צבעים (`src/index.css`):** רקע `--color-ink` #0a0806; רקעי סקשנים
  מתחלפים `--color-ground-1..4` (#080604 / #0d0a07 / #060403 / #090705) +
  `--color-ground-footer` #050403, כל סקשן עם קו עליון `--hairline`. טקסט
  `--color-cream` #f7ede8 / `--color-white`, משני `--color-text-70`/`-50`.
  **הדגשה אחת: כתום `--color-accent` #ff8a1e** (hover `--color-accent-hover`
  #ffa347, טקסט עליו `--color-on-accent` #110e0b, זוהר `--glow-accent`).
  זכוכית: `--glass-bg`, `--glass-bg-strong`, `--glass-tint`, `--glass-border`.
  הטוקנים הישנים (`--color-gold*`, `--color-chocolate*`, `--color-cream-dark`)
  **נמחקו** - אין להשתמש בהם.
- **טיפוגרפיה:** ברפרנס Outfit 900 + Plus Jakarta Sans, שניהם **בלי עברית**;
  המקבילה: **Heebo** (`--font-display`/`--font-body`), כותרות 900,
  line-height ~1, letter-spacing ‎-0.02em. ציטוט: **Frank Ruhl Libre**
  (`--font-serif`, במקום Cormorant Garamond).
- **רכיבים:** `.btn-primary` = גלולה כתומה עם זוהר והרמה; `.btn-secondary` =
  גלולת ghost שקופה עם גבול לבן; `.eyebrow` = כתום, ריווח אותיות רחב;
  `.section-header-split` = תגית+כותרת בצד אחד, תיאור בצד השני; כל `.section`
  הוא `position:relative; z-index:20` עם רקע (כדי לגלוש מעל במות נעוצות).
  `.btn-whatsapp` ירוק ואדום שגיאות נשארו (פונקציונליים).
- **Header:** `position:fixed`, שקוף ו"צף" (רוחב 92%), wordmark "DANIEL
  BAKERY" ב-900 (עדיין בלי לוגו גרפי), כפתורי עיגול זכוכית, גלולה כתומה
  "להזמנה" שפותחת את העגלה, ורקע זכוכית אחרי גלילה של 40px. דפים פנימיים
  מקבלים `padding-top: var(--header-offset)` (96px) כי ההדר כבר לא בזרימה.
  z-index: הדר 100, תפריט מובייל 160, עגלה 170, מסך טעינה 9999.
- **לא אומצו בכוונה** (החלטות משתמש): קונפיגורטור "Build Your Masterpiece"
  (המוצרים קבועים) וניוזלטר במייל (אין שרת) - בפוטר הוחלף בעמודת וואטסאפ.

## מבנה הקוד

```
src/
  config/siteConfig.ts      מספר וואטסאפ, שם מותג, קישורי סושיאל
  data/products.ts          8 המוצרים הקבועים (id, name, price, category, image, description, bestSeller)
  types/index.ts             Product, CartItem, Category
  context/CartContext.tsx    state עגלה + localStorage persistence (מפתח "daniel-bakery-cart")
  utils/asset.ts             asset(path) — עוטף import.meta.env.BASE_URL לנתיבי public/
  utils/format.ts            formatPrice, todayIsoDate, isoToDisplayDate (DD/MM/YYYY)
  utils/whatsapp.ts          buildWhatsappUrl — בונה את הודעת ה-wa.me
  utils/scrollCrossfade.ts   מתמטיקת crossfade+Ken Burns (CinematicHero) + clamp01
  utils/framePreloader.ts    טעינה מוקדמת + decode של רצף פריימים לקנבס + מונה התקדמות (CroissantScrollSequence)
  components/icons.tsx       כל אייקוני ה-SVG המשותפים (כולל Instagram/Facebook)
  components/layout/         Header, MobileMenu, Footer, FloatingWhatsAppButton
  components/home/           סדר בדף הבית: CroissantScrollSequence (+LoadingScreen) → CategoryShowcase →
                             ProductsSection ×2 → AboutPreview (מסגרת עגולה) → QuoteSection → Gallery →
                             CinematicHero (דסקטופ) / CookieStoryMobile (טלפון), שניהם מסתיימים ב-LastBite
  components/product/        ProductCard, ProductGrid
  components/cart/           CartDrawer (שני שלבים: cart → form), CartLineItem, OrderForm
  components/ScrollToTop.tsx  מאפס גלילה ל-(0,0) בכל שינוי route
  hooks/useIsDesktop.ts       matchMedia('(min-width: 900px)')
  pages/                     HomePage, ProductsPage (טאבים + חיפוש ב-query params), AboutPage
```

## נקודות חשובות / gotchas

- **תמונות ציבוריות:** תמיד לגשת אליהן דרך `asset('images/...')` (לא נתיב מוחלט
  עם `/`), כדי שיעבדו תחת `base: './'` בכל תת-נתיב.
- **CSS Modules + מחלקות גלובליות:** כדי לעצב מחלקה גלובלית (כמו `.btn-primary`)
  מתוך קובץ `*.module.css`, חובה `:global(.btn-primary)` — אחרת CSS Modules
  יעטוף אותה בהאש ולא תתאים לרכיב בפועל.
- **סגירת עגלה בניווט:** `CartDrawer` מאזין ל-`useLocation()` וסוגר את עצמו
  אוטומטית בכל שינוי route, כדי שלא יישאר פתוח מעל עמוד חדש אחרי ניווט.
- **`addItem` לא פותח את העגלה אוטומטית** (הוסר בכוונה) — פתיחה רק דרך אייקון
  העגלה בהדר או כפתור הוואטסאפ הצף, כדי לא לחסום הוספת מוצרים נוספים מהגריד.
- **תאריך בטופס ההזמנה:** input מסוג `type="date"` (UX נוח/נייטיבי במובייל),
  אך ממיר ל-DD/MM/YYYY רק בהודעת הוואטסאפ הסופית דרך `isoToDisplayDate`.
- **ולידציה בטופס:** הודעות שגיאה בעברית מנוהלות ידנית ב-state (לא הודעות
  ברירת מחדל של הדפדפן, שהיו מופיעות בשפת המערכת ולא בעברית). שגיאה נעלמת
  אוטומטית ברגע שהשדה נערך.
- **נמחקו ב-02/10/2026 (לבקשת המשתמש):** סקשן "הצלילה לעוגה"
  (`CakeZoomCinematic`/`CakeZoomMobile` + `public/images/cake-zoom`), רצועת
  הווידאו (`VideoStrip` + `public/videos`, 7.4MB), `CtaBanner` (הוחלף ב-
  `LastBite` בסוף סיפור העוגייה), ו-`Hero` הסטטי (+`public/images/hero`) -
  הקרואסון הוא הפתיחה בכל המכשירים. נשארים בהיסטוריית git אם יידרשו.
- **תמונות דניאל האמיתיות:** `public/images/daniel/daniel-{portrait,piping,mixing}.jpg`
  — כולן פורטרט (לא landscape!). `daniel-portrait` בעמוד האודות (הירו) **וגם**
  במסגרת העגולה של `AboutPreview` בדף הבית; רצועת `daniel-piping`/
  `daniel-mixing` בעמוד האודות, ושתיהן **גם** בגלריית דף הבית (`Gallery.tsx`,
  מיקומים 1+4 במערך - התאים ה"גבוהים" במוזאיקה). `images/about/about.jpg`
  כבר לא בשימוש בדף הבית.
- **CSS padding shorthand + `.container`:** כל פעם שרכיב מקבל גם `container`
  וגם מחלקת CSS-module משלו על אותו אלמנט (`className={`container ${styles.x}`}`),
  אסור להשתמש ב-shorthand `padding: A B C` / `padding: A B` על אותה מחלקה -
  הערך האמצעי (0 בד"כ) מאפס את ה-padding האופקי ודורס את `.container` (נתקל
  בזה כמה פעמים: Header, Footer, AboutPage). **לכתוב תמיד
  `padding-top`/`padding-bottom` נפרדים** כשרוצים רק ריווח אנכי.
- **CSS specificity ב-media queries עם `:nth-child`:** כלל בסיסי
  `.item { ... }` יש לו specificity **נמוך** מ-`.item:nth-child(4) { ... }`,
  ולכן לא יעקוף אותו גם אם הוא מאוחר יותר בקובץ ובתוך media query. כדי
  לעקוף/לאפס חוקי `:nth-child(N)` ספציפיים ל-breakpoint אחר, להשתמש ב-
  `.item:nth-child(n)` (מתאים לכל הילדים, specificity שווה) ולא ב-`.item`
  לבד. ראה `Gallery.module.css`.
- **`CinematicHero.tsx` (דסקטופ בלבד, `min-width: 900px`; מ-02/10/2026
  הוא הסקשן ה**אחרון** בדף הבית, לא הפתיחה, ומסתיים ב-`LastBite` - "ביס
  אחד / ואתם מכורים." בסגנון "THE LAST BITE" של הרפרנס. בטלפון:
  `CookieStoryMobile` - אותן 6 תמונות כמצגת crossfade + `LastBite`. הטקסט
  ההיסטורי שלהלן על "מחליף את Hero+VideoStrip" כבר לא רלוונטי):** חוויית
  scroll-scrubbing מבוססת **6 תמונות סטילס** (לא וידאו!) שהמשתמש סיפק
  בעצמו - סדרה עקבית ויזואלית (AI-generated, רקע שחור, משטח שיש כהה, תאורה
  חמה זהה) שמספרת סיפור אחד אמיתי ומחובר: קמח+ביצה → קקאו+שוקולד → בתנור →
  עוגייה מוכנה → נפתחת עם שוקולד נוזל (2 זוויות). זה **פתר לגמרי** את בעיית
  ה"סיפור מחובר" שגרסאות קודמות (וידאו stock) לא הצליחו לפתור. קבצים:
  `public/images/cinematic/photo-01.webp` עד `photo-06.webp` (~920KB סה"כ).
  מימוש: 6 `<img>` חופפים (`position:absolute;inset:0`) עם opacity+scale
  (Ken Burns) מחושבים ישירות על ה-DOM (`imgRefs`) בתוך לולאת scroll+rAF -
  **לא canvas, לא frame-sequence-מוידאו** (כך שאין יותר תלות ב-ffmpeg
  לפיצ'ר הזה כלל). 4 "פרקים" לכיתוב (`CHAPTERS`, עם `photoStart`/`photoEnd`
  שמצביעים לטווח באינדקס 6 התמונות), עם eyebrow קבוע ("הסיפור של עוגיית
  דניאל") ומספור פרקים גלוי (01-04) במקום נקודות פשוטות - הכל לפי בקשה
  מפורשת "לתת דגש לסיפור". **מחליף** לגמרי את `Hero`+`VideoStrip` בדסקטופ;
  במובייל שניהם נשארים בדיוק כמו שהיו (`useIsDesktop()`, אפס בקשות רשת
  ל-`cinematic/` במובייל - מאומת). מכבד `prefers-reduced-motion`.
  **gotcha אמיתי שנתקלנו בו:** אלמנט flex עם `align-items` שאינו `stretch`
  ו-`width` לא מפורש (רק `max-width`) מבצע shrink-to-fit לפי ילדים
  בזרימה רגילה בלבד - ילד עם `width:100%` **לא נספר** בחישוב הזה (percentage
  width לא תורם ל-intrinsic sizing של הורה shrink-to-fit), מה שגרם ל-
  `.captionArea` להתכווץ לרוחב ה-eyebrow הקטן בלבד (~146px) במקום 820px,
  וכל הכיתוב "נדחס" לשורות קצרות. התיקון: `width:100%` מפורש בנוסף
  ל-`max-width` על אלמנט flex עם `align-items:center`.
- **לקח מקבצי תמונות של המשתמש:** בעבר הגיעו קבצים עם שמות לא-רציפים
  (`1,2,3,4,6.png` + קובץ UUID) שהסדר החזותי האמיתי שלהם היה שונה מהשמות.
  תמיד לבדוק תוכן חזותי בפועל (contact sheet), לא לסמוך על שם קובץ.
- **`LoadingScreen` (דף הבית בלבד):** מוצג מעל הקרואסון בכניסה הראשונה, עם
  התקדמות טעינת הפריימים (`onProgress` ב-`framePreloader`, סופר גם פריימים
  שנכשלו כדי שלא ייתקע), נעלם בעמעום בסיום או אחרי 6 שניות לכל היותר. דגל
  מודול `framesLoadedOnce` מונע הצגה חוזרת בניווט חוזר לדף הבית. לא מוצג עם
  reduced motion.
- **`CroissantScrollSequence.tsx` (הסקשן הראשון בדף הבית, בכל המכשירים) - גרסת 67 הפריימים
  (02/10/2026):** שוט קולנועי אחד בגלילה לפי תסריט בימוי מפורט של המשתמש. **הפריימים
  הם מקור האמת לתנועת המצלמה** (התקרבות בזמן התפיחה/אפייה, התרחקות לשוט Hero רחב) -
  אין יותר מצלמה וירטואלית, אין BAKE_KEYS, אין החלקה. פריים אחד בכל רגע, בלי crossfade.
  - **מקור:** `Desktop/תמונות דניאל/1.png..67.png` (PNG, 1672×941, 136MB; פריים 35 הוא
    1672×940) - **מחוץ לפרויקט**. עותקי אתר: `public/frames/frame-001..067.webp`
    (1440w, ~7.1MB) + `public/frames/m/` (1024w, ~4.7MB, נטען כש-`innerWidth<=900`).
    מיון מספרי, 16:9 מדויק. 33 הפריימים הישנים (`public/images/croissant`) נמחקו;
    `source-frames/croissant` (הישנים, מקומי בלבד) כבר לא בשימוש.
  - **גלילה:** `FRAME_COUNT=67`, `frameIndex = round(progress*66)`. גובה ב-CSS:
    `200vh + 66 × --px-per-frame` (68px, ו-50px מתחת ל-768px), כלומר 100vh במה +
    66 צעדים + **זנב 100vh** שבו frame-067 מוחזק בזמן שהסקשן הבא (`CategoryShowcase`)
    גולש מעליו (`margin-bottom:-100vh`). ציור רק כשהפריים משתנה (rAF).
  - **ייצוב (`CAMERA_CORRECTION`, 67×[scale,x,y]):** נמדד offline - תנועה בין כל זוג
    פריימים סמוכים (NCC על gradient), מסלול מצלמה מצטבר, החלקה גאוסית (σ=2.2), תיקון
    לכל פריים, חתוך למגבלות המשתמש (scale 1/1.025–1.025, ≤6px). הוריד רעידות RMS
    בערך פי 2. נוסה גם "תיקון קפיצות בלבד" - היה פחות טוב. **שארית ידועה:** פריים 55
    קופץ ~10% zoom-out ובחזרה (תוקן רק עד המגבלה 2.5%), וגם 5–8, 21, 36, 47 תוקנו
    חלקית. `OVERSCAN=1.025` לכל הפריימים כדי שתיקון לא יחשוף קצה.
  - **רעידת חום:** פריימים 19–29 בלבד, דטרמיניסטית (sin), ≤1px/0.7px/0.03°, מעטפת
    easeInOut, אפס מחוץ לטווח. **זוהר כתום:** שכבת DOM (radial, screen), 9→שיא 20–25→35,
    עד 0.12. **vignette** עדינה (0.12–0.22). רקע `#1a100b`.
  - **התאמה:** cover עם object-position 50% 52% (מחשב) / 54% (מובייל). במסך לאורך:
    הקרואסון (`CROISSANT_SPAN=0.56` מרוחב הפריים, הרוחב שלו בפריימים הקרובים)
    נכנס לרוחב המסך - לא נחתך; רצועת התמונה מתמוססת לרקע.
  - **טקסט:** 4 קטעים בחלונות של הרפרנס; קטע הסיום ב-`top:34%` כדי שהכפתור יהיה
    מעל הקרואסון בשוט הרחב.
  - **Debug:** `?debug=1` (למשל `/?debug=1#/`) - פריים, progress, מהירות גלילה,
    נטענו, מידות קנבס. כבוי כברירת מחדל. פריים שנכשל: מוצג הקודם + console.error.
  - gotcha (StrictMode): הניקוי חייב לאפס `rafRef`, אחרת ה-mount השני לא מתזמן tick.
  - סקריפטי המדידה/ייצוא (Node+sharp) היו ב-scratchpad של הסשן, לא בפרויקט.

## איך להריץ

```bash
npm install
npm run dev        # פיתוח, http://localhost:5173
npm run build       # בדיקת build + tsc
npx tsc -b          # type-check בלבד (root tsconfig הוא solution file, אין להריץ tsc --noEmit רגיל)
npx oxlint          # lint
```

## מצב נוכחי

הבנייה הראשונית, רצועת הוידאו, תמונות דניאל האמיתיות (אודות + גלריה), תיקוני
מובייל (תפריט המבורגר, גלילה בניווט, מוזאיקת גלריה), וחוויית ה-scroll-scrubbing
הקולנועית בדסקטופ (`CinematicHero`) — כולם הושלמו, נבדקו חזותית (Playwright
headless, desktop + מובייל 390px), ונדחפו בהצלחה לאתר החי ב-GitHub Pages.
נוספו מאז: אפקט הקרואסון בגלילה (`CroissantScrollSequence`, כויל מול
crussant), ובשלב הבא (02/10/2026) **אימוץ מלא של שפת העיצוב של crussant**
לכל האתר (ראו "שפת עיצוב" למעלה) + סידור מחדש של דף הבית (עוגה ווידאו
נמחקו, העוגייה ירדה לתחתית, נוספו ציטוט ומסך טעינה).

**קרואסון:** הוחלף ב-67 פריימים (במקום ה-80 שתוכננו), ראו הסעיף על `CroissantScrollSequence`.
