"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, BookOpen } from "lucide-react"

interface Course {
  id: string
  name: string
  grade: string
  credits: number
  semester: string
  year: string
}

export default function GPAPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "AP Calculus BC", grade: "A", credits: 4, semester: "Fall", year: "2024" },
    { id: "2", name: "AP English Literature", grade: "A-", credits: 3, semester: "Fall", year: "2024" },
    { id: "3", name: "AP Chemistry", grade: "B+", credits: 4, semester: "Fall", year: "2024" },
    { id: "4", name: "AP US History", grade: "A", credits: 3, semester: "Fall", year: "2024" },
    { id: "5", name: "Spanish III", grade: "A-", credits: 3, semester: "Fall", year: "2024" },
  ])

  const [newCourse, setNewCourse] = useState({
    name: "",
    grade: "",
    credits: 3,
    semester: "",
    year: "2024",
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

  const calculateGPA = (courseList: Course[]) => {
    const totalPoints = courseList.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] || 0) * course.credits
    }, 0)
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0)
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00"
  }

  const addCourse = () => {
    if (newCourse.name && newCourse.grade && newCourse.semester) {
      setCourses([
        ...courses,
        {
          ...newCourse,
          id: Date.now().toString(),
        },
      ])
      setNewCourse({
        name: "",
        grade: "",
        credits: 3,
        semester: "",
        year: "2024",
      })
    }
  }

  const currentGPA = calculateGPA(courses)
  const currentSemesterCourses = courses.filter((c) => c.semester === "Fall" && c.year === "2024")
  const semesterGPA = calculateGPA(currentSemesterCourses)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">GPA Tracking</h1>
        <p className="text-gray-600 mt-2">Monitor your academic progress and calculate your GPA</p>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentGPA}</div>
            <p className="text-xs text-muted-foreground">Based on {courses.length} courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesterGPA}</div>
            <p className="text-xs text-muted-foreground">Fall 2024 GPA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.credits, 0)}</div>
            <p className="text-xs text-muted-foreground">Credits completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Course */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>Enter your course details to update your GPA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                placeholder="e.g., AP Biology"
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Select value={newCourse.grade} onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(gradePoints).map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade} ({gradePoints[grade]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number.parseInt(e.target.value) || 0 })}
                min="1"
                max="6"
              />
            </div>
            <div>
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
            <div className="flex items-end">
              <Button onClick={addCourse} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <Card>
        <CardHeader>
          <CardTitle>Course History</CardTitle>
          <CardDescription>All your completed and current courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.semester} {course.year} • {course.credits} credits
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      course.grade.startsWith("A") ? "default" : course.grade.startsWith("B") ? "secondary" : "outline"
                    }
                  >
                    {course.grade}
                  </Badge>
                  <span className="text-sm font-medium">{gradePoints[course.grade]?.toFixed(1)} pts</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
