export interface Session {
  token: string
  userId: string
  loggedInAt: string
}

export interface Settings {
  /** yyyy-MM-dd that replaces "today" in cycle calculations. Mock/demo only. */
  simulatedDate: string | null
}
