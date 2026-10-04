/** Token groups rendered as swatches. Values are read live from CSS, so both themes are shown correctly. */
export const COLOR_GROUPS = [
  {
    title: 'Brand',
    tokens: ['--pp-primary', '--pp-primary-hover', '--pp-primary-subtle', '--pp-primary-text'],
  },
  {
    title: 'Surfaces',
    tokens: ['--pp-bg-page', '--pp-bg-surface', '--pp-bg-surface-alt', '--pp-bg-hover'],
  },
  {
    title: 'Text & borders',
    tokens: ['--pp-text-heading', '--pp-text', '--pp-text-secondary', '--pp-border-strong'],
  },
  {
    title: 'Status',
    tokens: ['--pp-success', '--pp-warning', '--pp-danger', '--pp-info'],
  },
] as const

export const TYPE_SCALE = [
  { name: 'Heading 1', className: 'h1', sample: 'Provider registry', spec: 'Urbanist 40/48 · 700' },
  {
    name: 'Heading 3',
    className: 'h3',
    sample: 'Initial Certification',
    spec: 'Urbanist 24/30 · 700',
  },
  {
    name: 'Heading 5',
    className: 'h5',
    sample: 'Cycle 2 · 2025–2028',
    spec: 'Urbanist 18/24 · 700',
  },
  {
    name: 'Body',
    className: 'body',
    sample: 'Complete all four steps to become a Diplomat.',
    spec: 'Inter 14/22 · 400',
  },
  {
    name: 'Small',
    className: 'small',
    sample: 'Last saved 2 minutes ago',
    spec: 'Inter 12/18 · 400',
  },
  { name: 'Label', className: 'label', sample: 'Completion', spec: 'Inter 12/18 · 600 · caps' },
] as const

export const SPACING = [4, 8, 12, 16, 24, 32, 48, 64] as const
export const RADII = [
  { name: 'sm', token: '--pp-radius-sm' },
  { name: 'md', token: '--pp-radius-md' },
  { name: 'lg', token: '--pp-radius-lg' },
  { name: 'xl', token: '--pp-radius-xl' },
  { name: 'full', token: '--pp-radius-full' },
] as const
export const SHADOWS = ['--pp-shadow-sm', '--pp-shadow-md', '--pp-shadow-lg'] as const
