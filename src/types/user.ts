export interface User {
  id: string
  username: string
  role: 'admin' | 'technician' | 'farmer'
  name: string
  phone: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UserState {
  token: string | null
  user: User | null
  isLoading: boolean
} 