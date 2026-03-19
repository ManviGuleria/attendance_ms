"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  students, faculty, subjects, attendanceRecords, warnings,
  getStudentAttendance, getSubjectAttendance, getFacultyStudents, type Student
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SearchBar } from "@/components/search-bar"
import { Chatbot } from "@/components/chatbot"
import {
  BarChart3, Users, BookOpen, Bell, LogOut,
  LayoutDashboard, Eye, ChevronLeft, ClipboardCheck, AlertTriangle
} from "lucide-react"

type FacultyTab = "dashboard" | "my-subjects" | "students" | "mark-attendance" | "warnings"

export function FacultyDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<FacultyTab>("dashboard")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const currentFaculty = faculty.find((f) => f.id === user?.id)
  const mySubjects = currentFaculty ? subjects.filter((s) => currentFaculty.subjects.includes(s.id)) : []
  const myStudents = currentFaculty ? getFacultyStudents(currentFaculty.id) : []

  const tabs: { id: FacultyTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-subjects", label: "My Subjects", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "mark-attendance", label: "Mark Attendance", icon: ClipboardCheck },
    { id: "warnings", label: "Warnings", icon: Bell },
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
              onClick={() => {
                setActiveTab(tab.id)
                setSelectedStudent(null)
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 px-3">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Faculty - {user?.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground hover:text-[oklch(0.6_0.22_25)] hover:bg-[oklch(0.6_0.22_25)]/10">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === "dashboard" && <FacultyOverview mySubjects={mySubjects} myStudents={myStudents} currentFaculty={currentFaculty} />}
        {activeTab === "my-subjects" && <FacultySubjects mySubjects={mySubjects} />}
        {activeTab === "students" && !selectedStudent && (
          <FacultyStudents myStudents={myStudents} onSelect={setSelectedStudent} />
        )}
        {activeTab === "students" && selectedStudent && (
          <FacultyStudentDetail student={selectedStudent} mySubjects={mySubjects} onBack={() => setSelectedStudent(null)} />
        )}
        {activeTab === "mark-attendance" && <MarkAttendance mySubjects={mySubjects} myStudents={myStudents} currentFaculty={currentFaculty} />}
        {activeTab === "warnings" && <FacultyWarnings mySubjects={mySubjects} />}
      </main>
      <Chatbot role="faculty" userId={user?.id || ""} />
    </div>
  )
}

