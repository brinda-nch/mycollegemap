"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  GraduationCap,
  Target,
  Search,
  Plus,
  Trash2,
  FileText,
  Mail,
  FileCheck,
  ClipboardList,
  DollarSign,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Pencil,
} from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface CollegeSearchResult {
  name: string
  location: string
  acceptanceRate: number
  avgGPA: number
  avgSAT: number
  avgACT: number
  tuition: number
  type: string
  state: string
}

const categoryIcons = {
  essays: FileText,
  letters: Mail,
  transcripts: FileCheck,
  tests: ClipboardList,
  application: Target,
  financial: DollarSign,
  other: MoreHorizontal,
}

const categoryLabels = {
  essays: "Essays",
  letters: "Letters of Recommendation",
  transcripts: "Transcripts",
  tests: "Test Scores",
  application: "Application Form",
  financial: "Financial Aid",
  other: "Other",
}

export default function ApplicationTrackingPage() {
  const {
    collegeApplications,
    addCollegeApplication,
    deleteCollegeApplication,
    updateCollegeApplication,
    addTaskToApplication,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    programsInternships,
    addProgramInternship,
    deleteProgramInternship,
    updateProgramInternship,
    addTaskToProgram,
    updateProgramTask,
    deleteProgramTask,
    toggleProgramTaskComplete,
  } = useData()

  const [activeTab, setActiveTab] = useState<"college" | "programs">("college")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CollegeSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set())
  
  // Programs & Internships state
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false)
  const [isAddProgramTaskDialogOpen, setIsAddProgramTaskDialogOpen] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set())
  
  // Edit application state
  const [editingApplication, setEditingApplication] = useState<{
    id: string
    collegeName: string
    applicationType: string
    deadline: string
    status: string
    notes?: string
  } | null>(null)
  
  // Edit program state
  const [isEditProgramDialogOpen, setIsEditProgramDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<{
    id: string
    title: string
    deadline: string
    status: string
    tuition?: number
    notes?: string
  } | null>(null)

  // Add application form state
  const [newApplication, setNewApplication] = useState({
    collegeName: "",
    applicationType: "Regular Decision",
    deadline: "",
  })

  // Add task form state
  const [newTask, setNewTask] = useState({
    title: "",
    category: "essays" as const,
    dueDate: "",
    notes: "",
  })

  // Add program form state
  const [newProgram, setNewProgram] = useState({
    title: "",
    deadline: "",
    tuition: "",
  })

  // Add program task form state
  const [newProgramTask, setNewProgramTask] = useState({
    title: "",
    category: "essays" as const,
    dueDate: "",
    notes: "",
  })

  const searchColleges = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/colleges/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.colleges || [])
    } catch (error) {
      console.error("Error searching colleges:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchColleges(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSelectCollege = (college: CollegeSearchResult) => {
    setNewApplication({
      ...newApplication,
      collegeName: college.name,
    })
    setSearchQuery("")
    setSearchResults([])
  }

  const handleAddApplication = () => {
    if (!newApplication.collegeName || !newApplication.deadline) return

    addCollegeApplication({
      collegeName: newApplication.collegeName,
      applicationType: newApplication.applicationType,
      deadline: newApplication.deadline,
      status: "planning",
      tasks: [],
    })

    setNewApplication({
      collegeName: "",
      applicationType: "Regular Decision",
      deadline: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditApplication = () => {
    if (!editingApplication) return

    updateCollegeApplication(editingApplication.id, {
      collegeName: editingApplication.collegeName,
      applicationType: editingApplication.applicationType,
      deadline: editingApplication.deadline,
      status: editingApplication.status,
      notes: editingApplication.notes,
    })

    setEditingApplication(null)
    setIsEditDialogOpen(false)
  }

  const openEditDialog = (application: any) => {
    setEditingApplication({
      id: application.id,
      collegeName: application.collegeName,
      applicationType: application.applicationType || "Regular Decision",
      deadline: application.deadline || "",
      status: application.status || "planning",
      notes: application.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleEditProgram = () => {
    if (!editingProgram) return

    updateProgramInternship(editingProgram.id, {
      title: editingProgram.title,
      deadline: editingProgram.deadline,
      status: editingProgram.status,
      tuition: editingProgram.tuition,
      notes: editingProgram.notes,
    })

    setEditingProgram(null)
    setIsEditProgramDialogOpen(false)
  }

  const openEditProgramDialog = (program: any) => {
    setEditingProgram({
      id: program.id,
      title: program.title,
      deadline: program.deadline || "",
      status: program.status || "planning",
      tuition: program.tuition || undefined,
      notes: program.notes || "",
    })
    setIsEditProgramDialogOpen(true)
  }

  const handleAddTask = () => {
    if (!selectedApplicationId || !newTask.title) return

    addTaskToApplication(selectedApplicationId, {
      title: newTask.title,
      category: newTask.category,
      completed: false,
      dueDate: newTask.dueDate || undefined,
      notes: newTask.notes || undefined,
    })

    setNewTask({
      title: "",
      category: "essays",
      dueDate: "",
      notes: "",
    })
    setIsAddTaskDialogOpen(false)
  }

  const toggleExpanded = (applicationId: string) => {
    setExpandedApplications((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId)
      } else {
        newSet.add(applicationId)
      }
      return newSet
    })
  }

  const getTaskProgress = (tasks: any[] = []) => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((t) => t.completed).length
    return Math.round((completed / tasks.length) * 100)
  }

  const getTasksByCategory = (tasks: any[] = []) => {
    const categories: { [key: string]: any[] } = {}
    tasks.forEach((task) => {
      if (!categories[task.category]) {
        categories[task.category] = []
      }
      categories[task.category].push(task)
    })
    return categories
  }

  // Programs & Internships handlers
  const handleAddProgram = () => {
    if (!newProgram.title || !newProgram.deadline) return

    addProgramInternship({
      title: newProgram.title,
      deadline: newProgram.deadline,
      tuition: newProgram.tuition ? parseFloat(newProgram.tuition) : undefined,
      status: "planning",
      tasks: [],
    })

    setNewProgram({
      title: "",
      deadline: "",
      tuition: "",
    })
    setIsAddProgramDialogOpen(false)
  }

  const handleAddProgramTask = () => {
    if (!selectedProgramId || !newProgramTask.title) return

    addTaskToProgram(selectedProgramId, {
      title: newProgramTask.title,
      category: newProgramTask.category,
      completed: false,
      dueDate: newProgramTask.dueDate || undefined,
      notes: newProgramTask.notes || undefined,
    })

    setNewProgramTask({
      title: "",
      category: "essays",
      dueDate: "",
      notes: "",
    })
    setIsAddProgramTaskDialogOpen(false)
  }

  const toggleProgramExpanded = (programId: string) => {
    setExpandedPrograms((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(programId)) {
        newSet.delete(programId)
      } else {
        newSet.add(programId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3 sm:mb-4 transition-colors group -ml-2"
            >
              <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#0f172a" }}>
              Application Tracking
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600">
              Manage your applications and track your to-do items
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <Button
            variant="ghost"
            className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
              activeTab === "college"
                ? "border-b-2 border-[#a78bfa] text-[#a78bfa]"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("college")}
          >
            College Applications
          </Button>
          <Button
            variant="ghost"
            className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
              activeTab === "programs"
                ? "border-b-2 border-[#60a5fa] text-[#60a5fa]"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("programs")}
          >
            Programs & Internships
          </Button>
        </div>

        {/* College Applications Tab */}
        {activeTab === "college" && (
          <div>
            {/* Add Application Button */}
            <div className="mb-6">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: "#a78bfa" }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add College Application
                  </Button>
                </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                Add College Application
              </DialogTitle>
              <DialogDescription className="text-base">
                Search for a college and enter the application deadline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* College Search */}
              <div className="space-y-2">
                <Label htmlFor="college-search" className="text-sm font-medium">
                  Search College *
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="college-search"
                    placeholder="Type to search for colleges..."
                    value={newApplication.collegeName || searchQuery}
                    onChange={(e) => {
                      if (!newApplication.collegeName) {
                        setSearchQuery(e.target.value)
                      } else {
                        setNewApplication({ ...newApplication, collegeName: e.target.value })
                      }
                    }}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && !newApplication.collegeName && (
                  <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-lg">
                    {searchResults.map((college, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectCollege(college)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      >
                        <div className="font-medium" style={{ color: "#0f172a" }}>
                          {college.name}
                        </div>
                        <div className="text-sm text-gray-500">{college.location}</div>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                )}
              </div>

              {/* Application Type */}
              <div className="space-y-2">
                <Label htmlFor="app-type" className="text-sm font-medium">
                  Application Type *
                </Label>
                <Select
                  value={newApplication.applicationType}
                  onValueChange={(value) =>
                    setNewApplication({ ...newApplication, applicationType: value })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Early Decision">Early Decision</SelectItem>
                    <SelectItem value="Early Action">Early Action</SelectItem>
                    <SelectItem value="Regular Decision">Regular Decision</SelectItem>
                    <SelectItem value="Rolling Admission">Rolling Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium">
                  Application Deadline *
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newApplication.deadline}
                  onChange={(e) =>
                    setNewApplication({ ...newApplication, deadline: e.target.value })
                  }
                  className="h-12 rounded-xl"
                />
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
                onClick={handleAddApplication}
                disabled={!newApplication.collegeName || !newApplication.deadline}
                className="h-12 rounded-xl px-6 text-white font-semibold"
                style={{ backgroundColor: "#f89880" }}
              >
                Add Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Application Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Edit Application Details
            </DialogTitle>
            <DialogDescription className="text-base">
              Update the details for this college application.
            </DialogDescription>
          </DialogHeader>
          {editingApplication && (
            <div className="space-y-6 py-4">
              {/* College Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-college-name" className="text-sm font-medium">
                  College Name *
                </Label>
                <Input
                  id="edit-college-name"
                  value={editingApplication.collegeName}
                  onChange={(e) =>
                    setEditingApplication({ ...editingApplication, collegeName: e.target.value })
                  }
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Application Type */}
              <div className="space-y-2">
                <Label htmlFor="edit-app-type" className="text-sm font-medium">
                  Application Type *
                </Label>
                <Select
                  value={editingApplication.applicationType}
                  onValueChange={(value) =>
                    setEditingApplication({ ...editingApplication, applicationType: value })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Early Decision">Early Decision</SelectItem>
                    <SelectItem value="Early Action">Early Action</SelectItem>
                    <SelectItem value="Regular Decision">Regular Decision</SelectItem>
                    <SelectItem value="Rolling Admission">Rolling Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="edit-deadline" className="text-sm font-medium">
                  Application Deadline *
                </Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editingApplication.deadline}
                  onChange={(e) =>
                    setEditingApplication({ ...editingApplication, deadline: e.target.value })
                  }
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium">
                  Application Status *
                </Label>
                <Select
                  value={editingApplication.status}
                  onValueChange={(value) =>
                    setEditingApplication({ ...editingApplication, status: value })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-sm font-medium">
                  Notes (Optional)
                </Label>
                <Input
                  id="edit-notes"
                  placeholder="Add any additional notes..."
                  value={editingApplication.notes || ""}
                  onChange={(e) =>
                    setEditingApplication({ ...editingApplication, notes: e.target.value })
                  }
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingApplication(null)
              }}
              className="h-12 rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditApplication}
              disabled={!editingApplication?.collegeName || !editingApplication?.deadline}
              className="h-12 rounded-xl px-6 text-white font-semibold"
              style={{ backgroundColor: "#f89880" }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applications List */}
      {collegeApplications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
            <CardContent className="text-center py-16">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}
              >
                <Target className="h-12 w-12" style={{ color: "#f89880" }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                No Applications Yet
              </h3>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                Start tracking your college applications by adding your first one.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {collegeApplications.map((application, index) => {
              const isExpanded = expandedApplications.has(application.id)
              const progress = getTaskProgress(application.tasks)
              const tasksByCategory = getTasksByCategory(application.tasks)
              const totalTasks = application.tasks?.length || 0
              const completedTasks = application.tasks?.filter((t) => t.completed).length || 0

              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all">
                    {/* Application Header */}
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpanded(application.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <GraduationCap className="h-6 w-6" style={{ color: "#f89880" }} />
                            <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                              {application.collegeName}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {application.deadline
                                  ? new Date(application.deadline).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "No deadline"}
                              </span>
                            </div>
                            <Badge variant="secondary">{application.applicationType}</Badge>
                            <span className="font-medium">
                              {completedTasks}/{totalTasks} tasks completed
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-3xl font-bold mb-1" style={{ color: "#0f172a" }}>
                              {progress}%
                            </div>
                            <Progress value={progress} className="w-24 h-2" />
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Expanded Content - Task List */}
                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="space-y-6">
                          {/* Add Task Button and Edit/Delete Buttons */}
                          <div className="flex justify-between items-center border-t pt-4">
                            <div className="flex gap-2">
                              <Dialog
                                open={isAddTaskDialogOpen && selectedApplicationId === application.id}
                                onOpenChange={(open) => {
                                  setIsAddTaskDialogOpen(open)
                                  if (open) setSelectedApplicationId(application.id)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() => setSelectedApplicationId(application.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Task
                                  </Button>
                                </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                                    Add Task
                                  </DialogTitle>
                                  <DialogDescription>
                                    Add a new task to track for this application.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="task-title">Task Title *</Label>
                                    <Input
                                      id="task-title"
                                      placeholder="e.g., Write personal statement"
                                      value={newTask.title}
                                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                      className="h-12 rounded-xl"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="task-category">Category *</Label>
                                    <Select
                                      value={newTask.category}
                                      onValueChange={(value: any) =>
                                        setNewTask({ ...newTask, category: value })
                                      }
                                    >
                                      <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="essays">Essays</SelectItem>
                                        <SelectItem value="letters">Letters of Recommendation</SelectItem>
                                        <SelectItem value="transcripts">Transcripts</SelectItem>
                                        <SelectItem value="tests">Test Scores</SelectItem>
                                        <SelectItem value="application">Application Form</SelectItem>
                                        <SelectItem value="financial">Financial Aid</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="task-due-date">Due Date (Optional)</Label>
                                    <Input
                                      id="task-due-date"
                                      type="date"
                                      value={newTask.dueDate}
                                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                      className="h-12 rounded-xl"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="task-notes">Notes (Optional)</Label>
                                    <Input
                                      id="task-notes"
                                      placeholder="Any additional notes"
                                      value={newTask.notes}
                                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                                      className="h-12 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsAddTaskDialogOpen(false)}
                                    className="h-12 rounded-xl px-6"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleAddTask}
                                    disabled={!newTask.title}
                                    className="h-12 rounded-xl px-6 text-white font-semibold"
                                    style={{ backgroundColor: "#f89880" }}
                                  >
                                    Add Task
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(application)}
                                className="rounded-xl"
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Details
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCollegeApplication(application.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Application
                            </Button>
                          </div>

                          {/* Tasks by Category */}
                          {totalTasks === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                              <p>No tasks yet. Add your first task to get started!</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {Object.entries(tasksByCategory).map(([category, tasks]: [string, any[]]) => {
                                const Icon = categoryIcons[category as keyof typeof categoryIcons]
                                const label = categoryLabels[category as keyof typeof categoryLabels]

                                return (
                                  <div key={category} className="space-y-3">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Icon className="h-5 w-5" style={{ color: "#f89880" }} />
                                      <h4 className="font-semibold text-lg" style={{ color: "#0f172a" }}>
                                        {label}
                                      </h4>
                                    </div>

                                    <div className="space-y-2 pl-7">
                                      {tasks.map((task) => (
                                        <div
                                          key={task.id}
                                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                        >
                                          <Checkbox
                                            checked={task.completed}
                                            onCheckedChange={() =>
                                              toggleTaskComplete(application.id, task.id)
                                            }
                                            className="mt-0.5"
                                          />
                                          <div className="flex-1">
                                            <p
                                              className={`font-medium ${
                                                task.completed ? "line-through text-gray-400" : ""
                                              }`}
                                            >
                                              {task.title}
                                            </p>
                                            {task.dueDate && (
                                              <p className="text-xs text-gray-500 mt-1">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                              </p>
                                            )}
                                            {task.notes && (
                                              <p className="text-sm text-gray-600 mt-1">{task.notes}</p>
                                            )}
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteTask(application.id, task.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
          </div>
        )}

        {/* Programs & Internships Tab */}
        {activeTab === "programs" && (
          <div>
            {/* Add Program Button */}
            <div className="mb-6">
              <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: "#60a5fa" }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Program or Internship
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                      Add Program or Internship
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Enter the program title, deadline, and tuition information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Program Title */}
                    <div className="space-y-2">
                      <Label htmlFor="program-title" className="text-sm font-medium">
                        Program Title *
                      </Label>
                      <Input
                        id="program-title"
                        placeholder="e.g., MIT Summer Research Program"
                        value={newProgram.title}
                        onChange={(e) =>
                          setNewProgram({ ...newProgram, title: e.target.value })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>

                    {/* Deadline */}
                    <div className="space-y-2">
                      <Label htmlFor="program-deadline" className="text-sm font-medium">
                        Application Deadline *
                      </Label>
                      <Input
                        id="program-deadline"
                        type="date"
                        value={newProgram.deadline}
                        onChange={(e) =>
                          setNewProgram({ ...newProgram, deadline: e.target.value })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>

                    {/* Tuition */}
                    <div className="space-y-2">
                      <Label htmlFor="program-tuition" className="text-sm font-medium">
                        Tuition (Optional)
                      </Label>
                      <Input
                        id="program-tuition"
                        type="number"
                        placeholder="e.g., 5000"
                        value={newProgram.tuition}
                        onChange={(e) =>
                          setNewProgram({ ...newProgram, tuition: e.target.value })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddProgramDialogOpen(false)}
                      className="h-12 rounded-xl px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddProgram}
                      disabled={!newProgram.title || !newProgram.deadline}
                      className="h-12 rounded-xl px-6 text-white font-semibold"
                      style={{ backgroundColor: "#60a5fa" }}
                    >
                      Add Program
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Edit Program Dialog */}
            <Dialog open={isEditProgramDialogOpen} onOpenChange={setIsEditProgramDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Edit Program/Internship Details
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Update the details for this program or internship.
                  </DialogDescription>
                </DialogHeader>
                {editingProgram && (
                  <div className="space-y-6 py-4">
                    {/* Program Title */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-program-title" className="text-sm font-medium">
                        Program/Internship Title *
                      </Label>
                      <Input
                        id="edit-program-title"
                        value={editingProgram.title}
                        onChange={(e) =>
                          setEditingProgram({ ...editingProgram, title: e.target.value })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>

                    {/* Deadline */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-program-deadline" className="text-sm font-medium">
                        Application Deadline *
                      </Label>
                      <Input
                        id="edit-program-deadline"
                        type="date"
                        value={editingProgram.deadline}
                        onChange={(e) =>
                          setEditingProgram({ ...editingProgram, deadline: e.target.value })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-program-status" className="text-sm font-medium">
                        Application Status *
                      </Label>
                      <Select
                        value={editingProgram.status}
                        onValueChange={(value) =>
                          setEditingProgram({ ...editingProgram, status: value })
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="waitlisted">Waitlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tuition */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-program-tuition" className="text-sm font-medium">
                        Tuition (Optional)
                      </Label>
                      <Input
                        id="edit-program-tuition"
                        type="number"
                        placeholder="e.g., 5000"
                        value={editingProgram.tuition || ""}
                        onChange={(e) =>
                          setEditingProgram({ 
                            ...editingProgram, 
                            tuition: e.target.value ? parseFloat(e.target.value) : undefined 
                          })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-program-notes" className="text-sm font-medium">
                        Notes (Optional)
                      </Label>
                      <Input
                        id="edit-program-notes"
                        placeholder="Add any additional notes..."
                        value={editingProgram.notes || ""}
                        onChange={(e) =>
                          setEditingProgram({ ...editingProgram, notes: e.target.value })
                        }
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditProgramDialogOpen(false)
                      setEditingProgram(null)
                    }}
                    className="h-12 rounded-xl px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditProgram}
                    disabled={!editingProgram?.title || !editingProgram?.deadline}
                    className="h-12 rounded-xl px-6 text-white font-semibold"
                    style={{ backgroundColor: "#60a5fa" }}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Programs List */}
            {programsInternships.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                  <CardContent className="text-center py-16">
                    <div
                      className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                      style={{ backgroundColor: "rgba(96, 165, 250, 0.1)" }}
                    >
                      <Target className="h-12 w-12" style={{ color: "#60a5fa" }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      No Programs Yet
                    </h3>
                    <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                      Start tracking your summer programs and internships by adding your first one.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {programsInternships.map((program, index) => {
                    const isExpanded = expandedPrograms.has(program.id)
                    const progress = getTaskProgress(program.tasks)
                    const tasksByCategory = getTasksByCategory(program.tasks)
                    const totalTasks = program.tasks?.length || 0
                    const completedTasks = program.tasks?.filter((t) => t.completed).length || 0

                    return (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all">
                          {/* Program Header */}
                          <CardHeader
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleProgramExpanded(program.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Target className="h-6 w-6" style={{ color: "#60a5fa" }} />
                                  <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                                    {program.title}
                                  </CardTitle>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {program.deadline
                                        ? new Date(program.deadline).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })
                                        : "No deadline"}
                                    </span>
                                  </div>
                                  {program.tuition && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      <span>${program.tuition.toLocaleString()}</span>
                                    </div>
                                  )}
                                  <span className="font-medium">
                                    {completedTasks}/{totalTasks} tasks completed
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-3xl font-bold mb-1" style={{ color: "#0f172a" }}>
                                    {progress}%
                                  </div>
                                  <Progress value={progress} className="w-24 h-2" />
                                </div>
                                <Button variant="ghost" size="sm">
                                  {isExpanded ? (
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          {/* Expanded Content - Task List */}
                          {isExpanded && (
                            <CardContent className="pt-0">
                              <div className="space-y-6">
                                {/* Add Task Button and Edit/Delete Buttons */}
                                <div className="flex justify-between items-center border-t pt-4">
                                  <div className="flex gap-2">
                                    <Dialog
                                      open={isAddProgramTaskDialogOpen && selectedProgramId === program.id}
                                      onOpenChange={(open) => {
                                        setIsAddProgramTaskDialogOpen(open)
                                        if (open) setSelectedProgramId(program.id)
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="rounded-xl"
                                          onClick={() => setSelectedProgramId(program.id)}
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Add Task
                                        </Button>
                                      </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                                          Add Task
                                        </DialogTitle>
                                        <DialogDescription>
                                          Add a new task to track for this program.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="program-task-title">Task Title *</Label>
                                          <Input
                                            id="program-task-title"
                                            placeholder="e.g., Submit application form"
                                            value={newProgramTask.title}
                                            onChange={(e) => setNewProgramTask({ ...newProgramTask, title: e.target.value })}
                                            className="h-12 rounded-xl"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="program-task-category">Category *</Label>
                                          <Select
                                            value={newProgramTask.category}
                                            onValueChange={(value: any) =>
                                              setNewProgramTask({ ...newProgramTask, category: value })
                                            }
                                          >
                                            <SelectTrigger className="h-12 rounded-xl">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="essays">Essays</SelectItem>
                                              <SelectItem value="letters">Letters of Recommendation</SelectItem>
                                              <SelectItem value="transcripts">Transcripts</SelectItem>
                                              <SelectItem value="tests">Test Scores</SelectItem>
                                              <SelectItem value="application">Application Form</SelectItem>
                                              <SelectItem value="financial">Financial Aid</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="program-task-due-date">Due Date (Optional)</Label>
                                          <Input
                                            id="program-task-due-date"
                                            type="date"
                                            value={newProgramTask.dueDate}
                                            onChange={(e) => setNewProgramTask({ ...newProgramTask, dueDate: e.target.value })}
                                            className="h-12 rounded-xl"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="program-task-notes">Notes (Optional)</Label>
                                          <Input
                                            id="program-task-notes"
                                            placeholder="Any additional notes"
                                            value={newProgramTask.notes}
                                            onChange={(e) => setNewProgramTask({ ...newProgramTask, notes: e.target.value })}
                                            className="h-12 rounded-xl"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter className="gap-3">
                                        <Button
                                          variant="outline"
                                          onClick={() => setIsAddProgramTaskDialogOpen(false)}
                                          className="h-12 rounded-xl px-6"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          onClick={handleAddProgramTask}
                                          disabled={!newProgramTask.title}
                                          className="h-12 rounded-xl px-6 text-white font-semibold"
                                          style={{ backgroundColor: "#60a5fa" }}
                                        >
                                          Add Task
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditProgramDialog(program)}
                                      className="rounded-xl"
                                    >
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit Details
                                    </Button>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteProgramInternship(program.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Program
                                  </Button>
                                </div>

                                {/* Tasks by Category */}
                                {totalTasks === 0 ? (
                                  <div className="text-center py-8 text-gray-500">
                                    <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                    <p>No tasks yet. Add your first task to get started!</p>
                                  </div>
                                ) : (
                                  <div className="space-y-6">
                                    {Object.entries(tasksByCategory).map(([category, tasks]: [string, any[]]) => {
                                      const Icon = categoryIcons[category as keyof typeof categoryIcons]
                                      const label = categoryLabels[category as keyof typeof categoryLabels]

                                      return (
                                        <div key={category} className="space-y-3">
                                          <div className="flex items-center gap-2 mb-3">
                                            <Icon className="h-5 w-5" style={{ color: "#60a5fa" }} />
                                            <h4 className="font-semibold text-lg" style={{ color: "#0f172a" }}>
                                              {label}
                                            </h4>
                                          </div>

                                          <div className="space-y-2 pl-7">
                                            {tasks.map((task) => (
                                              <div
                                                key={task.id}
                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                              >
                                                <Checkbox
                                                  checked={task.completed}
                                                  onCheckedChange={() =>
                                                    toggleProgramTaskComplete(program.id, task.id)
                                                  }
                                                  className="mt-0.5"
                                                />
                                                <div className="flex-1">
                                                  <p
                                                    className={`font-medium ${
                                                      task.completed ? "line-through text-gray-400" : ""
                                                    }`}
                                                  >
                                                    {task.title}
                                                  </p>
                                                  {task.dueDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </p>
                                                  )}
                                                  {task.notes && (
                                                    <p className="text-sm text-gray-600 mt-1">{task.notes}</p>
                                                  )}
                                                </div>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => deleteProgramTask(program.id, task.id)}
                                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
