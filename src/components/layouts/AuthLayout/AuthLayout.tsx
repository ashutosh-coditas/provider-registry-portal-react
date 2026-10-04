import { Outlet } from 'react-router'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import styles from './AuthLayout.module.scss'

const HIGHLIGHTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'certificate', title: '4-step certification', text: '20 questions, saved as you go.' },
  {
    icon: 'calendar',
    title: '3-year cycles',
    text: 'Cycle 1 is your Initial Certification; recertify every cycle after.',
  },
  {
    icon: 'shield',
    title: 'One registry',
    text: 'Your credentials, licenses and CME in one place.',
  },
]

/** Login and Register: brand panel on wide screens, form card on the right. */
export const AuthLayout = () => (
  <div className={styles.layout}>
    <aside className={styles.brandPanel}>
      <Logo tone="inverse" />
      <div className={styles.pitch}>
        <h2 className={styles.headline}>The registry for board-certified providers</h2>
        <ul className={styles.highlights}>
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className={styles.highlight}>
              <span className={styles.highlightIcon}>
                <Icon name={item.icon} size={20} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <span className={styles.highlightText}>{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.footnote}>Demo build · data is stored in this browser only</p>
    </aside>

    <main className={styles.formSide}>
      <div className={styles.topRow}>
        <Logo className={styles.mobileLogo} />
        <ThemeToggle />
      </div>
      <div className={styles.card}>
        <Outlet />
      </div>
    </main>
  </div>
)