// ============ Faculty Overview ============
function FacultyOverview({
  mySubjects,
  myStudents,
  currentFaculty,
}: {
  mySubjects: typeof subjects
  myStudents: typeof students
  currentFaculty: typeof faculty[0] | undefined
}) {
  const myWarnings = warnings.filter((w) => mySubjects.some((s) => s.id === w.subjectId))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentFaculty?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.65_0.2_145)]/15">
              <BookOpen className="h-6 w-6 text-[oklch(0.65_0.2_145)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">My Subjects</p>
              <p className="text-2xl font-bold text-foreground">{mySubjects.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.78_0.18_85)]/15">
              <Users className="h-6 w-6 text-[oklch(0.78_0.18_85)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">My Students</p>
              <p className="text-2xl font-bold text-foreground">{myStudents.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
              <BarChart3 className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Designation</p>
              <p className="text-lg font-bold text-foreground">{currentFaculty?.designation}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.6_0.22_25)]/15">
              <AlertTriangle className="h-6 w-6 text-[oklch(0.6_0.22_25)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-foreground">{myWarnings.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">My Subject Performance</CardTitle>
          <CardDescription className="text-muted-foreground">Attendance rate per subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {mySubjects.map((sub) => {
              const att = getSubjectAttendance(sub.id)
              const enrolledStudents = students.filter((s) => s.semester === sub.semester)
              return (
                <div key={sub.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.code} | Sem {sub.semester} | {enrolledStudents.length} students</p>
                    </div>
                    <span className="rounded-full bg-[oklch(0.65_0.2_145)]/15 px-2.5 py-0.5 text-xs font-medium text-[oklch(0.65_0.2_145)]">{att.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={att.percentage} className="mt-3 h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============ Faculty Subjects ============
function FacultySubjects({ mySubjects }: { mySubjects: typeof subjects }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Subjects</h1>
        <p className="text-muted-foreground">Subjects assigned to you</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mySubjects.map((sub) => {
          const att = getSubjectAttendance(sub.id)
          const enrolledStudents = students.filter((s) => s.semester === sub.semester)

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
                      <span className="text-muted-foreground">Attendance Rate</span>
                      <span className="font-medium text-foreground">{att.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={att.percentage} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Enrolled</p>
                      <p className="font-semibold text-foreground">{enrolledStudents.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Present</p>
                      <p className="font-semibold text-[oklch(0.65_0.2_145)]">{att.present}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Absent</p>
                      <p className="font-semibold text-[oklch(0.6_0.22_25)]">{att.absent}</p>
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

// ============ Faculty Students with Search by Student ID ============
function FacultyStudents({
  myStudents,
  onSelect,
}: {
  myStudents: typeof students
  onSelect: (s: Student) => void
}) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return myStudents.filter((s) =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.section.toLowerCase() === q
    )
  }, [search, myStudents])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Students</h1>
        <p className="text-muted-foreground">Search students by name, student ID (e.g. STU001), email, or phone</p>
      </div>

      <SearchBar
        placeholder="Search by student ID (e.g. STU001), name, email, or phone..."
        value={search}
        onChange={setSearch}
      />

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Semester</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Attendance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const att = getStudentAttendance(student.id)
                  return (
                    <tr key={student.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-border font-mono text-xs text-foreground">{student.id}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{student.semester}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{student.section}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={att.percentage} className="h-2 w-20" />
                          <span className={`text-xs font-medium ${att.percentage < 75 ? "text-[oklch(0.6_0.22_25)]" : "text-[oklch(0.65_0.2_145)]"}`}>
                            {att.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => onSelect(student)} className="text-muted-foreground hover:text-[oklch(0.65_0.2_145)]">
                          <Eye className="mr-1 h-3 w-3" /> View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No students found matching your search.</div>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {myStudents.length} students</p>
    </div>
  )
}

// ============ Faculty Student Detail ============
function FacultyStudentDetail({
  student,
  mySubjects,
  onBack,
}: {
  student: Student
  mySubjects: typeof subjects
  onBack: () => void
}) {
  const overall = getStudentAttendance(student.id)
  const studentSubjects = mySubjects.filter((s) => s.semester === student.semester)

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Students
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="border-border font-mono text-foreground">{student.id}</Badge>
            <span className="text-sm text-muted-foreground">Semester {student.semester} | Section {student.section}</span>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          overall.percentage >= 75
            ? "bg-[oklch(0.65_0.2_145)]/15 text-[oklch(0.65_0.2_145)]"
            : "bg-[oklch(0.6_0.22_25)]/15 text-[oklch(0.6_0.22_25)]"
        }`}>
          {overall.percentage.toFixed(1)}% Overall
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Email", value: student.email },
          { label: "Phone", value: student.phone },
          { label: "CGPA", value: student.cgpa.toString() },
        ].map((item) => (
          <Card key={item.label} className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Attendance in My Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {studentSubjects.map((sub) => {
              const att = getStudentAttendance(student.id, sub.id)
              return (
                <div key={sub.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.code}</p>
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
                  </div>
                </div>
              )
            })}
            {studentSubjects.length === 0 && (
              <p className="text-sm text-muted-foreground">This student is not enrolled in any of your subjects.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============ Mark Attendance ============
function MarkAttendance({
  mySubjects,
  myStudents,
  currentFaculty,
}: {
  mySubjects: typeof subjects
  myStudents: typeof students
  currentFaculty: typeof faculty[0] | undefined
}) {
  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || "")
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({})
  const [saved, setSaved] = useState(false)

  const subjectStudents = useMemo(() => {
    const sub = subjects.find((s) => s.id === selectedSubject)
    if (!sub) return []
    return myStudents.filter((s) => s.semester === sub.semester)
  }, [selectedSubject, myStudents])

  const handleMark = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
    setSaved(false)
  }

  const handleMarkAll = (status: "present" | "absent" | "late") => {
    const newAtt: Record<string, "present" | "absent" | "late"> = {}
    subjectStudents.forEach((s) => { newAtt[s.id] = status })
    setAttendance(newAtt)
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
        <p className="text-muted-foreground">Mark attendance for today's classes</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value)
              setAttendance({})
              setSaved(false)
            }}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
          >
            {mySubjects.map((s) => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date</label>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleMarkAll("present")} className="border-border text-foreground hover:bg-[oklch(0.65_0.2_145)]/15 hover:text-[oklch(0.65_0.2_145)]">
            Mark All Present
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMarkAll("absent")} className="border-border text-foreground hover:bg-[oklch(0.6_0.22_25)]/15 hover:text-[oklch(0.6_0.22_25)]">
            Mark All Absent
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjectStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-border font-mono text-xs text-foreground">{student.id}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{student.section}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(["present", "late", "absent"] as const).map((status) => (
                          <Button
                            key={status}
                            variant="outline"
                            size="sm"
                            className={`text-xs border-border ${
                              attendance[student.id] === status
                                ? status === "present"
                                  ? "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] border-[oklch(0.65_0.2_145)]"
                                  : status === "late"
                                  ? "bg-[oklch(0.78_0.18_85)] text-[oklch(0.15_0.02_85)] border-[oklch(0.78_0.18_85)]"
                                  : "bg-[oklch(0.6_0.22_25)] text-[oklch(0.95_0.01_25)] border-[oklch(0.6_0.22_25)]"
                                : "text-foreground hover:bg-secondary"
                            }`}
                            onClick={() => handleMark(student.id, status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={Object.keys(attendance).length === 0} className="bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:bg-[oklch(0.6_0.2_145)]">
          Save Attendance
        </Button>
        {saved && <span className="text-sm text-[oklch(0.65_0.2_145)]">Attendance saved successfully!</span>}
      </div>
    </div>
  )
}

// ============ Faculty Warnings ============
function FacultyWarnings({ mySubjects }: { mySubjects: typeof subjects }) {
  const myWarnings = warnings.filter((w) => mySubjects.some((s) => s.id === w.subjectId))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Warnings</h1>
        <p className="text-muted-foreground">Students with low attendance in your subjects</p>
      </div>

      {myWarnings.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No warnings for your subjects. All students have adequate attendance.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Warning</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myWarnings.map((warning) => {
                    const student = students.find((s) => s.id === warning.studentId)
                    const subject = subjects.find((s) => s.id === warning.subjectId)
                    return (
                      <tr key={warning.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{student?.name}</p>
                            <p className="text-xs text-muted-foreground">{warning.studentId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{subject?.code}</td>
                        <td className="px-4 py-3 text-sm text-[oklch(0.6_0.22_25)]">{warning.message}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{warning.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
