import { LinkButton } from '@/components/ui/LinkButton'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ControlsSection } from '../components/ControlsSection'
import { DisplaySection } from '../components/DisplaySection'
import { FoundationsSection } from '../components/FoundationsSection'
import { OverlaySection } from '../components/OverlaySection'
import styles from './DesignSystem.module.scss'
import { SECTIONS, useDesignSystemState } from './DesignSystem.state'

/** Living reference of tokens and components (demo builds only). */
export const DesignSystemPage = () => {
  const { backTo, backLabel } = useDesignSystemState()

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <Logo />
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.label}>Design System</span>
        </div>
        <div className={styles.actions}>
          <ThemeToggle />
          <LinkButton to={backTo} variant="secondary" size="sm" leftIcon="arrowLeft">
            {backLabel}
          </LinkButton>
        </div>
      </header>

      <div className={styles.body}>
        <nav className={styles.nav} aria-label="Design system sections">
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={styles.navLink}>
              {section.label}
            </a>
          ))}
        </nav>

        <main className={styles.content}>
          <div className={styles.intro}>
            <h1 className={styles.title}>Provider Portal Design System</h1>
            <p className={styles.lede}>
              Coditas palette, Urbanist and Inter type, and the components every screen of the
              portal is built from. Everything here is live. Switch the theme to check dark mode.
            </p>
          </div>
          <FoundationsSection />
          <ControlsSection />
          <DisplaySection />
          <OverlaySection />
        </main>
      </div>
    </div>
  )
}
