"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  MessageCircle, X, Send, Bot, User, ChevronDown
} from "lucide-react"
import {
  students, faculty, subjects, warnings,
  getStudentAttendance, getSubjectAttendance, getFacultyStudents
} from "@/lib/data"
import type { UserRole } from "@/lib/data"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface QuickAction {
  label: string
  query: string
}

function getQuickActions(role: UserRole): QuickAction[] {
  switch (role) {
    case "admin":
      return [
        { label: "Total students?", query: "How many students are enrolled?" },
        { label: "Low attendance?", query: "Show students with low attendance" },
        { label: "Subject stats", query: "Show subject-wise attendance" },
        { label: "Faculty count", query: "How many faculty members?" },
        { label: "Total warnings", query: "How many warnings are active?" },
        { label: "Help", query: "What can you help me with?" },
      ]
    case "faculty":
      return [
        { label: "My subjects", query: "What subjects do I teach?" },
        { label: "My students", query: "How many students are assigned to me?" },
        { label: "Low attendance", query: "Show students with low attendance in my subjects" },
        { label: "Subject stats", query: "Show my subject attendance stats" },
        { label: "Help", query: "What can you help me with?" },
      ]
    case "student":
      return [
        { label: "My attendance", query: "What is my overall attendance?" },
        { label: "My subjects", query: "What subjects am I enrolled in?" },
        { label: "My warnings", query: "Do I have any warnings?" },
        { label: "Minimum required?", query: "What is the minimum attendance required?" },
        { label: "Help", query: "What can you help me with?" },
      ]
  }
}

