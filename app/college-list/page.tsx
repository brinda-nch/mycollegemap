"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, School, MapPin, TrendingUp, ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { CollegeData } from "@/lib/college-data"
import { toast } from "sonner"

export default function CollegeListPage() {
  const { 
    collegeList, 
    addToCollegeList, 
    removeFromCollegeList, 
    updateCollegeListItem,
    gpaEntries,
    testScores,
    collegeApplications,
  } = useData()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CollegeData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null)
  const [notes, setNotes] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "safety" | "target" | "reach">("all")
  const [expandedColleges, setExpandedColleges] = useState<Set<string>>(new Set())

  // Calculate student's stats for categorization
  const studentStats = {
    gpa: gpaEntries.length > 0 
      ? gpaEntries.reduce((sum, entry) => sum + entry.gpa, 0) / gpaEntries.length 
      : 0,
    sat: testScores.find(score => score.testType === "SAT")?.score || 0,
    act: testScores.find(score => score.testType === "ACT")?.score || 0,
  }

  // Categorize college based on selectivity, prestige, and acceptance rate
  const categorizeCollege = (college: CollegeData): 'safety' | 'target' | 'reach' => {
    const { gpa, sat, act } = studentStats
    
    // If student has no stats, default to target
    if (gpa === 0 && sat === 0 && act === 0) {
      return 'target'
    }

    // Define highly selective/prestigious schools that should almost always be reaches
    const eliteSchools = [
      'Harvard', 'Yale', 'Princeton', 'Stanford', 'MIT', 'Columbia', 'University of Pennsylvania',
      'Brown University', 'Dartmouth', 'Cornell', 'Duke', 'Johns Hopkins', 'Northwestern',
      'Vanderbilt', 'Rice', 'Washington University', 'University of Chicago', 'Notre Dame',
      'California Institute of Technology', 'Georgetown'
    ]

    // Check if this is an elite school
    const isEliteSchool = eliteSchools.some(school => college.name.includes(school))

    // STEP 1: Check for ultra-elite schools (< 10% acceptance)
    // These are almost always reaches regardless of stats
    if (college.acceptanceRate < 10 && isEliteSchool) {
      return 'reach'
    }

    // STEP 2: Schools with acceptance rate < 15% are typically reaches
    // But can be target if student has truly exceptional stats
    if (college.acceptanceRate < 15) {
      const hasExceptionalStats = (
        (gpa > 0 && gpa >= college.avgGPA + 0.15) &&
        (sat === 0 || sat >= college.avgSAT + 80) &&
        (act === 0 || act >= college.avgACT + 2)
      )
      // Even with exceptional stats, very selective schools are difficult
      if (hasExceptionalStats && college.acceptanceRate >= 12) {
        return 'target' // Can be target if stats are exceptional
      }
      return 'reach'
    }

    // STEP 3: Calculate match score for all other schools (acceptance rate 15%+)
    let matchScore = 0
    let criteriaCount = 0

    // GPA comparison (strict thresholds)
    if (gpa > 0) {
      const gpaDiff = gpa - college.avgGPA
      if (gpaDiff >= 0.25) matchScore += 2 // Significantly above
      else if (gpaDiff >= 0.1) matchScore += 1 // Moderately above
      else if (gpaDiff >= -0.1) matchScore += 0 // Near average
      else if (gpaDiff >= -0.25) matchScore -= 1 // Below average
      else matchScore -= 2 // Significantly below
      criteriaCount++
    }

    // SAT comparison (strict thresholds)
    if (sat > 0) {
      const satDiff = sat - college.avgSAT
      if (satDiff >= 100) matchScore += 2
      else if (satDiff >= 50) matchScore += 1
      else if (satDiff >= -50) matchScore += 0
      else if (satDiff >= -100) matchScore -= 1
      else matchScore -= 2
      criteriaCount++
    }

    // ACT comparison (strict thresholds)
    if (act > 0) {
      const actDiff = act - college.avgACT
      if (actDiff >= 3) matchScore += 2
      else if (actDiff >= 1) matchScore += 1
      else if (actDiff >= -1) matchScore += 0
      else if (actDiff >= -3) matchScore -= 1
      else matchScore -= 2
      criteriaCount++
    }

    // Calculate average score
    const avgScore = criteriaCount > 0 ? matchScore / criteriaCount : 0

    // STEP 4: Categorize based on acceptance rate and match score
    if (college.acceptanceRate >= 60) {
      // High acceptance rate schools (60%+)
      if (avgScore >= 0.5) return 'safety'
      else if (avgScore >= -0.5) return 'target'
      else return 'reach'
    } else if (college.acceptanceRate >= 40) {
      // Moderate acceptance rate (40-60%)
      if (avgScore >= 1.5) return 'safety'
      else if (avgScore >= 0) return 'target'
      else return 'reach'
    } else if (college.acceptanceRate >= 25) {
      // Selective schools (25-40%)
      if (avgScore >= 1.8) return 'safety'
      else if (avgScore >= 0.5) return 'target'
      else return 'reach'
    } else {
      // Very selective schools (15-25%) - like UMich, UVA
      // These can be safety/target with strong stats
      if (avgScore >= 2) return 'safety'  // Need exceptional stats
      else if (avgScore >= 1) return 'target'  // Need strong stats
      else return 'reach'
    }
  }

  // Search colleges API
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

  const handleSelectCollege = (college: CollegeData) => {
    setSelectedCollege(college)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleAddCollege = () => {
    if (!selectedCollege) return

    const category = categorizeCollege(selectedCollege)

    // Check if already in application tracker BEFORE adding
    const alreadyInTracker = collegeApplications.some(
      app => app.collegeName.toLowerCase() === selectedCollege.name.toLowerCase()
    )

    addToCollegeList({
      collegeName: selectedCollege.name,
      location: selectedCollege.location,
      acceptanceRate: selectedCollege.acceptanceRate,
      avgGPA: selectedCollege.avgGPA,
      avgSAT: selectedCollege.avgSAT,
      avgACT: selectedCollege.avgACT,
      type: selectedCollege.type,
      category,
      notes,
    })

    // Show success message
    if (alreadyInTracker) {
      toast.success(`${selectedCollege.name} added to your college list!`)
    } else {
      toast.success(`${selectedCollege.name} added to your college list and application tracker!`)
    }

    setSelectedCollege(null)
    setNotes("")
    setIsAddDialogOpen(false)
  }

  const handleRemoveCollege = (id: string) => {
    removeFromCollegeList(id)
  }

  // Check if college is in application tracker
  const isInApplicationTracker = (collegeName: string) => {
    return collegeApplications.some(
      app => app.collegeName.toLowerCase() === collegeName.toLowerCase()
    )
  }

  const getCategoryColor = (category?: 'safety' | 'target' | 'reach') => {
    switch (category) {
      case 'safety':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'target':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'reach':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedColleges(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Filter colleges based on category
  const filteredColleges = filterCategory === "all" 
    ? collegeList 
    : collegeList.filter(college => college.category === filterCategory)

  // Group colleges by category
  const safetyColleges = collegeList.filter(c => c.category === 'safety')
  const targetColleges = collegeList.filter(c => c.category === 'target')
  const reachColleges = collegeList.filter(c => c.category === 'reach')

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-3 sm:mb-4 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">My College List</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Track and organize colleges you're interested in applying to
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
                Add College
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Add College to Your List</DialogTitle>
                <DialogDescription className="text-sm">
                  Search for a college and we'll automatically categorize it based on your stats
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {!selectedCollege ? (
                  <div className="space-y-2">
                    <Label htmlFor="search">Search for College</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="e.g., Harvard, Stanford, MIT..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    {isSearching && (
                      <p className="text-sm text-gray-500">Searching...</p>
                    )}
                    
                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-64 overflow-y-auto border rounded-lg">
                        {searchResults.map((college, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b last:border-b-0"
                            onClick={() => handleSelectCollege(college)}
                          >
                            <div className="font-medium">{college.name}</div>
                            <div className="text-sm text-gray-500">{college.location}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <School className="h-5 w-5" />
                          {selectedCollege.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {selectedCollege.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Acceptance Rate</Label>
                            <p className="font-semibold">{selectedCollege.acceptanceRate}%</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Type</Label>
                            <p className="font-semibold">{selectedCollege.type}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Average GPA</Label>
                            <p className="font-semibold">{selectedCollege.avgGPA.toFixed(2)}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Average SAT</Label>
                            <p className="font-semibold">{selectedCollege.avgSAT}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Average ACT</Label>
                            <p className="font-semibold">{selectedCollege.avgACT}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Category</Label>
                            <Badge className={`${getCategoryColor(categorizeCollege(selectedCollege))} capitalize`}>
                              {categorizeCollege(selectedCollege)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes about this college..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCollege(null)
                        setNotes("")
                      }}
                      className="w-full"
                    >
                      Choose Different College
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setSelectedCollege(null)
                    setSearchQuery("")
                    setNotes("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCollege} disabled={!selectedCollege}>
                  Add to List
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{collegeList.length}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Total Colleges</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-200">{safetyColleges.length}</div>
              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1">Safety Schools</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-200">{targetColleges.length}</div>
              <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-1">Target Schools</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-800 dark:text-orange-200">{reachColleges.length}</div>
              <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 mt-1">Reach Schools</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filterCategory === "all" ? "default" : "outline"}
          onClick={() => setFilterCategory("all")}
          className="text-xs sm:text-sm"
          size="sm"
        >
          All ({collegeList.length})
        </Button>
        <Button
          variant={filterCategory === "safety" ? "default" : "outline"}
          onClick={() => setFilterCategory("safety")}
          className={`text-xs sm:text-sm ${filterCategory === "safety" ? "bg-green-600 hover:bg-green-700" : ""}`}
          size="sm"
        >
          Safety ({safetyColleges.length})
        </Button>
        <Button
          variant={filterCategory === "target" ? "default" : "outline"}
          onClick={() => setFilterCategory("target")}
          className={`text-xs sm:text-sm ${filterCategory === "target" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          size="sm"
        >
          Target ({targetColleges.length})
        </Button>
        <Button
          variant={filterCategory === "reach" ? "default" : "outline"}
          onClick={() => setFilterCategory("reach")}
          className={`text-xs sm:text-sm ${filterCategory === "reach" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
          size="sm"
        >
          Reach ({reachColleges.length})
        </Button>
      </div>

      {/* College List */}
      {filteredColleges.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filterCategory === "all" ? "No colleges yet" : `No ${filterCategory} schools yet`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your college list by adding schools you're interested in
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First College
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredColleges.map((college) => {
              const isExpanded = expandedColleges.has(college.id)
              return (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <CardTitle className="text-base sm:text-lg lg:text-xl truncate">{college.collegeName}</CardTitle>
                            <Badge className={`${getCategoryColor(college.category)} capitalize text-xs whitespace-nowrap`}>
                              {college.category}
                            </Badge>
                            {isInApplicationTracker(college.collegeName) && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 gap-1 text-xs whitespace-nowrap">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="hidden sm:inline">In Tracker</span>
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{college.location}</span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpanded(college.id)}
                            className="h-8 w-8 sm:h-10 sm:w-10"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCollege(college.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div>
                          <Label className="text-xs text-gray-500">Acceptance Rate</Label>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg">{college.acceptanceRate}%</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Average GPA</Label>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg">{college.avgGPA.toFixed(2)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Average SAT</Label>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg">{college.avgSAT}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Average ACT</Label>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg">{college.avgACT}</p>
                        </div>
                      </div>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs text-gray-500">Type</Label>
                              <p className="font-medium">{college.type}</p>
                            </div>
                            
                            {/* Your Stats vs College Stats */}
                            {studentStats.gpa > 0 && (
                              <div>
                                <Label className="text-xs text-gray-500 mb-2 block">Your Stats Comparison</Label>
                                <div className="space-y-2">
                                  {studentStats.gpa > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Your GPA: <strong>{studentStats.gpa.toFixed(2)}</strong></span>
                                      <span className={studentStats.gpa >= college.avgGPA ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                                        {studentStats.gpa >= college.avgGPA ? "✓ Above average" : "Below average"}
                                      </span>
                                    </div>
                                  )}
                                  {studentStats.sat > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Your SAT: <strong>{studentStats.sat}</strong></span>
                                      <span className={studentStats.sat >= college.avgSAT ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                                        {studentStats.sat >= college.avgSAT ? "✓ Above average" : "Below average"}
                                      </span>
                                    </div>
                                  )}
                                  {studentStats.act > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Your ACT: <strong>{studentStats.act}</strong></span>
                                      <span className={studentStats.act >= college.avgACT ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                                        {studentStats.act >= college.avgACT ? "✓ Above average" : "Below average"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {college.notes && (
                              <div>
                                <Label className="text-xs text-gray-500">Notes</Label>
                                <p className="text-sm mt-1">{college.notes}</p>
                              </div>
                            )}

                            {isInApplicationTracker(college.collegeName) && (
                              <div className="pt-4 border-t">
                                <Link href="/application-tracking">
                                  <Button variant="outline" size="sm" className="w-full gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    View in Application Tracker
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

