"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  students, faculty, subjects, attendanceRecords, warnings,
  getStudentAttendance, getSubjectAttendance, type Student, type Faculty
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SearchBar } from "@/components/search-bar"
import { Chatbot } from "@/components/chatbot"
import {
  BarChart3, Users, GraduationCap, BookOpen, Bell, LogOut,
  LayoutDashboard, AlertTriangle, Eye, ChevronLeft
} from "lucide-react"

type AdminTab = "dashboard" | "students" | "faculty" | "subjects" | "attendance" | "warnings"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "faculty", label: "Faculty", icon: Users },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: BarChart3 },
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
                setSelectedFaculty(null)
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
            <p className="text-xs text-muted-foreground">Admin - {user?.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground hover:text-[oklch(0.6_0.22_25)] hover:bg-[oklch(0.6_0.22_25)]/10">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === "dashboard" && <AdminOverview />}
        {activeTab === "students" && !selectedStudent && (
          <AdminStudents onSelect={setSelectedStudent} />
        )}
        {activeTab === "students" && selectedStudent && (
          <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
        )}
        {activeTab === "faculty" && !selectedFaculty && (
          <AdminFaculty onSelect={setSelectedFaculty} />
        )}
        {activeTab === "faculty" && selectedFaculty && (
          <FacultyDetail faculty={selectedFaculty} onBack={() => setSelectedFaculty(null)} />
        )}
        {activeTab === "subjects" && <AdminSubjects />}
        {activeTab === "attendance" && <AdminAttendance />}
        {activeTab === "warnings" && <AdminWarnings />}
      </main>
      <Chatbot role="admin" userId={user?.id || "ADM001"} />
    </div>
  )
}

