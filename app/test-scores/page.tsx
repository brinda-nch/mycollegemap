"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Trophy, Target } from "lucide-react"

interface TestScore {
  id: string
  testType: string
  subject?: string
  score: number
  maxScore?: number
  testDate?: string
}

export default function TestScoresPage() {
  const [testScores, setTestScores] = useState<TestScore[]>([
    {
      id: "1",
      testType: "SAT",
      subject: "Math",
      score: 750,
      maxScore: 800,
      testDate: "2024-03-15",
    },
    {
      id: "2",
      testType: "SAT",
      subject: "Reading & Writing",
      score: 700,
      maxScore: 800,
      testDate: "2024-03-15",
    },
    {
      id: "3",
      testType: "AP",
      subject: "Calculus BC",
      score: 5,
      maxScore: 5,
      testDate: "2024-05-10",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newScore, setNewScore] = useState({
    testType: "",
    subject: "",
    score: "",
    maxScore: "",
    testDate: "",
  })

  const handleAddScore = () => {
    if (!newScore.testType || !newScore.score) return

    const score: TestScore = {
      id: Date.now().toString(),
      testType: newScore.testType,
      subject: newScore.subject || undefined,
      score: Number.parseInt(newScore.score),
      maxScore: newScore.maxScore ? Number.parseInt(newScore.maxScore) : undefined,
      testDate: newScore.testDate || undefined,
    }

    setTestScores([...testScores, score])
    setNewScore({
      testType: "",
      subject: "",
      score: "",
      maxScore: "",
      testDate: "",
    })
    setIsAddDialogOpen(false)
  }

  const getSATComposite = () => {
    const satScores = testScores.filter((score) => score.testType === "SAT")
    if (satScores.length === 0) return null
    return satScores.reduce((sum, score) => sum + score.score, 0)
  }

  const getHighestAPScore = () => {
    const apScores = testScores.filter((score) => score.testType === "AP")
    if (apScores.length === 0) return null
    return Math.max(...apScores.map((score) => score.score))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto lg:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Scores</h1>
        <p className="text-gray-600">Track your standardized test performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">SAT Composite</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{getSATComposite() || "N/A"}</div>
            <p className="text-xs text-gray-500 mt-1">out of 1600</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Highest AP Score</CardTitle>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{getHighestAPScore() || "N/A"}</div>
            <p className="text-xs text-gray-500 mt-1">out of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{testScores.length}</div>
            <p className="text-xs text-gray-500 mt-1">tests recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AP Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {testScores.filter((score) => score.testType === "AP").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">AP exams taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Scores Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Test Score History</CardTitle>
            <CardDescription>Your standardized test performance over time</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Test Score
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Test Score</DialogTitle>
                <DialogDescription>Record a new standardized test score to track your progress.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="testType">Test Type</Label>
                  <Select
                    value={newScore.testType}
                    onValueChange={(value) => setNewScore({ ...newScore, testType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAT">SAT</SelectItem>
                      <SelectItem value="ACT">ACT</SelectItem>
                      <SelectItem value="AP">AP</SelectItem>
                      <SelectItem value="SAT Subject">SAT Subject</SelectItem>
                      <SelectItem value="PSAT">PSAT</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Input
                    id="subject"
                    value={newScore.subject}
                    onChange={(e) => setNewScore({ ...newScore, subject: e.target.value })}
                    placeholder="e.g., Math, Reading, Chemistry"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="score">Score (Required)</Label>
                    <Input
                      id="score"
                      type="number"
                      value={newScore.score}
                      onChange={(e) => setNewScore({ ...newScore, score: e.target.value })}
                      placeholder="750"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxScore">Max Score</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      value={newScore.maxScore}
                      onChange={(e) => setNewScore({ ...newScore, maxScore: e.target.value })}
                      placeholder="800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testDate">Test Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    value={newScore.testDate}
                    onChange={(e) => setNewScore({ ...newScore, testDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddScore} disabled={!newScore.testType || !newScore.score}>
                  Add Test Score
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {testScores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testScores.map((score) => (
                  <TableRow key={score.id}>
                    <TableCell>
                      <Badge variant="outline">{score.testType}</Badge>
                    </TableCell>
                    <TableCell>{score.subject || <span className="text-gray-400">N/A</span>}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{score.score}</span>
                        {score.maxScore && <span className="text-gray-500 text-sm">/ {score.maxScore}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {score.testDate ? (
                        new Date(score.testDate).toLocaleDateString()
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test scores yet</h3>
              <p className="text-gray-500">Add your first standardized test score to start tracking your progress.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
