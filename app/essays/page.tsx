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
import { Plus, FileText, Clock, CheckCircle } from "lucide-react"

interface Essay {
  id: string
  title: string
  type: string
  college: string
  prompt: string
  content: string
  wordLimit: number
  status: "Not Started" | "In Progress" | "Draft Complete" | "Final"
  lastModified: string
}

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([
    {
      id: "1",
      title: "Common Application Personal Statement",
      type: "Personal Statement",
      college: "Common App",
      prompt:
        "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
      content:
        "Growing up in a multicultural household has shaped my perspective on the world in ways I never fully appreciated until I began my college search...",
      wordLimit: 650,
      status: "Final",
      lastModified: "2024-10-15",
    },
    {
      id: "2",
      title: "Stanford Supplemental Essay",
      type: "Supplemental",
      college: "Stanford University",
      prompt: "What matters most to you, and why?",
      content: "The intersection of technology and social justice matters most to me because...",
      wordLimit: 250,
      status: "In Progress",
      lastModified: "2024-10-20",
    },
    {
      id: "3",
      title: "UC Personal Insight Question #1",
      type: "Personal Insight",
      college: "UC System",
      prompt: "Describe an example of your leadership experience in which you have positively influenced others.",
      content: "",
      wordLimit: 350,
      status: "Not Started",
      lastModified: "2024-10-01",
    },
  ])

  const [newEssay, setNewEssay] = useState({
    title: "",
    type: "",
    college: "",
    prompt: "",
    wordLimit: 650,
  })

  const addEssay = () => {
    if (newEssay.title && newEssay.type && newEssay.college && newEssay.prompt) {
      setEssays([
        ...essays,
        {
          ...newEssay,
          id: Date.now().toString(),
          content: "",
          status: "Not Started" as const,
          lastModified: new Date().toISOString().split("T")[0],
        },
      ])
      setNewEssay({
        title: "",
        type: "",
        college: "",
        prompt: "",
        wordLimit: 650,
      })
    }
  }

  const updateEssayContent = (id: string, content: string) => {
    setEssays(
      essays.map((essay) =>
        essay.id === id
          ? {
              ...essay,
              content,
              status: content.length > 0 ? ("In Progress" as const) : ("Not Started" as const),
              lastModified: new Date().toISOString().split("T")[0],
            }
          : essay,
      ),
    )
  }

  const updateEssayStatus = (id: string, status: Essay["status"]) => {
    setEssays(
      essays.map((essay) =>
        essay.id === id ? { ...essay, status, lastModified: new Date().toISOString().split("T")[0] } : essay,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Final":
        return "default"
      case "Draft Complete":
        return "secondary"
      case "In Progress":
        return "outline"
      case "Not Started":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Final":
        return <CheckCircle className="h-4 w-4" />
      case "Draft Complete":
        return <FileText className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getWordCount = (content: string) => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCompletionPercentage = () => {
    const completed = essays.filter((e) => e.status === "Final").length
    return essays.length > 0 ? (completed / essays.length) * 100 : 0
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Essays</h1>
        <p className="text-gray-600 mt-2">Manage your college application essays and personal statements</p>
      </div>

      {/* Essay Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{essays.length}</div>
            <p className="text-xs text-muted-foreground">Essays to write</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{essays.filter((e) => e.status === "Final").length}</div>
            <p className="text-xs text-muted-foreground">Final essays</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {essays.filter((e) => e.status === "In Progress" || e.status === "Draft Complete").length}
            </div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(getCompletionPercentage())}%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Essay Progress</CardTitle>
          <CardDescription>Track your overall essay completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(getCompletionPercentage())}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Essay */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Essay</CardTitle>
          <CardDescription>Create a new essay for your college applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="essayTitle">Essay Title</Label>
              <Input
                id="essayTitle"
                value={newEssay.title}
                onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                placeholder="e.g., Common App Personal Statement"
              />
            </div>
            <div>
              <Label htmlFor="college">College/Application</Label>
              <Input
                id="college"
                value={newEssay.college}
                onChange={(e) => setNewEssay({ ...newEssay, college: e.target.value })}
                placeholder="e.g., Stanford University"
              />
            </div>
            <div>
              <Label htmlFor="essayType">Essay Type</Label>
              <Select value={newEssay.type} onValueChange={(value) => setNewEssay({ ...newEssay, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Statement">Personal Statement</SelectItem>
                  <SelectItem value="Supplemental">Supplemental Essay</SelectItem>
                  <SelectItem value="Personal Insight">Personal Insight Question</SelectItem>
                  <SelectItem value="Why This College">Why This College</SelectItem>
                  <SelectItem value="Activity Essay">Activity Essay</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="wordLimit">Word Limit</Label>
              <Input
                id="wordLimit"
                type="number"
                value={newEssay.wordLimit || ""}
                onChange={(e) => setNewEssay({ ...newEssay, wordLimit: Number.parseInt(e.target.value) || 0 })}
                placeholder="650"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="prompt">Essay Prompt</Label>
            <Textarea
              id="prompt"
              value={newEssay.prompt}
              onChange={(e) => setNewEssay({ ...newEssay, prompt: e.target.value })}
              placeholder="Enter the full essay prompt here..."
              rows={3}
            />
          </div>
          <Button onClick={addEssay}>
            <Plus className="h-4 w-4 mr-2" />
            Add Essay
          </Button>
        </CardContent>
      </Card>

      {/* Essays List */}
      <div className="space-y-6">
        {essays.map((essay) => {
          const wordCount = getWordCount(essay.content)
          const wordProgress = essay.wordLimit > 0 ? (wordCount / essay.wordLimit) * 100 : 0

          return (
            <Card key={essay.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-3">
                      <span>{essay.title}</span>
                      <Badge variant={getStatusColor(essay.status)} className="flex items-center">
                        {getStatusIcon(essay.status)}
                        <span className="ml-1">{essay.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {essay.college} • {essay.type} • Last modified:{" "}
                      {new Date(essay.lastModified).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Select
                    value={essay.status}
                    onValueChange={(value: Essay["status"]) => updateEssayStatus(essay.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Draft Complete">Draft Complete</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Prompt:</Label>
                  <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">{essay.prompt}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`content-${essay.id}`}>Essay Content:</Label>
                    <div className="text-sm text-gray-600">
                      {wordCount} / {essay.wordLimit} words
                      {wordProgress > 100 && <span className="text-red-600 ml-2">Over limit!</span>}
                    </div>
                  </div>
                  <Textarea
                    id={`content-${essay.id}`}
                    value={essay.content}
                    onChange={(e) => updateEssayContent(essay.id, e.target.value)}
                    placeholder="Start writing your essay here..."
                    rows={8}
                    className="resize-none"
                  />
                  <div className="mt-2">
                    <Progress
                      value={Math.min(wordProgress, 100)}
                      className={`h-2 ${wordProgress > 100 ? "bg-red-100" : ""}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
