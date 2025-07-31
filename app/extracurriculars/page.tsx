"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, Award } from "lucide-react"

interface Activity {
  id: string
  name: string
  category: string
  role: string
  description: string
  hoursPerWeek: number
  weeksPerYear: number
  yearsParticipated: number
  achievements: string
}

export default function ExtracurricularsPage() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      name: "Student Government",
      category: "Leadership",
      role: "Vice President",
      description: "Led student initiatives and represented student body in school decisions",
      hoursPerWeek: 8,
      weeksPerYear: 36,
      yearsParticipated: 2,
      achievements: "Organized school-wide fundraiser raising $5,000 for local charity",
    },
    {
      id: "2",
      name: "Varsity Soccer",
      category: "Sports",
      role: "Team Captain",
      description: "Competed at varsity level and led team training sessions",
      hoursPerWeek: 15,
      weeksPerYear: 20,
      yearsParticipated: 4,
      achievements: "Led team to regional championships, All-State honorable mention",
    },
    {
      id: "3",
      name: "National Honor Society",
      category: "Academic",
      role: "Member",
      description: "Participated in community service and academic excellence programs",
      hoursPerWeek: 3,
      weeksPerYear: 36,
      yearsParticipated: 2,
      achievements: "Completed 100+ hours of community service",
    },
  ])

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

  const addActivity = () => {
    if (newActivity.name && newActivity.category && newActivity.role) {
      setActivities([
        ...activities,
        {
          ...newActivity,
          id: Date.now().toString(),
        },
      ])
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

  const removeActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id))
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
          <Button onClick={addActivity}>
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
                  onClick={() => removeActivity(activity.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Award className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