// ============ Dashboard Overview ============
function AdminOverview() {
  const totalRecords = attendanceRecords.length
  const presentCount = attendanceRecords.filter((r) => r.status === "present" || r.status === "late").length
  const overallPercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100) : 0
  const lowAttendanceStudents = students.filter((s) => {
    const att = getStudentAttendance(s.id)
    return att.percentage < 75
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of attendance management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={students.length.toString()} sub="Enrolled in CSE" icon={GraduationCap} accent="emerald" />
        <StatCard title="Total Faculty" value={faculty.length.toString()} sub="Department of CSE" icon={Users} accent="amber" />
        <StatCard title="Subjects" value={subjects.length.toString()} sub="Active courses" icon={BookOpen} accent="default" />
        <StatCard title="Warnings" value={warnings.length.toString()} sub="Low attendance alerts" icon={AlertTriangle} accent="red" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Overall Attendance</CardTitle>
            <CardDescription className="text-muted-foreground">System-wide attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">{overallPercentage.toFixed(1)}%</span>
                <span className="mb-1 text-sm text-muted-foreground">average</span>
              </div>
              <Progress value={overallPercentage} className="h-3" />
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Present</p>
                  <p className="text-lg font-semibold text-[oklch(0.65_0.2_145)]">
                    {attendanceRecords.filter((r) => r.status === "present").length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Late</p>
                  <p className="text-lg font-semibold text-[oklch(0.78_0.18_85)]">
                    {attendanceRecords.filter((r) => r.status === "late").length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Absent</p>
                  <p className="text-lg font-semibold text-[oklch(0.6_0.22_25)]">
                    {attendanceRecords.filter((r) => r.status === "absent").length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Subject-wise Attendance</CardTitle>
            <CardDescription className="text-muted-foreground">Attendance per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {subjects.map((sub) => {
                const att = getSubjectAttendance(sub.id)
                return (
                  <div key={sub.id} className="flex items-center gap-3">
                    <span className="w-32 truncate text-sm text-muted-foreground">{sub.code}</span>
                    <Progress value={att.percentage} className="h-2 flex-1" />
                    <span className="w-12 text-right text-sm font-medium text-foreground">
                      {att.percentage.toFixed(0)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowAttendanceStudents.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Students Below 75% Attendance</CardTitle>
            <CardDescription className="text-muted-foreground">{lowAttendanceStudents.length} students need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {lowAttendanceStudents.slice(0, 10).map((s) => {
                const att = getStudentAttendance(s.id)
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-border font-mono text-xs text-foreground">{s.id}</Badge>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground">Sem {s.semester} / Sec {s.section}</span>
                    </div>
                    <span className="rounded-full bg-[oklch(0.6_0.22_25)]/15 px-2.5 py-0.5 text-xs font-medium text-[oklch(0.6_0.22_25)]">{att.percentage.toFixed(1)}%</span>
                  </div>
                )
              })}
              {lowAttendanceStudents.length > 10 && (
                <p className="text-center text-sm text-muted-foreground">
                  +{lowAttendanceStudents.length - 10} more students
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ============ Students Tab with Search by ID/Name/Email ============
function AdminStudents({ onSelect }: { onSelect: (s: Student) => void }) {
  const [search, setSearch] = useState("")
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase().trim()
      const matchSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.section.toLowerCase() === q ||
        `sem ${s.semester}` === q ||
        `semester ${s.semester}` === q
      const matchSemester = semesterFilter === null || s.semester === semesterFilter
      return matchSearch && matchSemester
    })
  }, [search, semesterFilter])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
        <p className="text-muted-foreground">Search and view all enrolled students by name, ID, email, or phone</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by name, student ID (e.g. STU001), email, or phone..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={semesterFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSemesterFilter(null)}
            className={semesterFilter === null ? "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)]" : "border-border text-foreground hover:bg-secondary"}
          >
            All
          </Button>
          {[3, 4, 5].map((sem) => (
            <Button
              key={sem}
              variant={semesterFilter === sem ? "default" : "outline"}
              size="sm"
              onClick={() => setSemesterFilter(sem)}
              className={semesterFilter === sem ? "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)]" : "border-border text-foreground hover:bg-secondary"}
            >
              Sem {sem}
            </Button>
          ))}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
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
                      <td className="px-4 py-3 text-sm text-muted-foreground">{student.email}</td>
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
            <div className="py-12 text-center text-sm text-muted-foreground">
              No students found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {students.length} students</p>
    </div>
  )
}

// ============ Student Detail ============
function StudentDetail({ student, onBack }: { student: Student; onBack: () => void }) {
  const overall = getStudentAttendance(student.id)
  const studentSubjects = subjects.filter((s) => s.semester === student.semester)

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

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Email", value: student.email },
          { label: "Phone", value: student.phone },
          { label: "CGPA", value: student.cgpa.toString() },
          { label: "Enrollment Year", value: student.enrollmentYear.toString() },
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
          <CardTitle className="text-foreground">Subject-wise Attendance</CardTitle>
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
                      <p className="text-xs text-muted-foreground">{sub.code} | {sub.credits} credits</p>
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
    </div>
  )
}

// ============ Faculty Tab with Search by ID/Name/Email/Designation ============
function AdminFaculty({ onSelect }: { onSelect: (f: Faculty) => void }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return faculty.filter((f) => {
      return !q ||
        f.name.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.phone.includes(q) ||
        f.department.toLowerCase().includes(q)
    })
  }, [search])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Faculty</h1>
        <p className="text-muted-foreground">Search and view all faculty by name, ID, email, designation, or phone</p>
      </div>

      <SearchBar
        placeholder="Search by name, faculty ID (e.g. FAC001), email, designation, or phone..."
        value={search}
        onChange={setSearch}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((fac) => {
          const facSubjects = subjects.filter((s) => fac.subjects.includes(s.id))
          return (
            <Card key={fac.id} className="border-border bg-card hover:border-[oklch(0.65_0.2_145)]/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2 border-border font-mono text-xs text-foreground">{fac.id}</Badge>
                    <h3 className="font-semibold text-foreground">{fac.name}</h3>
                    <p className="text-sm text-[oklch(0.78_0.18_85)]">{fac.designation}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onSelect(fac)} className="text-muted-foreground hover:text-[oklch(0.65_0.2_145)]">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">{fac.email}</p>
                  <p className="text-xs text-muted-foreground">{fac.phone}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {facSubjects.map((s) => (
                    <span key={s.id} className="rounded bg-secondary px-2 py-0.5 text-xs text-foreground">{s.code}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No faculty found matching your search.
        </div>
      )}
      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {faculty.length} faculty</p>
    </div>
  )
}

// ============ Faculty Detail ============
function FacultyDetail({ faculty: fac, onBack }: { faculty: Faculty; onBack: () => void }) {
  const facSubjects = subjects.filter((s) => fac.subjects.includes(s.id))

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Faculty
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{fac.name}</h1>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className="border-border font-mono text-foreground">{fac.id}</Badge>
          <span className="text-sm text-[oklch(0.78_0.18_85)]">{fac.designation}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Email", value: fac.email },
          { label: "Phone", value: fac.phone },
          { label: "Department", value: fac.department },
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
          <CardTitle className="text-foreground">Assigned Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {facSubjects.map((sub) => {
              const att = getSubjectAttendance(sub.id)
              return (
                <div key={sub.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.code} | Semester {sub.semester} | {sub.credits} credits</p>
                    </div>
                    <span className="rounded-full bg-[oklch(0.65_0.2_145)]/15 px-2.5 py-0.5 text-xs font-medium text-[oklch(0.65_0.2_145)]">{att.percentage.toFixed(1)}% avg</span>
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

// ============ Subjects Tab ============
function AdminSubjects() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
        <p className="text-muted-foreground">CSE department subjects and their statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((sub) => {
          const att = getSubjectAttendance(sub.id)
          const assignedFaculty = faculty.filter((f) => f.subjects.includes(sub.id))
          const enrolledStudents = students.filter((s) => s.semester === sub.semester)

          return (
            <Card key={sub.id} className="border-border bg-card">
              <CardHeader className="pb-3">
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
                      <span className="text-muted-foreground">Attendance</span>
                      <span className="font-medium text-foreground">{att.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={att.percentage} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Students: </span>
                      <span className="font-medium text-foreground">{enrolledStudents.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Faculty: </span>
                      <span className="font-medium text-foreground">{assignedFaculty.length}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assignedFaculty.map((f) => (
                      <span key={f.id} className="rounded bg-secondary px-2 py-0.5 text-xs text-foreground">{f.name.split(" ").slice(-1)}</span>
                    ))}
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

// ============ Attendance Tab ============
function AdminAttendance() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  const filteredRecords = useMemo(() => {
    let records = attendanceRecords
    if (selectedSubject) records = records.filter((r) => r.subjectId === selectedSubject)
    records = records.filter((r) => r.date === selectedDate)
    return records
  }, [selectedSubject, selectedDate])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance Records</h1>
        <p className="text-muted-foreground">View attendance records by subject and date</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Subject</label>
          <select
            value={selectedSubject || ""}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Faculty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.slice(0, 50).map((record) => {
                  const student = students.find((s) => s.id === record.studentId)
                  const subject = subjects.find((s) => s.id === record.subjectId)
                  const fac = faculty.find((f) => f.id === record.facultyId)
                  return (
                    <tr key={record.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-border font-mono text-xs text-foreground">{record.studentId}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{student?.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{subject?.code}</td>
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
          {filteredRecords.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No records found for the selected filters.
            </div>
          )}
          {filteredRecords.length > 50 && (
            <div className="border-t border-border py-3 text-center text-sm text-muted-foreground">
              Showing 50 of {filteredRecords.length} records
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ============ Warnings Tab ============
function AdminWarnings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Warnings</h1>
        <p className="text-muted-foreground">Students with attendance below 75%</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Total Warnings" value={warnings.length.toString()} sub="Active alerts" icon={AlertTriangle} accent="red" />
        <StatCard
          title="Students Affected"
          value={new Set(warnings.map((w) => w.studentId)).size.toString()}
          sub="Unique students"
          icon={Users}
          accent="amber"
        />
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Warning ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {warnings.slice(0, 50).map((warning) => {
                  const student = students.find((s) => s.id === warning.studentId)
                  const subject = subjects.find((s) => s.id === warning.subjectId)
                  return (
                    <tr key={warning.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-border font-mono text-xs text-foreground">{warning.id}</Badge>
                      </td>
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
          {warnings.length > 50 && (
            <div className="border-t border-border py-3 text-center text-sm text-muted-foreground">
              Showing 50 of {warnings.length} warnings
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ============ Stat Card Component ============
function StatCard({ title, value, sub, icon: Icon, accent = "default" }: {
  title: string
  value: string
  sub: string
  icon: React.ElementType
  accent?: "emerald" | "red" | "amber" | "default"
}) {
  const accentStyles = {
    emerald: { bg: "bg-[oklch(0.65_0.2_145)]/15", text: "text-[oklch(0.65_0.2_145)]" },
    red: { bg: "bg-[oklch(0.6_0.22_25)]/15", text: "text-[oklch(0.6_0.22_25)]" },
    amber: { bg: "bg-[oklch(0.78_0.18_85)]/15", text: "text-[oklch(0.78_0.18_85)]" },
    default: { bg: "bg-foreground/10", text: "text-foreground" },
  }

  const style = accentStyles[accent]

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${style.bg}`}>
          <Icon className={`h-6 w-6 ${style.text}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}
