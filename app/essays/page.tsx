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
import { Trash2, Plus, FileText, Edit, Eye } from "lucide-react"

interface Essay {
  id: string
  title: string
  type: "Personal Statement" | "Supplemental" | "Why This College" | "Activity" | "Other"
  college?: string
  prompt: string
  content: string
  wordLimit: number
  status: "Not Started" | "In Progress" | "First Draft" | "Revision" | "Final"
  feedback: string
  score?: number
}

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([
    {
      id: "1",
      title: "Common App Personal Statement",
      type: "Personal Statement",
      prompt:
        "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
      content:
        "Growing up in a multicultural household has shaped my perspective on the world in ways I never fully appreciated until I began my journey toward higher education...",
      wordLimit: 650,
      status: "First Draft",
      feedback: "Strong opening, but needs more specific examples. Consider expanding on the cultural bridge metaphor.",
      score: 7,
    },
    {
      id: "2",
      title: "Stanford Supplemental",
      type: "Why This College",
      college: "Stanford University",
      prompt: "What matters most to you, and why?",
      content: "Innovation through collaboration matters most to me because...",
      wordLimit: 250,
      status: "In Progress",
      feedback: "",
    },
    {
      id: "3",
      title: "UC Personal Insight",
      type: "Activity",
      college: "UC System",
      prompt:
        "Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.",
      content: "",
      wordLimit: 350,
      status: "Not Started",
      feedback: "",
    },
  ])

  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [newEssay, setNewEssay] = useState({
    title: "",
    type: "Personal Statement" as Essay["type"],
    college: "",
    prompt: "",
    wordLimit: 650,
  })

  const addEssay = () => {
    if (newEssay.title && newEssay.prompt) {
      setEssays([
        ...essays,
        {
          ...newEssay,
          id: Date.now().toString(),
          content: "",
          status: "Not Started",
          feedback: "",
        },
      ])
      setNewEssay({
        title: "",
        type: "Personal Statement",
        college: "",
        prompt: "",
        wordLimit: 650,
      })
    }
  }

  const removeEssay = (id: string) => {
    setEssays(essays.filter((essay) => essay.id !== id))
    if (selectedEssay?.id === id) {
      setSelectedEssay(null)
      setIsEditing(false)
    }
  }

  const updateEssay = (id: string, updates: Partial<Essay>) => {
    setEssays(essays.map((essay) => (essay.id === id ? { ...essay, ...updates } : essay)))
    if (selectedEssay?.id === id) {
      setSelectedEssay({ ...selectedEssay, ...updates })
    }
  }

  const getStatusColor = (status: Essay["status"]) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "First Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Revision":
        return "bg-orange-100 text-orange-800"
      case "Final":
        return "bg-green-100 text-green-800"
    }
  }

  const getWordCount = (content: string) => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCompletionStats = () => {
    const total = essays.length
    const completed = essays.filter((e) => e.status === "Final").length
    const inProgress = essays.filter(
      (e) => e.status === "In Progress" || e.status === "First Draft" || e.status === "Revision",
    ).length
    return { total, completed, inProgress }
  }

  const stats = getCompletionStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Essay Tracker</h1>
          <p className="text-muted-foreground">Manage your college application essays and track progress</p>
        </div>
      </div>

      {/* Essay Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Essay List */}
        <div className="space-y-6">
          {/* Add New Essay */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Essay</CardTitle>
              <CardDescription>Create a new essay to track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="essay-title">Essay Title</Label>
                <Input
                  id="essay-title"
                  placeholder="e.g., Common App Personal Statement"
                  value={newEssay.title}
                  onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="essay-type">Essay Type</Label>
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
                      <SelectItem value="Why This College">Why This College</SelectItem>
                      <SelectItem value="Activity">Activity</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College (Optional)</Label>
                  <Input
                    id="college"
                    placeholder="e.g., Stanford University"
                    value={newEssay.college}
                    onChange={(e) => setNewEssay({ ...newEssay, college: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="word-limit">Word Limit</Label>
                <Input
                  id="word-limit"
                  type="number"
                  value={newEssay.wordLimit}
                  onChange={(e) => setNewEssay({ ...newEssay, wordLimit: Number.parseInt(e.target.value) || 650 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Essay Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter the essay prompt here..."
                  value={newEssay.prompt}
                  onChange={(e) => setNewEssay({ ...newEssay, prompt: e.target.value })}
                />
              </div>

              <Button onClick={addEssay} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Essay
              </Button>
            </CardContent>
          </Card>

          {/* Essay List */}
          <div className="space-y-4">
            {essays.map((essay) => (
              <Card key={essay.id} className={selectedEssay?.id === essay.id ? "ring-2 ring-blue-500" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{essay.title}</CardTitle>
                        <Badge className={getStatusColor(essay.status)}>{essay.status}</Badge>
                      </div>
                      <CardDescription>
                        {essay.type} {essay.college && `• ${essay.college}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEssay(essay)
                          setIsEditing(false)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeEssay(essay.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Word Count:</span>
                      <span
                        className={
                          getWordCount(essay.content) > essay.wordLimit ? "text-red-600" : "text-muted-foreground"
                        }
                      >
                        {getWordCount(essay.content)}/{essay.wordLimit}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((getWordCount(essay.content) / essay.wordLimit) * 100, 100)}
                      className="w-full"
                    />
                    {essay.score && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Score:</span>
                        <span className="font-medium">{essay.score}/10</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Essay Editor/Viewer */}
        <div className="space-y-6">
          {selectedEssay ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedEssay.title}</CardTitle>
                    <CardDescription>
                      {selectedEssay.type} • {getWordCount(selectedEssay.content)}/{selectedEssay.wordLimit} words
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedEssay.status}
                      onValueChange={(value: Essay["status"]) => updateEssay(selectedEssay.id, { status: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="First Draft">First Draft</SelectItem>
                        <SelectItem value="Revision">Revision</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Prompt:</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedEssay.prompt}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Essay Content:</Label>
                  {isEditing ? (
                    <Textarea
                      className="mt-2 min-h-[300px]"
                      value={selectedEssay.content}
                      onChange={(e) => updateEssay(selectedEssay.id, { content: e.target.value })}
                      placeholder="Start writing your essay here..."
                    />
                  ) : (
                    <div className="mt-2 p-3 border rounded-md min-h-[300px] bg-muted/50">
                      {selectedEssay.content ? (
                        <p className="whitespace-pre-wrap text-sm">{selectedEssay.content}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm">No content yet. Click edit to start writing.</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Feedback & Notes:</Label>
                  <Textarea
                    className="mt-2"
                    value={selectedEssay.feedback}
                    onChange={(e) => updateEssay(selectedEssay.id, { feedback: e.target.value })}
                    placeholder="Add feedback, notes, or revision ideas..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Score (1-10):</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={selectedEssay.score || ""}
                      onChange={(e) =>
                        updateEssay(selectedEssay.id, { score: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="Rate your essay"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an essay to view or edit</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
