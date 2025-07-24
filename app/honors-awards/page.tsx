"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Award, Trophy, Medal, Star } from "lucide-react"

interface Honor {
  id: string
  name: string
  category: "Academic" | "Athletic" | "Community Service" | "Leadership" | "Arts" | "Other"
  level: "School" | "District" | "State" | "National" | "International"
  date: string
  description: string
  organization: string
}

export default function HonorsAwardsPage() {
  const [honors, setHonors] = useState<Honor[]>([
    {
      id: "1",
      name: "National Merit Semifinalist",
      category: "Academic",
      level: "National",
      date: "2024-09",
      description: "Recognized for outstanding performance on the PSAT/NMSQT",
      organization: "National Merit Scholarship Corporation",
    },
    {
      id: "2",
      name: "AP Scholar with Distinction",
      category: "Academic",
      level: "National",
      date: "2024-07",
      description: "Earned average score of 3.5+ on 5 or more AP exams",
      organization: "College Board",
    },
    {
      id: "3",
      name: "State Championship - Soccer",
      category: "Athletic",
      level: "State",
      date: "2023-11",
      description: "Led varsity soccer team to state championship victory",
      organization: "State Athletic Association",
    },
    {
      id: "4",
      name: "Presidential Volunteer Service Award",
      category: "Community Service",
      level: "National",
      date: "2023-06",
      description: "Completed 100+ hours of community service",
      organization: "Corporation for National and Community Service",
    },
    {
      id: "5",
      name: "Regional Science Fair - 1st Place",
      category: "Academic",
      level: "State",
      date: "2024-03",
      description: "First place in Environmental Science category",
      organization: "Regional Science Fair Association",
    },
  ])

  const [newHonor, setNewHonor] = useState({
    name: "",
    category: "Academic" as Honor["category"],
    level: "School" as Honor["level"],
    date: "",
    description: "",
    organization: "",
  })

  const addHonor = () => {
    if (newHonor.name && newHonor.date && newHonor.organization) {
      setHonors([...honors, { ...newHonor, id: Date.now().toString() }])
      setNewHonor({
        name: "",
        category: "Academic",
        level: "School",
        date: "",
        description: "",
        organization: "",
      })
    }
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
        return <Medal className="w-4 h-4" />
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
      School: "bg-gray-100 text-gray-800",
      District: "bg-blue-100 text-blue-800",
      State: "bg-green-100 text-green-800",
      National: "bg-purple-100 text-purple-800",
      International: "bg-red-100 text-red-800",
    }
    return colors[level] || colors["School"]
  }

  const getHonorsByCategory = () => {
    const categories = ["Academic", "Athletic", "Community Service", "Leadership", "Arts", "Other"]
    return categories
      .map((category) => ({
        category,
        count: honors.filter((honor) => honor.category === category).length,
      }))
      .filter((item) => item.count > 0)
  }

  const getHonorsByLevel = () => {
    const levels = ["International", "National", "State", "District", "School"]
    return levels
      .map((level) => ({
        level,
        count: honors.filter((honor) => honor.level === level).length,
      }))
      .filter((item) => item.count > 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Honors & Awards</h1>
        <p className="text-muted-foreground">Track your achievements and recognition</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{honors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">National Awards</CardTitle>
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {honors.filter((honor) => honor.level === "National").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Honors</CardTitle>
            <Medal className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {honors.filter((honor) => honor.category === "Academic").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Awards</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {
                honors.filter((honor) => {
                  const honorDate = new Date(honor.date)
                  const sixMonthsAgo = new Date()
                  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
                  return honorDate >= sixMonthsAgo
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">last 6 months</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Awards by Category</CardTitle>
            <CardDescription>Distribution across different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getHonorsByCategory().map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <Badge className={getCategoryColor(item.category)}>{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Awards by Level</CardTitle>
            <CardDescription>Recognition scope and reach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getHonorsByLevel().map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.level}</span>
                  <Badge className={getLevelColor(item.level)}>{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Honor/Award</CardTitle>
          <CardDescription>Record your achievements and recognition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="honor-name">Award Name</Label>
              <Input
                id="honor-name"
                value={newHonor.name}
                onChange={(e) => setNewHonor({ ...newHonor, name: e.target.value })}
                placeholder="e.g., National Honor Society"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Awarding Organization</Label>
              <Input
                id="organization"
                value={newHonor.organization}
                onChange={(e) => setNewHonor({ ...newHonor, organization: e.target.value })}
                placeholder="e.g., National Honor Society"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newHonor.category}
                onValueChange={(value: Honor["category"]) => setNewHonor({ ...newHonor, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={newHonor.level}
                onValueChange={(value: Honor["level"]) => setNewHonor({ ...newHonor, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="School">School</SelectItem>
                  <SelectItem value="District">District</SelectItem>
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
                type="month"
                value={newHonor.date}
                onChange={(e) => setNewHonor({ ...newHonor, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newHonor.description}
              onChange={(e) => setNewHonor({ ...newHonor, description: e.target.value })}
              placeholder="Describe the achievement and its significance..."
              rows={3}
            />
          </div>

          <Button onClick={addHonor} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Honor/Award
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Honors & Awards</CardTitle>
          <CardDescription>Your recorded achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {honors
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((honor) => (
                <div key={honor.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{honor.name}</h4>
                        <Badge className={getCategoryColor(honor.category)}>{honor.category}</Badge>
                        <Badge className={getLevelColor(honor.level)}>{honor.level}</Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {honor.organization} •{" "}
                        {new Date(honor.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                      </p>
                      {honor.description && <p className="text-sm text-muted-foreground">{honor.description}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHonor(honor.id)}
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
