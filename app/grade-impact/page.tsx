"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react"

export default function GradeImpactPage() {
  const currentGPA = 3.85
  const targetGPA = 3.9

  const scenarios = [
    {
      scenario: "If you get all A's this semester",
      newGPA: 3.92,
      change: +0.07,
      likelihood: "High",
      courses: ["AP Physics", "AP Literature", "Calculus BC", "Government"],
    },
    {
      scenario: "If you get mostly A's with one B+",
      newGPA: 3.89,
      change: +0.04,
      likelihood: "Very High",
      courses: ["AP Physics (B+)", "AP Literature (A)", "Calculus BC (A)", "Government (A)"],
    },
    {
      scenario: "If you get mostly A's with one B",
      newGPA: 3.87,
      change: +0.02,
      likelihood: "High",
      courses: ["AP Physics (B)", "AP Literature (A)", "Calculus BC (A)", "Government (A)"],
    },
    {
      scenario: "If you maintain current performance",
      newGPA: 3.85,
      change: 0,
      likelihood: "Very High",
      courses: ["Mixed A's and B's"],
    },
    {
      scenario: "If performance drops slightly",
      newGPA: 3.82,
      change: -0.03,
      likelihood: "Low",
      courses: ["More B's than usual"],
    },
  ]

  const courseImpact = [
    {
      course: "AP Physics C",
      credits: 4,
      currentGrade: "B+",
      potentialGrades: [
        { grade: "A", gpaImpact: +0.05, effort: "High" },
        { grade: "A-", gpaImpact: +0.02, effort: "Medium" },
        { grade: "B+", gpaImpact: 0, effort: "Current" },
        { grade: "B", gpaImpact: -0.03, effort: "Low" },
      ],
    },
    {
      course: "AP Literature",
      credits: 4,
      currentGrade: "A-",
      potentialGrades: [
        { grade: "A", gpaImpact: +0.03, effort: "Medium" },
        { grade: "A-", gpaImpact: 0, effort: "Current" },
        { grade: "B+", gpaImpact: -0.04, effort: "Low" },
      ],
    },
    {
      course: "Calculus BC",
      credits: 4,
      currentGrade: "A",
      potentialGrades: [
        { grade: "A", gpaImpact: 0, effort: "Current" },
        { grade: "A-", gpaImpact: -0.03, effort: "Low" },
        { grade: "B+", gpaImpact: -0.07, effort: "Very Low" },
      ],
    },
    {
      course: "Government",
      credits: 3,
      currentGrade: "A",
      potentialGrades: [
        { grade: "A", gpaImpact: 0, effort: "Current" },
        { grade: "A-", gpaImpact: -0.02, effort: "Low" },
        { grade: "B+", gpaImpact: -0.05, effort: "Very Low" },
      ],
    },
  ]

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "Very High":
        return "bg-green-100 text-green-800"
      case "High":
        return "bg-blue-100 text-blue-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Current":
        return "bg-blue-100 text-blue-800"
      case "Low":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-green-100 text-green-800"
      case "Very Low":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grade Impact Analysis</h1>
        <p className="text-muted-foreground">See how different grades will affect your GPA</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentGPA}</div>
            <Progress value={(currentGPA / 4.0) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{targetGPA}</div>
            <Progress value={(targetGPA / 4.0) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gap to Target</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">+{(targetGPA - currentGPA).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">points needed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GPA Scenarios</CardTitle>
          <CardDescription>Potential outcomes based on different grade combinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{scenario.scenario}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{scenario.courses.join(", ")}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getLikelihoodColor(scenario.likelihood)}>{scenario.likelihood} Likelihood</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {getChangeIcon(scenario.change)}
                    <span className="text-2xl font-bold">{scenario.newGPA.toFixed(2)}</span>
                  </div>
                  <div className={`text-sm font-medium ${getChangeColor(scenario.change)}`}>
                    {scenario.change > 0 ? "+" : ""}
                    {scenario.change.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Course Impact</CardTitle>
          <CardDescription>How each course grade affects your overall GPA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {courseImpact.map((course, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{course.course}</h4>
                  <div className="text-sm text-muted-foreground">
                    {course.credits} credits • Currently: {course.currentGrade}
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                  {course.potentialGrades.map((grade, gradeIndex) => (
                    <div key={gradeIndex} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{grade.grade}</span>
                        <Badge className={getEffortColor(grade.effort)} variant="outline">
                          {grade.effort}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(grade.gpaImpact)}
                        <span className={`text-sm font-medium ${getChangeColor(grade.gpaImpact)}`}>
                          {grade.gpaImpact > 0 ? "+" : ""}
                          {grade.gpaImpact.toFixed(2)} GPA
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Strategic advice to reach your target GPA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-green-800">High Impact Opportunity</h5>
                <p className="text-sm text-green-700">
                  Focus on improving AP Physics C from B+ to A. This 4-credit course has the highest potential impact
                  (+0.05 GPA).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-800">Maintain Strengths</h5>
                <p className="text-sm text-blue-700">
                  Keep your A's in Calculus BC and Government. These courses are currently boosting your GPA
                  significantly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-800">Realistic Target</h5>
                <p className="text-sm text-yellow-700">
                  Getting mostly A's with one B+ this semester will likely achieve your target GPA of 3.90.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
