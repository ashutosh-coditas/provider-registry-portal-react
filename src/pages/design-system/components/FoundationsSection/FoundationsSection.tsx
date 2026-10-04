import clsx from 'clsx'
import { ShowcaseBlock, ShowcaseSection } from '../ShowcaseBlock'
import styles from './FoundationsSection.module.scss'
import { COLOR_GROUPS, RADII, SHADOWS, SPACING, TYPE_SCALE } from './FoundationsSection.state'

export const FoundationsSection = () => (
  <ShowcaseSection
    id="foundations"
    title="Foundations"
    description="Tokens in three tiers: primitives (Coditas palette) → semantic (light and dark) → scale. Components only use semantic and scale tokens, so every screen switches theme automatically."
  >
    <ShowcaseBlock title="Color" usage="Semantic tokens. Toggle the theme to see the dark values.">
      <div className={styles.colorGroups}>
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className={styles.colorGroup}>
            <p className={styles.groupTitle}>{group.title}</p>
            {group.tokens.map((token) => (
              <div key={token} className={styles.swatchRow}>
                <span className={styles.swatch} style={{ background: `var(${token})` }} />
                <code className={styles.token}>{token}</code>
              </div>
            ))}
          </div>
        ))}
      </div>
    </ShowcaseBlock>

    <ShowcaseBlock title="Typography" usage="Urbanist for headings, Inter for everything else.">
      <div className={styles.typeList}>
        {TYPE_SCALE.map((item) => (
          <div key={item.name} className={styles.typeRow}>
            <span className={styles.typeMeta}>
              <strong>{item.name}</strong>
              <span>{item.spec}</span>
            </span>
            <span className={clsx(styles.typeSample, styles[item.className])}>{item.sample}</span>
          </div>
        ))}
      </div>
    </ShowcaseBlock>

    <ShowcaseBlock
      title="Spacing, radius, elevation"
      usage="4px grid. Cards use radius xl, controls md, buttons lg."
    >
      <div className={styles.scaleRow}>
        {SPACING.map((size) => (
          <span key={size} className={styles.spaceItem}>
            <span className={styles.spaceBar} style={{ width: size }} />
            <code className={styles.token}>{size}</code>
          </span>
        ))}
      </div>
      <div className={styles.scaleRow}>
        {RADII.map((radius) => (
          <span key={radius.name} className={styles.radiusItem}>
            <span className={styles.radiusBox} style={{ borderRadius: `var(${radius.token})` }} />
            <code className={styles.token}>{radius.name}</code>
          </span>
        ))}
        {SHADOWS.map((shadow) => (
          <span key={shadow} className={styles.radiusItem}>
            <span className={styles.shadowBox} style={{ boxShadow: `var(${shadow})` }} />
            <code className={styles.token}>{shadow.replace('--pp-', '')}</code>
          </span>
        ))}
      </div>
    </ShowcaseBlock>
  </ShowcaseSection>
)
