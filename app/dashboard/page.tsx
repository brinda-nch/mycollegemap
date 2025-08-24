"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Trophy, FileText, Target, TrendingUp, Calendar, Award, Plus } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { getDashboardStats, getRecentActivities, getUpcomingDeadlines, gpaEntries, testScores, activities, essays, collegeApplications } = useData()
  const router = useRouter()

  // Check if user is new (no data) and redirect to onboarding
  const isNewUser = gpaEntries.length === 0 && testScores.length === 0 && activities.length === 0 && essays.length === 0 && collegeApplications.length === 0
  
  useEffect(() => {
    if (isNewUser && session?.user?.email !== 'demo@example.com') {
      router.push('/onboarding')
    }
  }, [isNewUser, session?.user?.email, router])

  const dashboardStats = getDashboardStats()
  
  const stats = [
    {
      title: "Current GPA",
      value: dashboardStats.currentGPA,
      description: gpaEntries.length > 0 ? "Weighted GPA" : "No GPA data",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "SAT Score",
      value: dashboardStats.satScore,
      description: testScores.length > 0 ? "Latest attempt" : "No test scores",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Applications",
      value: dashboardStats.applicationsCount,
      description: collegeApplications.length > 0 ? "In progress" : "No applications",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Essays",
      value: dashboardStats.essaysCount,
      description: essays.length > 0 ? "Completed" : "No essays",
      icon: Trophy,
      color: "text-orange-600",
    },
  ]

  const recentActivities = getRecentActivities()
  const upcomingDeadlines = getUpcomingDeadlines()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.firstName || session?.user?.name}!
        </h1>
        <p className="text-muted-foreground">Here's an overview of your college application progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for New Users */}
      {gpaEntries.length === 0 && testScores.length === 0 && activities.length === 0 && essays.length === 0 && collegeApplications.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="pt-6">
            <div className="text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to your College Application Tracker!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start building your college application profile by adding your academic information, test scores, activities, and more.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Link href="/gpa">
                    <GraduationCap className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add GPA</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Link href="/test-scores">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add Test Scores</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Link href="/extracurriculars">
                    <Trophy className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add Activities</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Link href="/essays">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add Essays</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest updates and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === "essay" && <FileText className="h-4 w-4 text-purple-600" />}
                    {activity.type === "test" && <BookOpen className="h-4 w-4 text-blue-600" />}
                    {activity.type === "application" && <Target className="h-4 w-4 text-green-600" />}
                    {activity.type === "activity" && <Award className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{deadline.college}</p>
                    <p className="text-xs text-muted-foreground">{deadline.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{deadline.deadline}</p>
                    <Badge variant={deadline.status === "urgent" ? "destructive" : "secondary"} className="text-xs">
                      {deadline.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
          <CardDescription>Track your progress across different application components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Common Application</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Essays Completed</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recommendation Letters</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Test Scores Submitted</span>
              <span>90%</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
