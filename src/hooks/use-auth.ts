'use client'

import { useCallback, useEffect, useState } from 'react'
// import { trackEvent } from '@/lib/tracking'
import type { User } from '@/types/types'

const AUTH_STORAGE_KEY = 'ecommerce_user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((name: string, email?: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      isLoggedIn: true,
    }
    setUser(newUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
    // trackEvent('LOGIN', { name, email })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    // trackEvent('LOGOUT', {})
  }, [])

  return {
    user,
    isLoading,
    isLoggedIn: user?.isLoggedIn ?? false,
    login,
    logout,
  }
}
