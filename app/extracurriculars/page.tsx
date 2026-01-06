"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Award, Trash2, Edit, Clock, Users, BookOpen, Sparkles, Target, FileText, BookMarked, ArrowLeft } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ExtracurricularsPage() {
  const { data: session } = useSession()
  const { activities, addActivity, deleteActivity, updateActivity, honorsAwards, addHonorAward, deleteHonorAward, updateHonorAward, essays } = useData()

  const [activeTab, setActiveTab] = useState<"activities" | "honors" | "analyzer" | "resources">("activities")

  // Activities State
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false)
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<any>(null)
  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "",
    role: "",
    description: "",
    hoursPerWeek: "",
    weeksPerYear: "",
    yearsParticipated: "",
  })
  const [editActivity, setEditActivity] = useState({
    name: "",
    category: "",
    role: "",
    description: "",
    hoursPerWeek: "",
    weeksPerYear: "",
    yearsParticipated: "",
  })

  // Honors State
  const [isAddHonorDialogOpen, setIsAddHonorDialogOpen] = useState(false)
  const [isEditHonorDialogOpen, setIsEditHonorDialogOpen] = useState(false)
  const [editingHonor, setEditingHonor] = useState<any>(null)
  const [newHonor, setNewHonor] = useState({
    title: "",
    level: "",
    description: "",
    dateReceived: "",
  })
  const [editHonor, setEditHonor] = useState({
    title: "",
    level: "",
    description: "",
    dateReceived: "",
  })

  // Analyzer State
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set())
  const [selectedHonors, setSelectedHonors] = useState<Set<string>>(new Set())
  const [selectedEssays, setSelectedEssays] = useState<Set<string>>(new Set())
  const [analyzerResult, setAnalyzerResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Resources State
  const [resourcesCategory, setResourcesCategory] = useState<"tips" | "programs">("tips")
  const [programCategory, setProgramCategory] = useState<"medical" | "cs" | "business" | "stem" | "humanities">("medical")
  const [programSearchQuery, setProgramSearchQuery] = useState("")

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.category) return

    addActivity({
      activityName: newActivity.name,
      category: newActivity.category,
      description: newActivity.description || undefined,
      leadershipPosition: newActivity.role || undefined,
      hoursPerWeek: newActivity.hoursPerWeek ? Number.parseInt(newActivity.hoursPerWeek) : undefined,
      weeksPerYear: newActivity.weeksPerYear ? Number.parseInt(newActivity.weeksPerYear) : undefined,
      yearsParticipated: newActivity.yearsParticipated ? Number.parseInt(newActivity.yearsParticipated) : undefined,
    })

    setNewActivity({
      name: "",
      category: "",
      role: "",
      description: "",
      hoursPerWeek: "",
      weeksPerYear: "",
      yearsParticipated: "",
    })
    setIsAddActivityDialogOpen(false)
  }

  const handleOpenEditActivityDialog = (activity: any) => {
    setEditingActivity(activity)
    setEditActivity({
      name: activity.activityName,
      category: activity.category || "",
      role: activity.leadershipPosition || "",
      description: activity.description || "",
      hoursPerWeek: activity.hoursPerWeek?.toString() || "",
      weeksPerYear: activity.weeksPerYear?.toString() || "",
      yearsParticipated: activity.yearsParticipated?.toString() || "",
    })
    setIsEditActivityDialogOpen(true)
  }

  const handleEditActivity = () => {
    if (!editingActivity || !editActivity.name || !editActivity.category) return

    updateActivity(editingActivity.id, {
      activityName: editActivity.name,
      category: editActivity.category,
      description: editActivity.description || undefined,
      leadershipPosition: editActivity.role || undefined,
      hoursPerWeek: editActivity.hoursPerWeek ? Number.parseInt(editActivity.hoursPerWeek) : undefined,
      weeksPerYear: editActivity.weeksPerYear ? Number.parseInt(editActivity.weeksPerYear) : undefined,
      yearsParticipated: editActivity.yearsParticipated ? Number.parseInt(editActivity.yearsParticipated) : undefined,
    })

    setEditingActivity(null)
    setEditActivity({
      name: "",
      category: "",
      role: "",
      description: "",
      hoursPerWeek: "",
      weeksPerYear: "",
      yearsParticipated: "",
    })
    setIsEditActivityDialogOpen(false)
  }

  const handleAddHonor = () => {
    if (!newHonor.title) return

    addHonorAward({
      title: newHonor.title,
      level: newHonor.level || undefined,
      description: newHonor.description || undefined,
      dateReceived: newHonor.dateReceived || undefined,
    })

    setNewHonor({
      title: "",
      level: "",
      description: "",
      dateReceived: "",
    })
    setIsAddHonorDialogOpen(false)
  }

  const handleOpenEditHonorDialog = (honor: any) => {
    setEditingHonor(honor)
    setEditHonor({
      title: honor.title,
      level: honor.level || "",
      description: honor.description || "",
      dateReceived: honor.dateReceived || "",
    })
    setIsEditHonorDialogOpen(true)
  }

  const handleEditHonor = () => {
    if (!editingHonor || !editHonor.title) return

    updateHonorAward(editingHonor.id, {
      title: editHonor.title,
      level: editHonor.level || undefined,
      description: editHonor.description || undefined,
      dateReceived: editHonor.dateReceived || undefined,
    })

    setEditingHonor(null)
    setEditHonor({
      title: "",
      level: "",
      description: "",
      dateReceived: "",
    })
    setIsEditHonorDialogOpen(false)
  }

  const handleAnalyze = async () => {
    // Get selected items
    const selectedActivityItems = activities.filter(a => selectedActivities.has(a.id))
    const selectedHonorItems = honorsAwards.filter(h => selectedHonors.has(h.id))
    const selectedEssayItems = essays.filter(e => selectedEssays.has(e.id))

    // Check if any items are selected
    const totalSelected = selectedActivityItems.length + selectedHonorItems.length + selectedEssayItems.length
    if (totalSelected === 0) {
      alert("Please select at least one item to analyze")
      return
    }

    const startTime = Date.now()
    console.log('🎯 [FRONTEND] Starting analysis...', {
      activitiesCount: selectedActivityItems.length,
      honorsCount: selectedHonorItems.length,
      essaysCount: selectedEssayItems.length,
      totalSelected,
      timestamp: new Date().toISOString()
    })

    setIsAnalyzing(true)
    setAnalyzerResult(null)

    // Build combined text from selected items
    let combinedText = ""
    
    if (selectedActivityItems.length > 0) {
      combinedText += "ACTIVITIES:\n\n"
      selectedActivityItems.forEach((activity, idx) => {
        combinedText += `Activity ${idx + 1}: ${activity.activityName}\n`
        if (activity.category) combinedText += `Category: ${activity.category}\n`
        if (activity.leadershipPosition) combinedText += `Role: ${activity.leadershipPosition}\n`
        if (activity.description) combinedText += `Description: ${activity.description}\n`
        if (activity.hoursPerWeek && activity.weeksPerYear && activity.yearsParticipated) {
          const totalHours = activity.hoursPerWeek * activity.weeksPerYear * activity.yearsParticipated
          combinedText += `Time commitment: ${activity.hoursPerWeek} hrs/week × ${activity.weeksPerYear} weeks/year × ${activity.yearsParticipated} years = ${totalHours} total hours\n`
        }
        combinedText += "\n"
      })
    }

    if (selectedHonorItems.length > 0) {
      combinedText += "HONORS & AWARDS:\n\n"
      selectedHonorItems.forEach((honor, idx) => {
        combinedText += `Honor ${idx + 1}: ${honor.title}\n`
        if (honor.level) combinedText += `Level: ${honor.level}\n`
        if (honor.description) combinedText += `Description: ${honor.description}\n`
        if (honor.dateReceived) combinedText += `Date: ${honor.dateReceived}\n`
        combinedText += "\n"
      })
    }

    if (selectedEssayItems.length > 0) {
      combinedText += "ESSAYS:\n\n"
      selectedEssayItems.forEach((essay, idx) => {
        combinedText += `Essay ${idx + 1}: ${essay.title || 'Untitled'}\n`
        if (essay.prompt) combinedText += `Prompt: ${essay.prompt}\n`
        if (essay.content) combinedText += `Content: ${essay.content}\n`
        combinedText += "\n"
      })
    }

    // Create timeout controller
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.error('⏱️ [FRONTEND] Request timed out after 45 seconds')
      controller.abort()
    }, 45000) // 45 second timeout

    try {
      console.log('📤 [FRONTEND] Sending request to API...')
      const fetchStartTime = Date.now()
      
      const response = await fetch("/api/analyze-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: combinedText,
          type: selectedEssayItems.length > 0 ? "essay" : "activity",
        }),
        signal: controller.signal,
      })

      const fetchDuration = Date.now() - fetchStartTime
      console.log('📥 [FRONTEND] Response received:', {
        status: response.status,
        statusText: response.statusText,
        duration: `${fetchDuration}ms`,
        ok: response.ok
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ [FRONTEND] API returned error:', {
          status: response.status,
          error: errorData.error
        })
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      console.log('✅ [FRONTEND] Analysis successful:', {
        hasResult: !!data.result,
        resultKeys: data.result ? Object.keys(data.result) : [],
        totalDuration: `${Date.now() - startTime}ms`
      })
      
      setAnalyzerResult(data.result)
      
    } catch (error: any) {
      const duration = Date.now() - startTime
      console.error('💥 [FRONTEND] Error caught:', {
        duration: `${duration}ms`,
        errorName: error.name,
        errorMessage: error.message,
        fullError: error
      })
      
      if (error.name === 'AbortError') {
        alert("⏱️ Analysis timed out (45 seconds).\n\nPossible causes:\n- OpenAI API is slow\n- You selected too many items\n- Network issues\n\nTry selecting fewer items or check your internet connection.")
      } else {
        alert(`❌ Analysis failed:\n\n${error.message}\n\nCheck the browser console for more details.`)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsAnalyzing(false)
      console.log('🏁 [FRONTEND] Analysis process completed')
    }
  }

  // Helper functions for selection
  const toggleActivity = (activityId: string) => {
    const newSet = new Set(selectedActivities)
    if (newSet.has(activityId)) {
      newSet.delete(activityId)
    } else {
      newSet.add(activityId)
    }
    setSelectedActivities(newSet)
  }

  const toggleHonor = (honorId: string) => {
    const newSet = new Set(selectedHonors)
    if (newSet.has(honorId)) {
      newSet.delete(honorId)
    } else {
      newSet.add(honorId)
    }
    setSelectedHonors(newSet)
  }

  const toggleEssay = (essayId: string) => {
    const newSet = new Set(selectedEssays)
    if (newSet.has(essayId)) {
      newSet.delete(essayId)
    } else {
      newSet.add(essayId)
    }
    setSelectedEssays(newSet)
  }

  const selectAllActivities = () => {
    setSelectedActivities(new Set(activities.map(a => a.id)))
  }

  const selectAllHonors = () => {
    setSelectedHonors(new Set(honorsAwards.map(h => h.id)))
  }

  const selectAllEssays = () => {
    setSelectedEssays(new Set(essays.map(e => e.id)))
  }

  const clearAllSelections = () => {
    setSelectedActivities(new Set())
    setSelectedHonors(new Set())
    setSelectedEssays(new Set())
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
              Extracurriculars
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600">
              Track your activities, honors, and awards
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "activities"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "activities" ? "#60a5fa" : "transparent" }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Trophy className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>Activities</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("honors")}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "honors"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "honors" ? "#a78bfa" : "transparent" }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Award className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="hidden sm:inline">Honors & Awards</span>
                <span className="sm:hidden">Honors</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analyzer")}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "analyzer"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "analyzer" ? "#f89880" : "transparent" }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>Analyzer</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "resources"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "resources" ? "#34d399" : "transparent" }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <BookMarked className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>Resources</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {activeTab === "activities" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Activities Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-transparent hover:border-blue-300 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Trophy className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Activities</p>
                    <div className="text-4xl font-bold text-blue-600">{activities.length}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Activities Table */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Activities
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Your extracurricular activities and leadership roles</CardDescription>
                </div>
                <Dialog open={isAddActivityDialogOpen} onOpenChange={setIsAddActivityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      style={{ backgroundColor: "#60a5fa" }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Add Activity
                      </DialogTitle>
                      <DialogDescription className="text-base">Add a new extracurricular activity or leadership role.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-name">Activity Name *</Label>
                        <Input
                          id="activity-name"
                          placeholder="e.g., Student Government"
                          value={newActivity.name}
                          onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select value={newActivity.category} onValueChange={(value) => setNewActivity({ ...newActivity, category: value })}>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Leadership">Leadership</SelectItem>
                              <SelectItem value="Sports">Sports</SelectItem>
                              <SelectItem value="Arts">Arts</SelectItem>
                              <SelectItem value="Community Service">Community Service</SelectItem>
                              <SelectItem value="Academic">Academic</SelectItem>
                              <SelectItem value="Work Experience">Work Experience</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Leadership Position</Label>
                          <Input
                            id="role"
                            placeholder="e.g., President"
                            value={newActivity.role}
                            onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your involvement and achievements"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          className="rounded-xl"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hours">Hours/Week</Label>
                          <Input
                            id="hours"
                            type="number"
                            placeholder="10"
                            value={newActivity.hoursPerWeek}
                            onChange={(e) => setNewActivity({ ...newActivity, hoursPerWeek: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weeks">Weeks/Year</Label>
                          <Input
                            id="weeks"
                            type="number"
                            placeholder="40"
                            value={newActivity.weeksPerYear}
                            onChange={(e) => setNewActivity({ ...newActivity, weeksPerYear: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="years">Years</Label>
                          <Input
                            id="years"
                            type="number"
                            placeholder="3"
                            value={newActivity.yearsParticipated}
                            onChange={(e) => setNewActivity({ ...newActivity, yearsParticipated: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="gap-3">
                      <Button variant="outline" onClick={() => setIsAddActivityDialogOpen(false)} className="h-12 rounded-xl px-6">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddActivity}
                        disabled={!newActivity.name || !newActivity.category}
                        className="h-12 rounded-xl px-6 text-white font-semibold"
                        style={{ backgroundColor: "#60a5fa" }}
                      >
                        Add Activity
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Time Commitment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.activityName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{activity.category}</Badge>
                          </TableCell>
                          <TableCell>{activity.leadershipPosition || "Member"}</TableCell>
                          <TableCell>
                            {activity.hoursPerWeek && activity.weeksPerYear
                              ? `${activity.hoursPerWeek}h/w, ${activity.weeksPerYear}w/y`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditActivityDialog(activity)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteActivity(activity.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-16">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      No activities yet
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      Start tracking your extracurricular activities and leadership roles.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "honors" && (
          <div className="space-y-6">
            {/* Honors Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-transparent hover:border-purple-300 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Honors</p>
                    <div className="text-4xl font-bold text-purple-600">{honorsAwards.length}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Honors Table */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Honors & Awards
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Academic and extracurricular achievements</CardDescription>
                </div>
                <Dialog open={isAddHonorDialogOpen} onOpenChange={setIsAddHonorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      style={{ backgroundColor: "#a78bfa" }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Honor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Add Honor or Award
                      </DialogTitle>
                      <DialogDescription className="text-base">Record a new academic or extracurricular achievement.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="honor-title">Title *</Label>
                        <Input
                          id="honor-title"
                          placeholder="e.g., National Merit Scholar"
                          value={newHonor.title}
                          onChange={(e) => setNewHonor({ ...newHonor, title: e.target.value })}
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="level">Level</Label>
                          <Select value={newHonor.level} onValueChange={(value) => setNewHonor({ ...newHonor, level: value })}>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="School">School</SelectItem>
                              <SelectItem value="Regional">Regional</SelectItem>
                              <SelectItem value="State">State</SelectItem>
                              <SelectItem value="National">National</SelectItem>
                              <SelectItem value="International">International</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date">Date Received</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newHonor.dateReceived}
                            onChange={(e) => setNewHonor({ ...newHonor, dateReceived: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="honor-description">Description</Label>
                        <Textarea
                          id="honor-description"
                          placeholder="Describe the achievement and its significance"
                          value={newHonor.description}
                          onChange={(e) => setNewHonor({ ...newHonor, description: e.target.value })}
                          className="rounded-xl"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-3">
                      <Button variant="outline" onClick={() => setIsAddHonorDialogOpen(false)} className="h-12 rounded-xl px-6">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddHonor}
                        disabled={!newHonor.title}
                        className="h-12 rounded-xl px-6 text-white font-semibold"
                        style={{ backgroundColor: "#a78bfa" }}
                      >
                        Add Honor
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {honorsAwards.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {honorsAwards.map((honor) => (
                        <TableRow key={honor.id}>
                          <TableCell className="font-medium">{honor.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{honor.level || "N/A"}</Badge>
                          </TableCell>
                          <TableCell>
                            {honor.dateReceived ? new Date(honor.dateReceived).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditHonorDialog(honor)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteHonorAward(honor.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-16">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      No honors yet
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      Start documenting your academic and extracurricular achievements.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditActivityDialogOpen} onOpenChange={setIsEditActivityDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Edit Activity
            </DialogTitle>
            <DialogDescription className="text-base">Update your extracurricular activity or leadership role.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-activity-name">Activity Name *</Label>
              <Input
                id="edit-activity-name"
                placeholder="e.g., Student Government"
                value={editActivity.name}
                onChange={(e) => setEditActivity({ ...editActivity, name: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={editActivity.category} onValueChange={(value) => setEditActivity({ ...editActivity, category: value })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Community Service">Community Service</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Work Experience">Work Experience</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Leadership Position</Label>
                <Input
                  id="edit-role"
                  placeholder="e.g., President"
                  value={editActivity.role}
                  onChange={(e) => setEditActivity({ ...editActivity, role: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your involvement and achievements"
                value={editActivity.description}
                onChange={(e) => setEditActivity({ ...editActivity, description: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-hours">Hours/Week</Label>
                <Input
                  id="edit-hours"
                  type="number"
                  placeholder="10"
                  value={editActivity.hoursPerWeek}
                  onChange={(e) => setEditActivity({ ...editActivity, hoursPerWeek: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-weeks">Weeks/Year</Label>
                <Input
                  id="edit-weeks"
                  type="number"
                  placeholder="40"
                  value={editActivity.weeksPerYear}
                  onChange={(e) => setEditActivity({ ...editActivity, weeksPerYear: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-years">Years</Label>
                <Input
                  id="edit-years"
                  type="number"
                  placeholder="3"
                  value={editActivity.yearsParticipated}
                  onChange={(e) => setEditActivity({ ...editActivity, yearsParticipated: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsEditActivityDialogOpen(false)} className="h-12 rounded-xl px-6">
              Cancel
            </Button>
            <Button
              onClick={handleEditActivity}
              disabled={!editActivity.name || !editActivity.category}
              className="h-12 rounded-xl px-6 text-white font-semibold"
              style={{ backgroundColor: "#60a5fa" }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Honor Dialog */}
      <Dialog open={isEditHonorDialogOpen} onOpenChange={setIsEditHonorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Edit Honor/Award
            </DialogTitle>
            <DialogDescription className="text-base">Update your honor or award details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-honor-title">Title *</Label>
              <Input
                id="edit-honor-title"
                placeholder="e.g., National Merit Scholar"
                value={editHonor.title}
                onChange={(e) => setEditHonor({ ...editHonor, title: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-honor-level">Recognition Level</Label>
                <Select
                  value={editHonor.level}
                  onValueChange={(value) => setEditHonor({ ...editHonor, level: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="School">School</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="State">State</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-honor-date">Date Received</Label>
                <Input
                  id="edit-honor-date"
                  type="date"
                  value={editHonor.dateReceived}
                  onChange={(e) => setEditHonor({ ...editHonor, dateReceived: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-honor-description">Description</Label>
              <Textarea
                id="edit-honor-description"
                placeholder="Describe the achievement and its significance"
                value={editHonor.description}
                onChange={(e) => setEditHonor({ ...editHonor, description: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsEditHonorDialogOpen(false)} className="h-12 rounded-xl px-6">
              Cancel
            </Button>
            <Button
              onClick={handleEditHonor}
              disabled={!editHonor.title}
              className="h-12 rounded-xl px-6 text-white font-semibold"
              style={{ backgroundColor: "#a78bfa" }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analyzer Tab */}
      {activeTab === "analyzer" && session?.user?.id && (
        <FeatureGate userId={session.user.id} featureName="Activities & Essays Analyzer">
          <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3" style={{ color: "#0f172a" }}>
                <Sparkles className="h-6 w-6" style={{ color: "#f89880" }} />
                Activities & Essays Analyzer
              </CardTitle>
              <CardDescription className="text-base">
                Get expert admissions feedback on your activities and essays from a simulated admissions officer perspective
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selection Controls */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select items to analyze:</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllActivities}
                    disabled={activities.length === 0}
                  >
                    All Activities
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllHonors}
                    disabled={honorsAwards.length === 0}
                  >
                    All Honors
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllEssays}
                    disabled={essays.length === 0}
                  >
                    All Essays
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllSelections}
                    disabled={selectedActivities.size === 0 && selectedHonors.size === 0 && selectedEssays.size === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Activities Section */}
              {activities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#0f172a" }}>
                    <Trophy className="h-5 w-5" style={{ color: "#f89880" }} />
                    Activities ({selectedActivities.size} of {activities.length} selected)
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-xl p-3 bg-gray-50">
                    {activities.map((activity) => (
                      <label
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedActivities.has(activity.id)}
                          onChange={() => toggleActivity(activity.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{activity.activityName}</p>
                          {activity.category && (
                            <p className="text-xs text-gray-500 mt-0.5">{activity.category}</p>
                          )}
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Honors Section */}
              {honorsAwards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#0f172a" }}>
                    <Award className="h-5 w-5" style={{ color: "#a78bfa" }} />
                    Honors & Awards ({selectedHonors.size} of {honorsAwards.length} selected)
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-xl p-3 bg-gray-50">
                    {honorsAwards.map((honor) => (
                      <label
                        key={honor.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedHonors.has(honor.id)}
                          onChange={() => toggleHonor(honor.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{honor.title}</p>
                          {honor.level && (
                            <p className="text-xs text-gray-500 mt-0.5">{honor.level}</p>
                          )}
                          {honor.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{honor.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Essays Section */}
              {essays.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#0f172a" }}>
                    <FileText className="h-5 w-5" style={{ color: "#34d399" }} />
                    Essays ({selectedEssays.size} of {essays.length} selected)
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-xl p-3 bg-gray-50">
                    {essays.map((essay) => (
                      <label
                        key={essay.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEssays.has(essay.id)}
                          onChange={() => toggleEssay(essay.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{essay.title || 'Untitled Essay'}</p>
                          {essay.prompt && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{essay.prompt}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {activities.length === 0 && honorsAwards.length === 0 && essays.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No items to analyze</p>
                  <p className="text-gray-500 text-sm mt-1">Add activities, honors, or essays to get started</p>
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (selectedActivities.size === 0 && selectedHonors.size === 0 && selectedEssays.size === 0)}
                className="w-full h-12 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: "#f89880" }}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Analyze Selected Items ({selectedActivities.size + selectedHonors.size + selectedEssays.size})
                  </span>
                )}
              </Button>

              {/* Results */}
              {analyzerResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 space-y-6"
                >
                  {/* Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                      <p className="text-xs font-medium text-blue-700 mb-1">Public Flagship</p>
                      <div className="text-3xl font-bold text-blue-600">
                        {analyzerResult.scores?.public_flagship || "N/A"}<span className="text-lg">/5</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50">
                      <p className="text-xs font-medium text-purple-700 mb-1">Highly Selective</p>
                      <div className="text-3xl font-bold text-purple-600">
                        {analyzerResult.scores?.highly_selective || "N/A"}<span className="text-lg">/5</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                      <p className="text-xs font-medium text-green-700 mb-1">Essay Quality</p>
                      <div className="text-3xl font-bold text-green-600">
                        {analyzerResult.scores?.essay_quality || "N/A"}<span className="text-lg">/6</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-orange-200 bg-orange-50">
                      <p className="text-xs font-medium text-orange-700 mb-1">Overall Impact</p>
                      <div className="text-3xl font-bold text-orange-600">
                        {analyzerResult.scores?.overall || "N/A"}<span className="text-lg">/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {analyzerResult.summary && (
                    <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "#0f172a" }}>
                        <FileText className="h-5 w-5" style={{ color: "#f89880" }} />
                        Summary
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{analyzerResult.summary}</p>
                    </div>
                  )}

                  {/* Key Strengths */}
                  {analyzerResult.strengths && analyzerResult.strengths.length > 0 && (
                    <div className="p-6 rounded-xl border-2 border-green-200 bg-green-50">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-green-800">
                        <Trophy className="h-5 w-5" />
                        Key Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analyzerResult.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-green-900">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas to Improve */}
                  {analyzerResult.improvements && analyzerResult.improvements.length > 0 && (
                    <div className="p-6 rounded-xl border-2 border-orange-200 bg-orange-50">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-800">
                        <Target className="h-5 w-5" />
                        Areas to Improve
                      </h3>
                      <ul className="space-y-2">
                        {analyzerResult.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-orange-900">
                            <span className="text-orange-600 mt-1">→</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
          </div>
        </FeatureGate>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3" style={{ color: "#0f172a" }}>
                <BookMarked className="h-6 w-6" style={{ color: "#34d399" }} />
                Resources
              </CardTitle>
              <CardDescription className="text-base">
                Helpful resources and guides for building strong extracurricular profiles
              </CardDescription>
              
              {/* Sub-tabs for Tips vs Programs */}
              <div className="flex gap-3 mt-4">
                <Button
                  variant={resourcesCategory === "tips" ? "default" : "outline"}
                  onClick={() => setResourcesCategory("tips")}
                  className="rounded-xl"
                  style={{
                    backgroundColor: resourcesCategory === "tips" ? "#34d399" : "transparent",
                    color: resourcesCategory === "tips" ? "white" : "#0f172a",
                  }}
                >
                  Tips & Guides
                </Button>
                <Button
                  variant={resourcesCategory === "programs" ? "default" : "outline"}
                  onClick={() => setResourcesCategory("programs")}
                  className="rounded-xl"
                  style={{
                    backgroundColor: resourcesCategory === "programs" ? "#34d399" : "transparent",
                    color: resourcesCategory === "programs" ? "white" : "#0f172a",
                  }}
                >
                  Programs & Internships
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {resourcesCategory === "tips" && (
                <div className="grid md:grid-cols-2 gap-6">
                {/* Resource Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-6 w-6 text-green-600" />
                        <CardTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                          Building Your Profile
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Learn how to develop a compelling extracurricular profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Focus on depth over breadth - quality matters more than quantity</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Develop a "spike" or area of expertise that shows passion and commitment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Show leadership and initiative, not just participation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Document impact and achievements with specific numbers and outcomes</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Resource Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                          Activity Descriptions
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Tips for writing effective activity descriptions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Use action verbs to describe your role and impact</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Include specific numbers (hours, people helped, funds raised, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Focus on what you accomplished, not just what you did</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Keep descriptions concise but impactful (150 characters for Common App)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Resource Card 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-6 w-6 text-purple-600" />
                        <CardTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                          Honors & Awards
                        </CardTitle>
                      </div>
                      <CardDescription>
                        How to showcase your achievements effectively
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>List awards in order of significance, not chronologically</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>Include the level of recognition (school, state, national, international)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>Explain the selection process and how many students were considered</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>Connect awards to your activities and interests to show consistency</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Resource Card 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-6 w-6 text-orange-600" />
                        <CardTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                          Leadership Tips
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Strategies for demonstrating leadership in your activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>Start initiatives or projects, don't just join existing ones</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>Show how you've mentored others or built a team</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>Document measurable outcomes from your leadership</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>Leadership can be informal - show initiative even without a title</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              )}

              {resourcesCategory === "programs" && (
                <div className="space-y-6">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={programCategory === "medical" ? "default" : "outline"}
                      onClick={() => setProgramCategory("medical")}
                      className="rounded-xl"
                      style={{
                        backgroundColor: programCategory === "medical" ? "#ef4444" : "transparent",
                        color: programCategory === "medical" ? "white" : "#0f172a",
                      }}
                    >
                      Medical Programs
                    </Button>
                    <Button
                      variant={programCategory === "cs" ? "default" : "outline"}
                      onClick={() => setProgramCategory("cs")}
                      className="rounded-xl"
                      style={{
                        backgroundColor: programCategory === "cs" ? "#3b82f6" : "transparent",
                        color: programCategory === "cs" ? "white" : "#0f172a",
                      }}
                    >
                      CS Programs
                    </Button>
                    <Button
                      variant={programCategory === "business" ? "default" : "outline"}
                      onClick={() => setProgramCategory("business")}
                      className="rounded-xl"
                      style={{
                        backgroundColor: programCategory === "business" ? "#10b981" : "transparent",
                        color: programCategory === "business" ? "white" : "#0f172a",
                      }}
                    >
                      Business Programs
                    </Button>
                    <Button
                      variant={programCategory === "stem" ? "default" : "outline"}
                      onClick={() => setProgramCategory("stem")}
                      className="rounded-xl"
                      style={{
                        backgroundColor: programCategory === "stem" ? "#8b5cf6" : "transparent",
                        color: programCategory === "stem" ? "white" : "#0f172a",
                      }}
                    >
                      General STEM Programs
                    </Button>
                    <Button
                      variant={programCategory === "humanities" ? "default" : "outline"}
                      onClick={() => setProgramCategory("humanities")}
                      className="rounded-xl"
                      style={{
                        backgroundColor: programCategory === "humanities" ? "#f59e0b" : "transparent",
                        color: programCategory === "humanities" ? "white" : "#0f172a",
                      }}
                    >
                      Humanities Programs
                    </Button>
                  </div>

                  {/* Search Bar */}
                  <div className="space-y-2">
                    <Label htmlFor="program-search" className="text-sm font-medium">
                      Search Programs
                    </Label>
                    <Input
                      id="program-search"
                      placeholder="Search by program name, university, or keyword..."
                      value={programSearchQuery}
                      onChange={(e) => setProgramSearchQuery(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {/* Programs List */}
                  <div className="max-h-[600px] overflow-y-auto space-y-2">
                    {(() => {
                      const programs = programsData[programCategory] || []
                      const filtered = programSearchQuery.trim()
                        ? programs.filter((p) => p.toLowerCase().includes(programSearchQuery.toLowerCase()))
                        : programs
                      return filtered.map((program, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.01 }}
                      >
                        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <p className="font-medium text-gray-900">{program}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      ))
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Programs data organized by category
const programsData: Record<string, string[]> = {
  medical: [
    "Stanford CSSEC Cardiothoracic Surgical Skills",
    "Stanford CASP Clinical Anatomy",
    "Stanford CNI-X Neuroscience Immersion",
    "Stanford GRIPS Genomics Research",
    "Stanford IFSS Shadow Program",
    "Stanford PIPS Pediatrics Internship Program",
    "Stanford SASI Stanford Anesthesia Summer Institute",
    "Stanford STARS Reconstructive Surgery Internship",
    "Stanford SIMR Medicine Summer Research Program",
    "Stanford CSI Clinical Summer Internship",
    "Stanford EXPLORE Biomedical Research Lectures",
    "Stanford SMYSP Medical Youth Science Program",
    "Stanford Medicine Art and Anatomy",
    "Stanford SHVCA Tri-Valley Clinical Academy",
    "Stanford Neuroscience Journal Club",
    "Stanford HARRIS Neuroscience Internship",
    "Harvard Project Success",
    "Harvard Hinton Scholars",
    "Harvard HPREP",
    "NIH Summer Internship Program",
    "NIH Research Experience Program",
    "NIH Academic Internship",
    "Stony Brook Biotechnology Lab Techniques",
    "Stony Brook SARAS",
    "MSK HOPP Cancer Center",
    "OldWestBury ICaRE Summer Science",
    "UNC Rural Medicine Summer Academy",
    "Lebanon Valley Health & Biomedical Camp",
    "UCSD OPTIMUS Research Internship",
    "UCSD Medicine Program",
    "UCD Medical and Health Programs",
    "UCI Online Research Program",
    "UCI Summer Surgery Program",
    "UCI Summer Healthcare Experience",
    "UCI MedAcademy",
    "UCSF CURE Internship",
    "UCSF Investigation and Training in Careers in Health",
    "UCSF SEP Intern Program",
    "UCSF Teen Wellness Connection",
    "UCSF Teen Wellness Summit",
    "UCSF Cellular Construction Workshop",
    "UCSF HealthLink",
    "Yale Discovery to Cure Program",
    "UIUC SpHERES",
    "UIUC POETS",
    "UIUC GEnYuS",
    "Northwestern Sci-High Program",
    "Northwestern DHC Program",
    "Northwestern Health Professions Program",
    "Northwestern Kimberly Querrey Research",
    "Northwestern NM GCM Grosvenor Program",
    "Northwestern PRISM High School Program",
    "UMich Virtual Computational Biology Research",
    "UMich Computational Biology Research",
    "UMich Biotechnology Sequencing (BTS) Camp",
    "UTA Teen Med Camp",
    "Columbia Pre-College Enrichment Program",
    "Columbia BrainYac",
    "IALR Biotechnology Intern",
    "Hutch Cancer Center High School Internship Program",
    "Children's Hospital Summer Camp",
    "LAPS Summer Medical Career Program",
    "UW NeuroScience Summer Program",
    "UConn Research Apprentice Program",
    "UArizona Med-Start Health Program",
    "Jackson Laboratory Summer Student Program",
    "SanfordHealth Research Scholars Program",
    "NIH HiSTEP Scientific Training and Enrichment Program",
    "NIH Student Intern Program",
    "Monell Center Apprenticeship Program",
    "MD Anderson High School Summer Program",
    "Magee Womens Summer Internship Program",
    "JBEI Summer Science Intensive",
    "George Mason ASSIP Program",
    "Children's Hospital Summer Child Health Internship",
    "Cincinnati Org Biomedical Research Internship",
    "Cincinnati Org Summer Internship",
    "City of Hope Summer Student Academy",
    "Coriell Summer Experience",
    "Harvard CURE - Summer Only",
    "Harvard YES for CURE",
    "NYU Dentistry Saturday Academy",
    "PSU PULSE",
    "Rice NYLF Medicine & Health Care",
    "Rice PATHS-UP Young Scholar",
    "Georgetown Discover the Exciting World of Surgery",
    "Georgetown Discover Nursing and Its Vital Role in Healthcare",
    "Georgetown Start Your Journey in Medicine Here",
    "Georgetown Begin Your Medical Research Journey",
    "Georgetown The Cutting-Edge of Biological Discovery",
    "Georgetown Discover How the Systems of the Body Work Together",
    "Georgetown 3-Week Medical Academy",
    "Georgetown Nursing Academy",
    "Georgetown 1-Week Medical Academy",
    "Barnard Health and Society Institute",
    "UNLV Nurse Camp",
    "Boston University CityLab Biotechnology SummerLab",
    "UMass Trapped Ions and Photonics Research",
    "UMass Host-Microbe Mutualism",
    "UMass Advanced Bacteriophage Therapy – An Alternative to Antibiotics",
    "UMass Using Zebrafish to Study Brain Development Internship",
    "UMass Antimicrobial Drug Discovery",
    "UMass How Cells Ensure Accurate Chromosome Segregation Internship",
    "UMass Unveiling the Sugary Armor of Mycobacterial Cells",
    "UHawaii Medical Program",
    "Scripps Student Research Internships",
    "Scripps Medical Student Research Internship Program",
    "Tufts STEM + M Connect",
    "UND Harper Research Cures Cancer Corps",
    "Duke Dune Neuroscience Experience",
    "Emory NextGen High School Internship",
    "HYPOTHEkids New York Bioforce",
    "Yale YCCI Exposures Program",
    "UCSF Neuroscape Research Internship",
    "Stanford CSI (Fall) Clinical Summer Internship",
  ],
  cs: [
    "Stanford AIMI Artificial Intelligence Internship",
    "Stanford AIMI Artificial Intelligence Bootcamp",
    "Stanford AI4ALL Artificial Intelligence Bootcamp",
    "SMASH Smash Academy",
    "CSSI Google CS Summer Institute",
    "Stony Brook Della Pietra HS Program",
    "Stony Brook Computer Science and Informatics",
    "Stony Brook IAS Computes",
    "Stony Brook SYCCL",
    "Girls Who Code Self-Paced Program",
    "Lebanon Valley Computer & Data Science Camp",
    "UCSD FinDS Summer Program",
    "UMich Joy of Coding",
    "UMich R Programming & Machine Learning Camp",
    "Princeton AI4ALL Internship",
    "UTAUS Computer Science Summer Academics",
    "Microsoft Discovery Program",
    "IALR Coding and Robotics Intern",
    "CMU AI-Scholars Pre-College",
    "CMU Computational Biology Pre-College",
    "CMU CS Scholars Pre-College",
    "CMU National High School Game Academy",
    "NYU Coding for Game Design",
    "NYU Program for Automation Robotics and Coding",
    "NYU Machine Learning Program",
    "NYU Computer Science for Cyber Security",
    "UMD Trails AI",
    "UMD CreateTech Camp",
    "PSU Mark Cuban Foundation AI Bootcamp",
    "UVA Introduction to Programming Python",
    "Georgetown Explore Cyber Threats and Security",
    "Georgetown Artificial Intelligence Academy",
    "UNLV GenCyber Summer Camp",
    "UNL Raikes School Summer Camp",
    "UMass AI, Data & Ethics: Introduction to Public Interest Technology",
    "UChicago SCUBA Summer Coding",
    "Kode with Klossy Coding Program",
  ],
  business: [
    "Stony Brook Youth Entrepreneurship",
    "Babson Summer Study",
    "Barnard Pre-College",
    "Molloy Summer Academics",
    "SUSQU Pre-College",
    "UPENN Global Youth Program",
    "UCB HAAS Business",
    "LaunchX Ann Arbor Entrepreneurship",
    "LaunchX Bay Area Entrepreneurship",
    "UCLA Sports Business Academy",
    "UCLA Media & Sports Academy",
    "UCLA Digital Marketing Academy",
    "UCLA Innovation in Music Academy",
    "UCSD Business Immersion",
    "UCSD Business Research",
    "UCD Business and Technology Programs",
    "PSU Finance Camp",
    "PSU Teen Entrepreneurship Challenge",
    "PSU Business Opportunities Summer Session",
    "Lewis & Clark High School Programming",
    "UVA McIntire Business Program",
    "UW Madison Business Basics",
    "UW Madison Junior Business Badgers",
    "Georgetown Learn How Investors Create Wealth",
    "Georgetown Learn How Entrepreneurs Identify and Solve Problems",
    "Georgetown Business Academy",
    "Georgetown Economics Policy Academy",
    "Georgetown Entrepreneurship Academy",
    "Georgetown Marketing & Personal Branding Academy",
    "Georgetown Bridges to Social Justice Academy",
    "Rutgers Network For Teaching Entrepreneurship",
    "UHouston Business Summer Institutes",
    "CLA High School Internship",
  ],
  stem: [
    "MIT Internship Lincoln Laboratory",
    "Fermilab TARGET Summer Internship",
    "Fermilab TECHS Technician Education",
    "Fermilab VALOR JROTC Program",
    "Fermilab QuarkNet Summer Research Program",
    "SAGE Science Accelerating Girls' Engagement",
    "Oak Ridge NGSI Internship Program",
    "Oak Ridge NGP Computing Program",
    "Oak Ridge ARC Stem Academy",
    "SAGE LLNL Summer Camp LLNL",
    "SAGE LBL Summer Camp LBL",
    "Boston University Research in Science & Engineering Program",
    "SEAP Apprenticeship Program",
    "UCSC Science Internship",
    "COSMOS Summer School for Mathematics & Science",
    "MIT MITES Program",
    "MIT RSI Program",
    "NASA Internship Program",
    "NASA CCRI - Climate Change",
    "NASA CCRI - Land",
    "NASA CCRI - Snow",
    "NASA CCRI - Urban",
    "NASA HAS Astronomy",
    "Stanford Young Investigators",
    "MIT Beaverworks",
    "SSP Science Program",
    "Waterloo Quantum School",
    "UCD Young Scholars Program",
    "US AEOP GEMS",
    "US AEOP High School Internships",
    "US AEOP UNITE",
    "BHE Healthcare Exploration",
    "Roswell Park Scholars Program",
    "Roswell Park Summer Cancer Research",
    "Stony Brook Summer Research",
    "Stony Brook Simmons Research",
    "Stony Brook Forensics Exploration",
    "Hofstra SSRP",
    "Rockefeller Neuroscience Program",
    "Boston University High School Honors",
    "Boston University Summer Challenge",
    "Boston University Academic Immersion",
    "SAME STEM Camp",
    "USNA Summer Stem",
    "Texas Tech Anson L. Clark Scholars Program",
    "MSU HSHP",
    "UIowa Belin-Blank Research Center",
    "SPARC Quantitative Skills Program",
    "UF CPET Science Training Program",
    "Stevens Institute Pre-College",
    "NYU OGStem Program",
    "NYSA National Youth Science Camp",
    "Lebanon Valley Actuarial Science Camp",
    "BNL High School Research Program",
    "UCSB Pre-College",
    "UCSD ENLACE Summer Research",
    "UCSD Research Experience",
    "UCSD Science Academy",
    "UCSD Life Sciences Research",
    "UCSD Marine Science Research",
    "UCSD Design Lab Program",
    "Rosetta Institute of Biomedical Research",
    "PARI Summer Research Experience",
    "UCD Environmental Sciences Programs",
    "UCSB Research Mentorship Program",
    "Project Scientist Scholars Program",
    "Caltech Earthquake Program",
    "Yale Pathways Research Internship",
    "UIUC DSAP Program",
    "UIUC Young Scholars Research",
    "Northwestern NURPH",
    "UMich Math and Science Scholars",
    "UMich Sequencing Your Genome Camp",
    "UMich Thinkabit Summer Camp",
    "UMich Aspirnaut Summer Research",
    "JHU ASPIRE",
    "JHU STEM Academy",
    "JHU Summer Academic Research Experience",
    "Princeton Laboratory Learning Program",
    "PPPL Summer Internship",
    "UTA Fab Lab: 3D Printing",
    "UTAUS Summer Learning Academy",
    "IALR Communications Intern",
    "IALR Information Technology Intern",
    "IALR AgTech Research Intern",
    "Smith Summer Science & Engineering Program",
    "Cooper Union Summer Stem",
    "UNH HighTech Bound",
    "UR Laboratory for Laser Energetics",
    "Telluride TASS Summer Seminar",
    "UNO AMRI Research Program",
    "Echinacea Project Research Intern",
    "Suny Oneonta BFS Internship",
    "Broad Institute Summer Scholars Program",
    "BTI High School Research Internship",
    "NYSCamp Youth Science Camp",
    "Duke Marine Lab Pre-College",
    "CMU Summer Academy for Math & Science",
    "CMU PGSS",
    "CMU Project Ignite",
    "UPENN Engineering, Math and Science Camp",
    "UPENN Upward Bound Math Science",
    "UPENN Upward Bound",
    "TAMU AggieSTEM",
    "NYU User Experience Design",
    "NYU Science Explorations Program",
    "NYU Design, Invent & Innovate",
    "NYU GSTEM",
    "NYU GSTEM Online Data Science",
    "NYU XR Through Virtual Worlds",
    "NYU Science of Smart Cities",
    "Emory Summer Science Academy",
    "UChicago RIBS - Research in Biological Sciences",
    "UChicago Young Innovators Climate Program",
    "UChicago Quantum Quickstart",
    "UChicago Voltage Scholars",
    "UChicago Neubauer Phoenix Scholars",
    "UMD Bug Camp",
    "UMD WIE Rise Summer Research",
    "NCSU NC Youth Institute",
    "NCSU Horticultural Science Summer Institute",
    "NCSU CAALS3D",
    "NCSU Poultry Summer Science Institute",
    "NCSU Livestock Science Camp",
    "NCSU IFAL",
    "PSU Forensic Science Camp",
    "PSU TechCrafters",
    "PSU College-Bound STEM Academy",
    "PSU Earth & Mineral Science Exposition",
    "PSU Research Internships",
    "Brown Stem-Rising",
    "Vanderbilt Research Experience for High School Students",
    "Vanderbilt Discover Biomedical Research Summer Program",
    "Rice Aerospace Academy",
    "Rice Tapia STEM Camps",
    "Rice Biotech Academy",
    "Rice STEM Academy",
    "Rice Forensics Investigators",
    "OHSU Ted R. Lilley CURE Program",
    "Oregon State Food Science Camp",
    "Oregon State \"Blender\" Camp",
    "Oregon State Toxicology Camp",
    "Oregon State Virtual \"Processing\" Camp",
    "Oregon State Microbiology Camp",
    "Oregon State Cyber Camp",
    "ASE Apprenticeships in Science & Engineering",
    "Oregon State Summer Academy for Math & Science",
    "UVA Forensic Science Camp",
    "UW Madison ARISE UWCCC Summer High School Cancer Research",
    "Oklahoma State CEAT - Automation and Robotics Discovery",
    "Oklahoma State Engineering Discovery for Girls",
    "Oklahoma State Fire Protection Discovery Program",
    "Oklahoma State OKStars Summer Research Program",
    "Oklahoma State NSTI Summer Camp",
    "Binghamton UBMS Summer Program",
    "Binghamton Summer Research Immersion",
    "Binghamton FtRi Research",
    "Georgetown Psychology and Its Impact on Everyday Life",
    "Georgetown Biotechnology for Science & Health Academy",
    "Georgetown Forensic Science Academy",
    "Barnard Sustainable Food and the City",
    "Rutgers 4H-RU Program",
    "Governor's School New Jersey Governor's School in the Sciences",
    "UNH Tech Camp",
    "UNLV Summer STEM Camp",
    "UNLV Fall STEM Camp",
    "UNLV Student Interactions with Science, Technology, Engineering and Mathematics",
    "UNL Discover Actuarial Science",
    "YNS Emergent Quantum Materials and Technologies",
    "YNS Biomechanics at UNO",
    "YNS Climate Science at UNL",
    "UMass Summer Design Academy",
    "Boston University The Artemis Project",
    "UMass Plant Signal Transduction and Reproduction",
    "UMass Research Intensive in Food Science.",
    "UMass Pollinator Health and Ecology",
    "Amherst Summer STEM Program",
    "UCB Experience in Research",
    "USC Bridge Undergraduate Science Jr. Program",
    "ASDRP Aspiring Scholars Directed Research Program",
    "GiS Ewgis Program",
    "Duke Summer Stem Academy",
    "Dartmouth JSEP",
    "Georgia Tech STEM @GTRI",
    "Bigelow Keller BLOOM Program",
    "NSS SPUN Debate Program",
    "3M Young Scientists Annual Challenge",
    "USC SHINE Poster Session",
    "Rockefeller Summer Science Research Program",
    "KGI Summer STEM Internships",
  ],
  humanities: [
    "Stanford Summer Humanities",
    "Stanford SPICE Scholars Program",
    "Stanford SLSI Intensive Law Program",
    "American Museum MEEP",
    "American Museum SRMP",
    "UCLA Writing Project Summer Camp",
    "UCI Summer Youth Program",
    "Yale Summer Debate Program",
    "Yale Summer Journalism Program",
    "Yale Citizens Thinkers Writers",
    "Georgia Tech College of Design Pre-College",
    "Northwestern National High School Institute",
    "Northwestern Journalism Institute",
    "Northwestern Civic Leadership Institute",
    "Northwestern Online Leadership Intensive",
    "Princeton Summer Journalism Program",
    "Princeton The James Madison Seminar",
    "UTA Choir Camp",
    "UTA Summer Concert Camp",
    "UTA Marching Band Camp",
    "UTA Summer Strings",
    "UTA Speech & Debate Camp",
    "Columbia Columbia Writing Academy: Summer",
    "Columbia Summer Journalism Workshop",
    "USC Annenberg Youth Academy",
    "NSLI-Y National Security Language Initiative",
    "Williams Pre-College",
    "CMU Writing & Culture",
    "UPENN Management & Technology Summer Institute",
    "NYU Summer Journalism",
    "NYU High School Law Institute",
    "NYU Democracy Scholars",
    "NYU Urban Journalism Workshop",
    "NYU College Access Leadership Institute",
    "NYU Collegiate Seminar Program",
    "Emory YTI Online",
    "UChicago Summer Language Institute",
    "UChicago Emerging Rural Leaders I",
    "UChicago Parrhesia Ambassador Program",
    "UChicago Young Innovators Program",
    "UChicago China Emerging Leaders",
    "UChicago Emerging Rural Leaders II",
    "Rutgers Building Leadership Strategies Summer Academy",
    "Rutgers Pre-Law and Mock Trial Summer Academy",
    "Rutgers Language Summer Academy",
    "UNLV Civic Engagement Leadership Academy",
    "Boston University Center for English Language and Orientation Programs",
    "Boston University Summer Journalism Academy",
    "Boston University Summer Preview Program",
    "Amherst Summer Humanities and Social Science Program",
    "Debate Speech & Debate",
    "US Senate Senate Page Program",
    "Stanford SPICE Stanford E-Japan Program",
    "Stanford SPICE Sejong Korea Scholars Program",
    "Stanford SPICE Stanford E-China Program",
    "Stanford SPICE China Scholars Program",
    "Stanford SPICE Reischhauer Program",
  ],
}
