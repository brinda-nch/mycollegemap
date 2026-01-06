"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Edit, 
  AlignLeft,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Save,
  X,
} from "lucide-react"
import { useData } from "@/lib/data-context"
import { FeatureGate } from "@/components/feature-gate"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function EssaysPage() {
  const { data: session } = useSession()
  const { essays, addEssay, deleteEssay, updateEssay } = useData()

  // If no session, show loading
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const userId = (session.user as any).id

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEssay, setEditingEssay] = useState<any>(null)
  
  // Full-page editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [currentEssay, setCurrentEssay] = useState<any>(null)
  const [editorContent, setEditorContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [canClose, setCanClose] = useState(false)
  
  // Proofreading state
  const [isProofreading, setIsProofreading] = useState(false)
  const [proofreadResults, setProofreadResults] = useState<any>(null)
  const [showProofreadPanel, setShowProofreadPanel] = useState(false)
  
  // Discard confirmation dialog
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  
  // New essay form state
  const [newEssay, setNewEssay] = useState({
    title: "",
    prompt: "",
    wordLimit: "650",
    status: "Not Started",
  })

  // Edit essay state
  const [editForm, setEditForm] = useState({
    title: "",
    prompt: "",
    wordLimit: "650",
    status: "Not Started",
  })

  const handleAddEssay = () => {
    if (!newEssay.title || !newEssay.prompt) return

    addEssay({
      title: newEssay.title,
      prompt: newEssay.prompt,
      content: "",
      wordCount: Number.parseInt(newEssay.wordLimit),
      status: newEssay.status,
    })

    setNewEssay({
      title: "",
      prompt: "",
      wordLimit: "650",
      status: "Not Started",
    })
    setIsAddDialogOpen(false)
  }

  const handleOpenEditor = (essay: any) => {
    setCurrentEssay(essay)
    setEditorContent(essay.content || "")
    setHasUnsavedChanges(false)
    setCanClose(false)
    setIsEditorOpen(true)
  }

  const handleEditorContentChange = (content: string) => {
    setEditorContent(content)
    setHasUnsavedChanges(true)
    setCanClose(false)
  }

  const handleSaveEditor = () => {
    if (!currentEssay) return

    updateEssay(currentEssay.id, {
      content: editorContent,
    })

    setHasUnsavedChanges(false)
    setCanClose(true)
  }

  const handleDiscardChanges = () => {
    setEditorContent(currentEssay?.content || "")
    setHasUnsavedChanges(false)
    setCanClose(true)
    setShowDiscardDialog(false)
  }

  const handleCloseEditor = () => {
    if (canClose) {
      setIsEditorOpen(false)
      setCurrentEssay(null)
      setEditorContent("")
      setCanClose(false)
      setProofreadResults(null)
      setShowProofreadPanel(false)
    }
  }

  const handleProofread = async () => {
    if (!editorContent || editorContent.trim().length === 0) {
      alert("Please write some content before proofreading.")
      return
    }

    setIsProofreading(true)
    setProofreadResults(null)

    const startTime = Date.now()
    console.log('📝 [PROOFREADER UI] Starting proofreading...', {
      contentLength: editorContent.length,
      wordLimit: currentEssay?.wordCount,
      timestamp: new Date().toISOString()
    })

    try {
      console.log('📤 [PROOFREADER UI] Sending request to API...')
      const fetchStartTime = Date.now()

      const response = await fetch("/api/proofread-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          essay: editorContent,
          wordLimit: currentEssay?.wordCount || null,
        }),
      })

      const fetchDuration = Date.now() - fetchStartTime
      console.log('📥 [PROOFREADER UI] Response received:', {
        status: response.status,
        statusText: response.statusText,
        duration: `${fetchDuration}ms`,
        ok: response.ok
      })

      if (!response.ok) {
        let errorMessage = "Failed to proofread essay"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If response is not JSON, try to get text
          try {
            const textError = await response.text()
            errorMessage = textError || `HTTP ${response.status}: ${response.statusText}`
          } catch (textError) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      console.log('✅ [PROOFREADER UI] Proofreading successful:', {
        hasResult: !!data.result,
        issuesCount: data.result?.issues?.length || 0,
        overallScore: data.result?.overallScore,
        totalDuration: `${Date.now() - startTime}ms`
      })

      if (!data.result) {
        throw new Error("No result returned from proofreading API")
      }

      setProofreadResults(data.result)
      setShowProofreadPanel(true)
    } catch (error: any) {
      console.error('❌ [PROOFREADER UI] Error:', {
        error: error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorMessage: error?.message,
        errorName: error?.name,
        duration: `${Date.now() - startTime}ms`,
        stack: error?.stack
      })
      
      // Handle different error types
      let errorMessage = "Failed to proofread essay. Please try again."
      
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.toString && typeof error.toString === 'function') {
        const errorString = error.toString()
        // Don't show "[object Event]" or "[object Object]"
        if (!errorString.includes('[object')) {
          errorMessage = errorString
        }
      }
      
      // Check for network errors
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        errorMessage = "Network error: Could not connect to the server. Please check your internet connection."
      }
      
      alert(`Proofreading failed: ${errorMessage}`)
    } finally {
      setIsProofreading(false)
    }
  }

  const handleOpenEditDialog = (essay: any) => {
    setEditingEssay(essay)
    setEditForm({
      title: essay.title,
      prompt: essay.prompt || "",
      content: essay.content || "",
      wordLimit: essay.wordCount?.toString() || "650",
      status: essay.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditEssay = () => {
    if (!editingEssay || !editForm.title) return

    updateEssay(editingEssay.id, {
      title: editForm.title,
      prompt: editForm.prompt || undefined,
      content: editForm.content || undefined,
      wordCount: Number.parseInt(editForm.wordLimit),
      status: editForm.status,
    })

    setEditingEssay(null)
    setEditForm({
      title: "",
      prompt: "",
      content: "",
      wordLimit: "650",
      status: "Not Started",
    })
    setIsEditDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" }
      case "In Progress":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" }
      case "Not Started":
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" }
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" }
    }
  }

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Calculate stats
  const totalEssays = essays.length
  const completedEssays = essays.filter(e => e.status === "Completed").length
  const inProgressEssays = essays.filter(e => e.status === "In Progress").length
  const totalWords = essays.reduce((sum, e) => sum + (getWordCount(e.content || "")), 0)

  return (
    <FeatureGate userId={userId} featureName="Essay Proofreader">
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" style={{ color: "#f89880" }} />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: "#0f172a" }}>
                Essays
              </h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600">
              Write and manage your college application essays
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-transparent hover:border-[#f89880] transition-all shadow-lg hover:shadow-xl">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: "#f89880" }} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-0.5 sm:mb-1">Total Essays</p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: "#f89880" }}>
                  {totalEssays}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-transparent hover:border-green-400 transition-all shadow-lg hover:shadow-xl">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl bg-green-100">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-0.5 sm:mb-1">Completed</p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{completedEssays}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-transparent hover:border-blue-400 transition-all shadow-lg hover:shadow-xl">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl bg-blue-100">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-0.5 sm:mb-1">In Progress</p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{inProgressEssays}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-transparent hover:border-purple-400 transition-all shadow-lg hover:shadow-xl">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl bg-purple-100">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-0.5 sm:mb-1">Total Words</p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">{totalWords}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Essays List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4 lg:pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Your Essays
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                    Manage and write your college application essays
                  </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      style={{ backgroundColor: "#f89880" }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Essay
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Add New Essay
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        Create a new essay for your college applications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Essay Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Common App Personal Statement"
                          value={newEssay.title}
                          onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prompt">Essay Prompt *</Label>
                        <Textarea
                          id="prompt"
                          placeholder="Enter the essay prompt or question"
                          value={newEssay.prompt}
                          onChange={(e) => setNewEssay({ ...newEssay, prompt: e.target.value })}
                          className="rounded-xl"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="wordLimit">Word Limit</Label>
                          <Input
                            id="wordLimit"
                            type="number"
                            placeholder="650"
                            value={newEssay.wordLimit}
                            onChange={(e) => setNewEssay({ ...newEssay, wordLimit: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newEssay.status}
                            onValueChange={(value) => setNewEssay({ ...newEssay, status: value })}
                          >
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                    </div>
                    <DialogFooter className="gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="h-12 rounded-xl px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddEssay}
                        disabled={!newEssay.title || !newEssay.prompt}
                        className="h-12 rounded-xl px-6 text-white font-semibold"
                        style={{ backgroundColor: "#f89880" }}
                      >
                        Add Essay
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {essays.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {essays.map((essay, index) => {
                      const statusColors = getStatusColor(essay.status)
                      const wordCount = getWordCount(essay.content || "")
                      const wordLimit = essay.wordCount || 650
                      const progressPercent = Math.min((wordCount / wordLimit) * 100, 100)

                      return (
                        <motion.div
                          key={essay.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group"
                        >
                          <div className="p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all">
                            <button
                              onClick={() => handleOpenEditor(essay)}
                              className="w-full text-left"
                            >
                              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                                <div
                                  className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                                  style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}
                                >
                                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#f89880" }} />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm sm:text-base font-bold mb-1 break-words" style={{ color: "#0f172a" }}>
                                    {essay.title}
                                  </h3>
                                  {essay.prompt && (
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                      <span className="font-medium">Prompt:</span> {essay.prompt}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                                    <Badge className={`${statusColors.bg} ${statusColors.text} border ${statusColors.border} text-xs px-1.5 py-0`}>
                                      {essay.status}
                                    </Badge>
                                    <span className="text-xs text-gray-600">
                                      {wordCount}/{wordLimit}
                                    </span>
                                  </div>

                                  <div className="w-full">
                                    <Progress value={progressPercent} className="h-1.5" />
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {progressPercent.toFixed(0)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </button>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenEditDialog(essay)
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteEssay(essay.id)
                                }}
                                className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                    style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}
                  >
                    <FileText className="h-12 w-12" style={{ color: "#f89880" }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                    No essays yet
                  </h3>
                  <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    Start writing your college application essays to track your progress.
                  </p>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 h-12 px-8"
                    style={{ backgroundColor: "#f89880" }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Essay
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Essay Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Edit Essay
            </DialogTitle>
            <DialogDescription className="text-base">
              Update your essay details and content
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Essay Title *</Label>
              <Input
                id="edit-title"
                placeholder="e.g., Common App Personal Statement"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prompt">Essay Prompt *</Label>
              <Textarea
                id="edit-prompt"
                placeholder="Enter the essay prompt or question"
                value={editForm.prompt}
                onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-wordLimit">Word Limit</Label>
                <Input
                  id="edit-wordLimit"
                  type="number"
                  placeholder="650"
                  value={editForm.wordLimit}
                  onChange={(e) => setEditForm({ ...editForm, wordLimit: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="h-12 rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditEssay}
              disabled={!editForm.title || !editForm.prompt}
              className="h-12 rounded-xl px-6 text-white font-semibold"
              style={{ backgroundColor: "#f89880" }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full-Page Notion-Style Editor */}
      <AnimatePresence>
        {isEditorOpen && currentEssay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto"
          >
            {/* Editor Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" style={{ color: "#f89880" }} />
                  <span className="text-sm sm:text-base lg:text-lg font-semibold truncate" style={{ color: "#0f172a" }}>
                    {currentEssay.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0">
                  <Button
                    onClick={handleProofread}
                    disabled={isProofreading || !editorContent || editorContent.trim().length === 0}
                    className="h-7 sm:h-8 lg:h-9 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 text-white font-semibold text-xs sm:text-sm"
                    style={{ backgroundColor: "#a78bfa" }}
                  >
                    {isProofreading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 border-b-2 border-white mr-1"></div>
                        <span className="hidden sm:inline">Proofreading...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Proofread</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowDiscardDialog(true)}
                    variant="outline"
                    className="h-7 sm:h-8 lg:h-9 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 border text-xs sm:text-sm"
                  >
                    <X className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Discard</span>
                  </Button>
                  <Button
                    onClick={handleSaveEditor}
                    className="h-7 sm:h-8 lg:h-9 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 text-white font-semibold text-xs sm:text-sm"
                    style={{ backgroundColor: "#f89880" }}
                  >
                    <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button
                    onClick={handleCloseEditor}
                    variant="ghost"
                    size="sm"
                    disabled={!canClose}
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl p-0 ${
                      canClose
                        ? "hover:bg-gray-100"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    title={
                      !canClose
                        ? "Please save or discard changes before closing"
                        : "Close editor"
                    }
                  >
                    <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Essay Details Section */}
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 sm:mb-6"
              >
                {/* Essay Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3" style={{ color: "#0f172a" }}>
                  {currentEssay.title}
                </h1>

                {/* Essay Meta Information */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Badge
                    className={`${getStatusColor(currentEssay.status).bg} ${
                      getStatusColor(currentEssay.status).text
                    } border ${getStatusColor(currentEssay.status).border} text-xs py-0.5 px-2`}
                  >
                    {currentEssay.status}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {getWordCount(editorContent)} / {currentEssay.wordCount || 650}
                    </span>
                  </div>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs py-0.5 px-2">
                      Unsaved
                    </Badge>
                  )}
                </div>

                {/* Essay Prompt */}
                {currentEssay.prompt && (
                  <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                      Prompt
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {currentEssay.prompt}
                    </p>
                  </div>
                )}

                {/* Word Count Progress */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {Math.min(
                        ((getWordCount(editorContent) / (currentEssay.wordCount || 650)) * 100).toFixed(0),
                        100
                      )}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (getWordCount(editorContent) / (currentEssay.wordCount || 650)) * 100,
                      100
                    )}
                    className="h-1.5"
                  />
                </div>
              </motion.div>

              {/* Essay Editor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Textarea
                  value={editorContent}
                  onChange={(e) => handleEditorContentChange(e.target.value)}
                  placeholder="Start writing your essay here..."
                  className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] text-sm sm:text-base leading-relaxed rounded-xl border-2 border-gray-200 focus:border-[#f89880] focus:ring-[#f89880] p-3 sm:p-4 lg:p-6 resize-none"
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.75",
                    fontFamily: "inherit",
                  }}
                />
              </motion.div>

              {/* Helper Text */}
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#f89880] flex-shrink-0" />
                  <span>
                    <strong>Tip:</strong> Save changes before closing.
                  </span>
                </p>
              </div>

              {/* Proofreading Results */}
              {showProofreadPanel && proofreadResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 sm:mt-6"
                >
                  <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base sm:text-lg lg:text-xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#a78bfa" }} />
                          Results
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowProofreadPanel(false)}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <CardDescription className="text-xs sm:text-sm">
                        AI-powered feedback on grammar, style, and best practices
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      {/* Overall Score */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-white border border-purple-200">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-0.5">Score</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-bold" style={{ color: "#a78bfa" }}>
                              {proofreadResults.overallScore}
                            </span>
                            <span className="text-sm text-gray-500">/100</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-0.5">Words</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg sm:text-xl font-bold text-gray-800">
                              {proofreadResults.wordCount}
                            </span>
                            {currentEssay.wordCount && (
                              <span className="text-xs text-gray-500">/{currentEssay.wordCount}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-0.5">Tone</p>
                          <Badge 
                            className={`text-xs px-1.5 py-0 ${
                              proofreadResults.tone === 'authentic' 
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : proofreadResults.tone === 'generic'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {proofreadResults.tone}
                          </Badge>
                        </div>
                      </div>

                      {/* Summary */}
                      {proofreadResults.summary && (
                        <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-gray-200">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                            Summary
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-800">{proofreadResults.summary}</p>
                        </div>
                      )}

                      {/* Issues Found */}
                      {proofreadResults.issues && proofreadResults.issues.length > 0 && (
                        <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-orange-200">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <AlignLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            Issues ({proofreadResults.issues.length})
                          </h3>
                          <div className="space-y-2">
                            {proofreadResults.issues.map((issue: any, index: number) => (
                              <div key={index} className="p-2 sm:p-2.5 rounded-lg bg-orange-50 border border-orange-200">
                                <div className="flex items-start justify-between mb-1">
                                  <Badge 
                                    className={`text-xs px-1.5 py-0 ${
                                      issue.type === 'grammar' 
                                        ? 'bg-red-100 text-red-800 border-red-300'
                                        : issue.type === 'style'
                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                    }`}
                                  >
                                    {issue.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-700 mb-1">
                                  <span className="font-medium">Found: </span>
                                  <span className="line-through text-red-600">"{issue.text}"</span>
                                </p>
                                <p className="text-xs text-gray-700 mb-1">
                                  <span className="font-medium">Fix: </span>
                                  <span className="text-green-600 font-medium">"{issue.suggestion}"</span>
                                </p>
                                <p className="text-xs text-gray-600 italic">
                                  {issue.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths */}
                      {proofreadResults.strengths && proofreadResults.strengths.length > 0 && (
                        <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-green-200">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            Strengths
                          </h3>
                          <ul className="space-y-1.5">
                            {proofreadResults.strengths.map((strength: string, index: number) => (
                              <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-gray-800">
                                <span className="text-green-600 mt-0.5 text-xs">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {proofreadResults.improvements && proofreadResults.improvements.length > 0 && (
                        <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-blue-200">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            Improvements
                          </h3>
                          <ul className="space-y-1.5">
                            {proofreadResults.improvements.map((improvement: string, index: number) => (
                              <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-gray-800">
                                <span className="text-blue-600 mt-0.5 text-xs">→</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Discard Confirmation Dialog */}
            <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
                    <X className="h-5 w-5 text-red-500" />
                    Discard Changes?
                  </DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Are you sure you want to discard all unsaved changes? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDiscardDialog(false)}
                    className="h-10 rounded-xl px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDiscardChanges}
                    className="h-10 rounded-xl px-4 bg-red-500 hover:bg-red-600 text-white font-semibold"
                  >
                    Yes, Discard
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </FeatureGate>
  )
}
