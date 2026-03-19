// ============================================================
// Attendance Management System - Data Store
// ============================================================

export interface Subject {
  id: string
  code: string
  name: string
  semester: number
  credits: number
}

export interface Faculty {
  id: string
  name: string
  email: string
  password: string
  department: string
  designation: string
  phone: string
  subjects: string[] // subject IDs
}

export interface Student {
  id: string
  name: string
  email: string
  password: string
  semester: number
  section: string
  phone: string
  cgpa: number
  enrollmentYear: number
}

export interface AttendanceRecord {
  id: string
  studentId: string
  subjectId: string
  facultyId: string
  date: string
  status: "present" | "absent" | "late"
}

export interface Warning {
  id: string
  studentId: string
  subjectId: string
  message: string
  date: string
  read: boolean
}

// ============================================================
// 6 CSE Subjects
// ============================================================
export const subjects: Subject[] = [
  { id: "SUB001", code: "CS301", name: "Data Structures & Algorithms", semester: 3, credits: 4 },
  { id: "SUB002", code: "CS302", name: "Database Management Systems", semester: 3, credits: 4 },
  { id: "SUB003", code: "CS401", name: "Operating Systems", semester: 4, credits: 4 },
  { id: "SUB004", code: "CS402", name: "Computer Networks", semester: 4, credits: 3 },
  { id: "SUB005", code: "CS501", name: "Machine Learning", semester: 5, credits: 4 },
  { id: "SUB006", code: "CS502", name: "Software Engineering", semester: 5, credits: 3 },
]

// ============================================================
// 15 Faculty Members
// ============================================================
export const faculty: Faculty[] = [
  { id: "FAC001", name: "Dr. Rajesh Kumar", email: "rajesh.kumar@college.edu", password: "faculty123", department: "CSE", designation: "Professor", phone: "9876543201", subjects: ["SUB001", "SUB003"] },
  { id: "FAC002", name: "Dr. Priya Sharma", email: "priya.sharma@college.edu", password: "faculty123", department: "CSE", designation: "Associate Professor", phone: "9876543202", subjects: ["SUB002"] },
  { id: "FAC003", name: "Dr. Amit Singh", email: "amit.singh@college.edu", password: "faculty123", department: "CSE", designation: "Professor", phone: "9876543203", subjects: ["SUB004", "SUB006"] },
  { id: "FAC004", name: "Dr. Sunita Verma", email: "sunita.verma@college.edu", password: "faculty123", department: "CSE", designation: "Assistant Professor", phone: "9876543204", subjects: ["SUB005"] },
  { id: "FAC005", name: "Dr. Vikram Patel", email: "vikram.patel@college.edu", password: "faculty123", department: "CSE", designation: "Associate Professor", phone: "9876543205", subjects: ["SUB001"] },
  { id: "FAC006", name: "Dr. Meena Gupta", email: "meena.gupta@college.edu", password: "faculty123", department: "CSE", designation: "Professor", phone: "9876543206", subjects: ["SUB002", "SUB005"] },
  { id: "FAC007", name: "Dr. Rakesh Joshi", email: "rakesh.joshi@college.edu", password: "faculty123", department: "CSE", designation: "Assistant Professor", phone: "9876543207", subjects: ["SUB003"] },
  { id: "FAC008", name: "Dr. Anita Desai", email: "anita.desai@college.edu", password: "faculty123", department: "CSE", designation: "Associate Professor", phone: "9876543208", subjects: ["SUB004"] },
  { id: "FAC009", name: "Dr. Suresh Reddy", email: "suresh.reddy@college.edu", password: "faculty123", department: "CSE", designation: "Professor", phone: "9876543209", subjects: ["SUB006"] },
  { id: "FAC010", name: "Dr. Kavita Nair", email: "kavita.nair@college.edu", password: "faculty123", department: "CSE", designation: "Assistant Professor", phone: "9876543210", subjects: ["SUB001", "SUB002"] },
  { id: "FAC011", name: "Dr. Manoj Tiwari", email: "manoj.tiwari@college.edu", password: "faculty123", department: "CSE", designation: "Associate Professor", phone: "9876543211", subjects: ["SUB003", "SUB004"] },
  { id: "FAC012", name: "Dr. Deepa Iyer", email: "deepa.iyer@college.edu", password: "faculty123", department: "CSE", designation: "Professor", phone: "9876543212", subjects: ["SUB005", "SUB006"] },
  { id: "FAC013", name: "Dr. Arun Mishra", email: "arun.mishra@college.edu", password: "faculty123", department: "CSE", designation: "Assistant Professor", phone: "9876543213", subjects: ["SUB001"] },
  { id: "FAC014", name: "Dr. Pooja Saxena", email: "pooja.saxena@college.edu", password: "faculty123", department: "CSE", designation: "Associate Professor", phone: "9876543214", subjects: ["SUB002", "SUB004"] },
  { id: "FAC015", name: "Dr. Nitin Agarwal", email: "nitin.agarwal@college.edu", password: "faculty123", department: "CSE", designation: "Professor", phone: "9876543215", subjects: ["SUB003", "SUB005"] },
]

