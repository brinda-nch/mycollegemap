"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Clock, Users, Award, Star } from "lucide-react"

interface Extracurricular {
  id: string
  name: string
  category: "Academic" | "Sports" | "Arts" | "Community Service" | "Leadership" | "Work" | "Other"
  position: string
  description: string
  startDate: string
  endDate: string
  hoursPerWeek: number
  weeksPerYear: number
  achievements: string[]
  isLeadership: boolean
}

export default function ExtracurricularsPage() {
  const [activities, setActivities] = useState<Extracurricular[]>([
    {
      id: "1",
      name: "Student Government",
      category: "Leadership",
      position: "Vice President",
      description: "Led student initiatives and represented student body in school decisions",
      startDate: "2022-09",
      endDate: "2024-06",
      hoursPerWeek: 8,
      weeksPerYear: 36,
      achievements: ["Organized school-wide fundraiser raising $5,000", "Implemented new student feedback system"],
      isLeadership: true,
    },
    {
      id: "2",
      name: "Varsity Soccer",
      category: "Sports",
      position: "Team Captain",
      description: "Competitive soccer player and team leader",
      startDate: "2021-08",
      endDate: "2024-06",
      hoursPerWeek: 15,
      weeksPerYear: 20,
      achievements: ["Led team to state championship", "All-State selection 2023"],
      isLeadership: true,
    },
    {
      id: "3",
      name: "Local Food Bank",
      category: "Community Service",
      position: "Volunteer Coordinator",
      description: "Organized volunteer schedules and food distribution events",
      startDate: "2020-06",
      endDate: "2024-08",
      hoursPerWeek: 4,
      weeksPerYear: 50,
      achievements: ["Coordinated 200+ volunteers", "Helped distribute food to 1,000+ families"],
      isLeadership: false,
    },
    {
      id: "4",
      name: "Math Tutoring Club",
      category: "Academic",
      position: "President",
      description: "Founded and led peer tutoring program for underclassmen",
      startDate: "2022-01",
      endDate: "2024-06",
      hoursPerWeek: 6,
      weeksPerYear: 32,
      achievements: ["Helped 50+ students improve math grades", "Expanded program to 3 schools"],
      isLeadership: true,
    },
  ])

  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "Academic" as Extracurricular["category"],
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    hoursPerWeek: 0,
    weeksPerYear: 0,
    achievements: [""],
    isLeadership: false,
  })

  const addActivity = () => {
    if (newActivity.name && newActivity.position && newActivity.description) {
      setActivities([
        ...activities,
        {
          ...newActivity,
          id: Date.now().toString(),
          achievements: newActivity.achievements.filter((a) => a.trim() !== ""),
        },
      ])
      setNewActivity({
        name: "",
        category: "Academic",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        hoursPerWeek: 0,
        weeksPerYear: 0,
        achievements: [""],
        isLeadership: false,
      })
    }
  }

  const removeActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...newActivity.achievements]
    newAchievements[index] = value
    setNewActivity({ ...newActivity, achievements: newAchievements })
  }

  const addAchievement = () => {
    setNewActivity({ ...newActivity, achievements: [...newActivity.achievements, ""] })
  }

  const removeAchievement = (index: number) => {
    const newAchievements = newActivity.achievements.filter((_, i) => i !== index)
    setNewActivity({ ...newActivity, achievements: newAchievements })
  }

  const getTotalHours = () => {
    return activities.reduce((total, activity) => {
      return total + activity.hoursPerWeek * activity.weeksPerYear
    }, 0)
  }

  const getLeadershipCount = () => {
    return activities.filter((activity) => activity.isLeadership).length
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Academic: "bg-blue-100 text-blue-800",
      Sports: "bg-green-100 text-green-800",
      Arts: "bg-purple-100 text-purple-800",
      "Community Service": "bg-orange-100 text-orange-800",
      Leadership: "bg-red-100 text-red-800",
      Work: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["Other"]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Extracurricular Activities</h1>
        <p className="text-muted-foreground">Document your activities, leadership roles, and achievements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getTotalHours().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">estimated hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership Roles</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{getLeadershipCount()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Activity</CardTitle>
          <CardDescription>Record your extracurricular involvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="activity-name">Activity Name</Label>
              <Input
                id="activity-name"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                placeholder="e.g., National Honor Society"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newActivity.category}
                onValueChange={(value: Extracurricular["category"]) =>
                  setNewActivity({ ...newActivity, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Community Service">Community Service</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">Position/Role</Label>
              <Input
                id="position"
                value={newActivity.position}
                onChange={(e) => setNewActivity({ ...newActivity, position: e.target.value })}
                placeholder="e.g., President, Member, Volunteer"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="leadership"
                checked={newActivity.isLeadership}
                onCheckedChange={(checked) => setNewActivity({ ...newActivity, isLeadership: checked as boolean })}
              />
              <Label htmlFor="leadership">This is a leadership role</Label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="month"
                value={newActivity.startDate}
                onChange={(e) => setNewActivity({ ...newActivity, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="month"
                value={newActivity.endDate}
                onChange={(e) => setNewActivity({ ...newActivity, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hours-week">Hours per Week</Label>
              <Input
                id="hours-week"
                type="number"
                value={newActivity.hoursPerWeek || ""}
                onChange={(e) => setNewActivity({ ...newActivity, hoursPerWeek: Number.parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeks-year">Weeks per Year</Label>
              <Input
                id="weeks-year"
                type="number"
                value={newActivity.weeksPerYear || ""}
                onChange={(e) => setNewActivity({ ...newActivity, weeksPerYear: Number.parseInt(e.target.value) || 0 })}
                min="0"
                max="52"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              placeholder="Describe your role and responsibilities..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Achievements & Awards</Label>
            {newActivity.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder="Describe an achievement or award..."
                />
                {newActivity.achievements.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeAchievement(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
              className="w-full bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          </div>

          <Button onClick={addActivity} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Activities</CardTitle>
          <CardDescription>Your recorded extracurricular activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{activity.name}</h4>
                      <Badge className={getCategoryColor(activity.category)}>{activity.category}</Badge>
                      {activity.isLeadership && (
                        <Badge variant="default" className="bg-blue-600">
                          <Award className="w-3 h-3 mr-1" />
                          Leadership
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{activity.position}</p>
                    <p className="text-sm mb-3">{activity.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                      <span>
                        📅 {activity.startDate} - {activity.endDate}
                      </span>
                      <span>⏰ {activity.hoursPerWeek}h/week</span>
                      <span>📊 {activity.weeksPerYear} weeks/year</span>
                      <span>🕐 {activity.hoursPerWeek * activity.weeksPerYear} total hours</span>
                    </div>

                    {activity.achievements.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Achievements:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {activity.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(activity.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
