"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Edit, 
  Save, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  MoreHorizontal,
  Search,
  Filter,
  Grid3X3,
  List as ListIcon
} from "lucide-react"
import { useData } from "@/lib/data-context"

export default function EssaysPage() {
  const { essays, addEssay, deleteEssay, updateEssay } = useData()

  // State for Google Docs-like interface
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewEssayForm, setShowNewEssayForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // New essay form state
  const [newEssay, setNewEssay] = useState({
    title: "",
    type: "",
    college: "",
    prompt: "",
    wordLimit: 650,
  })

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    type: "",
    college: "",
    prompt: "",
    wordLimit: 650,
  })

  // Refs for editor
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // Get current essay
  const currentEssay = essays.find(essay => essay.id === selectedEssay)

  // Filter essays based on search
  const filteredEssays = essays.filter(essay =>
    essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    essay.prompt?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Auto-save functionality
  useEffect(() => {
    if (currentEssay && editorRef.current) {
      editorRef.current.value = currentEssay.content || ""
    }
  }, [currentEssay])

  const handleAddEssay = () => {
    if (newEssay.title && newEssay.prompt) {
      const newId = Date.now().toString()
      addEssay({
        title: newEssay.title,
        prompt: newEssay.prompt,
        content: "",
        wordCount: newEssay.wordLimit,
        status: "Not Started",
      })
      setNewEssay({
        title: "",
        type: "",
        college: "",
        prompt: "",
        wordLimit: 650,
      })
      setShowNewEssayForm(false)
      setSelectedEssay(newId)
    }
  }

  const handleEditEssay = (essay: any) => {
    setEditForm({
      title: essay.title,
      type: essay.type || "",
      college: essay.college || "",
      prompt: essay.prompt || "",
      wordLimit: essay.wordCount || 650,
    })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (selectedEssay && editForm.title && editForm.prompt) {
      updateEssay(selectedEssay, {
        title: editForm.title,
        prompt: editForm.prompt,
        wordCount: editForm.wordLimit,
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      title: "",
      type: "",
      college: "",
      prompt: "",
      wordLimit: 650,
    })
  }

  const updateEssayContent = (content: string) => {
    if (selectedEssay) {
      updateEssay(selectedEssay, {
              content,
        status: content.length > 0 ? "In Progress" : "Not Started",
      })
    }
  }

  const updateEssayStatus = (status: string) => {
    if (selectedEssay) {
      updateEssay(selectedEssay, { status })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Final":
        return "bg-green-100 text-green-800"
      case "Draft Complete":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Final":
        return <CheckCircle className="h-3 w-3" />
      case "Draft Complete":
        return <FileText className="h-3 w-3" />
      case "In Progress":
        return <Clock className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const getWordCount = (content: string) => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCompletionPercentage = () => {
    const completed = essays.filter((e) => e.status === "Final").length
    return essays.length > 0 ? (completed / essays.length) * 100 : 0
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-navy-800">Essays</h2>
                <p className="text-sm text-navy-600">{essays.length} documents</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
      </div>

        {/* Search and Controls */}
        {!sidebarCollapsed && (
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search essays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={() => setShowNewEssayForm(true)}
                size="sm"
                     style={{ 
                       backgroundColor: '#f89880',
                       borderColor: '#f89880'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = '#f5856b';
                       e.currentTarget.style.borderColor = '#f5856b';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = '#f89880';
                       e.currentTarget.style.borderColor = '#f89880';
                     }}
              >
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>
        )}

        {/* Essays List */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-2">
            {filteredEssays.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No essays found</p>
                {searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredEssays.map((essay) => {
                  const wordCount = getWordCount(essay.content || "")
                  const isSelected = selectedEssay === essay.id
                  
                  return (
                    <div
                      key={essay.id}
                      onClick={() => setSelectedEssay(essay.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                        isSelected 
                          ? 'border-2' 
                          : 'hover:bg-gray-100 border-transparent'
                      }`}
                      style={isSelected ? { 
                        backgroundColor: '#fef2f2', 
                        borderColor: '#f89880' 
                      } : { borderColor: '#e5e7eb' }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy-800 text-sm mb-2 line-clamp-2">
                            {essay.title}
                          </h3>
                          <div className="flex items-center justify-center mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(essay.status)}`}>
                              {getStatusIcon(essay.status)}
                              <span className="ml-1">{essay.status}</span>
                            </span>
                          </div>
                          <p className="text-xs text-navy-600 text-center">
                            {wordCount} words
                          </p>
                        </div>
                        <div className="flex items-center justify-center space-x-2 mt-3 pt-2 border-t border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditEssay(essay)
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEssay(essay.id)
                            }}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredEssays.map((essay) => {
                  const wordCount = getWordCount(essay.content || "")
                  const isSelected = selectedEssay === essay.id
                  
                  return (
                    <div
                      key={essay.id}
                      onClick={() => setSelectedEssay(essay.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border' 
                          : 'hover:bg-gray-100 border border-transparent'
                      }`}
                      style={isSelected ? { 
                        backgroundColor: '#fef2f2', 
                        borderColor: '#f89880' 
                      } : {}}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-navy-800 truncate">
                            {essay.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(essay.status)}`}>
                              {getStatusIcon(essay.status)}
                              <span className="ml-1">{essay.status}</span>
                            </span>
                          </div>
                          <p className="text-xs text-navy-600 mt-1">
                            {wordCount} words
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditEssay(essay)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEssay(essay.id)
                            }}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Collapsed Sidebar Icons */}
        {sidebarCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewEssayForm(true)}
              className="h-10 w-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <div className="w-full h-px bg-gray-200" />
            {essays.slice(0, 5).map((essay) => (
              <Button
                key={essay.id}
                variant={selectedEssay === essay.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedEssay(essay.id)}
                className="h-10 w-10 p-0"
                title={essay.title}
              >
                <FileText className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentEssay ? (
          <>
            {/* Toolbar */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isEditing ? (
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="text-lg font-semibold border-none p-0 h-auto"
                    />
                  ) : (
                    <h1 className="text-lg font-semibold text-navy-800">{currentEssay.title}</h1>
                  )}
                  
                  <Select
                    value={currentEssay.status}
                    onValueChange={updateEssayStatus}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Draft Complete">Draft Complete</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-sm text-navy-600">
                    {getWordCount(currentEssay.content || "")} words
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEssay(currentEssay)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEssay(null)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-y-auto bg-white/90 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto p-8">
                {/* Prompt Section */}
                <div className="mb-8 p-4 rounded-lg border" style={{ backgroundColor: '#fef2f2', borderColor: '#f89880' }}>
                  <h3 className="text-sm font-medium text-navy-800 mb-2">Prompt:</h3>
                  <p className="text-sm text-navy-600 leading-relaxed">
                    {isEditing ? (
                      <Textarea
                        value={editForm.prompt}
                        onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                        className="border-none bg-transparent p-0 resize-none"
                        rows={3}
                      />
                    ) : (
                      currentEssay.prompt
                    )}
                  </p>
                </div>

                {/* Editor */}
                <div className="min-h-96">
                  <Textarea
                    ref={editorRef}
                    value={currentEssay.content || ""}
                    onChange={(e) => updateEssayContent(e.target.value)}
                    placeholder="Start writing your essay here..."
                    className="border-none resize-none text-base leading-relaxed p-0 min-h-96 focus:ring-0 focus:outline-none"
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      lineHeight: '1.8',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Word Count Progress */}
                <div className="mt-8 p-4 rounded-lg border" style={{ backgroundColor: '#fef2f2', borderColor: '#f89880' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-navy-800">Word Count</span>
                    <span className="text-sm text-navy-600">
                      {getWordCount(currentEssay.content || "")} / {currentEssay.wordCount || 650}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((getWordCount(currentEssay.content || "") / (currentEssay.wordCount || 650)) * 100, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-white/50">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-navy-400" />
              <h3 className="text-lg font-medium text-navy-800 mb-2">No essay selected</h3>
              <p className="text-navy-600 mb-4">Choose an essay from the sidebar or create a new one</p>
              <Button
                onClick={() => setShowNewEssayForm(true)}
                     style={{ 
                       backgroundColor: '#f89880',
                       borderColor: '#f89880'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = '#f5856b';
                       e.currentTarget.style.borderColor = '#f5856b';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = '#f89880';
                       e.currentTarget.style.borderColor = '#f89880';
                     }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Essay
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Essay Modal */}
      {showNewEssayForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
              <CardTitle>Create New Essay</CardTitle>
              <CardDescription>Add a new essay to your collection</CardDescription>
        </CardHeader>
            <CardContent className="space-y-4">
            <div>
              <Label htmlFor="essayTitle">Essay Title</Label>
              <Input
                id="essayTitle"
                value={newEssay.title}
                onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                placeholder="e.g., Common App Personal Statement"
              />
            </div>
              
              <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="college">College/Application</Label>
              <Input
                id="college"
                value={newEssay.college}
                onChange={(e) => setNewEssay({ ...newEssay, college: e.target.value })}
                placeholder="e.g., Stanford University"
              />
            </div>
            <div>
              <Label htmlFor="wordLimit">Word Limit</Label>
              <Input
                id="wordLimit"
                type="number"
                    value={newEssay.wordLimit}
                    onChange={(e) => setNewEssay({ ...newEssay, wordLimit: Number(e.target.value) })}
                placeholder="650"
              />
            </div>
          </div>

              <div>
            <Label htmlFor="prompt">Essay Prompt</Label>
            <Textarea
              id="prompt"
              value={newEssay.prompt}
              onChange={(e) => setNewEssay({ ...newEssay, prompt: e.target.value })}
              placeholder="Enter the full essay prompt here..."
                  rows={4}
            />
          </div>

              <div className="flex justify-end space-x-2">
                    <Button
                  variant="outline"
                  onClick={() => setShowNewEssayForm(false)}
                >
                  Cancel
                    </Button>
                    <Button
                  onClick={handleAddEssay}
                     style={{ 
                       backgroundColor: '#f89880',
                       borderColor: '#f89880'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = '#f5856b';
                       e.currentTarget.style.borderColor = '#f5856b';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = '#f89880';
                       e.currentTarget.style.borderColor = '#f89880';
                     }}
                >
                  Create Essay
                    </Button>
                </div>
              </CardContent>
            </Card>
      </div>
      )}

      {/* Edit Essay Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle>Edit Essay</CardTitle>
            <CardDescription>Update your essay information</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="editEssayTitle">Essay Title</Label>
                <Input
                  id="editEssayTitle"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g., Personal Statement"
                />
            </div>

              <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editEssayCollege">College/University</Label>
                <Input
                  id="editEssayCollege"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  placeholder="e.g., Harvard University"
                />
              </div>
              <div>
                <Label htmlFor="editEssayWordLimit">Word Limit</Label>
                <Input
                  id="editEssayWordLimit"
                  type="number"
                  value={editForm.wordLimit}
                  onChange={(e) => setEditForm({ ...editForm, wordLimit: Number(e.target.value) })}
                  min="0"
                  max="5000"
                />
              </div>
            </div>

              <div>
              <Label htmlFor="editEssayPrompt">Essay Prompt</Label>
              <Textarea
                id="editEssayPrompt"
                value={editForm.prompt}
                onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                placeholder="Enter the full essay prompt here..."
                  rows={4}
              />
            </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                     style={{ 
                       backgroundColor: '#f89880',
                       borderColor: '#f89880'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = '#f5856b';
                       e.currentTarget.style.borderColor = '#f5856b';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = '#f89880';
                       e.currentTarget.style.borderColor = '#f89880';
                     }}
                >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  )
}
