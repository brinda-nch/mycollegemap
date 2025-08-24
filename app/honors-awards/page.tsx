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
import { useData } from "@/lib/data-context"

export default function HonorsAwardsPage() {
  const { honorsAwards, addHonorAward, deleteHonorAward } = useData()

  const [newHonor, setNewHonor] = useState({
    name: "",
    category: "",
    level: "",
    date: "",
    description: "",
    organization: "",
  })

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
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Analyze My Honors
            </Button>
          </div>
        </CardContent>
      </Card>

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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHonorAward(honor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
    </div>
  )
}
