"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, Award, Trash2 } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function ExtracurricularsPage() {
  const { activities, addActivity, deleteActivity } = useData()

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
                    a.role.toLowerCase().includes("president") ||
                    a.role.toLowerCase().includes("captain") ||
                    a.role.toLowerCase().includes("leader"),
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
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Analyze My Activities
            </Button>
          </div>
        </CardContent>
      </Card>

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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteActivity(activity.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