function generateBotResponse(query: string, role: UserRole, userId: string): string {
  const q = query.toLowerCase().trim()

  // General help
  if (q.includes("help") || q.includes("what can you")) {
    switch (role) {
      case "admin":
        return "I can help you with:\n- Student enrollment counts and details\n- Faculty information\n- Subject-wise attendance statistics\n- Warnings and low attendance reports\n- General system information\n\nTry asking about student counts, faculty details, subject stats, or attendance warnings."
      case "faculty":
        return "I can help you with:\n- Your assigned subjects\n- Student counts and attendance in your subjects\n- Warnings for students in your subjects\n- General attendance information\n\nTry asking about your subjects, students, or attendance stats."
      case "student":
        return "I can help you with:\n- Your overall and subject-wise attendance\n- Your enrolled subjects and faculty\n- Active warnings\n- Attendance policies and requirements\n\nTry asking about your attendance, subjects, or warnings."
    }
  }

  // Greetings
  if (q.includes("hello") || q.includes("hi") || q === "hey" || q.includes("good morning") || q.includes("good afternoon")) {
    return "Hello! Welcome to AttendanceMS Assistant. How can I help you today? You can ask me about attendance, students, subjects, or warnings."
  }

  // Thank you
  if (q.includes("thank") || q.includes("thanks")) {
    return "You're welcome! Feel free to ask if you need anything else."
  }

  // ---- Admin responses ----
  if (role === "admin") {
    // Student count
    if (q.includes("how many students") || q.includes("total students") || q.includes("student count") || q.includes("enrolled")) {
      const sem3 = students.filter(s => s.semester === 3).length
      const sem4 = students.filter(s => s.semester === 4).length
      const sem5 = students.filter(s => s.semester === 5).length
      return `There are ${students.length} students enrolled in the CSE department.\n\nBreakdown by semester:\n- Semester 3: ${sem3} students\n- Semester 4: ${sem4} students\n- Semester 5: ${sem5} students`
    }

    // Faculty count
    if (q.includes("how many faculty") || q.includes("total faculty") || q.includes("faculty count") || q.includes("faculty member")) {
      const profs = faculty.filter(f => f.designation === "Professor").length
      const assoc = faculty.filter(f => f.designation === "Associate Professor").length
      const asst = faculty.filter(f => f.designation === "Assistant Professor").length
      return `There are ${faculty.length} faculty members in the CSE department.\n\nBy designation:\n- Professors: ${profs}\n- Associate Professors: ${assoc}\n- Assistant Professors: ${asst}`
    }

    // Warnings
    if (q.includes("warning") || q.includes("alert")) {
      const uniqueStudents = new Set(warnings.map(w => w.studentId)).size
      return `There are ${warnings.length} active warnings across ${uniqueStudents} students. These warnings are for students whose attendance has fallen below 75% in one or more subjects. You can view details in the Warnings tab.`
    }

    // Low attendance
    if (q.includes("low attendance") || q.includes("below 75") || q.includes("poor attendance")) {
      const lowStudents = students.filter(s => {
        const att = getStudentAttendance(s.id)
        return att.percentage < 75
      })
      if (lowStudents.length === 0) return "All students currently have attendance above 75%."
      const top5 = lowStudents.slice(0, 5).map(s => {
        const att = getStudentAttendance(s.id)
        return `- ${s.name} (${s.id}): ${att.percentage.toFixed(1)}%`
      }).join("\n")
      return `${lowStudents.length} students have attendance below 75%.\n\nLowest attendance:\n${top5}${lowStudents.length > 5 ? `\n...and ${lowStudents.length - 5} more` : ""}`
    }

    // Subject stats
    if (q.includes("subject") && (q.includes("stat") || q.includes("attendance") || q.includes("wise"))) {
      const stats = subjects.map(sub => {
        const att = getSubjectAttendance(sub.id)
        return `- ${sub.code} ${sub.name}: ${att.percentage.toFixed(1)}%`
      }).join("\n")
      return `Subject-wise attendance rates:\n\n${stats}`
    }

    // Find specific student
    const stuMatch = q.match(/stu\d{3}/i)
    if (stuMatch) {
      const sid = stuMatch[0].toUpperCase()
      const stu = students.find(s => s.id === sid)
      if (stu) {
        const att = getStudentAttendance(stu.id)
        return `Student: ${stu.name}\nID: ${stu.id}\nSemester: ${stu.semester} | Section: ${stu.section}\nEmail: ${stu.email}\nCGPA: ${stu.cgpa}\nOverall Attendance: ${att.percentage.toFixed(1)}%\nPresent: ${att.present} | Late: ${att.late} | Absent: ${att.absent}`
      }
      return `No student found with ID ${sid}.`
    }

    // Find specific faculty
    const facMatch = q.match(/fac\d{3}/i)
    if (facMatch) {
      const fid = facMatch[0].toUpperCase()
      const fac = faculty.find(f => f.id === fid)
      if (fac) {
        const facSubs = subjects.filter(s => fac.subjects.includes(s.id))
        return `Faculty: ${fac.name}\nID: ${fac.id}\nDesignation: ${fac.designation}\nEmail: ${fac.email}\nSubjects: ${facSubs.map(s => s.code).join(", ")}`
      }
      return `No faculty found with ID ${fid}.`
    }

    // Subjects info
    if (q.includes("subject") || q.includes("course")) {
      return `There are ${subjects.length} CSE subjects:\n\n${subjects.map(s => `- ${s.code}: ${s.name} (Sem ${s.semester}, ${s.credits} credits)`).join("\n")}`
    }
  }

  // ---- Faculty responses ----
  if (role === "faculty") {
    const currentFaculty = faculty.find(f => f.id === userId)
    const mySubjects = currentFaculty ? subjects.filter(s => currentFaculty.subjects.includes(s.id)) : []
    const myStudents = currentFaculty ? getFacultyStudents(currentFaculty.id) : []

    if (q.includes("my subject") || q.includes("what subject") || q.includes("teach")) {
      if (mySubjects.length === 0) return "You don't have any subjects assigned currently."
      return `You teach ${mySubjects.length} subject(s):\n\n${mySubjects.map(s => {
        const att = getSubjectAttendance(s.id)
        return `- ${s.code}: ${s.name} (Sem ${s.semester}) - ${att.percentage.toFixed(1)}% attendance`
      }).join("\n")}`
    }

    if (q.includes("my student") || q.includes("how many student") || q.includes("assigned")) {
      return `You have ${myStudents.length} students enrolled across your subjects in semesters ${[...new Set(mySubjects.map(s => s.semester))].join(", ")}.`
    }

    if (q.includes("low attendance") || q.includes("warning") || q.includes("below 75")) {
      const myWarnings = warnings.filter(w => mySubjects.some(s => s.id === w.subjectId))
      if (myWarnings.length === 0) return "No students have low attendance in your subjects. All students are above 75%."
      const top5 = myWarnings.slice(0, 5).map(w => {
        const stu = students.find(s => s.id === w.studentId)
        const sub = subjects.find(s => s.id === w.subjectId)
        return `- ${stu?.name} (${w.studentId}) in ${sub?.code}: ${w.message}`
      }).join("\n")
      return `${myWarnings.length} warnings in your subjects:\n\n${top5}${myWarnings.length > 5 ? `\n...and ${myWarnings.length - 5} more` : ""}`
    }

    if (q.includes("subject") && (q.includes("stat") || q.includes("attendance"))) {
      return mySubjects.map(s => {
        const att = getSubjectAttendance(s.id)
        const enrolled = students.filter(st => st.semester === s.semester).length
        return `${s.code} - ${s.name}:\n  Attendance: ${att.percentage.toFixed(1)}% | Enrolled: ${enrolled} students`
      }).join("\n\n")
    }

    // Search student by ID
    const stuMatch = q.match(/stu\d{3}/i)
    if (stuMatch) {
      const sid = stuMatch[0].toUpperCase()
      const stu = myStudents.find(s => s.id === sid)
      if (stu) {
        const att = getStudentAttendance(stu.id)
        return `Student: ${stu.name}\nID: ${stu.id}\nSemester: ${stu.semester} | Section: ${stu.section}\nOverall Attendance: ${att.percentage.toFixed(1)}%`
      }
      return `Student ${sid} is not enrolled in any of your subjects, or doesn't exist.`
    }
  }

  // ---- Student responses ----
  if (role === "student") {
    const currentStudent = students.find(s => s.id === userId)
    const mySubjects = currentStudent ? subjects.filter(s => s.semester === currentStudent.semester) : []
    const myWarnings = currentStudent ? warnings.filter(w => w.studentId === currentStudent.id) : []

    if (q.includes("my attendance") || q.includes("overall attendance") || q.includes("attendance percent")) {
      if (!currentStudent) return "Could not find your student record."
      const att = getStudentAttendance(currentStudent.id)
      const subDetails = mySubjects.map(sub => {
        const subAtt = getStudentAttendance(currentStudent.id, sub.id)
        return `- ${sub.code}: ${subAtt.percentage.toFixed(1)}%`
      }).join("\n")
      return `Your overall attendance: ${att.percentage.toFixed(1)}%\n\nSubject-wise:\n${subDetails}\n\n${att.percentage < 75 ? "Warning: Your attendance is below the minimum 75% requirement." : "Your attendance is above the minimum requirement."}`
    }

    if (q.includes("my subject") || q.includes("enrolled") || q.includes("what subject")) {
      return `You are enrolled in ${mySubjects.length} subjects this semester:\n\n${mySubjects.map(s => {
        const facs = faculty.filter(f => f.subjects.includes(s.id))
        return `- ${s.code}: ${s.name} (${s.credits} credits)\n  Faculty: ${facs.map(f => f.name).join(", ")}`
      }).join("\n")}`
    }

    if (q.includes("warning") || q.includes("alert")) {
      if (myWarnings.length === 0) return "You have no active warnings. Your attendance is adequate across all subjects."
      return `You have ${myWarnings.length} active warning(s):\n\n${myWarnings.map(w => {
        const sub = subjects.find(s => s.id === w.subjectId)
        return `- ${sub?.name}: ${w.message}`
      }).join("\n")}\n\nPlease improve your attendance to avoid academic penalties.`
    }

    if (q.includes("minimum") || q.includes("required") || q.includes("policy") || q.includes("rule")) {
      return "The minimum attendance requirement is 75% per subject. Students falling below this threshold will receive warnings and may face academic penalties including being barred from exams."
    }

    if (q.includes("cgpa") || q.includes("grade")) {
      if (!currentStudent) return "Could not find your student record."
      return `Your current CGPA is ${currentStudent.cgpa}. Keep up the good work!`
    }
  }

  // Fallback
  return "I'm not sure I understand that question. Try asking about:\n- Attendance statistics\n- Student or faculty information\n- Subject details\n- Warnings and alerts\n\nOr type 'help' to see what I can assist with."
}

