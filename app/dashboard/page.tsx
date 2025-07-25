"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Target, TrendingUp, Users, Calendar, BookOpen, Award, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your college application progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.85</div>
            <p className="text-xs text-muted-foreground">+0.12 from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SAT Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1450</div>
            <p className="text-xs text-muted-foreground">Target: 1500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 leadership roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 submitted, 7 in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Application Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>Track your college application status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Essays</span>
                <Badge variant="secondary">8/12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recommendations</span>
                <Badge variant="secondary">6/12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Transcripts</span>
                <Badge>12/12</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Stanford EA</p>
                <p className="text-xs text-muted-foreground">Nov 1, 2024</p>
              </div>
              <Badge variant="destructive">3 days</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">MIT EA</p>
                <p className="text-xs text-muted-foreground">Nov 1, 2024</p>
              </div>
              <Badge variant="secondary">3 days</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">UC Applications</p>
                <p className="text-xs text-muted-foreground">Nov 30, 2024</p>
              </div>
              <Badge variant="outline">33 days</Badge>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/gpa">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Target className="h-6 w-6 mb-2" />
                <span>Update GPA</span>
              </Button>
            </Link>
            <Link href="/test-scores">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Add Test Score</span>
              </Button>
            </Link>
            <Link href="/extracurriculars">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Users className="h-6 w-6 mb-2" />
                <span>Log Activity</span>
              </Button>
            </Link>
            <Link href="/essays">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <FileText className="h-6 w-6 mb-2" />
                <span>Work on Essays</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest updates and achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Award className="h-4 w-4 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Added National Honor Society</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Updated AP Chemistry grade</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Completed Common App essay</p>
              <p className="text-xs text-muted-foreground">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
