"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Award, Trash2, Edit, Clock, Users, BookOpen, Sparkles, Target, FileText } from "lucide-react"
import { useData } from "@/lib/data-context"
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
  const { activities, addActivity, deleteActivity, updateActivity, honorsAwards, addHonorAward, deleteHonorAward, updateHonorAward } = useData()

  const [activeTab, setActiveTab] = useState<"activities" | "honors" | "analyzer">("activities")

  // Activities State
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({
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
  const [analyzerInput, setAnalyzerInput] = useState("")
  const [analyzerType, setAnalyzerType] = useState<"activity" | "essay">("activity")
  const [analyzerResult, setAnalyzerResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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
    if (!analyzerInput.trim()) return

    setIsAnalyzing(true)
    setAnalyzerResult(null)

    try {
      const response = await fetch("/api/analyze-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: analyzerInput,
          type: analyzerType,
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setAnalyzerResult(data.result)
    } catch (error) {
      console.error("Error analyzing:", error)
      alert("Failed to analyze. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#0f172a" }}>
              Extracurriculars
            </h1>
            <p className="text-lg text-slate-600">
              Track your activities, honors, and awards
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "activities"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "activities" ? "#60a5fa" : "transparent" }}
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>Activities</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("honors")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "honors"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "honors" ? "#a78bfa" : "transparent" }}
            >
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Honors & Awards</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analyzer")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "analyzer"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "analyzer" ? "#f89880" : "transparent" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Analyzer</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "activities" && (
          <div className="space-y-6">
            {/* Activities Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteActivity(activity.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      {activeTab === "analyzer" && (
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
              {/* Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">What would you like to analyze?</Label>
                <div className="flex gap-3">
                  <Button
                    variant={analyzerType === "activity" ? "default" : "outline"}
                    onClick={() => setAnalyzerType("activity")}
                    className="flex-1"
                    style={{
                      backgroundColor: analyzerType === "activity" ? "#f89880" : "transparent",
                      color: analyzerType === "activity" ? "white" : "#0f172a",
                    }}
                  >
                    Activity/Honor
                  </Button>
                  <Button
                    variant={analyzerType === "essay" ? "default" : "outline"}
                    onClick={() => setAnalyzerType("essay")}
                    className="flex-1"
                    style={{
                      backgroundColor: analyzerType === "essay" ? "#f89880" : "transparent",
                      color: analyzerType === "essay" ? "white" : "#0f172a",
                    }}
                  >
                    Essay
                  </Button>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                <Label htmlFor="analyzer-input" className="text-sm font-medium">
                  {analyzerType === "activity" 
                    ? "Paste your activity or honor description"
                    : "Paste your essay or personal statement"}
                </Label>
                <Textarea
                  id="analyzer-input"
                  placeholder={
                    analyzerType === "activity"
                      ? "Example: Founded and led a tutoring program at my local library, organizing 15 volunteers to provide free homework help to 50+ elementary school students weekly. Developed curriculum materials and secured $2,000 in funding from local businesses..."
                      : "Paste your complete essay here..."
                  }
                  value={analyzerInput}
                  onChange={(e) => setAnalyzerInput(e.target.value)}
                  className="rounded-xl min-h-[300px]"
                  rows={12}
                />
                <p className="text-xs text-gray-500">
                  Tip: Include as much detail as possible for the most accurate analysis
                </p>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !analyzerInput.trim()}
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
                    Analyze
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
      )}
    </div>
  )
}
