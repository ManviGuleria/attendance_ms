"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  students, faculty, subjects, attendanceRecords, warnings,
  getStudentAttendance
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Chatbot } from "@/components/chatbot"
import {
  BarChart3, BookOpen, Bell, LogOut,
  LayoutDashboard, Calendar, AlertTriangle, User
} from "lucide-react"

type StudentTab = "dashboard" | "attendance" | "subjects" | "warnings" | "profile"

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<StudentTab>("dashboard")

  const currentStudent = students.find((s) => s.id === user?.id)
  const mySubjects = currentStudent ? subjects.filter((s) => s.semester === currentStudent.semester) : []
  const myWarnings = currentStudent
    ? warnings.filter((w) => w.studentId === currentStudent.id)
    : []

  const tabs: { id: StudentTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "warnings", label: "Warnings", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-[oklch(0.11_0.005_260)]">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.65_0.2_145)]">
            <BarChart3 className="h-4 w-4 text-[oklch(0.1_0.02_145)]" />
          </div>
          <span className="font-bold text-foreground tracking-tight">AttendanceMS</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "warnings" && myWarnings.length > 0 && (
                <span className="ml-auto rounded-full bg-[oklch(0.6_0.22_25)] px-1.5 py-0.5 text-[10px] font-bold text-[oklch(0.95_0.01_25)]">{myWarnings.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 px-3">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Student - {user?.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground hover:text-[oklch(0.6_0.22_25)] hover:bg-[oklch(0.6_0.22_25)]/10">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {!currentStudent ? (
          <div className="py-12 text-center text-muted-foreground">Student data not found.</div>
        ) : (
          <>
            {activeTab === "dashboard" && <StudentOverview student={currentStudent} mySubjects={mySubjects} myWarnings={myWarnings} />}
            {activeTab === "attendance" && <StudentAttendanceView student={currentStudent} mySubjects={mySubjects} />}
            {activeTab === "subjects" && <StudentSubjectsView student={currentStudent} mySubjects={mySubjects} />}
            {activeTab === "warnings" && <StudentWarnings myWarnings={myWarnings} />}
            {activeTab === "profile" && <StudentProfile student={currentStudent} />}
          </>
        )}
      </main>
      <Chatbot role="student" userId={user?.id || ""} />
    </div>
  )
}

// ============ Student Overview ============
function StudentOverview({
  student,
  mySubjects,
  myWarnings,
}: {
  student: typeof students[0]
  mySubjects: typeof subjects
  myWarnings: typeof warnings
}) {
  const overall = getStudentAttendance(student.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {student.name}</h1>
        <p className="text-muted-foreground">Semester {student.semester} | Section {student.section}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.65_0.2_145)]/15">
              <BarChart3 className="h-6 w-6 text-[oklch(0.65_0.2_145)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
              <p className={`text-2xl font-bold ${overall.percentage >= 75 ? "text-[oklch(0.65_0.2_145)]" : "text-[oklch(0.6_0.22_25)]"}`}>
                {overall.percentage.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.78_0.18_85)]/15">
              <BookOpen className="h-6 w-6 text-[oklch(0.78_0.18_85)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-2xl font-bold text-foreground">{mySubjects.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
              <Calendar className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes Attended</p>
              <p className="text-2xl font-bold text-foreground">{overall.present + overall.late}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${myWarnings.length > 0 ? "bg-[oklch(0.6_0.22_25)]/15" : "bg-foreground/10"}`}>
              <AlertTriangle className={`h-6 w-6 ${myWarnings.length > 0 ? "text-[oklch(0.6_0.22_25)]" : "text-foreground"}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className={`text-2xl font-bold ${myWarnings.length > 0 ? "text-[oklch(0.6_0.22_25)]" : "text-foreground"}`}>
                {myWarnings.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Subject-wise Attendance</CardTitle>
          <CardDescription className="text-muted-foreground">Your attendance percentage per subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {mySubjects.map((sub) => {
              const att = getStudentAttendance(student.id, sub.id)
              const assignedFaculty = faculty.filter((f) => f.subjects.includes(sub.id))
              return (
                <div key={sub.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.code} | Faculty: {assignedFaculty.map((f) => f.name).join(", ") || "N/A"}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      att.percentage >= 75
                        ? "bg-[oklch(0.65_0.2_145)]/15 text-[oklch(0.65_0.2_145)]"
                        : "bg-[oklch(0.6_0.22_25)]/15 text-[oklch(0.6_0.22_25)]"
                    }`}>
                      {att.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={att.percentage} className="mt-3 h-2" />
                  <div className="mt-2 flex gap-4">
                    <span className="text-xs text-[oklch(0.65_0.2_145)]">Present: {att.present}</span>
                    <span className="text-xs text-[oklch(0.78_0.18_85)]">Late: {att.late}</span>
                    <span className="text-xs text-[oklch(0.6_0.22_25)]">Absent: {att.absent}</span>
                    <span className="text-xs text-muted-foreground">Total: {att.total}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {myWarnings.length > 0 && (
        <Card className="border-[oklch(0.6_0.22_25)]/30 bg-card">
          <CardHeader>
            <CardTitle className="text-[oklch(0.6_0.22_25)]">Active Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {myWarnings.map((w) => {
                const sub = subjects.find((s) => s.id === w.subjectId)
                return (
                  <div key={w.id} className="flex items-center gap-3 rounded-lg border border-border bg-[oklch(0.6_0.22_25)]/5 p-3">
                    <AlertTriangle className="h-4 w-4 text-[oklch(0.6_0.22_25)]" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{sub?.name}</p>
                      <p className="text-xs text-[oklch(0.6_0.22_25)]">{w.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ============ Student Attendance View ============
function StudentAttendanceView({
  student,
  mySubjects,
}: {
  student: typeof students[0]
  mySubjects: typeof subjects
}) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  const records = useMemo(() => {
    let recs = attendanceRecords.filter((r) => r.studentId === student.id)
    if (selectedSubject !== "all") recs = recs.filter((r) => r.subjectId === selectedSubject)
    return recs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [student.id, selectedSubject])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Attendance</h1>
        <p className="text-muted-foreground">View your detailed attendance records</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Filter by Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-fit rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
        >
          <option value="all">All Subjects</option>
          {mySubjects.map((s) => (
            <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
          ))}
        </select>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Faculty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 60).map((record) => {
                  const subject = subjects.find((s) => s.id === record.subjectId)
                  const fac = faculty.find((f) => f.id === record.facultyId)
                  return (
                    <tr key={record.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{record.date}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{subject?.code} - {subject?.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{fac?.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === "present"
                            ? "bg-[oklch(0.65_0.2_145)]/15 text-[oklch(0.65_0.2_145)]"
                            : record.status === "late"
                            ? "bg-[oklch(0.78_0.18_85)]/15 text-[oklch(0.78_0.18_85)]"
                            : "bg-[oklch(0.6_0.22_25)]/15 text-[oklch(0.6_0.22_25)]"
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {records.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No attendance records found.</div>
          )}
          {records.length > 60 && (
            <div className="border-t border-border py-3 text-center text-sm text-muted-foreground">
              Showing 60 of {records.length} records
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ============ Student Subjects View ============
function StudentSubjectsView({
  student,
  mySubjects,
}: {
  student: typeof students[0]
  mySubjects: typeof subjects
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Subjects</h1>
        <p className="text-muted-foreground">Semester {student.semester} CSE subjects</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mySubjects.map((sub) => {
          const att = getStudentAttendance(student.id, sub.id)
          const assignedFaculty = faculty.filter((f) => f.subjects.includes(sub.id))

          return (
            <Card key={sub.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-border font-mono text-xs text-foreground">{sub.id}</Badge>
                  <span className="rounded bg-[oklch(0.65_0.2_145)]/15 px-2 py-0.5 text-xs font-medium text-[oklch(0.65_0.2_145)]">{sub.code}</span>
                </div>
                <CardTitle className="mt-2 text-foreground">{sub.name}</CardTitle>
                <CardDescription className="text-muted-foreground">Semester {sub.semester} | {sub.credits} credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">My Attendance</span>
                      <span className={`font-medium ${att.percentage >= 75 ? "text-[oklch(0.65_0.2_145)]" : "text-[oklch(0.6_0.22_25)]"}`}>
                        {att.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={att.percentage} className="h-2" />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">Present</p>
                      <p className="font-semibold text-[oklch(0.65_0.2_145)]">{att.present}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Late</p>
                      <p className="font-semibold text-[oklch(0.78_0.18_85)]">{att.late}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Absent</p>
                      <p className="font-semibold text-[oklch(0.6_0.22_25)]">{att.absent}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold text-foreground">{att.total}</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">Faculty</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {assignedFaculty.map((f) => (
                        <span key={f.id} className="rounded bg-secondary px-2 py-0.5 text-xs text-foreground">{f.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ============ Student Warnings ============
function StudentWarnings({ myWarnings }: { myWarnings: typeof warnings }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Warnings</h1>
        <p className="text-muted-foreground">Attendance warnings and alerts</p>
      </div>

      {myWarnings.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.65_0.2_145)]/15">
              <AlertTriangle className="h-8 w-8 text-[oklch(0.65_0.2_145)]" />
            </div>
            <p className="text-lg font-medium text-foreground">No Warnings</p>
            <p className="text-sm text-muted-foreground">Your attendance is adequate across all subjects.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {myWarnings.map((w) => {
            const sub = subjects.find((s) => s.id === w.subjectId)
            return (
              <Card key={w.id} className="border-border bg-card">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.6_0.22_25)]/15">
                    <AlertTriangle className="h-5 w-5 text-[oklch(0.6_0.22_25)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{sub?.name}</h3>
                      <Badge variant="outline" className="border-border text-xs text-muted-foreground">{w.date}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-[oklch(0.6_0.22_25)]">{w.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Please improve your attendance to avoid academic penalties. Minimum required: 75%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============ Student Profile ============
function StudentProfile({ student }: { student: typeof students[0] }) {
  const overall = getStudentAttendance(student.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Your personal and academic information</p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[oklch(0.65_0.2_145)]/15">
              <span className="text-2xl font-bold text-[oklch(0.65_0.2_145)]">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
              <Badge variant="outline" className="mt-1 border-border font-mono text-foreground">{student.id}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { label: "Email", value: student.email },
                { label: "Phone", value: student.phone },
                { label: "Enrollment Year", value: student.enrollmentYear.toString() },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Academic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { label: "Department", value: "Computer Science & Engineering" },
                { label: "Semester", value: student.semester.toString() },
                { label: "Section", value: student.section },
                { label: "CGPA", value: student.cgpa.toString() },
                { label: "Overall Attendance", value: `${overall.percentage.toFixed(1)}%` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