// ============================================================
// 100 Students with unique IDs
// ============================================================
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharva", "Advik", "Pranav", "Advaith", "Aarush", "Kabir", "Ritvik", "Aaryan", "Dhruv", "Ananya", "Diya", "Myra", "Sara", "Aadhya", "Isha", "Anvi", "Aanya", "Navya", "Riya", "Pari", "Anika", "Kiara", "Saanvi", "Avni", "Mira", "Zara", "Prisha", "Tanya", "Kavya", "Rohan", "Karan", "Rahul", "Nikhil", "Siddharth", "Akash", "Varun", "Gaurav", "Harsh", "Manish", "Neha", "Pooja", "Shreya", "Divya", "Anjali", "Megha", "Sneha", "Priyanka", "Komal", "Swati", "Amit", "Raj", "Dev", "Arnav", "Laksh", "Yash", "Om", "Tanmay", "Parth", "Rudra", "Nisha", "Sakshi", "Trisha", "Jiya", "Aisha", "Pihu", "Riddhi", "Siddhi", "Khushi", "Janvi", "Kunal", "Aman", "Sahil", "Mohit", "Tushar", "Abhi", "Jay", "Neil", "Samar", "Krish", "Simran", "Palak", "Nandini", "Bhavya", "Radhika", "Meera", "Tanvi", "Sonali", "Aarohi", "Lata"]
const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Nair", "Joshi", "Iyer", "Desai", "Tiwari", "Mishra", "Saxena", "Agarwal", "Mehta", "Chauhan", "Rao", "Pillai", "Menon"]

