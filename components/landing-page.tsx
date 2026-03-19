"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart3, Shield, Bell, ArrowRight } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.65_0.2_145)]">
              <BarChart3 className="h-5 w-5 text-[oklch(0.1_0.02_145)]" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">AttendanceMS</span>
          </div>
          <Button onClick={onGetStarted} className="bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:bg-[oklch(0.6_0.2_145)]">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[oklch(0.65_0.2_145)]"></span>
            CSE Department - 100 Students, 15 Faculty
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Smart Attendance
            <span className="block text-[oklch(0.65_0.2_145)]">Management System</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
            Streamline attendance tracking with real-time analytics, automated warnings,
            and comprehensive reporting for educational institutions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" onClick={onGetStarted} className="bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:bg-[oklch(0.6_0.2_145)] px-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onGetStarted} className="border-border text-foreground hover:bg-secondary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-y border-border bg-card/50 px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-12">
          {[
            { label: "Students", value: "100+", color: "text-[oklch(0.65_0.2_145)]" },
            { label: "Faculty", value: "15", color: "text-[oklch(0.78_0.18_85)]" },
            { label: "Subjects", value: "6", color: "text-[oklch(0.6_0.22_25)]" },
            { label: "Real-time Tracking", value: "24/7", color: "text-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "Student Management", desc: "Track attendance for 100+ enrolled students across semesters", accent: "bg-[oklch(0.65_0.2_145)]/15 text-[oklch(0.65_0.2_145)]" },
            { icon: BarChart3, title: "Analytics", desc: "View detailed attendance reports, trends, and subject-wise stats", accent: "bg-[oklch(0.78_0.18_85)]/15 text-[oklch(0.78_0.18_85)]" },
            { icon: Shield, title: "Secure Access", desc: "Role-based access for Admin, Faculty, and Students", accent: "bg-[oklch(0.6_0.22_25)]/15 text-[oklch(0.6_0.22_25)]" },
            { icon: Bell, title: "Real-time Alerts", desc: "Instant warnings for students below 75% attendance", accent: "bg-foreground/10 text-foreground" },
          ].map((feature) => (
            <Card key={feature.title} className="border-border bg-card hover:bg-secondary/50 transition-colors">
              <CardContent className="pt-6">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${feature.accent}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            Ready to streamline your attendance?
          </h2>
          <p className="mt-4 text-muted-foreground">
            100 students, 15 faculty members, and 6 CSE subjects ready to go.
          </p>
          <Button size="lg" className="mt-8 bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:bg-[oklch(0.6_0.2_145)]" onClick={onGetStarted}>
            Sign In Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-6 py-8 text-center text-sm text-muted-foreground">
        AttendanceMS - Smart Attendance Management System
      </footer>
    </div>
  )
}
