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
6. **פונט:** Assistant (Google Fonts, נטען ב-`index.html`)
7. **מספר וואטסאפ:** `972547887754` — מוגדר במקום אחד בלבד:
   `src/config/siteConfig.ts` (`whatsappNumber`)
8. **לוגו:** אין לוגו גרפי — טיפוגרפיה בלבד ("Daniel Bakery" + "דניאל בייקרי")
9. **Git:** ריפו git מקומי אותחל מתחילת הפרויקט, מחובר ל-
   `https://github.com/tbarak770/Daniel-Bakery`, `git config` המקומי מוגדר עם
   `tbarak80@gmail.com`. **הרשאת קבע מהמשתמש: לבצע `git push` אוטומטית בכל
   שינוי, בלי לשאול קודם** (ניתנה ב-24/09/2026).
10. **אתר חי:** `https://tbarak770.github.io/Daniel-Bakery/` (GitHub Pages,
    `build_type: workflow`, מופעל דרך API)

## פלטת צבעים וטיפוגרפיה — ערכת נושא כהה/יוקרתית (עודכן 01/10/2026)

האתר **כולו** עבר לערכת נושא כהה ("אחיד והומוגני" ברוח `CinematicHero`/
`CakeZoomCinematic`) - לא רק הסקשנים הקולנועיים. כלל מנחה שחשוב לשמר בכל
שינוי עתידי:

- **"Chrome" של האתר** (רקע `body`, `Header`, `MobileMenu`, `Footer`, כל
  הסקשנים הקולנועיים/וידאו, `CtaBanner`, scrim של `CategoryShowcase`,
  `.altBg`) → **כהה** (`--color-ink`/`--color-ink-light`), טקסט
  `--color-cream`/`--color-cream-70`.
- **משטחי "תוכן קנייתי"** (`ProductCard`, `CartDrawer`+`CartLineItem`,
  `OrderForm` inputs, כרטיסי `.value` ב-`AboutPage`, `.tab` ב-`ProductsPage`)
  → **נשארים בהירים בכוונה** (קרם/לבן), כמו "תכשיט על בד כהה" - כדי לשמור
  על קריאות/אמון בקנייה ועקביות עם תמונות המוצרים (רקע ניטרלי/בהיר).
  בתוך המשטחים האלה הטקסט **נשאר** `--color-chocolate`/`--color-chocolate-70`
  כרגיל.