export const students: Student[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i
  const firstName = firstNames[idx]
  const lastName = lastNames[idx % lastNames.length]
  const semester = [3, 4, 5][idx % 3]
  const section = ["A", "B"][idx % 2]
  const id = `STU${String(idx + 1).padStart(3, "0")}`

  return {
    id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx + 1}@student.college.edu`,
    password: "student123",
    semester,
    section,
    phone: `98${String(70000000 + idx * 111).padStart(8, "0")}`,
    cgpa: parseFloat((6.5 + Math.sin(idx) * 1.5 + Math.cos(idx * 2) * 0.5).toFixed(2)),
    enrollmentYear: 2023,
  }
})

// ============================================================
// Generate Attendance Records (last 30 days)
// ============================================================
function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const today = new Date()

  // For each student generate attendance for their semester subjects over 30 days
  students.forEach((student) => {
    const studentSubjects = subjects.filter((s) => s.semester === student.semester)
    studentSubjects.forEach((subject) => {
      // Find a faculty who teaches this subject
      const subjectFaculty = faculty.find((f) => f.subjects.includes(subject.id))
      if (!subjectFaculty) return

      for (let day = 0; day < 30; day++) {
        // Skip weekends
        const date = new Date(today)
        date.setDate(date.getDate() - day)
        if (date.getDay() === 0 || date.getDay() === 6) continue

        const rand = Math.random()
        let status: "present" | "absent" | "late"
        // Use student index as seed for consistent data
        const seed = (parseInt(student.id.slice(3)) + day + parseInt(subject.id.slice(3))) % 100
        if (seed < 70) status = "present"
        else if (seed < 85) status = "late"
        else status = "absent"

        // Add some randomness
        if (rand < 0.1) status = "absent"
        if (rand > 0.9 && status === "absent") status = "present"

        records.push({
          id: `ATT-${student.id}-${subject.id}-${day}`,
          studentId: student.id,
          subjectId: subject.id,
          facultyId: subjectFaculty.id,
          date: date.toISOString().split("T")[0],
          status,
        })
      }
    })
  })

  return records
}

export const attendanceRecords: AttendanceRecord[] = generateAttendanceRecords()

// ============================================================
// Generate Warnings for students with low attendance
// ============================================================
function generateWarnings(): Warning[] {
  const warnings: Warning[] = []
  const warningMap = new Map<string, number>()

  students.forEach((student) => {
    const studentSubjects = subjects.filter((s) => s.semester === student.semester)
    studentSubjects.forEach((subject) => {
      const subjectRecords = attendanceRecords.filter(
        (r) => r.studentId === student.id && r.subjectId === subject.id
      )
      const total = subjectRecords.length
      const present = subjectRecords.filter((r) => r.status === "present" || r.status === "late").length
      const percentage = total > 0 ? (present / total) * 100 : 100

      if (percentage < 75) {
        const key = `${student.id}-${subject.id}`
        if (!warningMap.has(key)) {
          warningMap.set(key, warnings.length)
          warnings.push({
            id: `WARN-${warnings.length + 1}`,
            studentId: student.id,
            subjectId: subject.id,
            message: `Attendance below 75% in ${subject.name}. Current: ${percentage.toFixed(1)}%`,
            date: new Date().toISOString().split("T")[0],
            read: false,
          })
        }
      }
    })
  })

  return warnings
}

export const warnings: Warning[] = generateWarnings()

// ============================================================
// Admin user
// ============================================================
export const adminUser = {
  id: "ADM001",
  name: "Admin User",
  email: "admin@college.edu",
  password: "admin123",
  role: "admin" as const,
}

// ============================================================
// Helper Functions
// ============================================================
export function getStudentAttendance(studentId: string, subjectId?: string) {
  let records = attendanceRecords.filter((r) => r.studentId === studentId)
  if (subjectId) records = records.filter((r) => r.subjectId === subjectId)
  const total = records.length
  const present = records.filter((r) => r.status === "present").length
  const late = records.filter((r) => r.status === "late").length
  const absent = records.filter((r) => r.status === "absent").length
  return { total, present, late, absent, percentage: total > 0 ? ((present + late) / total) * 100 : 0 }
}

export function getSubjectAttendance(subjectId: string) {
  const records = attendanceRecords.filter((r) => r.subjectId === subjectId)
  const total = records.length
  const present = records.filter((r) => r.status === "present").length
  const late = records.filter((r) => r.status === "late").length
  return { total, present, late, absent: total - present - late, percentage: total > 0 ? ((present + late) / total) * 100 : 0 }
}

export function getFacultyStudents(facultyId: string) {
  const fac = faculty.find((f) => f.id === facultyId)
  if (!fac) return []
  const facSubjects = subjects.filter((s) => fac.subjects.includes(s.id))
  const semesters = new Set(facSubjects.map((s) => s.semester))
  return students.filter((s) => semesters.has(s.semester))
}

export type UserRole = "admin" | "faculty" | "student"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}
