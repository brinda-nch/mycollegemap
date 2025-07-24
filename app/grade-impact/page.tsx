"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Target, Calculator } from "lucide-react"

interface Course {
  id: string
  name: string
  currentGrade: string
  credits: number
  type: "Regular" | "Honors" | "AP" | "IB"
}

interface Scenario {
  id: string
  name: string
  courseChanges: { courseId: string; newGrade: string }[]
  projectedGPA: number
  impact: number
}

export default function GradeImpact() {
  const [courses] = useState<Course[]>([
    { id: "1", name: "AP Calculus BC", currentGrade: "A", credits: 4, type: "AP" },
    { id: "2", name: "AP Chemistry", currentGrade: "A-", credits: 4, type: "AP" },
    { id: "3", name: "English Literature", currentGrade: "B+", credits: 3, type: "Honors" },
    { id: "4", name: "US History", currentGrade: "A", credits: 3, type: "AP" },
    { id: "5", name: "Spanish IV", currentGrade: "B", credits: 3, type: "Regular" },
    { id: "6", name: "Physics", currentGrade: "B+", credits: 4, type: "Honors" },
  ])

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [targetGPA, setTargetGPA] = useState("4.0")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [newGrade, setNewGrade] = useState("")

  const gradePoints = {
    "A+": { regular: 4.0, honors: 4.5, ap: 5.0 },
    A: { regular: 4.0, honors: 4.5, ap: 5.0 },
    "A-": { regular: 3.7, honors: 4.2, ap: 4.7 },
    "B+": { regular: 3.3, honors: 3.8, ap: 4.3 },
    B: { regular: 3.0, honors: 3.5, ap: 4.0 },
    "B-": { regular: 2.7, honors: 3.2, ap: 3.7 },
    "C+": { regular: 2.3, honors: 2.8, ap: 3.3 },
    C: { regular: 2.0, honors: 2.5, ap: 3.0 },
    "C-": { regular: 1.7, honors: 2.2, ap: 2.7 },
    D: { regular: 1.0, honors: 1.0, ap: 1.0 },
    F: { regular: 0.0, honors: 0.0, ap: 0.0 },
  }

  const calculateGPA = (courseOverrides: { courseId: string; newGrade: string }[] = []) => {
    let totalPoints = 0
    let totalCredits = 0

    courses.forEach((course) => {
      const override = courseOverrides.find((o) => o.courseId === course.id)
      const grade = override ? override.newGrade : course.currentGrade
      const gradeData = gradePoints[grade as keyof typeof gradePoints]

      if (gradeData) {
        let points = gradeData.regular
        if (course.type === "Honors") points = gradeData.honors
        else if (course.type === "AP" || course.type === "IB") points = gradeData.ap

        totalPoints += points * course.credits
        totalCredits += course.credits
      }
    })

    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const currentGPA = calculateGPA()

  const analyzeCourseImpact = (courseId: string, grade: string) => {
    const currentGPA = calculateGPA()
    const newGPA = calculateGPA([{ courseId, newGrade: grade }])
    return newGPA - currentGPA
  }

  const createScenario = () => {
    if (selectedCourse && newGrade) {
      const courseChanges = [{ courseId: selectedCourse, newGrade }]
      const projectedGPA = calculateGPA(courseChanges)
      const impact = projectedGPA - currentGPA
      const course = courses.find((c) => c.id === selectedCourse)

      const scenario: Scenario = {
        id: Date.now().toString(),
        name: `${course?.name}: ${newGrade}`,
        courseChanges,
        projectedGPA,
        impact,
      }

      setScenarios([...scenarios, scenario])
      setSelectedCourse("")
      setNewGrade("")
    }
  }

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id))
  }

  const getGradeNeededForTarget = () => {
    const target = Number.parseFloat(targetGPA)
    if (!target || !selectedCourse) return null

    const course = courses.find((c) => c.id === selectedCourse)
    if (!course) return null

    const grades = Object.keys(gradePoints)

    for (const grade of grades) {
      const projectedGPA = calculateGPA([{ courseId: selectedCourse, newGrade: grade }])
      if (projectedGPA >= target) {
        return grade
      }
    }

    return null
  }

  const getImpactColor = (impact: number) => {
    if (impact > 0.05) return "text-green-600"
    if (impact > 0) return "text-green-500"
    if (impact < -0.05) return "text-red-600"
    if (impact < 0) return "text-red-500"
    return "text-gray-600"
  }

  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="h-4 w-4" />
    if (impact < 0) return <TrendingDown className="h-4 w-4" />
    return <Target className="h-4 w-4" />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grade Impact Analysis</h1>
          <p className="text-muted-foreground">Analyze how different grades affect your GPA</p>
        </div>
      </div>

      {/* Current GPA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Current GPA Analysis
          </CardTitle>
          <CardDescription>Your current weighted GPA and course breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold">{currentGPA.toFixed(3)}</div>
            <p className="text-muted-foreground">Current Weighted GPA</p>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.credits} credits • {course.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{course.currentGrade}</div>
                  <div className="text-sm text-muted-foreground">
                    {(() => {
                      const gradeData = gradePoints[course.currentGrade as keyof typeof gradePoints]
                      if (!gradeData) return "0.0"
                      let points = gradeData.regular
                      if (course.type === "Honors") points = gradeData.honors
                      else if (course.type === "AP" || course.type === "IB") points = gradeData.ap
                      return points.toFixed(1)
                    })()} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Create Grade Scenario</CardTitle>
          <CardDescription>See how changing a grade would impact your GPA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="course-select">Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} (Current: {course.currentGrade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade-select">New Grade</Label>
              <Select value={newGrade} onValueChange={setNewGrade}>
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

            <div className="flex items-end">
              <Button onClick={createScenario} className="w-full" disabled={!selectedCourse || !newGrade}>
                Analyze Impact
              </Button>
            </div>
          </div>

          {selectedCourse && newGrade && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Projected Impact:</span>
                <div
                  className={`flex items-center gap-2 font-bold ${getImpactColor(analyzeCourseImpact(selectedCourse, newGrade))}`}
                >
                  {getImpactIcon(analyzeCourseImpact(selectedCourse, newGrade))}
                  {analyzeCourseImpact(selectedCourse, newGrade) > 0 ? "+" : ""}
                  {analyzeCourseImpact(selectedCourse, newGrade).toFixed(3)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                New GPA would be: {calculateGPA([{ courseId: selectedCourse, newGrade }]).toFixed(3)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target GPA Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Target GPA Calculator</CardTitle>
          <CardDescription>Find out what grade you need to reach your target GPA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="target-gpa">Target GPA</Label>
              <Input
                id="target-gpa"
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={targetGPA}
                onChange={(e) => setTargetGPA(e.target.value)}
                placeholder="e.g., 4.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-target">Course to Improve</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCourse && targetGPA && (
            <div className="p-4 bg-muted rounded-lg">
              {(() => {
                const neededGrade = getGradeNeededForTarget()
                const course = courses.find((c) => c.id === selectedCourse)
                return (
                  <div>
                    <p className="font-medium">
                      To reach a {targetGPA} GPA, you need at least a{" "}
                      <span className="font-bold text-blue-600">
                        {neededGrade || "A+ (not achievable with current courses)"}
                      </span>{" "}
                      in {course?.name}
                    </p>
                    {neededGrade && (
                      <p className="text-sm text-muted-foreground mt-1">
                        This would improve your GPA by{" "}
                        {(calculateGPA([{ courseId: selectedCourse, newGrade: neededGrade }]) - currentGPA).toFixed(3)}{" "}
                        points
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scenarios */}
      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Scenarios</CardTitle>
            <CardDescription>Compare different grade scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground">Projected GPA: {scenario.projectedGPA.toFixed(3)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 font-bold ${getImpactColor(scenario.impact)}`}>
                      {getImpactIcon(scenario.impact)}
                      {scenario.impact > 0 ? "+" : ""}
                      {scenario.impact.toFixed(3)}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeScenario(scenario.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
