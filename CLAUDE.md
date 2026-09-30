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

## פלטת צבעים וטיפוגרפיה

מוגדרים כמשתני CSS ב-`src/index.css`:
`--color-cream`, `--color-cream-dark`, `--color-chocolate`, `--color-chocolate-70`,
`--color-gold`, `--color-gold-light`. פונט `Assistant` בלבד.

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
  components/icons.tsx       כל אייקוני ה-SVG המשותפים
  components/layout/         Header, MobileMenu, Footer, FloatingWhatsAppButton
  components/home/           Hero, CinematicHero (דסקטופ בלבד), CategoryShowcase, ProductsSection (Best Sellers + Featured), VideoStrip, AboutPreview, Gallery, CtaBanner
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
headless, desktop + מובייל 390px), ונדחפו בהצלחה לאתר החי ב-GitHub Pages. אין
משימות פתוחות כרגע.
