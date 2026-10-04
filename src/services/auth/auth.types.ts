import type { PublicUser } from '@/types'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: PublicUser
}

export interface RegisterRequest {
  name: string
  username: string
  password: string
}

export interface RegisterResponse {
  user: PublicUser
}
