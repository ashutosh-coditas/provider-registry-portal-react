import { z } from 'zod'

/** Reusable zod field schemas. Rules come from CONTEXT.md §7.2. */

export const nameField = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters')
  .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Use letters, spaces, . ' and - only")

export const usernameField = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-z][a-z0-9._]*$/, 'Start with a letter; use lowercase letters, digits, . and _ only')

export const PASSWORD_RULES = [
  { label: '8–64 characters', test: (value: string) => value.length >= 8 && value.length <= 64 },
  { label: 'An uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'A lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'A digit', test: (value: string) => /\d/.test(value) },
  { label: 'A special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const

export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[A-Z]/, 'Password needs an uppercase letter')
  .regex(/[a-z]/, 'Password needs a lowercase letter')
  .regex(/\d/, 'Password needs a digit')
  .regex(/[^A-Za-z0-9]/, 'Password needs a special character')
