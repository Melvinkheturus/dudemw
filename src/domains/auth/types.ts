export interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthError {
  message: string
  field?: string
}
