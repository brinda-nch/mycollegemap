"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Target, TrendingUp, MapPin, DollarSign } from "lucide-react"

interface College {
  id: string
  name: string
  location: string
  acceptanceRate: number
  avgGPA: number
  avgSAT: number
  tuition: number
  matchLevel: "Safety" | "Target" | "Reach"
  applied: boolean
}

export default function CollegeEstimationsPage() {
  const [colleges] = useState<College[]>([
    {
      id: "1",
      name: "Stanford University",
      location: "Stanford, CA",
      acceptanceRate: 4.3,
      avgGPA: 3.96,
      avgSAT: 1505,
      tuition: 56169,
      matchLevel: "Reach",
      applied: true,
    },
    {
      id: "2",
      name: "University of California, Berkeley",
      location: "Berkeley, CA",
      acceptanceRate: 14.5,
      avgGPA: 3.89,
      avgSAT: 1415,
      tuition: 14226,
      matchLevel: "Target",
      applied: true,
    },
    {
      id: "3",
      name: "UCLA",
      location: "Los Angeles, CA",
      acceptanceRate: 12.3,
      avgGPA: 3.9,
      avgSAT: 1405,
      tuition: 13249,
      matchLevel: "Target",
      applied: false,
    },
    {
      id: "4",
      name: "UC San Diego",
      location: "San Diego, CA",
      acceptanceRate: 23.7,
      avgGPA: 3.87,
      avgSAT: 1370,
      tuition: 14648,
      matchLevel: "Safety",
      applied: true,
    },
    {
      id: "5",
      name: "MIT",
      location: "Cambridge, MA",
      acceptanceRate: 6.7,
      avgGPA: 3.96,
      avgSAT: 1520,
      tuition: 53790,
      matchLevel: "Reach",
      applied: false,
    },
    {
      id: "6",
      name: "Cal Poly SLO",
      location: "San Luis Obispo, CA",
      acceptanceRate: 28.4,
      avgGPA: 3.85,
      avgSAT: 1350,
      tuition: 10037,
      matchLevel: "Safety",
      applied: true,
    },
  ])

  const [studentStats] = useState({
    gpa: 3.85,
    sat: 1450,
    act: 32,
  })

  const getMatchColor = (matchLevel: string) => {
    switch (matchLevel) {
      case "Safety":
        return "default"
      case "Target":
        return "secondary"
      case "Reach":
        return "destructive"
      default:
        return "outline"
    }
  }

  const calculateAdmissionChance = (college: College) => {
    let chance = 50 // Base chance

    // GPA factor
    if (studentStats.gpa >= college.avgGPA) {
      chance += 20
    } else if (studentStats.gpa >= college.avgGPA - 0.1) {
      chance += 10
    } else {
      chance -= 15
    }

    // SAT factor
    if (studentStats.sat >= college.avgSAT) {
      chance += 20
    } else if (studentStats.sat >= college.avgSAT - 50) {
      chance += 10
    } else {
      chance -= 15
    }

    // Acceptance rate factor
    if (college.acceptanceRate > 30) {
      chance += 15
    } else if (college.acceptanceRate > 15) {
      chance += 5
    } else if (college.acceptanceRate < 10) {
      chance -= 20
    }

    return Math.max(5, Math.min(95, chance))
  }

  const appliedColleges = colleges.filter((c) => c.applied)
  const safetySchools = colleges.filter((c) => c.matchLevel === "Safety")
  const targetSchools = colleges.filter((c) => c.matchLevel === "Target")
  const reachSchools = colleges.filter((c) => c.matchLevel === "Reach")

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">College Estimations</h1>
        <p className="text-gray-600 mt-2">Analyze your chances at different colleges and universities</p>
      </div>

      {/* Student Profile */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Academic Profile</CardTitle>
          <CardDescription>Your current stats used for college matching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{studentStats.gpa}</div>
              <p className="text-sm text-gray-600">Cumulative GPA</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{studentStats.sat}</div>
              <p className="text-sm text-gray-600">SAT Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{studentStats.act}</div>
              <p className="text-sm text-gray-600">ACT Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedColleges.length}</div>
            <p className="text-xs text-muted-foreground">Applications submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Schools</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safetySchools.length}</div>
            <p className="text-xs text-muted-foreground">Safety options</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Schools</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetSchools.length}</div>
            <p className="text-xs text-muted-foreground">Target matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reach Schools</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reachSchools.length}</div>
            <p className="text-xs text-muted-foreground">Reach schools</p>
          </CardContent>
        </Card>
      </div>

      {/* College List */}
      <Card>
        <CardHeader>
          <CardTitle>College List & Admission Chances</CardTitle>
          <CardDescription>Your personalized college list with estimated admission probabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {colleges.map((college) => {
              const admissionChance = calculateAdmissionChance(college)
              return (
                <div key={college.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{college.name}</h3>
                        <Badge variant={getMatchColor(college.matchLevel)}>{college.matchLevel}</Badge>
                        {college.applied && <Badge variant="outline">Applied</Badge>}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {college.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />${college.tuition.toLocaleString()} tuition
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{admissionChance}%</div>
                      <p className="text-xs text-gray-500">Admission chance</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Admission Probability</span>
                      <span>{admissionChance}%</span>
                    </div>
                    <Progress value={admissionChance} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Acceptance Rate:</span>
                      <p className="text-gray-600">{college.acceptanceRate}%</p>
                    </div>
                    <div>
                      <span className="font-medium">Average GPA:</span>
                      <p className="text-gray-600">{college.avgGPA}</p>
                    </div>
                    <div>
                      <span className="font-medium">Average SAT:</span>
                      <p className="text-gray-600">{college.avgSAT}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Your Stats vs Average:</span>
                      <div className="flex space-x-4 mt-1">
                        <span className={`${studentStats.gpa >= college.avgGPA ? "text-green-600" : "text-red-600"}`}>
                          GPA: {studentStats.gpa >= college.avgGPA ? "✓" : "✗"}
                        </span>
                        <span className={`${studentStats.sat >= college.avgSAT ? "text-green-600" : "text-red-600"}`}>
                          SAT: {studentStats.sat >= college.avgSAT ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                    {!college.applied && (
                      <Button variant="outline" size="sm">
                        Add to Application List
                      </Button>
                    )}
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
