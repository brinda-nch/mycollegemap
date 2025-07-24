"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface Essay {
  id: string
  title: string
  type: "Personal Statement" | "Supplemental" | "Scholarship" | "Other"
  college: string
  prompt: string
  content: string
  wordLimit: number
  status: "Draft" | "In Review" | "Complete"
  score: number
  feedback: string[]
  lastUpdated: string
}

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([
    {
      id: "1",
      title: "Common Application Personal Statement",
      type: "Personal Statement",
      college: "Common Application",
      prompt:
        "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
      content:
        "Growing up in a small town, I never imagined that my grandmother's garden would become the catalyst for my passion in environmental science. Every summer, I spent countless hours helping her tend to her vegetables, learning not just about plants, but about the delicate balance of ecosystems...",
      wordLimit: 650,
      status: "Complete",
      score: 85,
      feedback: [
        "Strong opening that immediately engages the reader",
        "Good use of specific examples and personal anecdotes",
        "Consider strengthening the conclusion to better tie back to your academic goals",
      ],
      lastUpdated: "2024-10-15",
    },
    {
      id: "2",
      title: "Why Stanford Essay",
      type: "Supplemental",
      college: "Stanford University",
      prompt: "Tell us about something that is meaningful to you and why.",
      content:
        "The intersection of technology and social impact has always fascinated me. When I created an app to help local food banks distribute resources more efficiently, I realized that computer science could be a powerful tool for addressing real-world problems...",
      wordLimit: 250,
      status: "In Review",
      score: 78,
      feedback: [
        "Clear connection between personal experience and academic interest",
        "Could benefit from more specific details about the app's impact",
        "Strong potential, needs minor revisions",
      ],
      lastUpdated: "2024-10-12",
    },
    {
      id: "3",
      title: "UC Personal Insight Question #1",
      type: "Supplemental",
      college: "UC System",
      prompt: "Describe an example of your leadership experience in which you have positively influenced others.",
      content:
        "As student body vice president, I noticed that many students felt disconnected from school decisions. I initiated a monthly forum where students could directly voice their concerns to administration...",
      wordLimit: 350,
      status: "Draft",
      score: 72,
      feedback: [
        "Good leadership example with clear impact",
        "Needs more specific metrics or outcomes",
        "Consider adding more personal reflection on what you learned",
      ],
      lastUpdated: "2024-10-08",
    },
  ])

  const [newEssay, setNewEssay] = useState({
    title: "",
    type: "Personal Statement" as Essay["type"],
    college: "",
    prompt: "",
    content: "",
    wordLimit: 650,
  })

  const addEssay = () => {
    if (newEssay.title && newEssay.college && newEssay.prompt) {
      setEssays([
        ...essays,
        {
          ...newEssay,
          id: Date.now().toString(),
          status: "Draft" as Essay["status"],
          score: 0,
          feedback: [],
          lastUpdated: new Date().toISOString().split("T")[0],
        },
      ])
      setNewEssay({
        title: "",
        type: "Personal Statement",
        college: "",
        prompt: "",
        content: "",
        wordLimit: 650,
      })
    }
  }

  const removeEssay = (id: string) => {
    setEssays(essays.filter((essay) => essay.id !== id))
  }

  const updateEssayContent = (id: string, content: string) => {
    setEssays(
      essays.map((essay) =>
        essay.id === id ? { ...essay, content, lastUpdated: new Date().toISOString().split("T")[0] } : essay,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800"
      case "In Review":
        return "bg-yellow-100 text-yellow-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "In Review":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "Draft":
        return <FileText className="w-4 h-4 text-gray-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 65) return "text-yellow-600"
    return "text-red-600"
  }

  const getWordCount = (content: string) => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCompletionStats = () => {
    const total = essays.length
    const complete = essays.filter((e) => e.status === "Complete").length
    const inReview = essays.filter((e) => e.status === "In Review").length
    const draft = essays.filter((e) => e.status === "Draft").length

    return { total, complete, inReview, draft }
  }

  const stats = getCompletionStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Essay Grading & Review</h1>
        <p className="text-muted-foreground">Track and improve your college application essays</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            <Progress value={stats.total > 0 ? (stats.complete / stats.total) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {essays.length > 0 ? Math.round(essays.reduce((sum, essay) => sum + essay.score, 0) / essays.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Essay</CardTitle>
          <CardDescription>Start tracking a new college application essay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="essay-title">Essay Title</Label>
              <Input
                id="essay-title"
                value={newEssay.title}
                onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                placeholder="e.g., Common App Personal Statement"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College/Application</Label>
              <Input
                id="college"
                value={newEssay.college}
                onChange={(e) => setNewEssay({ ...newEssay, college: e.target.value })}
                placeholder="e.g., Harvard University"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Essay Type</Label>
              <Select
                value={newEssay.type}
                onValueChange={(value: Essay["type"]) => setNewEssay({ ...newEssay, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Statement">Personal Statement</SelectItem>
                  <SelectItem value="Supplemental">Supplemental</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="word-limit">Word Limit</Label>
              <Input
                id="word-limit"
                type="number"
                value={newEssay.wordLimit || ""}
                onChange={(e) => setNewEssay({ ...newEssay, wordLimit: Number.parseInt(e.target.value) || 0 })}
                placeholder="650"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Essay Prompt</Label>
            <Textarea
              id="prompt"
              value={newEssay.prompt}
              onChange={(e) => setNewEssay({ ...newEssay, prompt: e.target.value })}
              placeholder="Enter the essay prompt or question..."
              rows={3}
            />
          </div>

          <Button onClick={addEssay} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Essay
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {essays.map((essay) => (
          <Card key={essay.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{essay.title}</CardTitle>
                    <Badge className={getStatusColor(essay.status)}>
                      {getStatusIcon(essay.status)}
                      <span className="ml-1">{essay.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    {essay.college} • {essay.type} • Last updated: {new Date(essay.lastUpdated).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {essay.score > 0 && (
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(essay.score)}`}>{essay.score}</div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEssay(essay.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Prompt:</h5>
                <p className="text-sm text-muted-foreground">{essay.prompt}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`content-${essay.id}`}>Essay Content</Label>
                  <div className="text-sm text-muted-foreground">
                    {getWordCount(essay.content)} / {essay.wordLimit} words
                    {getWordCount(essay.content) > essay.wordLimit && (
                      <span className="text-red-600 ml-2">Over limit!</span>
                    )}
                  </div>
                </div>
                <Textarea
                  id={`content-${essay.id}`}
                  value={essay.content}
                  onChange={(e) => updateEssayContent(essay.id, e.target.value)}
                  placeholder="Start writing your essay..."
                  rows={8}
                  className="min-h-[200px]"
                />
                <Progress
                  value={Math.min((getWordCount(essay.content) / essay.wordLimit) * 100, 100)}
                  className="h-2"
                />
              </div>

              {essay.feedback.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">Feedback & Suggestions:</h5>
                  <div className="space-y-2">
                    {essay.feedback.map((feedback, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                        <p className="text-sm text-blue-800">{feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
