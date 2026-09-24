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
9. **Git:** ריפו git מקומי אותחל מתחילת הפרויקט

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
  components/home/           Hero, CategoryShowcase, ProductsSection (Best Sellers + Featured), AboutPreview, Gallery, CtaBanner
  components/product/        ProductCard, ProductGrid
  components/cart/           CartDrawer (שני שלבים: cart → form), CartLineItem, OrderForm
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

## איך להריץ

```bash
npm install
npm run dev        # פיתוח, http://localhost:5173
npm run build       # בדיקת build + tsc
npx tsc -b          # type-check בלבד (root tsconfig הוא solution file, אין להריץ tsc --noEmit רגיל)
npx oxlint          # lint
```

## מצב נוכחי

הבנייה הראשונית הושלמה ואומתה חזותית (Playwright headless, desktop + מובייל
390px) על כל שלושת העמודים, כולל זרימת עגלה מלאה עד יצירת קישור WhatsApp תקין
עם הודעה בעברית. לא בוצע `git commit` ולא נוצר ריפו ב-GitHub עדיין — הצעד הבא
הוא push ראשוני, יצירת ריפו ב-GitHub, והפעלת GitHub Pages (Settings → Pages →
Source: GitHub Actions).