**טוקני CSS** ב-`src/index.css`:
`--color-ink` (#140c08, רקע כהה ראשי - זהה לגוון ה-overlay הכמעט-שחור
שכבר שימש בסקשנים הקולנועיים), `--color-ink-light` (#1f1510, גוון כהה
משני ל"קצב" בין סקשנים), `--color-cream`/`--color-cream-dark` (משטחים
בהירים), `--color-cream-70` (טקסט מעומעם **על רקע כהה**),
`--color-chocolate`/`--color-chocolate-70` (טקסט/גבול **רק בתוך משטחים
בהירים** כעת - לא רקע ראשי יותר), `--color-gold`/`--color-gold-light`
(מבטא/CTA). `color-scheme: dark` גלובלי, אבל `.field input`/`textarea`
ב-`OrderForm.module.css` מקבלים `color-scheme: light` נקודתי (כי הם
משטח בהיר עם native date-picker וכו').

**כפתורים:** `.btn-primary` = זהב/טקסט שוקולד (לא שוקולד/לבן כמו קודם).
`.btn-secondary` = גבול/טקסט קרם (לא שוקולד). פונט `Assistant` בלבד.

**gotcha אמיתי שנתקלנו בו בזמן המעבר:** כל אלמנט טקסט שהסתמך על **ירושת**
צבע ברירת המחדל של `body` (בלי `color` מפורש) בתוך כרטיס/פאנל **בהיר**
(כמו `ProductCard .qty`, `CartLineItem .name`/`.qty`/`.lineTotal`,
`CartDrawer .title`, `OrderForm .summaryItem`/`.summaryTotal`,
`AboutPage .value h3`) - המשיך לרשת את ברירת המחדל החדשה (קרם) אחרי
שהפכה את `body`, מה שהפך אותו לבלתי קריא על רקע בהיר. **תמיד לתת color
מפורש לטקסט בתוך משטח בהיר, לא לסמוך על ירושה מ-`body`.**

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
  utils/scrollCrossfade.ts   מתמטיקת crossfade+Ken Burns משותפת (CinematicHero + CakeZoomCinematic)
  utils/framePreloader.ts    טעינה מוקדמת + decode של רצף פריימים לקנבס (CroissantScrollSequence)
  components/icons.tsx       כל אייקוני ה-SVG המשותפים
  components/layout/         Header, MobileMenu, Footer, FloatingWhatsAppButton
  components/home/           CroissantScrollSequence (ראשון בדף הבית, כל המכשירים), Hero, CinematicHero (דסקטופ בלבד), CakeZoomCinematic/CakeZoomMobile, CategoryShowcase, ProductsSection (Best Sellers + Featured), VideoStrip, AboutPreview, Gallery, CtaBanner
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
- **רצועת הוידאו (`VideoStrip.tsx`):** `public/videos/hero-strip.{mp4,webm}` +
  `hero-strip-poster.jpg` — הורכבו מ-4 קליפים חופשיים מ-Pexels (ganache, עוגיות,
  piping, חיתוך עוגה) עם ffmpeg (xfade + color grade עקבי, ~10 שניות בלופ).
  ffmpeg עצמו **אינו** תלות של הפרויקט — הורד כ-binary נייד חד-פעמי לצורך
  העיבוד בלבד ואינו נדרש ל-build/dev הרגילים. הרכיב טוען את הוידאו רק
  כשמתקרבים אליו בגלילה (IntersectionObserver), לפני כן מוצגת רק תמונת פוסטר.
- **תמונות דניאל האמיתיות:** `public/images/daniel/daniel-{portrait,piping,mixing}.jpg`
  — כולן פורטרט (לא landscape!). `daniel-portrait` בעמוד האודות (הירו) +
  רצועת `daniel-piping`/`daniel-mixing` מתחת. `daniel-mixing`/`daniel-piping`
  **גם** בגלריית דף הבית (`Gallery.tsx`, מיקומים 1+4 במערך - התאים ה"גבוהים"
  במוזאיקה). `AboutPreview.tsx` בדף הבית **עדיין** משתמש בתמונת ה-stock
  הגנרית (`images/about/about.jpg`) ולא הוחלף בכוונה (מחוץ להיקף שאושר).
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
- **`CinematicHero.tsx` (דסקטופ בלבד, `min-width: 900px`):** חוויית
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
- **`CakeZoomCinematic.tsx`/`CakeZoomMobile.tsx` (סקשן קולנועי שני, באמצע
  דף הבית, בין "מוצרים נבחרים" ל"הסיפור שלנו"):** אותו רעיון כמו
  `CinematicHero` אבל **בלי שום טקסט/UI** - חוויה ויזואלית טהורה של "צלילה"
  לתוך עוגת שוקולד (6 תמונות סטילס שהמשתמש סיפק,
  `public/images/cake-zoom/photo-01.webp`...`photo-06.webp`, ~1.1MB).
  בדסקטופ: אותה טכניקת scroll-scrubbing (`wrapper 300vh` + 6 `<img>`
  חופפים + Ken Burns עד 1.10). **במובייל: לא scroll-scrubbing** - סליידשואו
  אוטומטי פשוט (crossfade כל 2.8 שניות, `setInterval`, בלי sticky/גלילה)
  כי scroll-scrub כבד מדי לביצועי מובייל. מתמטיקת ה-crossfade/זום הופקה
  מ-`CinematicHero` לקובץ משותף `src/utils/scrollCrossfade.ts` (שני
  הרכיבים משתמשים בו). gotcha: קבצי המקור מהמשתמש הגיעו עם שמות
  לא-רציפים (`1,2,3,4,6.png` + קובץ UUID) - הסדר החזותי הנכון (לפי תוכן,
  לא שם) היה `1,2,3,4,6.png,UUID.png` - "6.png" היה בפועל הפריים החמישי
  (האור מופיע) וקובץ ה-UUID היה הפריים האחרון/הסיום (העוגה חתוכה). תמיד
  לבדוק תוכן חזותי בפועל, לא לסמוך על שם קובץ.
- **`CroissantScrollSequence.tsx` (הסקשן הראשון בדף הבית, לפני `CinematicHero`/
  `Hero`, בכל המכשירים):** שחזור אפקט הקרואסון של crussant.vercel.app - קרואסון
  שנאפה מבצק נא ל-hero shot זהוב, כשמיקום הגלילה = הפריים (קדימה/אחורה, עוצר
  כשהגלילה עוצרת). **קנבס 2D אחד** (לא `<img>` חופפים, לא וידאו), refs בלבד בלי
  state של React בגלילה, `drawImage` רק כשהפריים משתנה, DPR עד 2,
  `ResizeObserver`. מיפוי: `Math.round` לפריים הקרוב; 5% האחרונים של הגלילה
  נשארים על הפריים האחרון (`HERO_HOLD`). כותרת "הזמן הוא המרכיב הסודי" נכנסת
  בהדרגה מ-84% התקדמות. גובה: 200vh דסקטופ / 180vh עד 1100px / 180vh מובייל
  (~21-30px גלילה לפריים). במסך לאורך: חישוב "hybrid" (לא cover) כך שהקרואסון
  (`FOCAL`) לעולם לא נחתך; רצועת התמונה מתמזגת לרקע בגרדיאנט שמצויר בקנבס.
  **פריימים:** מקור = `source-frames/croissant/1.png..33.png` (1672×941, ~60MB,
  **ב-.gitignore - לא בריפו**, רק מקומית/OneDrive). המשתמש תכנן 40 אבל סיפק 33
  (אמר "יש 34" - בפועל 33 בתיקייה). אם יתווספו פריימים: לעדכן `FRAME_COUNT`
  ולייצא מחדש. עותקי אתר: `public/images/croissant/frame-NN.webp` (1600w,
  ~3.2MB סה"כ) + `m/frame-NN.webp` (1280w, ~2.1MB, נטען כש-`innerWidth<=900`).
  **יישור:** תמונות ה-AI "קפצו" במסגור (1–6 drift קטן לכל פריים, 8–18 zoom-out
  ~16% ו-73px למעלה, 7 ו-19–33 יציבים). נמדד אוטומטית (NCC על gradient של רקע
  סטטי - קיר התנור/מדף, עם מסכה על הקרואסון והאדים) מול פריים 19, ותוקן **רק
  בעותקי ה-WebP** (crop+scale אחד לפריים, חלון משותף 93% מהתמונה), לא ב-CSS.
  סקריפטי Node+sharp שבהם נעשה זה היו ב-scratchpad של הסשן (לא בפרויקט).

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
נוספו מאז: סקשן הצלילה לעוגה, ערכת הנושא הכהה, ואפקט הקרואסון בגלילה
(`CroissantScrollSequence`, נבדק בדסקטופ/טאבלט/מובייל כולל גלילה הפוכה,
resize ו-reduced motion). תוכנית "עיצוב כתום בסגנון crussant לכל האתר" נדונה
ו**בוטלה** - המשתמש רצה רק את אפקט הקרואסון, לא שינוי עיצוב כללי.
