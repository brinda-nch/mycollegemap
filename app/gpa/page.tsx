"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Plus, TrendingUp, BarChart3, Calculator } from "lucide-react"

interface GPAEntry {
  id: string
  semester: string
  year: number
  gpa: number
  weightedGpa?: number
  credits?: number
  classRank?: number
  classSize?: number
}

export default function GPAPage() {
  const [gpaEntries, setGpaEntries] = useState<GPAEntry[]>([
    {
      id: "1",
      semester: "Fall",
      year: 2023,
      gpa: 3.85,
      weightedGpa: 4.12,
      credits: 6,
      classRank: 25,
      classSize: 350,
    },
    {
      id: "2",
      semester: "Spring",
      year: 2024,
      gpa: 3.92,
      weightedGpa: 4.18,
      credits: 6,
      classRank: 22,
      classSize: 350,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    semester: "",
    year: new Date().getFullYear(),
    gpa: "",
    weightedGpa: "",
    credits: "",
    classRank: "",
    classSize: "",
  })

  const calculateCumulativeGPA = () => {
    if (gpaEntries.length === 0) return 0
    const totalGPA = gpaEntries.reduce((sum, entry) => sum + entry.gpa, 0)
    return (totalGPA / gpaEntries.length).toFixed(2)
  }

  const calculateCumulativeWeightedGPA = () => {
    const entriesWithWeighted = gpaEntries.filter((entry) => entry.weightedGpa)
    if (entriesWithWeighted.length === 0) return 0
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

  const handleAddEntry = () => {
    if (!newEntry.semester || !newEntry.gpa) return

    const entry: GPAEntry = {
      id: Date.now().toString(),
      semester: newEntry.semester,
      year: newEntry.year,
      gpa: Number.parseFloat(newEntry.gpa),
      weightedGpa: newEntry.weightedGpa ? Number.parseFloat(newEntry.weightedGpa) : undefined,
      credits: newEntry.credits ? Number.parseInt(newEntry.credits) : undefined,
      classRank: newEntry.classRank ? Number.parseInt(newEntry.classRank) : undefined,
      classSize: newEntry.classSize ? Number.parseInt(newEntry.classSize) : undefined,
    }

    setGpaEntries([...gpaEntries, entry])
    setNewEntry({
      semester: "",
      year: new Date().getFullYear(),
      gpa: "",
      weightedGpa: "",
      credits: "",
      classRank: "",
      classSize: "",
    })
    setIsAddDialogOpen(false)
  }

  const cumulativeGPA = calculateCumulativeGPA()
  const cumulativeWeightedGPA = calculateCumulativeWeightedGPA()
  const latestRank = getLatestRank()
  const latestClassSize = getLatestClassSize()

  return (
    <div className="p-6 max-w-7xl mx-auto lg:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GPA Tracking</h1>
        <p className="text-gray-600">Monitor your academic performance across semesters</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cumulative GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{cumulativeGPA}</div>
            <Progress value={Number.parseFloat(cumulativeGPA) * 25} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weighted GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{cumulativeWeightedGPA}</div>
            <Progress value={Number.parseFloat(cumulativeWeightedGPA) * 20} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Class Rank</CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{latestRank ? `#${latestRank}` : "N/A"}</div>
            {latestClassSize && <p className="text-xs text-gray-500 mt-1">of {latestClassSize} students</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Semesters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{gpaEntries.length}</div>
            <p className="text-xs text-gray-500 mt-1">semesters tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* GPA Entries Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>GPA History</CardTitle>
            <CardDescription>Track your semester-by-semester performance</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Semester
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Semester</DialogTitle>
                <DialogDescription>Enter your GPA and other academic information for a new semester.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={newEntry.semester}
                      onValueChange={(value) => setNewEntry({ ...newEntry, semester: value })}
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newEntry.year}
                      onChange={(e) => setNewEntry({ ...newEntry, year: Number.parseInt(e.target.value) })}
                      min="2020"
                      max="2030"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Required)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      max="4.00"
                      value={newEntry.gpa}
                      onChange={(e) => setNewEntry({ ...newEntry, gpa: e.target.value })}
                      placeholder="3.85"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightedGpa">Weighted GPA</Label>
                    <Input
                      id="weightedGpa"
                      type="number"
                      step="0.01"
                      value={newEntry.weightedGpa}
                      onChange={(e) => setNewEntry({ ...newEntry, weightedGpa: e.target.value })}
                      placeholder="4.12"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={newEntry.credits}
                      onChange={(e) => setNewEntry({ ...newEntry, credits: e.target.value })}
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classRank">Class Rank</Label>
                    <Input
                      id="classRank"
                      type="number"
                      value={newEntry.classRank}
                      onChange={(e) => setNewEntry({ ...newEntry, classRank: e.target.value })}
                      placeholder="25"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classSize">Class Size</Label>
                  <Input
                    id="classSize"
                    type="number"
                    value={newEntry.classSize}
                    onChange={(e) => setNewEntry({ ...newEntry, classSize: e.target.value })}
                    placeholder="350"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEntry} disabled={!newEntry.semester || !newEntry.gpa}>
                  Add Semester
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {gpaEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semester</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Weighted GPA</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Class Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gpaEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {entry.semester} {entry.year}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.gpa.toFixed(2)}</Badge>
                    </TableCell>
                    <TableCell>
                      {entry.weightedGpa ? (
                        <Badge variant="secondary">{entry.weightedGpa.toFixed(2)}</Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{entry.credits ? entry.credits : <span className="text-gray-400">N/A</span>}</TableCell>
                    <TableCell>
                      {entry.classRank ? (
                        <div>
                          <span className="font-medium">#{entry.classRank}</span>
                          {entry.classSize && <span className="text-gray-500 text-sm"> / {entry.classSize}</span>}
                        </div>
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
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No GPA entries yet</h3>
              <p className="text-gray-500">Start tracking your academic performance by adding your first semester.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
