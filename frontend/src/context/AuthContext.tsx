import { createContext } from 'react'

type AuthContextChildren = {
  accessToken: string | null
  login: (token: string) => void
  signup: (token: string) => void
  logout: () => void
  loading: boolean
} | null

export const AuthContext = createContext<AuthContextChildren | null>(null)
