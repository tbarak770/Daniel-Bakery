import styles from './LoadingScreen.module.css'

interface Props {
  /** 0-100 */
  progress: number
  hidden: boolean
}

// Branded preloader shown while the croissant frames load (reference .loading-screen).
export default function LoadingScreen({ progress, hidden }: Props) {
  return (
    <div className={`${styles.screen} ${hidden ? styles.hidden : ''}`} aria-hidden={hidden}>
      <div className={styles.box} role="status" aria-live="polite">
        <div className={styles.brand}>Daniel Bakery</div>
        <div className={styles.subtext}>מחממים את התנור…</div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.status}>{progress}%</div>
      </div>
    </div>
  )
}
