import styles from './QuoteSection.module.css'

// Editorial quote, styled after the reference's quote section.
export default function QuoteSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <blockquote className={styles.quote}>
          ״הכי כיף לי כשמישהו טועם משהו שאפיתי ומחייך. בשביל הרגע הזה אני
          מחכה ליד התנור.״
        </blockquote>
        <cite className={styles.author}>— דניאל, האופה של דניאל בייקרי</cite>
      </div>
    </section>
  )
}
