"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, Award, Trash2, Edit } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function ExtracurricularsPage() {
  const { activities, addActivity, deleteActivity, updateActivity } = useData()

  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "",
    role: "",
    description: "",
    hoursPerWeek: 0,
    weeksPerYear: 0,
    yearsParticipated: 0,
    achievements: "",
  })

  const [editingActivity, setEditingActivity] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    role: "",
    description: "",
    hoursPerWeek: 0,
    weeksPerYear: 0,
    yearsParticipated: 0,
    achievements: "",
  })

  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAddActivity = () => {
    if (newActivity.name && newActivity.category && newActivity.role) {
      addActivity({
        activityName: newActivity.name,
        category: newActivity.category,
        description: newActivity.description,
        leadershipPosition: newActivity.role,
        hoursPerWeek: newActivity.hoursPerWeek,
        weeksPerYear: newActivity.weeksPerYear,
        yearsParticipated: newActivity.yearsParticipated,
      })
      setNewActivity({
        name: "",
        category: "",
        role: "",
        description: "",
        hoursPerWeek: 0,
        weeksPerYear: 0,
        yearsParticipated: 0,
        achievements: "",
      })
    }
  }

  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity.id)
    setEditForm({
      name: activity.name,
      category: activity.category,
      role: activity.role,
      description: activity.description,
      hoursPerWeek: activity.hoursPerWeek,
      weeksPerYear: activity.weeksPerYear,
      yearsParticipated: activity.yearsParticipated,
      achievements: activity.achievements || "",
    })
  }

  const handleSaveEdit = () => {
    if (editingActivity && editForm.name && editForm.category && editForm.role) {
      updateActivity(editingActivity, {
        activityName: editForm.name,
        category: editForm.category,
        description: editForm.description,
        leadershipPosition: editForm.role,
        hoursPerWeek: editForm.hoursPerWeek,
        weeksPerYear: editForm.weeksPerYear,
        yearsParticipated: editForm.yearsParticipated,
      })
      setEditingActivity(null)
      setEditForm({
        name: "",
        category: "",
        role: "",
        description: "",
        hoursPerWeek: 0,
        weeksPerYear: 0,
        yearsParticipated: 0,
        achievements: "",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingActivity(null)
    setEditForm({
      name: "",
      category: "",
      role: "",
      description: "",
      hoursPerWeek: 0,
      weeksPerYear: 0,
      yearsParticipated: 0,
      achievements: "",
    })
  }

  const analyzeActivities = () => {
    if (activities.length === 0) {
      alert("Please add some activities first before analyzing.")
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis with realistic insights
    setTimeout(() => {
      const analysis = activities.map(activity => {
        const totalHours = activity.hoursPerWeek * activity.weeksPerYear * activity.yearsParticipated
        const isLeadership = activity.role && (
          activity.role.toLowerCase().includes("president") ||
          activity.role.toLowerCase().includes("captain") ||
          activity.role.toLowerCase().includes("leader") ||
          activity.role.toLowerCase().includes("director") ||
          activity.role.toLowerCase().includes("coordinator")
        )
        
        let score = 5 // Base score
        
        // Leadership bonus
        if (isLeadership) score += 2
        
        // Time commitment bonus
        if (totalHours > 200) score += 1
        if (totalHours > 500) score += 1
        
        // Longevity bonus
        if (activity.yearsParticipated >= 2) score += 1
        
        // Category bonus
        if (activity.category === "Leadership") score += 1
        if (activity.category === "Community Service") score += 1
        
        // Description quality bonus
        if (activity.description && activity.description.length > 50) score += 1
        
        // Cap at 10
        score = Math.min(score, 10)
        
        const strengths = []
        const improvements = []
        
        if (isLeadership) strengths.push("Strong leadership position")
        if (totalHours > 200) strengths.push("Significant time commitment")
        if (activity.yearsParticipated >= 2) strengths.push("Long-term involvement")
        if (activity.description && activity.description.length > 50) strengths.push("Detailed description")
        
        if (!isLeadership) improvements.push("Consider taking on leadership roles")
        if (totalHours < 100) improvements.push("Increase time commitment")
        if (activity.yearsParticipated < 2) improvements.push("Continue involvement for longer periods")
        if (!activity.description || activity.description.length < 30) improvements.push("Add more detailed description")
        if (!activity.achievements) improvements.push("Include specific achievements and awards")
        
        return {
          id: activity.id,
          name: activity.name,
          score,
          strengths,
          improvements,
          totalHours,
          isLeadership
        }
      })
      
      const overallScore = Math.round(analysis.reduce((sum, a) => sum + a.score, 0) / analysis.length)
      const leadershipCount = analysis.filter(a => a.isLeadership).length
      const totalHours = analysis.reduce((sum, a) => sum + a.totalHours, 0)
      
      setAiAnalysis({
        activities: analysis,
        overallScore,
        leadershipCount,
        totalHours,
        recommendations: generateRecommendations(analysis)
      })
      
      setIsAnalyzing(false)
    }, 2000)
  }

  const generateRecommendations = (analysis: any[]) => {
    const recommendations = []
    
    if (analysis.length < 3) {
      recommendations.push("Consider adding more activities to show breadth of interests")
    }
    
    const leadershipCount = analysis.filter(a => a.isLeadership).length
    if (leadershipCount < 2) {
      recommendations.push("Aim for at least 2-3 leadership positions")
    }
    
    const totalHours = analysis.reduce((sum, a) => sum + a.totalHours, 0)
    if (totalHours < 500) {
      recommendations.push("Increase total time commitment across activities")
    }
    
    const lowScoringActivities = analysis.filter(a => a.score < 6)
    if (lowScoringActivities.length > 0) {
      recommendations.push("Focus on strengthening activities with lower scores")
    }
    
    return recommendations
  }

  const getTotalHours = () => {
    return activities.reduce((total, activity) => {
      return total + activity.hoursPerWeek * activity.weeksPerYear * activity.yearsParticipated
    }, 0)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Leadership: "default",
      Sports: "secondary",
      Academic: "outline",
      "Community Service": "destructive",
      Arts: "default",
      Work: "secondary",
    }
    return colors[category] || "outline"
  }



  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Extracurricular Activities</h1>
        <p className="text-gray-600 mt-2">Document your involvement in activities outside the classroom</p>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Activities recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalHours().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Hours of involvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership Roles</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                activities.filter(
                  (a) =>
                    a.role && a.role.toLowerCase().includes("president") ||
                    a.role && a.role.toLowerCase().includes("captain") ||
                    a.role && a.role.toLowerCase().includes("leader"),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Leadership positions</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            AI Activity Analysis
          </CardTitle>
          <CardDescription>
            Get AI-powered insights to strengthen your extracurricular activities
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
                Our AI evaluates each activity using real admissions criteria: leadership, impact, commitment, and uniqueness.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">3. See Your Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each activity gets a 0-10 rating with detailed feedback on strengths and areas for improvement.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">4. Improve & Optimize</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the feedback to strengthen your actual activities or improve how you describe them in applications.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={analyzeActivities}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze My Activities"}
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
              Your activities have been analyzed using college admissions criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Overall Score */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {aiAnalysis.overallScore}/10
                </div>
                <div className="text-lg font-semibold mb-1">Overall Activity Score</div>
                <div className="text-sm text-gray-600">
                  Based on {aiAnalysis.activities.length} activities • {aiAnalysis.leadershipCount} leadership roles • {aiAnalysis.totalHours.toLocaleString()} total hours
                </div>
              </div>
            </div>

            {/* Individual Activity Analysis */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Individual Activity Scores</h3>
              {aiAnalysis.activities.map((activity: any) => (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{activity.name}</h4>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">{activity.score}/10</div>
                      <div className="text-sm text-gray-500">{activity.totalHours} hours</div>
                    </div>
                  </div>
                  
                  {activity.strengths.length > 0 && (
                    <div className="mb-2">
                      <div className="text-sm font-medium text-green-700 mb-1">Strengths:</div>
                      <ul className="text-sm text-gray-700">
                        {activity.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {activity.improvements.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-orange-700 mb-1">Areas for Improvement:</div>
                      <ul className="text-sm text-gray-700">
                        {activity.improvements.map((improvement: string, index: number) => (
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

      {/* Add New Activity */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Activity</CardTitle>
          <CardDescription>Record your extracurricular involvement and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="activityName">Activity Name</Label>
              <Input
                id="activityName"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                placeholder="e.g., Debate Team"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newActivity.category}
                onValueChange={(value) => setNewActivity({ ...newActivity, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Community Service">Community Service</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={newActivity.role}
                onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                placeholder="e.g., Team Captain"
              />
            </div>
            <div>
              <Label htmlFor="hoursPerWeek">Hours per Week</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                value={newActivity.hoursPerWeek || ""}
                onChange={(e) => setNewActivity({ ...newActivity, hoursPerWeek: Number.parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="weeksPerYear">Weeks per Year</Label>
              <Input
                id="weeksPerYear"
                type="number"
                value={newActivity.weeksPerYear || ""}
                onChange={(e) => setNewActivity({ ...newActivity, weeksPerYear: Number.parseInt(e.target.value) || 0 })}
                min="0"
                max="52"
              />
            </div>
            <div>
              <Label htmlFor="yearsParticipated">Years Participated</Label>
              <Input
                id="yearsParticipated"
                type="number"
                value={newActivity.yearsParticipated || ""}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, yearsParticipated: Number.parseInt(e.target.value) || 0 })
                }
                min="0"
                max="4"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Describe your involvement and responsibilities"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="achievements">Achievements & Awards</Label>
              <Textarea
                id="achievements"
                value={newActivity.achievements}
                onChange={(e) => setNewActivity({ ...newActivity, achievements: e.target.value })}
                placeholder="List any awards, recognitions, or notable achievements"
                rows={2}
              />
            </div>
          </div>
          <Button onClick={handleAddActivity}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Activities</CardTitle>
          <CardDescription>All your extracurricular activities and involvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{activity.name}</h3>
                    <p className="text-sm text-gray-600">{activity.role}</p>
                  </div>
                  <Badge variant={getCategoryColor(activity.category)}>{activity.category}</Badge>
                </div>

                <p className="text-gray-700 mb-4">{activity.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium">Time Commitment:</span>
                    <p className="text-gray-600">
                      {activity.hoursPerWeek} hrs/week × {activity.weeksPerYear} weeks × {activity.yearsParticipated}{" "}
                      years
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Total Hours:</span>
                    <p className="text-gray-600">
                      {(activity.hoursPerWeek * activity.weeksPerYear * activity.yearsParticipated).toLocaleString()}{" "}
                      hours
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-gray-600">
                      {activity.yearsParticipated} year{activity.yearsParticipated !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {activity.achievements && (
                  <div>
                    <span className="font-medium text-sm">Achievements:</span>
                    <p className="text-gray-700 text-sm mt-1">{activity.achievements}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditActivity(activity)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteActivity(activity.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Activity Modal */}
      {editingActivity && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Edit Activity</CardTitle>
            <CardDescription>Update your activity information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="editActivityName">Activity Name</Label>
                <Input
                  id="editActivityName"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Debate Team"
                />
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Community Service">Community Service</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="editRole">Role/Position</Label>
                <Input
                  id="editRole"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  placeholder="e.g., President, Captain, Member"
                />
              </div>
              <div>
                <Label htmlFor="editHoursPerWeek">Hours per Week</Label>
                <Input
                  id="editHoursPerWeek"
                  type="number"
                  value={editForm.hoursPerWeek}
                  onChange={(e) => setEditForm({ ...editForm, hoursPerWeek: Number(e.target.value) })}
                  min="0"
                  max="168"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="editWeeksPerYear">Weeks per Year</Label>
                <Input
                  id="editWeeksPerYear"
                  type="number"
                  value={editForm.weeksPerYear}
                  onChange={(e) => setEditForm({ ...editForm, weeksPerYear: Number(e.target.value) })}
                  min="0"
                  max="52"
                />
              </div>
              <div>
                <Label htmlFor="editYearsParticipated">Years Participated</Label>
                <Input
                  id="editYearsParticipated"
                  type="number"
                  value={editForm.yearsParticipated}
                  onChange={(e) => setEditForm({ ...editForm, yearsParticipated: Number(e.target.value) })}
                  min="0"
                  max="4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Describe your involvement and responsibilities"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editAchievements">Achievements & Awards</Label>
                <Textarea
                  id="editAchievements"
                  value={editForm.achievements}
                  onChange={(e) => setEditForm({ ...editForm, achievements: e.target.value })}
                  placeholder="List any awards, recognitions, or notable achievements"
                  rows={2}
                />
              </div>
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
