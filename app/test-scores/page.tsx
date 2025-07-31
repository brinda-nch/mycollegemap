"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, TrendingUp } from "lucide-react"

interface TestScore {
  id: string
  testType: string
  score: number
  maxScore: number
  date: string
  subject?: string
}

export default function TestScoresPage() {
  const [scores, setScores] = useState<TestScore[]>([
    { id: "1", testType: "SAT", score: 1450, maxScore: 1600, date: "2024-03-15" },
    { id: "2", testType: "ACT", score: 32, maxScore: 36, date: "2024-04-20" },
    { id: "3", testType: "AP", subject: "Calculus BC", score: 5, maxScore: 5, date: "2024-05-10" },
    { id: "4", testType: "AP", subject: "English Literature", score: 4, maxScore: 5, date: "2024-05-12" },
    { id: "5", testType: "AP", subject: "Chemistry", score: 4, maxScore: 5, date: "2024-05-08" },
    { id: "6", testType: "SAT Subject", subject: "Math Level 2", score: 780, maxScore: 800, date: "2024-06-01" },
  ])

  const [newScore, setNewScore] = useState({
    testType: "",
    score: 0,
    maxScore: 0,
    date: "",
    subject: "",
  })

  const addScore = () => {
    if (newScore.testType && newScore.score && newScore.date) {
      setScores([
        ...scores,
        {
          ...newScore,
          id: Date.now().toString(),
        },
      ])
      setNewScore({
        testType: "",
        score: 0,
        maxScore: 0,
        date: "",
        subject: "",
      })
    }
  }

  const removeScore = (id: string) => {
    setScores(scores.filter((score) => score.id !== id))
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "default"
    if (percentage >= 80) return "secondary"
    if (percentage >= 70) return "outline"
    return "destructive"
  }

  const getLatestSAT = () =>
    scores
      .filter((s) => s.testType === "SAT")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  const getLatestACT = () =>
    scores
      .filter((s) => s.testType === "ACT")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  const getAPScores = () => scores.filter((s) => s.testType === "AP")

  const latestSAT = getLatestSAT()
  const latestACT = getLatestACT()
  const apScores = getAPScores()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Test Scores</h1>
        <p className="text-gray-600 mt-2">Track your standardized test scores and AP exam results</p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest SAT</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestSAT ? latestSAT.score : "Not taken"}</div>
            <p className="text-xs text-muted-foreground">
              {latestSAT ? `out of ${latestSAT.maxScore}` : "Take your first SAT"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest ACT</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestACT ? latestACT.score : "Not taken"}</div>
            <p className="text-xs text-muted-foreground">
              {latestACT ? `out of ${latestACT.maxScore}` : "Take your first ACT"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AP Exams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apScores.length}</div>
            <p className="text-xs text-muted-foreground">AP exams taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Score */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Test Score</CardTitle>
          <CardDescription>Record your latest test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="testType">Test Type</Label>
              <Select
                value={newScore.testType}
                onValueChange={(value) => {
                  const maxScores: { [key: string]: number } = {
                    SAT: 1600,
                    ACT: 36,
                    AP: 5,
                    "SAT Subject": 800,
                    PSAT: 1520,
                  }
                  setNewScore({ ...newScore, testType: value, maxScore: maxScores[value] || 0 })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAT">SAT</SelectItem>
                  <SelectItem value="ACT">ACT</SelectItem>
                  <SelectItem value="AP">AP Exam</SelectItem>
                  <SelectItem value="SAT Subject">SAT Subject Test</SelectItem>
                  <SelectItem value="PSAT">PSAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newScore.testType === "AP" && (
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newScore.subject}
                  onChange={(e) => setNewScore({ ...newScore, subject: e.target.value })}
                  placeholder="e.g., Calculus BC"
                />
              </div>
            )}
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={newScore.score || ""}
                onChange={(e) => setNewScore({ ...newScore, score: Number.parseInt(e.target.value) || 0 })}
                placeholder="Your score"
              />
            </div>
            <div>
              <Label htmlFor="maxScore">Max Score</Label>
              <Input
                id="maxScore"
                type="number"
                value={newScore.maxScore || ""}
                onChange={(e) => setNewScore({ ...newScore, maxScore: Number.parseInt(e.target.value) || 0 })}
                placeholder="Maximum possible"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="date">Test Date</Label>
              <Input
                id="date"
                type="date"
                value={newScore.date}
                onChange={(e) => setNewScore({ ...newScore, date: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addScore} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Score
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score History */}
      <Card>
        <CardHeader>
          <CardTitle>Score History</CardTitle>
          <CardDescription>All your test scores and exam results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scores
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((score) => (
                <div key={score.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {score.testType}
                      {score.subject && ` - ${score.subject}`}
                    </h3>
                    <p className="text-sm text-gray-500">{new Date(score.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={getScoreColor(score.score, score.maxScore)}>
                      {score.score}/{score.maxScore}
                    </Badge>
                    <span className="text-sm font-medium">{Math.round((score.score / score.maxScore) * 100)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
