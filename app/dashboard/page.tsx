"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, BookOpen, Trophy, FileText, Target, TrendingUp, Calendar, Award } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()

  const stats = [
    {
      title: "Current GPA",
      value: "3.85",
      description: "Weighted GPA",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "SAT Score",
      value: "1450",
      description: "Latest attempt",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Applications",
      value: "8",
      description: "In progress",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Essays",
      value: "12",
      description: "Completed",
      icon: Trophy,
      color: "text-orange-600",
    },
  ]

  const recentActivities = [
    {
      title: "Updated Common App Essay",
      description: "Personal statement draft completed",
      time: "2 hours ago",
      type: "essay",
    },
    {
      title: "Added SAT Score",
      description: "Math: 750, Reading: 700",
      time: "1 day ago",
      type: "test",
    },
    {
      title: "Submitted Stanford Application",
      description: "Early Action deadline met",
      time: "3 days ago",
      type: "application",
    },
    {
      title: "Added Extracurricular",
      description: "Debate Team Captain",
      time: "1 week ago",
      type: "activity",
    },
  ]

  const upcomingDeadlines = [
    {
      college: "Harvard University",
      deadline: "Jan 1, 2024",
      type: "Regular Decision",
      status: "pending",
    },
    {
      college: "MIT",
      deadline: "Jan 1, 2024",
      type: "Regular Decision",
      status: "pending",
    },
    {
      college: "UC Berkeley",
      deadline: "Nov 30, 2023",
      type: "UC Application",
      status: "urgent",
    },
  ]

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