export function Chatbot({ role, userId }: { role: UserRole; userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AttendanceMS Assistant. How can I help you today? You can ask me about attendance, subjects, students, or warnings.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const quickActions = getQuickActions(role)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(messageText, role, userId)
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-secondary text-foreground rotate-0"
            : "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:scale-105"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Card className="flex h-[500px] flex-col border-border bg-[oklch(0.14_0.005_260)] shadow-2xl">
            {/* Header */}
            <CardHeader className="flex flex-row items-center gap-3 border-b border-border px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.65_0.2_145)]/15">
                <Bot className="h-5 w-5 text-[oklch(0.65_0.2_145)]" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm text-foreground">AttendanceMS Assistant</CardTitle>
                <p className="text-xs text-[oklch(0.65_0.2_145)]">Online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Minimize chat"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.sender === "bot"
                        ? "bg-[oklch(0.65_0.2_145)]/15"
                        : "bg-secondary"
                    }`}>
                      {msg.sender === "bot" ? (
                        <Bot className="h-4 w-4 text-[oklch(0.65_0.2_145)]" />
                      ) : (
                        <User className="h-4 w-4 text-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                        msg.sender === "user"
                          ? "bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)]"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="border-t border-border px-4 py-2">
                <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Quick Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.query)}
                      className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-[oklch(0.65_0.2_145)]/15 hover:text-[oklch(0.65_0.2_145)] hover:border-[oklch(0.65_0.2_145)]/30"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question..."
                  className="flex-1 border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  size="icon"
                  className="bg-[oklch(0.65_0.2_145)] text-[oklch(0.1_0.02_145)] hover:bg-[oklch(0.6_0.2_145)] disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
