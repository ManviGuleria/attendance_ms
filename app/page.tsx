"use client"

import { useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { LoginPage } from "@/components/login-page"
import { AdminDashboard } from "@/components/admin-dashboard"
import { FacultyDashboard } from "@/components/faculty-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"
import { useState } from "react"

export default function Page() {
  const { user, isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (isAuthenticated && user) {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />
      case "faculty":
        return <FacultyDashboard />
      case "student":
        return <StudentDashboard />
    }
  }

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} />
  }

  return <LandingPage onGetStarted={() => setShowLogin(true)} />
}
