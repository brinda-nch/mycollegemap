import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Trophy, FileText, Target, BookOpen, Award } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const overallProgress = 75

  const stats = [
    { label: "Current GPA", value: "3.85", icon: GraduationCap, color: "text-blue-600" },
    { label: "SAT Score", value: "1450", icon: Target, color: "text-green-600" },
    { label: "Extracurriculars", value: "8", icon: Trophy, color: "text-purple-600" },
    { label: "Essays Complete", value: "3/5", icon: FileText, color: "text-orange-600" },
  ]

  const recentActivity = [
    { action: "Updated GPA", time: "2 hours ago", type: "gpa" },
    { action: "Added SAT Score", time: "1 day ago", type: "test" },
    { action: "Completed Common App Essay", time: "3 days ago", type: "essay" },
    { action: "Added Honor Society", time: "1 week ago", type: "award" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">College Application Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and stay organized</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Academic Records</span>
                <Badge variant="secondary">Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Test Scores</span>
                <Badge variant="secondary">Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Essays</span>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recommendations</span>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/gpa">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                GPA Tracking
              </CardTitle>
              <CardDescription>Monitor your academic performance</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/test-scores">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Test Scores
              </CardTitle>
              <CardDescription>Track SAT, ACT, and AP scores</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/extracurriculars">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Extracurriculars
              </CardTitle>
              <CardDescription>Document your activities</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/honors-awards">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Honors & Awards
              </CardTitle>
              <CardDescription>Track achievements and recognition</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/college-estimations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                College Estimations
              </CardTitle>
              <CardDescription>Admission probability analysis</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/essays">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Essay Grading
              </CardTitle>
              <CardDescription>Review and improve your essays</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
