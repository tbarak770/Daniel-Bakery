import { Link } from 'react-router-dom'
import { asset } from '../utils/asset'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  return (
    <div>
      <div className={`container ${styles.hero}`}>
        <span className="eyebrow">הסיפור שלנו</span>
        <h1>Daniel Bakery | דניאל בייקרי</h1>
        <p>מאחורי כל עוגה, עוגייה וקינוח שיוצאים מהמטבח שלנו עומדת אהבה גדולה לאפייה - ורצון פשוט לשמח אנשים.</p>
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.imageWrap}>
          <img src={asset('images/about/about.jpg')} alt="ידיים אופות בבצק ובקמח" loading="lazy" />
        </div>
        <div className={styles.text}>
          <h2>איך הכל התחיל</h2>
          <p>
            דניאל בייקרי נולד מתוך תשוקה אמיתית לאפייה, שהתחילה בבית המשפחה בין קערות בצק, תבניות אפייה וריח של
            שוקולד נמס. מה שהתחיל כתחביב הפך בהדרגה למשהו רציני יותר: רצון ליצור עוגות, עוגיות וקינוחים ברמה
            בוטיקית, עם תשומת לב לכל פרט.
          </p>
          <p>
            דניאל, בן 11 בלבד, אופה כל מוצר בעצמו בקפידה ובאהבה - ומאמין שאפשר לגלות רצינות, דיוק וטעם מעולה גם
            בגיל צעיר. כל הזמנה נאפית טרייה במיוחד, לפי בקשה, כדי שתקבלו תמיד את הטוב ביותר.
          </p>
          <p>אנחנו שמחים שהגעתם עד כאן, ומקווים שתמצאו כאן משהו שיתאים בדיוק למה שמתחשק לכם.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.values}>
          <div className={styles.value}>
            <h3>איכות ללא פשרות</h3>
            <p>מרכיבים נבחרים ותהליך אפייה קפדני בכל מוצר, מהמתכון ועד להגשה.</p>
          </div>
          <div className={styles.value}>
            <h3>אפייה טרייה</h3>
            <p>כל הזמנה מוכנה במיוחד עבורכם, קרוב ככל האפשר למועד האספקה שביקשתם.</p>
          </div>
          <div className={styles.value}>
            <h3>יחס אישי</h3>
            <p>ההזמנה מתואמת ישירות מולנו בוואטסאפ, כדי שתקבלו בדיוק את מה שרציתם.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <Link to="/products" className="btn btn-primary">
            לכל המוצרים
          </Link>
        </div>
      </div>
    </div>
  )
}
