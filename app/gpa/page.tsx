"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Plus, TrendingUp, TrendingDown, BarChart3, Calculator, Trash2, Award, Target, Sparkles, ChevronRight, Pencil, FileText, Trophy, BookOpen, ArrowLeft } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"

export default function AcademicsPage() {
  const { 
    gpaEntries, 
    addGpaEntry, 
    deleteGpaEntry, 
    updateGpaEntry,
    testScores,
    addTestScore,
    deleteTestScore
  } = useData()

  const [activeTab, setActiveTab] = useState<"gpa" | "tests" | "resources">("gpa")

  // GPA State
  const [isAddGpaDialogOpen, setIsAddGpaDialogOpen] = useState(false)
  const [isEditGpaDialogOpen, setIsEditGpaDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [newGpaEntry, setNewGpaEntry] = useState({
    semester: "",
    year: new Date().getFullYear(),
    gpa: "",
    weightedGpa: "",
    credits: "",
    classRank: "",
    classSize: "",
  })
  const [editGpaEntry, setEditGpaEntry] = useState({
    semester: "",
    year: new Date().getFullYear(),
    gpa: "",
    weightedGpa: "",
    credits: "",
    classRank: "",
    classSize: "",
  })

  // Test Scores State
  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false)
  const [newTestScore, setNewTestScore] = useState({
    testType: "",
    subject: "",
    score: "",
    maxScore: "",
    testDate: "",
  })

  // GPA Functions
  const calculateCumulativeGPA = () => {
    if (gpaEntries.length === 0) return "0.00"
    const totalGPA = gpaEntries.reduce((sum, entry) => sum + entry.gpa, 0)
    return (totalGPA / gpaEntries.length).toFixed(2)
  }

  const calculateCumulativeWeightedGPA = () => {
    const entriesWithWeighted = gpaEntries.filter((entry) => entry.weightedGpa)
    if (entriesWithWeighted.length === 0) return "0.00"
    const totalWeightedGPA = entriesWithWeighted.reduce((sum, entry) => sum + (entry.weightedGpa || 0), 0)
    return (totalWeightedGPA / entriesWithWeighted.length).toFixed(2)
  }

  const getLatestRank = () => {
    const sortedEntries = [...gpaEntries].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return a.semester === "Spring" ? 1 : -1
    })
    return sortedEntries[0]?.classRank
  }

  const getLatestClassSize = () => {
    const sortedEntries = [...gpaEntries].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return a.semester === "Spring" ? 1 : -1
    })
    return sortedEntries[0]?.classSize
  }

  const getGPATrend = () => {
    if (gpaEntries.length < 2) return null
    const sorted = [...gpaEntries].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      const semesterOrder = { Fall: 0, Spring: 1, Summer: 2 }
      return semesterOrder[a.semester as keyof typeof semesterOrder] - semesterOrder[b.semester as keyof typeof semesterOrder]
    })
    const firstGPA = sorted[0].gpa
    const lastGPA = sorted[sorted.length - 1].gpa
    return lastGPA - firstGPA
  }

  const handleAddGpaEntry = () => {
    if (!newGpaEntry.semester || !newGpaEntry.gpa) return

    addGpaEntry({
      semester: newGpaEntry.semester,
      year: newGpaEntry.year,
      gpa: Number.parseFloat(newGpaEntry.gpa),
      weightedGpa: newGpaEntry.weightedGpa ? Number.parseFloat(newGpaEntry.weightedGpa) : undefined,
      credits: newGpaEntry.credits ? Number.parseInt(newGpaEntry.credits) : undefined,
      classRank: newGpaEntry.classRank ? Number.parseInt(newGpaEntry.classRank) : undefined,
      classSize: newGpaEntry.classSize ? Number.parseInt(newGpaEntry.classSize) : undefined,
    })

    setNewGpaEntry({
      semester: "",
      year: new Date().getFullYear(),
      gpa: "",
      weightedGpa: "",
      credits: "",
      classRank: "",
      classSize: "",
    })
    setIsAddGpaDialogOpen(false)
  }

  const handleOpenEditDialog = (entry: any) => {
    setEditingEntry(entry)
    setEditGpaEntry({
      semester: entry.semester,
      year: entry.year,
      gpa: entry.gpa.toString(),
      weightedGpa: entry.weightedGpa ? entry.weightedGpa.toString() : "",
      credits: entry.credits ? entry.credits.toString() : "",
      classRank: entry.classRank ? entry.classRank.toString() : "",
      classSize: entry.classSize ? entry.classSize.toString() : "",
    })
    setIsEditGpaDialogOpen(true)
  }

  const handleEditGpaEntry = () => {
    if (!editingEntry || !editGpaEntry.semester || !editGpaEntry.gpa) return

    updateGpaEntry(editingEntry.id, {
      semester: editGpaEntry.semester,
      year: editGpaEntry.year,
      gpa: Number.parseFloat(editGpaEntry.gpa),
      weightedGpa: editGpaEntry.weightedGpa ? Number.parseFloat(editGpaEntry.weightedGpa) : undefined,
      credits: editGpaEntry.credits ? Number.parseInt(editGpaEntry.credits) : undefined,
      classRank: editGpaEntry.classRank ? Number.parseInt(editGpaEntry.classRank) : undefined,
      classSize: editGpaEntry.classSize ? Number.parseInt(editGpaEntry.classSize) : undefined,
    })

    setEditingEntry(null)
    setEditGpaEntry({
      semester: "",
      year: new Date().getFullYear(),
      gpa: "",
      weightedGpa: "",
      credits: "",
      classRank: "",
      classSize: "",
    })
    setIsEditGpaDialogOpen(false)
  }

  // Test Score Functions
  const getSATComposite = () => {
    const satScores = testScores.filter((score) => score.testType === "SAT")
    if (satScores.length === 0) return "N/A"
    return satScores.reduce((sum, score) => sum + score.score, 0).toString()
  }

  const getHighestAPScore = () => {
    const apScores = testScores.filter((score) => score.testType === "AP")
    if (apScores.length === 0) return "N/A"
    return Math.max(...apScores.map((score) => score.score)).toString()
  }

  const handleAddTestScore = () => {
    if (!newTestScore.testType || !newTestScore.score) return

    addTestScore({
      testType: newTestScore.testType,
      subject: newTestScore.subject || undefined,
      score: Number.parseInt(newTestScore.score),
      maxScore: newTestScore.maxScore ? Number.parseInt(newTestScore.maxScore) : undefined,
      testDate: newTestScore.testDate || undefined,
    })

    setNewTestScore({
      testType: "",
      subject: "",
      score: "",
      maxScore: "",
      testDate: "",
    })
    setIsAddTestDialogOpen(false)
  }

  const cumulativeGPA = calculateCumulativeGPA()
  const cumulativeWeightedGPA = calculateCumulativeWeightedGPA()
  const latestRank = getLatestRank()
  const latestClassSize = getLatestClassSize()
  const gpaTrend = getGPATrend()

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
              Academics
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600">
              Track your GPA and standardized test scores
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("gpa")}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "gpa"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "gpa" ? "#f89880" : "transparent" }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <BarChart3 className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>GPA</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "tests"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "tests" ? "#f89880" : "transparent" }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <BookOpen className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>Test Scores</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "resources"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              style={{ backgroundColor: activeTab === "resources" ? "#f89880" : "transparent" }}
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Resources</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {activeTab === "gpa" && (
          <div className="space-y-6">
            {/* GPA Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cumulative GPA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-coral-50 to-white border-2 hover:border-[#f89880] transition-all shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <BarChart3 className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      {gpaTrend !== null && (
                        <div className="flex items-center gap-1">
                          {gpaTrend > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : gpaTrend < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span
                            className={`text-sm font-medium ${
                              gpaTrend > 0 ? "text-green-600" : gpaTrend < 0 ? "text-red-600" : "text-gray-600"
                            }`}
                          >
                            {gpaTrend > 0 ? "+" : ""}
                            {gpaTrend?.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Cumulative GPA</p>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      {cumulativeGPA}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: "#f89880" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(Number.parseFloat(cumulativeGPA) / 4) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Out of 4.0</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Weighted GPA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-white border-2 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-blue-100">
                        <Calculator className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Weighted GPA</p>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      {cumulativeWeightedGPA}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(Number.parseFloat(cumulativeWeightedGPA) / 5) * 100}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Out of 5.0</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Class Rank Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-purple-50 to-white border-2 hover:border-purple-400 transition-all shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-2xl bg-purple-100 mb-4 w-fit">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Class Rank</p>
                    <div className="text-4xl font-bold mb-2" style={{ color: "#0f172a" }}>
                      {latestRank ? `#${latestRank}` : "N/A"}
                    </div>
                    {latestRank && latestClassSize && (
                      <p className="text-sm text-slate-500">
                        Top {Math.round((latestRank / latestClassSize) * 100)}% of {latestClassSize}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Total Semesters Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-white border-2 hover:border-green-400 transition-all shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-2xl bg-green-100 mb-4 w-fit">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Total Semesters</p>
                    <div className="text-4xl font-bold" style={{ color: "#0f172a" }}>
                      {gpaEntries.length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* GPA Entries - Rest of the GPA section content follows the same pattern as before... */}
            {/* I'll create a simplified version for brevity */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                      GPA History
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      Track your semester-by-semester academic performance
                    </CardDescription>
                  </div>
                  <Dialog open={isAddGpaDialogOpen} onOpenChange={setIsAddGpaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                        style={{ backgroundColor: "#f89880" }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Semester
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                          Add New Semester
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Enter your GPA and other academic information for a new semester.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="semester" className="text-sm font-medium">
                              Semester *
                            </Label>
                            <Select
                              value={newGpaEntry.semester}
                              onValueChange={(value) => setNewGpaEntry({ ...newGpaEntry, semester: value })}
                            >
                              <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Fall">Fall</SelectItem>
                                <SelectItem value="Spring">Spring</SelectItem>
                                <SelectItem value="Summer">Summer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="year" className="text-sm font-medium">
                              Year *
                            </Label>
                            <Input
                              id="year"
                              type="number"
                              placeholder="2024"
                              value={newGpaEntry.year}
                              onChange={(e) => setNewGpaEntry({ ...newGpaEntry, year: Number.parseInt(e.target.value) })}
                              className="h-12 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gpa" className="text-sm font-medium">
                              Unweighted GPA (4.0 scale) *
                            </Label>
                            <Input
                              id="gpa"
                              type="number"
                              step="0.01"
                              min="0"
                              max="4"
                              placeholder="3.85"
                              value={newGpaEntry.gpa}
                              onChange={(e) => setNewGpaEntry({ ...newGpaEntry, gpa: e.target.value })}
                              className="h-12 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="weighted-gpa" className="text-sm font-medium">
                              Weighted GPA (5.0 scale)
                            </Label>
                            <Input
                              id="weighted-gpa"
                              type="number"
                              step="0.01"
                              min="0"
                              max="5"
                              placeholder="4.20"
                              value={newGpaEntry.weightedGpa}
                              onChange={(e) => setNewGpaEntry({ ...newGpaEntry, weightedGpa: e.target.value })}
                              className="h-12 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="credits" className="text-sm font-medium">
                            Total Credits
                          </Label>
                          <Input
                            id="credits"
                            type="number"
                            placeholder="30"
                            value={newGpaEntry.credits}
                            onChange={(e) => setNewGpaEntry({ ...newGpaEntry, credits: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="class-rank" className="text-sm font-medium">
                              Class Rank
                            </Label>
                            <Input
                              id="class-rank"
                              type="number"
                              placeholder="15"
                              value={newGpaEntry.classRank}
                              onChange={(e) => setNewGpaEntry({ ...newGpaEntry, classRank: e.target.value })}
                              className="h-12 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="class-size" className="text-sm font-medium">
                              Class Size
                            </Label>
                            <Input
                              id="class-size"
                              type="number"
                              placeholder="350"
                              value={newGpaEntry.classSize}
                              onChange={(e) => setNewGpaEntry({ ...newGpaEntry, classSize: e.target.value })}
                              className="h-12 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setIsAddGpaDialogOpen(false)} className="h-12 rounded-xl px-6">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddGpaEntry}
                          disabled={!newGpaEntry.semester || !newGpaEntry.gpa}
                          className="h-12 rounded-xl px-6 text-white font-semibold"
                          style={{ backgroundColor: "#f89880" }}
                        >
                          Add Semester
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {gpaEntries.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {gpaEntries.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group"
                        >
                          <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all">
                            <div className="flex items-center gap-6 flex-1">
                              {/* Semester Badge */}
                              <div
                                className="flex flex-col items-center justify-center min-w-[120px] p-4 rounded-xl"
                                style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}
                              >
                                <span className="text-lg font-bold" style={{ color: "#f89880" }}>
                                  {entry.semester}
                                </span>
                                <span className="text-sm font-semibold text-slate-600">{entry.year}</span>
                              </div>

                              {/* GPA Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                                <div>
                                  <p className="text-xs text-slate-500 mb-1 font-medium">Unweighted GPA</p>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                                      {entry.gpa.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-slate-400">/4.0</span>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-500 mb-1 font-medium">Weighted GPA</p>
                                  {entry.weightedGpa ? (
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                                        {entry.weightedGpa.toFixed(2)}
                                      </span>
                                      <span className="text-sm text-slate-400">/5.0</span>
                                    </div>
                                  ) : (
                                    <span className="text-lg text-slate-300">N/A</span>
                                  )}
                                </div>

                                <div>
                                  <p className="text-xs text-slate-500 mb-1 font-medium">Credits</p>
                                  <span className="text-xl font-semibold text-slate-700">
                                    {entry.credits || <span className="text-slate-300">N/A</span>}
                                  </span>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-500 mb-1 font-medium">Class Rank</p>
                                  {entry.classRank ? (
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-semibold text-slate-700">#{entry.classRank}</span>
                                      {entry.classSize && <span className="text-sm text-slate-400">/{entry.classSize}</span>}
                                    </div>
                                  ) : (
                                    <span className="text-lg text-slate-300">N/A</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Edit and Delete Buttons */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditDialog(entry)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl p-3"
                              >
                                <Pencil className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteGpaEntry(entry.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl p-3"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
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
                      <BarChart3 className="h-12 w-12" style={{ color: "#f89880" }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      No GPA entries yet
                    </h3>
                    <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                      Start tracking your academic performance by adding your first semester.
                    </p>
                    <Button
                      onClick={() => setIsAddGpaDialogOpen(true)}
                      className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 h-12 px-8"
                      style={{ backgroundColor: "#f89880" }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Semester
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Edit GPA Dialog */}
            <Dialog open={isEditGpaDialogOpen} onOpenChange={setIsEditGpaDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Edit Semester
                  </DialogTitle>
                  <DialogDescription className="text-base">Update your GPA and academic information for this semester.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-semester" className="text-sm font-medium">
                        Semester *
                      </Label>
                      <Select
                        value={editGpaEntry.semester}
                        onValueChange={(value) => setEditGpaEntry({ ...editGpaEntry, semester: value })}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fall">Fall</SelectItem>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-year" className="text-sm font-medium">
                        Year *
                      </Label>
                      <Input
                        id="edit-year"
                        type="number"
                        placeholder="2024"
                        value={editGpaEntry.year}
                        onChange={(e) => setEditGpaEntry({ ...editGpaEntry, year: Number.parseInt(e.target.value) })}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-gpa" className="text-sm font-medium">
                        Unweighted GPA (4.0 scale) *
                      </Label>
                      <Input
                        id="edit-gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        placeholder="3.85"
                        value={editGpaEntry.gpa}
                        onChange={(e) => setEditGpaEntry({ ...editGpaEntry, gpa: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-weighted-gpa" className="text-sm font-medium">
                        Weighted GPA (5.0 scale)
                      </Label>
                      <Input
                        id="edit-weighted-gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        placeholder="4.20"
                        value={editGpaEntry.weightedGpa}
                        onChange={(e) => setEditGpaEntry({ ...editGpaEntry, weightedGpa: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-credits" className="text-sm font-medium">
                      Total Credits
                    </Label>
                    <Input
                      id="edit-credits"
                      type="number"
                      placeholder="30"
                      value={editGpaEntry.credits}
                      onChange={(e) => setEditGpaEntry({ ...editGpaEntry, credits: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-class-rank" className="text-sm font-medium">
                        Class Rank
                      </Label>
                      <Input
                        id="edit-class-rank"
                        type="number"
                        placeholder="15"
                        value={editGpaEntry.classRank}
                        onChange={(e) => setEditGpaEntry({ ...editGpaEntry, classRank: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-class-size" className="text-sm font-medium">
                        Class Size
                      </Label>
                      <Input
                        id="edit-class-size"
                        type="number"
                        placeholder="350"
                        value={editGpaEntry.classSize}
                        onChange={(e) => setEditGpaEntry({ ...editGpaEntry, classSize: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button variant="outline" onClick={() => setIsEditGpaDialogOpen(false)} className="h-12 rounded-xl px-6">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditGpaEntry}
                    disabled={!editGpaEntry.semester || !editGpaEntry.gpa}
                    className="h-12 rounded-xl px-6 text-white font-semibold"
                    style={{ backgroundColor: "#f89880" }}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-6">
            {/* Test Scores Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">SAT Composite</CardTitle>
                    <FileText className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{getSATComposite()}</div>
                    <p className="text-xs text-gray-500 mt-1">out of 1600</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Highest AP Score</CardTitle>
                    <Trophy className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{getHighestAPScore()}</div>
                    <p className="text-xs text-gray-500 mt-1">out of 5</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
                    <Target className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{testScores.length}</div>
                    <p className="text-xs text-gray-500 mt-1">tests recorded</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">AP Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {testScores.filter((score) => score.testType === "AP").length}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">AP exams taken</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Test Scores Table */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Test Score History
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Your standardized test performance over time</CardDescription>
                </div>
                <Dialog open={isAddTestDialogOpen} onOpenChange={setIsAddTestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      style={{ backgroundColor: "#f89880" }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Test Score
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Add New Test Score
                      </DialogTitle>
                      <DialogDescription className="text-base">Record a new standardized test score to track your progress.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="testType" className="text-sm font-medium">
                          Test Type *
                        </Label>
                        <Select value={newTestScore.testType} onValueChange={(value) => setNewTestScore({ ...newTestScore, testType: value })}>
                          <SelectTrigger className="h-12 rounded-xl">
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
                        <Label htmlFor="subject" className="text-sm font-medium">
                          Subject (Optional)
                        </Label>
                        <Input
                          id="subject"
                          value={newTestScore.subject}
                          onChange={(e) => setNewTestScore({ ...newTestScore, subject: e.target.value })}
                          placeholder="e.g., Math, Reading, Chemistry"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="score" className="text-sm font-medium">
                            Score *
                          </Label>
                          <Input
                            id="score"
                            type="number"
                            value={newTestScore.score}
                            onChange={(e) => setNewTestScore({ ...newTestScore, score: e.target.value })}
                            placeholder="750"
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxScore" className="text-sm font-medium">
                            Max Score
                          </Label>
                          <Input
                            id="maxScore"
                            type="number"
                            value={newTestScore.maxScore}
                            onChange={(e) => setNewTestScore({ ...newTestScore, maxScore: e.target.value })}
                            placeholder="800"
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testDate" className="text-sm font-medium">
                          Test Date
                        </Label>
                        <Input
                          id="testDate"
                          type="date"
                          value={newTestScore.testDate}
                          onChange={(e) => setNewTestScore({ ...newTestScore, testDate: e.target.value })}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-3">
                      <Button variant="outline" onClick={() => setIsAddTestDialogOpen(false)} className="h-12 rounded-xl px-6">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddTestScore}
                        disabled={!newTestScore.testType || !newTestScore.score}
                        className="h-12 rounded-xl px-6 text-white font-semibold"
                        style={{ backgroundColor: "#f89880" }}
                      >
                        Add Test Score
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-6">
                {testScores.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
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
                            {score.testDate ? new Date(score.testDate).toLocaleDateString() : <span className="text-gray-400">N/A</span>}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTestScore(score.id)}
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                  >
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                      No test scores yet
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      Add your first standardized test score to start tracking your progress.
                    </p>
                    <Button
                      onClick={() => setIsAddTestDialogOpen(true)}
                      className="text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 h-12 px-8"
                      style={{ backgroundColor: "#f89880" }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Test Score
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-6">
            {/* General Resources */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3" style={{ color: "#0f172a" }}>
                  <Sparkles className="h-6 w-6" style={{ color: "#f89880" }} />
                  General Study Resources
                </CardTitle>
                <CardDescription className="text-base">
                  Essential tools for test prep and academic success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://www.khanacademy.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <BookOpen className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#f89880] transition-colors" style={{ color: "#0f172a" }}>
                          Khan Academy
                        </h3>
                        <p className="text-sm text-gray-600">
                          Free standardized test prep (SAT, ACT) and academic courses
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#f89880] transition-colors" />
                    </div>
                  </a>

                  <a
                    href="https://satsuite.collegeboard.org/sat/practice-preparation/practice-questions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <Target className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#f89880] transition-colors" style={{ color: "#0f172a" }}>
                          SAT Question Bank
                        </h3>
                        <p className="text-sm text-gray-600">
                          Official SAT practice questions from College Board
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#f89880] transition-colors" />
                    </div>
                  </a>

                  <a
                    href="https://quizlet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <FileText className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#f89880] transition-colors" style={{ color: "#0f172a" }}>
                          Quizlet
                        </h3>
                        <p className="text-sm text-gray-600">
                          Flashcards and study sets for test preparation
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#f89880] transition-colors" />
                    </div>
                  </a>

                  <a
                    href="https://apclassroom.collegeboard.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <Award className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#f89880] transition-colors" style={{ color: "#0f172a" }}>
                          AP Classroom
                        </h3>
                        <p className="text-sm text-gray-600">
                          Official AP course materials and practice from College Board
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#f89880] transition-colors" />
                    </div>
                  </a>

                  <a
                    href="https://www.grammarly.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <FileText className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#f89880] transition-colors" style={{ color: "#0f172a" }}>
                          Grammarly
                        </h3>
                        <p className="text-sm text-gray-600">
                          English grammar checker and writing enhancement tool
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#f89880] transition-colors" />
                    </div>
                  </a>

                  <a
                    href="/essays"
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#f89880] bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                        <Sparkles className="h-6 w-6" style={{ color: "#f89880" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#f89880] transition-colors" style={{ color: "#0f172a" }}>
                          MyCollegeMap Essay Proofreader
                        </h3>
                        <p className="text-sm text-gray-600">
                          Built-in essay review and proofreading tool
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#f89880] transition-colors" />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Princeton Review AP Books */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3" style={{ color: "#0f172a" }}>
                  <Trophy className="h-6 w-6" style={{ color: "#f89880" }} />
                  Princeton Review AP Exam Prep Books
                </CardTitle>
                <CardDescription className="text-base">
                  Comprehensive AP test preparation guides available at major retailers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "AP Biology Premium Prep, 28th Edition",
                    "AP Calculus AB Premium Prep, 12th Edition",
                    "AP Calculus BC Premium Prep, 12th Edition",
                    "AP Chemistry Premium Prep, 27th Edition",
                    "AP Computer Science Principles Premium Prep, 4th Edition",
                    "AP Computer Science A Premium Prep, 9th Edition",
                    "AP Economics Micro & Macro Premium Prep, 22nd Edition",
                    "AP English Language & Composition Premium Prep, 20th Edition",
                    "AP English Literature & Composition Premium Prep, 26th Edition",
                    "AP Environmental Science Premium Prep, 20th Edition",
                    "AP European History Premium Prep, 24th Edition",
                    "AP Human Geography Premium Prep, 17th Edition",
                    "AP Physics 1 Premium Prep, 12th Edition",
                    "AP Physics 2 Premium Prep, 11th Edition",
                    "AP Physics C Premium Prep, 19th Edition",
                    "AP Psychology Premium Prep, 23rd Edition",
                    "AP Statistics Premium Prep, 21st Edition",
                    "AP U.S. Government & Politics Premium Prep, 24th Edition",
                    "ASAP U.S. Government & Politics: Quick-Review Study Guide",
                    "AP U.S. History Premium Prep, 25th Edition",
                    "AP World History: Modern Premium Prep, 7th Edition",
                    "AP Spanish Language & Culture Prep, 11th Edition"
                  ].map((book, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#f89880] bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                          <BookOpen className="h-5 w-5" style={{ color: "#f89880" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold mb-2 leading-tight" style={{ color: "#0f172a" }}>
                            {book}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <a
                              href={`https://www.amazon.com/s?k=Princeton+Review+${encodeURIComponent(book.split(',')[0])}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f89880] hover:underline"
                            >
                              Amazon
                            </a>
                            <span className="text-gray-300">•</span>
                            <a
                              href={`https://www.barnesandnoble.com/s/${encodeURIComponent(book.split(',')[0])}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f89880] hover:underline"
                            >
                              Barnes & Noble
                            </a>
                            <span className="text-gray-300">•</span>
                            <a
                              href={`https://www.booksamillion.com/search?query=${encodeURIComponent(book.split(',')[0])}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f89880] hover:underline"
                            >
                              Books-A-Million
                            </a>
                            <span className="text-gray-300">•</span>
                            <a
                              href={`https://bookshop.org/search?keywords=${encodeURIComponent(book.split(',')[0])}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f89880] hover:underline"
                            >
                              Bookshop.org
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
