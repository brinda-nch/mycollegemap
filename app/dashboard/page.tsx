"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, TrendingUp, Target, Users, Calendar, Plus, BookOpen, Award, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your college application progress.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Extracurricular activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Colleges applied to</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>Track your college application completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Common Application</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Essays Completed</span>
                <span>60%</span>
              </div>
              <Progress value={60} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recommendation Letters</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Stanford University</p>
                  <p className="text-xs text-muted-foreground">Application due in 5 days</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">MIT</p>
                  <p className="text-xs text-muted-foreground">Application due in 12 days</p>
                </div>
                <Badge variant="secondary">Soon</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">UC Berkeley</p>
                  <p className="text-xs text-muted-foreground">Application due in 25 days</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
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
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Update GPA</span>
              </Button>
            </Link>
            <Link href="/test-scores">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <Target className="h-6 w-6" />
                <span className="text-sm">Add Test Score</span>
              </Button>
            </Link>
            <Link href="/extracurriculars">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <Users className="h-6 w-6" />
                <span className="text-sm">Log Activity</span>
              </Button>
            </Link>
            <Link href="/essays">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Write Essay</span>
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
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Award className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Added National Honor Society</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Target className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Updated SAT Score to 1450</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FileText className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Completed Common App Essay</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
