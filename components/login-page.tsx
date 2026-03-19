"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { BarChart3, ArrowLeft, Shield, GraduationCap, Users } from "lucide-react"

interface LoginPageProps {
  onBack: () => void
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = login(email, password)
    if (!result.success) {
      setError(result.error || "Login failed")
    }
  }

  const fillDemo = (role: "admin" | "faculty" | "student") => {
    switch (role) {
      case "admin":
        setEmail("admin@college.edu")
        setPassword("admin123")
        break
      case "faculty":
        setEmail("rajesh.kumar@college.edu")
        setPassword("faculty123")
        break
      case "student":
        setEmail("aarav.sharma1@student.college.edu")
        setPassword("student123")
        break
    }
    setError("")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.65_0.2_145)]">
          <BarChart3 className="h-5 w-5 text-[oklch(0.1_0.02_145)]" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">AttendanceMS</span>
      </div>

      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Sign in to your account</CardTitle>
          <CardDescription className="text-muted-foreground">Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {error && (
              <p className="text-sm text-[oklch(0.6_0.22_25)]">{error}</p>
            )}

            <Button type="submit" className="w-full bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:bg-[oklch(0.6_0.2_145)]">
              Sign In
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillDemo("admin")}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-3 text-xs text-foreground transition-colors hover:bg-secondary hover:border-[oklch(0.6_0.22_25)]"
              >
                <Shield className="h-4 w-4 text-[oklch(0.6_0.22_25)]" />
                <span className="font-medium">Admin</span>
              </button>
              <button
                onClick={() => fillDemo("faculty")}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-3 text-xs text-foreground transition-colors hover:bg-secondary hover:border-[oklch(0.78_0.18_85)]"
              >
                <Users className="h-4 w-4 text-[oklch(0.78_0.18_85)]" />
                <span className="font-medium">Faculty</span>
              </button>
              <button
                onClick={() => fillDemo("student")}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-3 text-xs text-foreground transition-colors hover:bg-secondary hover:border-[oklch(0.65_0.2_145)]"
              >
                <GraduationCap className="h-4 w-4 text-[oklch(0.65_0.2_145)]" />
                <span className="font-medium">Student</span>
              </button>
            </div>
          </div>

          <button
            onClick={onBack}
            className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Go back home
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
