"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, Target } from "lucide-react"

interface TestScore {
  id: string
  testType: "SAT" | "ACT" | "AP" | "SAT Subject"
  subject?: string
  score: number
  maxScore: number
  date: string
  percentile?: number
}

export default function TestScoresPage() {
  const [scores, setScores] = useState<TestScore[]>([
    { id: "1", testType: "SAT", score: 1450, maxScore: 1600, date: "2024-03-15", percentile: 97 },
    { id: "2", testType: "ACT", score: 32, maxScore: 36, date: "2024-04-20", percentile: 95 },
    { id: "3", testType: "AP", subject: "Calculus BC", score: 5, maxScore: 5, date: "2024-05-10" },
    { id: "4", testType: "AP", subject: "English Literature", score: 4, maxScore: 5, date: "2024-05-12" },
  ])

  const [newScore, setNewScore] = useState({
    testType: "SAT" as TestScore["testType"],
    subject: "",
    score: 0,
    date: "",
    percentile: 0,
  })

  const getMaxScore = (testType: TestScore["testType"]) => {
    switch (testType) {
      case "SAT":
        return 1600
      case "ACT":
        return 36
      case "AP":
        return 5
      case "SAT Subject":
        return 800
      default:
        return 100
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const addScore = () => {
    if (newScore.testType && newScore.score && newScore.date) {
      const maxScore = getMaxScore(newScore.testType)
      setScores([
        ...scores,
        {
          ...newScore,
          id: Date.now().toString(),
          maxScore,
          percentile: newScore.percentile || undefined,
        },
      ])
      setNewScore({ testType: "SAT", subject: "", score: 0, date: "", percentile: 0 })
    }
  }

  const removeScore = (id: string) => {
    setScores(scores.filter((score) => score.id !== id))
  }

  const getBestScore = (testType: "SAT" | "ACT") => {
    const testScores = scores.filter((score) => score.testType === testType)
    return testScores.length > 0 ? Math.max(...testScores.map((score) => score.score)) : null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test Scores</h1>
        <p className="text-muted-foreground">Track your standardized test performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best SAT Score</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getBestScore("SAT") || "Not taken"}</div>
            {getBestScore("SAT") && <p className="text-xs text-muted-foreground">out of 1600</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best ACT Score</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getBestScore("ACT") || "Not taken"}</div>
            {getBestScore("ACT") && <p className="text-xs text-muted-foreground">out of 36</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AP Exams</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {scores.filter((score) => score.testType === "AP").length}
            </div>
            <p className="text-xs text-muted-foreground">exams taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average AP Score</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {scores.filter((score) => score.testType === "AP").length > 0
                ? (
                    scores.filter((score) => score.testType === "AP").reduce((sum, score) => sum + score.score, 0) /
                    scores.filter((score) => score.testType === "AP").length
                  ).toFixed(1)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">out of 5</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Test Score</CardTitle>
          <CardDescription>Record your test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="test-type">Test Type</Label>
              <Select
                value={newScore.testType}
                onValueChange={(value: TestScore["testType"]) => setNewScore({ ...newScore, testType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAT">SAT</SelectItem>
                  <SelectItem value="ACT">ACT</SelectItem>
                  <SelectItem value="AP">AP</SelectItem>
                  <SelectItem value="SAT Subject">SAT Subject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newScore.testType === "AP" || newScore.testType === "SAT Subject") && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newScore.subject}
                  onChange={(e) => setNewScore({ ...newScore, subject: e.target.value })}
                  placeholder="e.g., Calculus BC"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={newScore.score || ""}
                onChange={(e) => setNewScore({ ...newScore, score: Number.parseInt(e.target.value) || 0 })}
                placeholder="Enter score"
              />
            </div>

            <div className="space-y-2">
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
                <Plus className="w-4 h-4 mr-2" />
                Add Score
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Score History</CardTitle>
          <CardDescription>Your recorded test scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scores.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">
                      {score.testType} {score.subject && `- ${score.subject}`}
                    </h4>
                    <Badge variant="outline">{new Date(score.date).toLocaleDateString()}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={(score.score / score.maxScore) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {((score.score / score.maxScore) * 100).toFixed(1)}% of maximum
                      </p>
                    </div>
                    {score.percentile && (
                      <div className="text-sm text-muted-foreground">{score.percentile}th percentile</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`font-bold text-2xl ${getScoreColor(score.score, score.maxScore)}`}>
                      {score.score}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {score.maxScore}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScore(score.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
