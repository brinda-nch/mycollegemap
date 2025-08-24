"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Target, TrendingUp, MapPin, DollarSign, Search, Plus, Trash2 } from "lucide-react"
import { useData } from "@/lib/data-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

export default function CollegeEstimationsPage() {
  const { collegeApplications, addCollegeApplication, deleteCollegeApplication } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CollegeSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<CollegeSearchResult | null>(null)

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
      console.error('Error searching colleges:', error)
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

  const handleAddCollege = (college: CollegeSearchResult) => {
    addCollegeApplication({
      collegeName: college.name,
      applicationType: "Regular Decision",
      deadline: "2025-01-01",
      status: "planning",
      applicationFee: 70,
    })
    setIsAddDialogOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const getMatchLevel = (acceptanceRate: number) => {
    if (acceptanceRate < 15) return "Reach"
    if (acceptanceRate < 30) return "Target"
    return "Safety"
  }

  const getMatchColor = (matchLevel: string) => {
    switch (matchLevel) {
      case "Safety":
        return "bg-green-100 text-green-800"
      case "Target":
        return "bg-yellow-100 text-yellow-800"
      case "Reach":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">College List</h1>
        <p className="text-gray-600 mt-2">Search and add colleges to your application list</p>
      </div>

      {/* Add College Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add College</CardTitle>
          <CardDescription>Search for colleges and add them to your list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for colleges (e.g., Stanford, Harvard, UCLA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isSearching && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Searching colleges...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Search Results:</h3>
                {searchResults.map((college, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddCollege(college)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{college.name}</h4>
                        <p className="text-sm text-gray-600">{college.location}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Acceptance: {college.acceptanceRate}%</span>
                          <span>Avg GPA: {college.avgGPA}</span>
                          <span>Avg SAT: {college.avgSAT}</span>
                          <span>Tuition: ${college.tuition.toLocaleString()}</span>
                          <span className="text-blue-600 font-medium">{college.type}</span>
                        </div>
                      </div>
                      <Badge className={getMatchColor(getMatchLevel(college.acceptanceRate))}>
                        {getMatchLevel(college.acceptanceRate)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your College List */}
      <Card>
        <CardHeader>
          <CardTitle>Your College List</CardTitle>
          <CardDescription>Colleges you've added to your application list</CardDescription>
        </CardHeader>
        <CardContent>
          {collegeApplications.length > 0 ? (
            <div className="space-y-4">
              {collegeApplications.map((college) => (
                <div key={college.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{college.collegeName}</h4>
                      <p className="text-sm text-gray-600">
                        {college.applicationType} • {college.status} • Due: {college.deadline}
                      </p>
                      {college.applicationFee && (
                        <p className="text-sm text-gray-600">Fee: ${college.applicationFee}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCollegeApplication(college.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges added yet</h3>
              <p className="text-gray-500">Search for colleges above to start building your application list.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
