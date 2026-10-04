/** Seeded accounts shown on the login page when VITE_SHOW_DEMO_TOOLS is on. Mirrors services/mock/seed.ts. */
export const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'Admin@123', scenario: 'Admin' },
  { username: 'cand.new', password: 'Pass@123', scenario: 'Candidate · Cycle 1 at 0/4' },
  { username: 'cand.partial', password: 'Pass@123', scenario: 'Candidate · Cycle 1 at 2/4' },
  { username: 'cand.ready', password: 'Pass@123', scenario: 'Candidate · Cycle 1 at 3/4' },
  { username: 'dip.fresh', password: 'Pass@123', scenario: 'Diplomat · Cycle 1 done' },
  { username: 'dip.ontrack', password: 'Pass@123', scenario: 'Diplomat · Cycle 2 at 2/4' },
  { username: 'dip.overdue', password: 'Pass@123', scenario: 'Diplomat · Cycle 2 overdue' },
  { username: 'dip.veteran', password: 'Pass@123', scenario: 'Diplomat · Cycle 4 at 1/4' },
] as const
