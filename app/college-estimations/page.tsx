"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, TrendingUp, TrendingDown, School } from "lucide-react"

interface College {
  id: string
  name: string
  type: "Safety" | "Target" | "Reach"
  acceptanceRate: number
  avgGPA: number
  avgSAT: number
  estimatedChance: number
  applied: boolean
  deadline: string
}

export default function CollegeEstimationsPage() {
  const [colleges, setColleges] = useState<College[]>([
    {
      id: "1",
      name: "Harvard University",
      type: "Reach",
      acceptanceRate: 3.4,
      avgGPA: 4.18,
      avgSAT: 1520,
      estimatedChance: 15,
      applied: false,
      deadline: "2025-01-01",
    },
    {
      id: "2",
      name: "University of California, Berkeley",
      type: "Target",
      acceptanceRate: 14.5,
      avgGPA: 3.89,
      avgSAT: 1450,
      estimatedChance: 65,
      applied: true,
      deadline: "2024-11-30",
    },
    {
      id: "3",
      name: "University of Washington",
      type: "Safety",
      acceptanceRate: 52.9,
      avgGPA: 3.72,
      avgSAT: 1350,
      estimatedChance: 85,
      applied: true,
      deadline: "2024-12-15",
    },
    {
      id: "4",
      name: "Stanford University",
      type: "Reach",
      acceptanceRate: 3.9,
      avgGPA: 4.18,
      avgSAT: 1510,
      estimatedChance: 12,
      applied: false,
      deadline: "2025-01-02",
    },
    {
      id: "5",
      name: "University of Michigan",
      type: "Target",
      acceptanceRate: 20.2,
      avgGPA: 3.88,
      avgSAT: 1435,
      estimatedChance: 70,
      applied: false,
      deadline: "2025-02-01",
    },
  ])

  const [newCollege, setNewCollege] = useState({
    name: "",
    type: "Target" as College["type"],
    acceptanceRate: 0,
    avgGPA: 0,
    avgSAT: 0,
    deadline: "",
  })

  // Mock student stats - in real app, this would come from other pages
  const studentStats = {
    gpa: 3.85,
    sat: 1450,
    extracurriculars: 8,
    apCourses: 6,
  }

  const calculateEstimatedChance = (college: Omit<College, "id" | "estimatedChance" | "applied">) => {
    let baseChance = college.acceptanceRate

    // GPA factor
    const gpaRatio = studentStats.gpa / college.avgGPA
    if (gpaRatio > 1.05) baseChance *= 1.5
    else if (gpaRatio > 1.0) baseChance *= 1.2
    else if (gpaRatio < 0.95) baseChance *= 0.7
    else if (gpaRatio < 0.9) baseChance *= 0.5

    // SAT factor
    const satRatio = studentStats.sat / college.avgSAT
    if (satRatio > 1.05) baseChance *= 1.4
    else if (satRatio > 1.0) baseChance *= 1.1
    else if (satRatio < 0.95) baseChance *= 0.8
    else if (satRatio < 0.9) baseChance *= 0.6

    // Extracurricular bonus
    if (studentStats.extracurriculars >= 8) baseChance *= 1.1
    if (studentStats.apCourses >= 6) baseChance *= 1.1

    return Math.min(Math.round(baseChance), 95)
  }

  const addCollege = () => {
    if (newCollege.name && newCollege.acceptanceRate && newCollege.avgGPA && newCollege.avgSAT) {
      const estimatedChance = calculateEstimatedChance(newCollege)
      setColleges([
        ...colleges,
        {
          ...newCollege,
          id: Date.now().toString(),
          estimatedChance,
          applied: false,
        },
      ])
      setNewCollege({
        name: "",
        type: "Target",
        acceptanceRate: 0,
        avgGPA: 0,
        avgSAT: 0,
        deadline: "",
      })
    }
  }

  const removeCollege = (id: string) => {
    setColleges(colleges.filter((college) => college.id !== id))
  }

  const toggleApplied = (id: string) => {
    setColleges(colleges.map((college) => (college.id === id ? { ...college, applied: !college.applied } : college)))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Safety":
        return "bg-green-100 text-green-800"
      case "Target":
        return "bg-blue-100 text-blue-800"
      case "Reach":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChanceColor = (chance: number) => {
    if (chance >= 70) return "text-green-600"
    if (chance >= 40) return "text-blue-600"
    if (chance >= 20) return "text-yellow-600"
    return "text-red-600"
  }

  const getCollegesByType = () => {
    return {
      safety: colleges.filter((c) => c.type === "Safety").length,
      target: colleges.filter((c) => c.type === "Target").length,
      reach: colleges.filter((c) => c.type === "Reach").length,
    }
  }

  const getAverageChance = () => {
    if (colleges.length === 0) return 0
    return Math.round(colleges.reduce((sum, college) => sum + college.estimatedChance, 0) / colleges.length)
  }

  const collegesByType = getCollegesByType()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">College Admission Estimations</h1>
        <p className="text-muted-foreground">Analyze your chances at different colleges</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
            <School className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{colleges.length}</div>
            <p className="text-xs text-muted-foreground">{colleges.filter((c) => c.applied).length} applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Chance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getAverageChance()}%</div>
            <p className="text-xs text-muted-foreground">estimated admission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Schools</CardTitle>
            <School className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{collegesByType.safety}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reach Schools</CardTitle>
            <School className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{collegesByType.reach}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Current academic standing used for estimations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{studentStats.gpa}</div>
              <p className="text-sm text-muted-foreground">GPA</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{studentStats.sat}</div>
              <p className="text-sm text-muted-foreground">SAT Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{studentStats.extracurriculars}</div>
              <p className="text-sm text-muted-foreground">Extracurriculars</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{studentStats.apCourses}</div>
              <p className="text-sm text-muted-foreground">AP Courses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New College</CardTitle>
          <CardDescription>Add a college to track your admission chances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="college-name">College Name</Label>
              <Input
                id="college-name"
                value={newCollege.name}
                onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                placeholder="e.g., University of California, Los Angeles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">School Type</Label>
              <Select
                value={newCollege.type}
                onValueChange={(value: College["type"]) => setNewCollege({ ...newCollege, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Target">Target</SelectItem>
                  <SelectItem value="Reach">Reach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="acceptance-rate">Acceptance Rate (%)</Label>
              <Input
                id="acceptance-rate"
                type="number"
                value={newCollege.acceptanceRate || ""}
                onChange={(e) =>
                  setNewCollege({ ...newCollege, acceptanceRate: Number.parseFloat(e.target.value) || 0 })
                }
                placeholder="15.2"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg-gpa">Average GPA</Label>
              <Input
                id="avg-gpa"
                type="number"
                value={newCollege.avgGPA || ""}
                onChange={(e) => setNewCollege({ ...newCollege, avgGPA: Number.parseFloat(e.target.value) || 0 })}
                placeholder="3.85"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg-sat">Average SAT</Label>
              <Input
                id="avg-sat"
                type="number"
                value={newCollege.avgSAT || ""}
                onChange={(e) => setNewCollege({ ...newCollege, avgSAT: Number.parseInt(e.target.value) || 0 })}
                placeholder="1450"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newCollege.deadline}
                onChange={(e) => setNewCollege({ ...newCollege, deadline: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={addCollege} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add College
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>College List</CardTitle>
          <CardDescription>Your target colleges with admission estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {colleges
              .sort((a, b) => b.estimatedChance - a.estimatedChance)
              .map((college) => (
                <div key={college.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{college.name}</h4>
                        <Badge className={getTypeColor(college.type)}>{college.type}</Badge>
                        {college.applied && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Applied
                          </Badge>
                        )}
                      </div>
                      <div className="grid gap-2 md:grid-cols-4 text-sm text-muted-foreground mb-3">
                        <span>📊 {college.acceptanceRate}% acceptance rate</span>
                        <span>🎓 {college.avgGPA} avg GPA</span>
                        <span>📝 {college.avgSAT} avg SAT</span>
                        <span>📅 Due: {new Date(college.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Estimated Chance</span>
                            <span className={`text-sm font-bold ${getChanceColor(college.estimatedChance)}`}>
                              {college.estimatedChance}%
                            </span>
                          </div>
                          <Progress value={college.estimatedChance} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={college.applied ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleApplied(college.id)}
                      >
                        {college.applied ? "Applied" : "Mark Applied"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollege(college.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Suggestions to improve your college list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {collegesByType.safety < 2 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">Add More Safety Schools</h5>
                  <p className="text-sm text-yellow-700">
                    Consider adding {2 - collegesByType.safety} more safety school
                    {2 - collegesByType.safety > 1 ? "s" : ""} to ensure you have backup options.
                  </p>
                </div>
              </div>
            )}
            {collegesByType.target < 3 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <School className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800">Consider More Target Schools</h5>
                  <p className="text-sm text-blue-700">
                    Target schools should make up the majority of your list. Consider adding more schools where your
                    stats match their averages.
                  </p>
                </div>
              </div>
            )}
            {getAverageChance() < 30 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800">Consider Adjusting Your List</h5>
                  <p className="text-sm text-red-700">
                    Your average admission chance is quite low. Consider adding more target and safety schools to
                    balance your list.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
