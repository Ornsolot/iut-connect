'use client'
import { AuthProvider, useAuth } from '@/components/auth-provider'

export default function Noom() {
  const { user, login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      {user.role}
    </div>
  )
}