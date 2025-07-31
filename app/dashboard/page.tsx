"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trophy, Users, GraduationCap, TrendingUp, Calendar, Target, Award, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || "Student"}!</h1>
        <p className="text-muted-foreground">Here's an overview of your college application progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.85</div>
            <p className="text-xs text-muted-foreground">+0.12 from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Scores</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
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

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Application Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Common App</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Essays</span>
                <span>60%</span>
              </div>
              <Progress value={60} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recommendations</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stanford University</p>
                  <p className="text-sm text-muted-foreground">Regular Decision</p>
                </div>
                <Badge variant="destructive">Jan 5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">MIT</p>
                  <p className="text-sm text-muted-foreground">Regular Decision</p>
                </div>
                <Badge variant="secondary">Jan 1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">UC Berkeley</p>
                  <p className="text-sm text-muted-foreground">Application</p>
                </div>
                <Badge>Nov 30</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Award className="h-4 w-4 mt-1 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Added National Honor Society</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="h-4 w-4 mt-1 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Updated Fall semester grades</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="h-4 w-4 mt-1 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Recorded SAT score: 1450</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to keep your application on track</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/gpa">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <BookOpen className="h-6 w-6" />
                <span>Update GPA</span>
              </Button>
            </Link>
            <Link href="/test-scores">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Trophy className="h-6 w-6" />
                <span>Add Test Score</span>
              </Button>
            </Link>
            <Link href="/extracurriculars">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6" />
                <span>Log Activity</span>
              </Button>
            </Link>
            <Link href="/essays">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Plus className="h-6 w-6" />
                <span>Write Essay</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* College Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            College Recommendations
          </CardTitle>
          <CardDescription>Based on your academic profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">University of California, Los Angeles</h3>
              <p className="text-sm text-muted-foreground mb-2">Match School</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">75% Match</Badge>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">University of Michigan</h3>
              <p className="text-sm text-muted-foreground mb-2">Target School</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">68% Match</Badge>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Northwestern University</h3>
              <p className="text-sm text-muted-foreground mb-2">Reach School</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">45% Match</Badge>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
