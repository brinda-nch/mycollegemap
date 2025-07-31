"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Calculator } from "lucide-react"

interface Course {
  id: string
  name: string
  currentGrade: string
  credits: number
  semester: string
}

interface Scenario {
  id: string
  name: string
  courseId: string
  newGrade: string
  impact: number
}

export default function GradeImpactPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "AP Calculus BC", currentGrade: "A", credits: 4, semester: "Fall 2024" },
    { id: "2", name: "AP English Literature", currentGrade: "A-", credits: 3, semester: "Fall 2024" },
    { id: "3", name: "AP Chemistry", currentGrade: "B+", credits: 4, semester: "Fall 2024" },
    { id: "4", name: "AP US History", currentGrade: "A", credits: 3, semester: "Fall 2024" },
    { id: "5", name: "Spanish III", currentGrade: "A-", credits: 3, semester: "Fall 2024" },
  ])

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [newScenario, setNewScenario] = useState({
    name: "",
    courseId: "",
    newGrade: "",
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

  const calculateCurrentGPA = () => {
    const totalPoints = courses.reduce((sum, course) => {
      return sum + (gradePoints[course.currentGrade] || 0) * course.credits
    }, 0)
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const calculateScenarioGPA = (courseId: string, newGrade: string) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId ? { ...course, currentGrade: newGrade } : course,
    )

    const totalPoints = updatedCourses.reduce((sum, course) => {
      return sum + (gradePoints[course.currentGrade] || 0) * course.credits
    }, 0)
    const totalCredits = updatedCourses.reduce((sum, course) => sum + course.credits, 0)
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const addScenario = () => {
    if (newScenario.name && newScenario.courseId && newScenario.newGrade) {
      const currentGPA = calculateCurrentGPA()
      const scenarioGPA = calculateScenarioGPA(newScenario.courseId, newScenario.newGrade)
      const impact = scenarioGPA - currentGPA

      setScenarios([
        ...scenarios,
        {
          ...newScenario,
          id: Date.now().toString(),
          impact,
        },
      ])
      setNewScenario({
        name: "",
        courseId: "",
        newGrade: "",
      })
    }
  }

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id))
  }

  const currentGPA = calculateCurrentGPA()

  const getImpactColor = (impact: number) => {
    if (impact > 0.05) return "default"
    if (impact > 0) return "secondary"
    if (impact > -0.05) return "outline"
    return "destructive"
  }

  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="h-4 w-4" />
    if (impact < 0) return <TrendingDown className="h-4 w-4" />
    return <Calculator className="h-4 w-4" />
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grade Impact Analysis</h1>
        <p className="text-gray-600 mt-2">Analyze how different grades would affect your overall GPA</p>
      </div>

      {/* Current GPA */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Current Academic Standing
          </CardTitle>
          <CardDescription>Your current GPA based on recorded grades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{currentGPA.toFixed(3)}</div>
            <p className="text-gray-600">Current Cumulative GPA</p>
            <p className="text-sm text-gray-500 mt-1">
              Based on {courses.length} courses ({courses.reduce((sum, c) => sum + c.credits, 0)} credits)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Courses */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Courses</CardTitle>
          <CardDescription>Your current course grades used for impact analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.semester} • {course.credits} credits
                  </p>
                </div>
                <Badge variant="outline">
                  {course.currentGrade} ({gradePoints[course.currentGrade]?.toFixed(1)} pts)
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Scenario */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create Grade Scenario</CardTitle>
          <CardDescription>See how changing a grade would impact your GPA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="scenarioName">Scenario Name</Label>
              <Input
                id="scenarioName"
                value={newScenario.name}
                onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                placeholder="e.g., If I get A in Calc"
              />
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Select
                value={newScenario.courseId}
                onValueChange={(value) => setNewScenario({ ...newScenario, courseId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
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
            <div>
              <Label htmlFor="newGrade">New Grade</Label>
              <Select
                value={newScenario.newGrade}
                onValueChange={(value) => setNewScenario({ ...newScenario, newGrade: value })}
              >
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
            <div className="flex items-end">
              <Button onClick={addScenario} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Analyze Impact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Results */}
      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Impact Scenarios</CardTitle>
            <CardDescription>How different grades would affect your GPA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.map((scenario) => {
                const course = courses.find((c) => c.id === scenario.courseId)
                const newGPA = currentGPA + scenario.impact

                return (
                  <div key={scenario.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{scenario.name}</h3>
                        <p className="text-sm text-gray-600">
                          {course?.name}: {course?.currentGrade} → {scenario.newGrade}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeScenario(scenario.id)}>
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-700">{currentGPA.toFixed(3)}</div>
                        <p className="text-xs text-gray-500">Current GPA</p>
                      </div>

                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-700">{newGPA.toFixed(3)}</div>
                        <p className="text-xs text-blue-600">New GPA</p>
                      </div>

                      <div
                        className="text-center p-3 rounded-lg"
                        style={{
                          backgroundColor:
                            scenario.impact > 0 ? "#f0fdf4" : scenario.impact < 0 ? "#fef2f2" : "#f9fafb",
                        }}
                      >
                        <div
                          className={`text-lg font-semibold flex items-center justify-center ${
                            scenario.impact > 0
                              ? "text-green-700"
                              : scenario.impact < 0
                                ? "text-red-700"
                                : "text-gray-700"
                          }`}
                        >
                          {getImpactIcon(scenario.impact)}
                          <span className="ml-1">
                            {scenario.impact > 0 ? "+" : ""}
                            {scenario.impact.toFixed(3)}
                          </span>
                        </div>
                        <p
                          className={`text-xs ${
                            scenario.impact > 0
                              ? "text-green-600"
                              : scenario.impact < 0
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          GPA Impact
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <Badge variant={getImpactColor(scenario.impact)} className="flex items-center w-fit mx-auto">
                        {getImpactIcon(scenario.impact)}
                        <span className="ml-1">
                          {scenario.impact > 0.05
                            ? "Significant Positive Impact"
                            : scenario.impact > 0
                              ? "Positive Impact"
                              : scenario.impact > -0.05
                                ? "Minimal Impact"
                                : "Negative Impact"}
                        </span>
                      </Badge>
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
