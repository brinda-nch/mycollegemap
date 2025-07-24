"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface Course {
  id: string
  name: string
  grade: string
  credits: number
  semester: string
  year: string
  type: "Regular" | "Honors" | "AP" | "IB"
}

export default function GPAPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "AP Calculus BC", grade: "A", credits: 4, semester: "Fall", year: "2024", type: "AP" },
    { id: "2", name: "AP English Literature", grade: "A-", credits: 4, semester: "Fall", year: "2024", type: "AP" },
    { id: "3", name: "AP Chemistry", grade: "B+", credits: 4, semester: "Fall", year: "2024", type: "AP" },
    { id: "4", name: "AP US History", grade: "A", credits: 4, semester: "Spring", year: "2024", type: "AP" },
  ])

  const [newCourse, setNewCourse] = useState({
    name: "",
    grade: "",
    credits: 4,
    semester: "",
    year: "",
    type: "Regular" as Course["type"],
  })

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  }

  const getWeightedGradePoints = (grade: string, type: Course["type"]) => {
    const basePoints = gradePoints[grade] || 0
    const weight = type === "AP" || type === "IB" ? 1.0 : type === "Honors" ? 0.5 : 0
    return Math.min(basePoints + weight, 4.0)
  }

  const calculateGPA = (weighted = false) => {
    const totalPoints = courses.reduce((sum, course) => {
      const points = weighted ? getWeightedGradePoints(course.grade, course.type) : gradePoints[course.grade] || 0
      return sum + points * course.credits
    }, 0)
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : "0.000"
  }

  const addCourse = () => {
    if (newCourse.name && newCourse.grade && newCourse.semester && newCourse.year) {
      setCourses([...courses, { ...newCourse, id: Date.now().toString() }])
      setNewCourse({ name: "", grade: "", credits: 4, semester: "", year: "", type: "Regular" })
    }
  }

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GPA Tracking</h1>
        <p className="text-muted-foreground">Monitor your academic performance and calculate your GPA</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Unweighted GPA</CardTitle>
            <CardDescription>Standard 4.0 scale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{calculateGPA(false)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weighted GPA</CardTitle>
            <CardDescription>Including AP/Honors bonus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{calculateGPA(true)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Credits</CardTitle>
            <CardDescription>Completed credit hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {courses.reduce((sum, course) => sum + course.credits, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>Enter your course information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                placeholder="e.g., AP Biology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={newCourse.grade} onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(gradePoints).map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number.parseInt(e.target.value) || 0 })}
                min="1"
                max="8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Course Type</Label>
              <Select
                value={newCourse.type}
                onValueChange={(value: Course["type"]) => setNewCourse({ ...newCourse, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Honors">Honors</SelectItem>
                  <SelectItem value="AP">AP</SelectItem>
                  <SelectItem value="IB">IB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={newCourse.semester}
                onValueChange={(value) => setNewCourse({ ...newCourse, semester: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={newCourse.year} onValueChange={(value) => setNewCourse({ ...newCourse, year: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addCourse} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course History</CardTitle>
          <CardDescription>Your completed courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <Badge
                      variant={course.type === "AP" ? "default" : course.type === "Honors" ? "secondary" : "outline"}
                    >
                      {course.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.semester} {course.year} • {course.credits} credits
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-lg">{course.grade}</div>
                    <div className="text-xs text-muted-foreground">
                      {getWeightedGradePoints(course.grade, course.type).toFixed(1)} pts
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourse(course.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
