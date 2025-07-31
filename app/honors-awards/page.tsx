"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Award, Trophy, Star } from "lucide-react"

interface Honor {
  id: string
  name: string
  category: string
  level: string
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
      date: "2024-09-15",
      description: "Recognized for outstanding performance on the PSAT/NMSQT",
      organization: "National Merit Scholarship Corporation",
    },
    {
      id: "2",
      name: "AP Scholar with Distinction",
      category: "Academic",
      level: "National",
      date: "2024-07-01",
      description: "Earned average score of 3.5+ on 5 or more AP exams",
      organization: "College Board",
    },
    {
      id: "3",
      name: "State Championship - Soccer",
      category: "Athletic",
      level: "State",
      date: "2023-11-01",
      description: "Led varsity soccer team to state championship victory",
      organization: "State Athletic Association",
    },
    {
      id: "4",
      name: "Presidential Volunteer Service Award",
      category: "Community Service",
      level: "National",
      date: "2023-06-15",
      description: "Completed 100+ hours of community service",
      organization: "Corporation for National and Community Service",
    },
    {
      id: "5",
      name: "Regional Science Fair - 1st Place",
      category: "Academic",
      level: "State",
      date: "2024-03-15",
      description: "First place in Environmental Science category",
      organization: "Regional Science Fair Association",
    },
    {
      id: "6",
      name: "Principal's Honor Roll",
      category: "Academic",
      level: "School",
      date: "2024-06-15",
      description: "Maintained 4.0 GPA throughout junior year",
      organization: "Lincoln High School",
    },
  ])

  const [newHonor, setNewHonor] = useState({
    name: "",
    category: "",
    level: "",
    date: "",
    description: "",
    organization: "",
  })

  const addHonor = () => {
    if (newHonor.name && newHonor.category && newHonor.level && newHonor.date) {
      setHonors([...honors, { ...newHonor, id: Date.now().toString() }])
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

  const getHonorsByCategory = () => {
    const categories = honors.reduce(
      (acc, honor) => {
        if (!acc[honor.category]) {
          acc[honor.category] = []
        }
        acc[honor.category].push(honor)
        return acc
      },
      {} as { [key: string]: Honor[] },
    )
    return categories
  }

  const honorsByCategory = getHonorsByCategory()

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
            <div className="text-2xl font-bold">{honors.length}</div>
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
              {honors.filter((h) => h.level === "National" || h.level === "International").length}
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
            <div className="text-2xl font-bold">{honors.filter((h) => h.category === "Academic").length}</div>
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
              {honors.filter((h) => new Date(h.date).getFullYear() === 2024).length}
            </div>
            <p className="text-xs text-muted-foreground">Awards in 2024</p>
          </CardContent>
        </Card>
      </div>

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
          <Button onClick={addHonor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Honor/Award
          </Button>
        </CardContent>
      </Card>

      {/* Honors List by Category */}
      <div className="space-y-6">
        {Object.entries(honorsByCategory).map(([category, categoryHonors]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                {category} ({categoryHonors.length})
              </CardTitle>
              <CardDescription>Your {category.toLowerCase()} achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryHonors
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((honor) => (
                    <div key={honor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{honor.name}</h3>
                          <p className="text-sm text-gray-600">{honor.organization}</p>
                          <p className="text-sm text-gray-500">{new Date(honor.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getLevelColor(honor.level)} className="flex items-center">
                            {getLevelIcon(honor.level)}
                            <span className="ml-1">{honor.level}</span>
                          </Badge>
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
                      {honor.description && <p className="text-gray-700 text-sm">{honor.description}</p>}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
