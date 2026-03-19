"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { adminUser, faculty, students, type AuthUser, type UserRole } from "./data"

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    // Check admin
    if (email === adminUser.email && password === adminUser.password) {
      setUser({ id: adminUser.id, name: adminUser.name, email: adminUser.email, role: "admin" })
      return { success: true }
    }

    // Check faculty
    const fac = faculty.find((f) => f.email === email && f.password === password)
    if (fac) {
      setUser({ id: fac.id, name: fac.name, email: fac.email, role: "faculty" })
      return { success: true }
    }

    // Check student
    const stu = students.find((s) => s.email === email && s.password === password)
    if (stu) {
      setUser({ id: stu.id, name: stu.name, email: stu.email, role: "student" })
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
