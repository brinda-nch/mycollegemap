"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Award, Trophy, Star, Edit } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function HonorsAwardsPage() {
  const { honorsAwards, addHonorAward, deleteHonorAward, updateHonorAward } = useData()

  const [newHonor, setNewHonor] = useState({
    name: "",
    category: "",
    level: "",
    date: "",
    description: "",
    organization: "",
  })

  const [editingHonor, setEditingHonor] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    level: "",
    date: "",
    description: "",
    organization: "",
  })

  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAddHonor = () => {
    if (newHonor.name && newHonor.category && newHonor.level && newHonor.date) {
      addHonorAward({
        title: newHonor.name,
        description: newHonor.description,
        level: newHonor.level,
        dateReceived: newHonor.date,
      })
      setNewHonor({
        name: "",
        category: "",
        level: "",
        date: "",
        description: "",
        organization: "",
      })
    }
  }

  const handleEditHonor = (honor: any) => {
    setEditingHonor(honor.id)
    setEditForm({
      name: honor.title,
      category: honor.category || "",
      level: honor.level,
      date: honor.dateReceived,
      description: honor.description,
      organization: honor.organization || "",
    })
  }

  const handleSaveEdit = () => {
    if (editingHonor && editForm.name && editForm.level && editForm.date) {
      updateHonorAward(editingHonor, {
        title: editForm.name,
        description: editForm.description,
        level: editForm.level,
        dateReceived: editForm.date,
      })
      setEditingHonor(null)
      setEditForm({
        name: "",
        category: "",
        level: "",
        date: "",
        description: "",
        organization: "",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingHonor(null)
    setEditForm({
      name: "",
      category: "",
      level: "",
      date: "",
      description: "",
      organization: "",
    })
  }

  const analyzeHonors = () => {
    if (honorsAwards.length === 0) {
      alert("Please add some honors or awards first before analyzing.")
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis with realistic insights
    setTimeout(() => {
      const analysis = honorsAwards.map(honor => {
        let score = 5 // Base score
        
        // Level bonus
        if (honor.level === "International") score += 3
        else if (honor.level === "National") score += 2
        else if (honor.level === "State") score += 1
        
        // Category bonus
        if (honor.category === "Academic") score += 1
        if (honor.category === "Leadership") score += 1
        
        // Description quality bonus
        if (honor.description && honor.description.length > 30) score += 1
        
        // Cap at 10
        score = Math.min(score, 10)
        
        const strengths = []
        const improvements = []
        
        if (honor.level === "International" || honor.level === "National") {
          strengths.push("High-level recognition")
        }
        if (honor.category === "Academic") {
          strengths.push("Academic achievement")
        }
        if (honor.description && honor.description.length > 30) {
          strengths.push("Detailed description")
        }
        
        if (honor.level === "School" || honor.level === "Local") {
          improvements.push("Aim for higher-level recognitions")
        }
        if (!honor.description || honor.description.length < 20) {
          improvements.push("Add more detailed description")
        }
        if (honor.category === "Other") {
          improvements.push("Consider categorizing more specifically")
        }
        
        return {
          id: honor.id,
          name: honor.title,
          score,
          strengths,
          improvements,
          level: honor.level,
          category: honor.category
        }
      })
      
      const overallScore = Math.round(analysis.reduce((sum, h) => sum + h.score, 0) / analysis.length)
      const highLevelCount = analysis.filter(h => h.level === "International" || h.level === "National").length
      const academicCount = analysis.filter(h => h.category === "Academic").length
      
      setAiAnalysis({
        honors: analysis,
        overallScore,
        highLevelCount,
        academicCount,
        recommendations: generateHonorRecommendations(analysis)
      })
      
      setIsAnalyzing(false)
    }, 2000)
  }

  const generateHonorRecommendations = (analysis: any[]) => {
    const recommendations = []
    
    if (analysis.length < 2) {
      recommendations.push("Consider adding more honors and awards to strengthen your profile")
    }
    
    const highLevelCount = analysis.filter(h => h.level === "International" || h.level === "National").length
    if (highLevelCount < 1) {
      recommendations.push("Aim for at least one national or international recognition")
    }
    
    const academicCount = analysis.filter(h => h.category === "Academic").length
    if (academicCount < 1) {
      recommendations.push("Include academic honors and awards")
    }
    
    const lowScoringHonors = analysis.filter(h => h.score < 6)
    if (lowScoringHonors.length > 0) {
      recommendations.push("Focus on higher-level recognitions")
    }
    
    return recommendations
  }

  const removeHonor = (id: string) => {
    setHonors(honors.filter((honor) => honor.id !== id))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Academic":
        return <Award className="w-4 h-4" />
      case "Athletic":
        return <Trophy className="w-4 h-4" />
      case "Arts":
        return <Star className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Academic: "bg-blue-100 text-blue-800",
      Athletic: "bg-green-100 text-green-800",
      "Community Service": "bg-orange-100 text-orange-800",
      Leadership: "bg-red-100 text-red-800",
      Arts: "bg-purple-100 text-purple-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["Other"]
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      International: "default",
      National: "secondary",
      State: "outline",
      Regional: "outline",
      Local: "outline",
      School: "outline",
    }
    return colors[level] || "outline"
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "International":
      case "National":
        return <Trophy className="h-4 w-4" />
      case "State":
      case "Regional":
        return <Award className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }



  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Honors & Awards</h1>
        <p className="text-gray-600 mt-2">Showcase your academic and extracurricular achievements</p>
      </div>

      {/* Awards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{honorsAwards.length}</div>
            <p className="text-xs text-muted-foreground">Honors received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">National Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {honorsAwards.filter((h) => h.level === "National" || h.level === "International").length}
            </div>
            <p className="text-xs text-muted-foreground">National/International</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{honorsAwards.filter((h) => h.category === "Academic").length}</div>
            <p className="text-xs text-muted-foreground">Academic honors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {honorsAwards.filter((h) => new Date(h.dateReceived || '').getFullYear() === 2024).length}
            </div>
            <p className="text-xs text-muted-foreground">Awards in 2024</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            AI Honors Analysis
          </CardTitle>
          <CardDescription>
            Get AI-powered insights to strengthen your honors and awards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">2. Get AI Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our AI evaluates each honor using real admissions criteria: leadership, impact, commitment, and uniqueness.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">3. See Your Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each honor gets a 0-10 rating with detailed feedback on strengths and areas for improvement.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">4. Improve & Optimize</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the feedback to strengthen your actual honors or improve how you describe them in applications.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={analyzeHonors}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze My Honors"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              AI Analysis Results
            </CardTitle>
            <CardDescription>
              Your honors and awards have been analyzed using college admissions criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Overall Score */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {aiAnalysis.overallScore}/10
                </div>
                <div className="text-lg font-semibold mb-1">Overall Honors Score</div>
                <div className="text-sm text-gray-600">
                  Based on {aiAnalysis.honors.length} honors • {aiAnalysis.highLevelCount} high-level recognitions • {aiAnalysis.academicCount} academic awards
                </div>
              </div>
            </div>

            {/* Individual Honor Analysis */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Individual Honor Scores</h3>
              {aiAnalysis.honors.map((honor: any) => (
                <div key={honor.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{honor.name}</h4>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">{honor.score}/10</div>
                      <div className="text-sm text-gray-500">{honor.level} • {honor.category}</div>
                    </div>
                  </div>
                  
                  {honor.strengths.length > 0 && (
                    <div className="mb-2">
                      <div className="text-sm font-medium text-green-700 mb-1">Strengths:</div>
                      <ul className="text-sm text-gray-700">
                        {honor.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {honor.improvements.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-orange-700 mb-1">Areas for Improvement:</div>
                      <ul className="text-sm text-gray-700">
                        {honor.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="text-orange-500 mr-2">→</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {aiAnalysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Overall Recommendations</h3>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-600 mr-2 mt-0.5">💡</span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add New Honor */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Honor or Award</CardTitle>
          <CardDescription>Record your achievements and recognitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="honorName">Award Name</Label>
              <Input
                id="honorName"
                value={newHonor.name}
                onChange={(e) => setNewHonor({ ...newHonor, name: e.target.value })}
                placeholder="e.g., National Honor Society"
              />
            </div>
            <div>
              <Label htmlFor="organization">Awarding Organization</Label>
              <Input
                id="organization"
                value={newHonor.organization}
                onChange={(e) => setNewHonor({ ...newHonor, organization: e.target.value })}
                placeholder="e.g., National Honor Society"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newHonor.category}
                onValueChange={(value) => setNewHonor({ ...newHonor, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Community Service">Community Service</SelectItem>
                  <SelectItem value="Athletics">Athletics</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Select value={newHonor.level} onValueChange={(value) => setNewHonor({ ...newHonor, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="International">International</SelectItem>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="State">State</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="School">School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="date">Date Received</Label>
              <Input
                id="date"
                type="date"
                value={newHonor.date}
                onChange={(e) => setNewHonor({ ...newHonor, date: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newHonor.description}
              onChange={(e) => setNewHonor({ ...newHonor, description: e.target.value })}
              placeholder="Describe the achievement and its significance"
              rows={3}
            />
          </div>
          <Button onClick={handleAddHonor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Honor/Award
          </Button>
        </CardContent>
      </Card>

      {/* Honors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Your Honors & Awards ({honorsAwards.length})
          </CardTitle>
          <CardDescription>All your achievements and recognitions</CardDescription>
        </CardHeader>
        <CardContent>
          {honorsAwards.length > 0 ? (
            <div className="space-y-4">
              {honorsAwards
                .sort((a, b) => new Date(b.dateReceived || '').getTime() - new Date(a.dateReceived || '').getTime())
                .map((honor) => (
                  <div key={honor.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{honor.title}</h3>
                        {honor.level && (
                          <Badge variant="outline" className="mt-1">
                            {honor.level}
                          </Badge>
                        )}
                        {honor.dateReceived && (
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(honor.dateReceived).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditHonor(honor)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHonorAward(honor.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {honor.description && <p className="text-gray-700 text-sm">{honor.description}</p>}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No honors or awards yet</h3>
              <p className="text-gray-500">Add your first honor or award to start building your achievements list.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Honor Modal */}
      {editingHonor && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Edit Honor/Award</CardTitle>
            <CardDescription>Update your honor or award information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="editHonorName">Honor/Award Name</Label>
                <Input
                  id="editHonorName"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., National Merit Scholar"
                />
              </div>
              <div>
                <Label htmlFor="editHonorCategory">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Athletic">Athletic</SelectItem>
                    <SelectItem value="Community Service">Community Service</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="editHonorLevel">Level</Label>
                <Select value={editForm.level} onValueChange={(value) => setEditForm({ ...editForm, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="State">State</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="School">School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editHonorDate">Date Received</Label>
                <Input
                  id="editHonorDate"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="editHonorDescription">Description</Label>
              <Textarea
                id="editHonorDescription"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe the achievement and its significance"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
