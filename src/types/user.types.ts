export type UserType = 'admin' | 'candidate' | 'diplomat'

export interface User {
  id: string
  name: string
  /** Unique, stored lowercase. */
  username: string
  /** MOCK ONLY: plain text. Never ship this. */
  password: string
  type: UserType
  /** ISO date the Initial Certification was submitted; null until the user is a diplomat. */
  certifiedAt: string | null
  createdAt: string
  updatedAt: string
}

/** User as returned by the API: never includes the password. */
export type PublicUser = Omit<User, 'password'>
