"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Target, Users, FileText, Calculator, Calendar } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name || "Student"}!</h1>
          <p className="text-gray-600 mt-1">Here's your college application progress overview</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Senior Year
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.85</div>
            <p className="text-xs text-muted-foreground">+0.12 from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Scores</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1450</div>
            <p className="text-xs text-muted-foreground">SAT Score (Latest)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <p className="text-xs text-muted-foreground">Submitted applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Extracurricular activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>Track your college application submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stanford University</span>
                <Badge variant="secondary">Submitted</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MIT</span>
                <Badge variant="secondary">Submitted</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">UC Berkeley</span>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Harvard University</span>
                <Badge variant="outline">Draft</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">UC Berkeley Application</p>
                <p className="text-xs text-muted-foreground">Due in 5 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Harvard Essays</p>
                <p className="text-xs text-muted-foreground">Due in 12 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Financial Aid Forms</p>
                <p className="text-xs text-muted-foreground">Due in 18 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump to the tools you need most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/gpa">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">Update GPA</span>
              </Button>
            </Link>
            <Link href="/test-scores">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Target className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Test Score</span>
              </Button>
            </Link>
            <Link href="/essays">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Write Essay</span>
              </Button>
            </Link>
            <Link href="/college-estimations">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Calculator className="h-6 w-6 mb-2" />
                <span className="text-sm">Check Chances</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
