import type { PublicUser } from '@/types'
import { baseApi } from '../api/baseApi'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', data: body }),
    }),
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', data: body }),
    }),
    getMe: build.query<PublicUser, void>({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['Me'],
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useLogoutMutation } = authApi
