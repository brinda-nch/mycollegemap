"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Data types
export interface GPAEntry {
  id: string
  semester: string
  year: number
  gpa: number
  weightedGpa?: number
  credits?: number
  classRank?: number
  classSize?: number
}

export interface TestScore {
  id: string
  testType: string
  subject?: string
  score: number
  maxScore?: number
  testDate?: string
}

export interface Activity {
  id: string
  activityName: string
  category?: string
  description?: string
  leadershipPosition?: string
  hoursPerWeek?: number
  weeksPerYear?: number
  yearsParticipated?: number
  startDate?: string
  endDate?: string
}

export interface HonorAward {
  id: string
  title: string
  description?: string
  level?: string
  dateReceived?: string
}

export interface Essay {
  id: string
  title: string
  prompt?: string
  content?: string
  wordCount?: number
  status: string
}

export interface CollegeApplication {
  id: string
  collegeName: string
  applicationType?: string
  deadline?: string
  status: string
  applicationFee?: number
  notes?: string
}

interface DataContextType {
  // GPA Data
  gpaEntries: GPAEntry[]
  addGpaEntry: (entry: Omit<GPAEntry, 'id'>) => void
  updateGpaEntry: (id: string, entry: Partial<GPAEntry>) => void
  deleteGpaEntry: (id: string) => void
  
  // Test Scores
  testScores: TestScore[]
  addTestScore: (score: Omit<TestScore, 'id'>) => void
  updateTestScore: (id: string, score: Partial<TestScore>) => void
  deleteTestScore: (id: string) => void
  
  // Activities
  activities: Activity[]
  addActivity: (activity: Omit<Activity, 'id'>) => void
  updateActivity: (id: string, activity: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  
  // Honors & Awards
  honorsAwards: HonorAward[]
  addHonorAward: (award: Omit<HonorAward, 'id'>) => void
  updateHonorAward: (id: string, award: Partial<HonorAward>) => void
  deleteHonorAward: (id: string) => void
  
  // Essays
  essays: Essay[]
  addEssay: (essay: Omit<Essay, 'id'>) => void
  updateEssay: (id: string, essay: Partial<Essay>) => void
  deleteEssay: (id: string) => void
  
  // College Applications
  collegeApplications: CollegeApplication[]
  addCollegeApplication: (application: Omit<CollegeApplication, 'id'>) => void
  updateCollegeApplication: (id: string, application: Partial<CollegeApplication>) => void
  deleteCollegeApplication: (id: string) => void
  
  // Utility functions
  getDashboardStats: () => {
    currentGPA: string
    satScore: string
    applicationsCount: string
    essaysCount: string
  }
  getRecentActivities: () => Array<{
    title: string
    description: string
    time: string
    type: string
  }>
  getUpcomingDeadlines: () => Array<{
    college: string
    deadline: string
    type: string
    status: string
  }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  
  // Initialize empty data arrays
  const [gpaEntries, setGpaEntries] = useState<GPAEntry[]>([])
  const [testScores, setTestScores] = useState<TestScore[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [honorsAwards, setHonorsAwards] = useState<HonorAward[]>([])
  const [essays, setEssays] = useState<Essay[]>([])
  const [collegeApplications, setCollegeApplications] = useState<CollegeApplication[]>([])

  // Helper function to get user-specific storage key
  const getUserStorageKey = (key: string) => {
    return session?.user?.email ? `${session.user.email}_${key}` : key
  }

  // Load data based on user
  useEffect(() => {
    if (session?.user?.email === 'demo@example.com') {
      // Load demo data
      setGpaEntries([
        {
          id: "1",
          semester: "Fall",
          year: 2023,
          gpa: 3.85,
          weightedGpa: 4.12,
          credits: 6,
          classRank: 25,
          classSize: 350,
        },
        {
          id: "2",
          semester: "Spring",
          year: 2024,
          gpa: 3.92,
          weightedGpa: 4.18,
          credits: 6,
          classRank: 22,
          classSize: 350,
        },
      ])
      
      setTestScores([
        {
          id: "1",
          testType: "SAT",
          score: 1450,
          maxScore: 1600,
          testDate: "2024-03-15",
        },
      ])
      
      setActivities([
        {
          id: "1",
          activityName: "Debate Team",
          category: "Academic",
          description: "Varsity debate team captain",
          leadershipPosition: "Captain",
          hoursPerWeek: 8,
          weeksPerYear: 32,
          yearsParticipated: 3,
        },
      ])
      
      setEssays([
        {
          id: "1",
          title: "Common App Personal Statement",
          prompt: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
          content: "Draft in progress...",
          wordCount: 250,
          status: "draft",
        },
      ])
      
      setCollegeApplications([])
    } else if (session?.user?.email) {
      // For all other authenticated users, load from localStorage or start empty
      try {
        const storedGpa = localStorage.getItem(getUserStorageKey('gpaEntries'))
        const storedTestScores = localStorage.getItem(getUserStorageKey('testScores'))
        const storedActivities = localStorage.getItem(getUserStorageKey('activities'))
        const storedHonorsAwards = localStorage.getItem(getUserStorageKey('honorsAwards'))
        const storedEssays = localStorage.getItem(getUserStorageKey('essays'))
        const storedCollegeApplications = localStorage.getItem(getUserStorageKey('collegeApplications'))

        setGpaEntries(storedGpa ? JSON.parse(storedGpa) : [])
        setTestScores(storedTestScores ? JSON.parse(storedTestScores) : [])
        setActivities(storedActivities ? JSON.parse(storedActivities) : [])
        setHonorsAwards(storedHonorsAwards ? JSON.parse(storedHonorsAwards) : [])
        setEssays(storedEssays ? JSON.parse(storedEssays) : [])
        setCollegeApplications(storedCollegeApplications ? JSON.parse(storedCollegeApplications) : [])
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
        // If there's an error, start with empty arrays
        setGpaEntries([])
        setTestScores([])
        setActivities([])
        setHonorsAwards([])
        setEssays([])
        setCollegeApplications([])
      }
    }
    // If no session, keep data as is (empty arrays)
  }, [session?.user?.email])

  // GPA functions
  const addGpaEntry = (entry: Omit<GPAEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() }
    setGpaEntries(prev => {
      const updated = [...prev, newEntry]
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('gpaEntries'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const updateGpaEntry = (id: string, entry: Partial<GPAEntry>) => {
    setGpaEntries(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...entry } : item
      )
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('gpaEntries'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteGpaEntry = (id: string) => {
    setGpaEntries(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('gpaEntries'), JSON.stringify(updated))
      }
      return updated
    })
  }

  // Test Score functions
  const addTestScore = (score: Omit<TestScore, 'id'>) => {
    const newScore = { ...score, id: Date.now().toString() }
    setTestScores(prev => {
      const updated = [...prev, newScore]
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('testScores'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const updateTestScore = (id: string, score: Partial<TestScore>) => {
    setTestScores(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...score } : item
      )
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('testScores'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteTestScore = (id: string) => {
    setTestScores(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('testScores'), JSON.stringify(updated))
      }
      return updated
    })
  }

  // Activity functions
  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: Date.now().toString() }
    setActivities(prev => {
      const updated = [...prev, newActivity]
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('activities'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const updateActivity = (id: string, activity: Partial<Activity>) => {
    setActivities(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...activity } : item
      )
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('activities'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteActivity = (id: string) => {
    setActivities(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('activities'), JSON.stringify(updated))
      }
      return updated
    })
  }

  // Honor Award functions
  const addHonorAward = (award: Omit<HonorAward, 'id'>) => {
    const newAward = { ...award, id: Date.now().toString() }
    setHonorsAwards(prev => {
      const updated = [...prev, newAward]
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('honorsAwards'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const updateHonorAward = (id: string, award: Partial<HonorAward>) => {
    setHonorsAwards(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...award } : item
      )
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('honorsAwards'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteHonorAward = (id: string) => {
    setHonorsAwards(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('honorsAwards'), JSON.stringify(updated))
      }
      return updated
    })
  }

  // Essay functions
  const addEssay = (essay: Omit<Essay, 'id'>) => {
    const newEssay = { ...essay, id: Date.now().toString() }
    setEssays(prev => {
      const updated = [...prev, newEssay]
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('essays'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const updateEssay = (id: string, essay: Partial<Essay>) => {
    setEssays(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...essay } : item
      )
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('essays'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteEssay = (id: string) => {
    setEssays(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('essays'), JSON.stringify(updated))
      }
      return updated
    })
  }

  // College Application functions
  const addCollegeApplication = (application: Omit<CollegeApplication, 'id'>) => {
    const newApplication = { ...application, id: Date.now().toString() }
    setCollegeApplications(prev => {
      const updated = [...prev, newApplication]
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('collegeApplications'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const updateCollegeApplication = (id: string, application: Partial<CollegeApplication>) => {
    setCollegeApplications(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...application } : item
      )
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('collegeApplications'), JSON.stringify(updated))
      }
      return updated
    })
  }

  const deleteCollegeApplication = (id: string) => {
    setCollegeApplications(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (session?.user?.email && session.user.email !== 'demo@example.com') {
        localStorage.setItem(getUserStorageKey('collegeApplications'), JSON.stringify(updated))
      }
      return updated
    })
  }

  // Dashboard utility functions
  const getDashboardStats = () => {
    const currentGPA = gpaEntries.length > 0 
      ? (gpaEntries.reduce((sum, entry) => sum + entry.gpa, 0) / gpaEntries.length).toFixed(2)
      : "0.00"
    
    const latestSAT = testScores.find(score => score.testType === "SAT")
    const satScore = latestSAT ? latestSAT.score.toString() : "0"
    
    const applicationsCount = collegeApplications.length.toString()
    const essaysCount = essays.length.toString()

    return {
      currentGPA,
      satScore,
      applicationsCount,
      essaysCount,
    }
  }

  const getRecentActivities = () => {
    // This would be populated from actual user activity
    return []
  }

  const getUpcomingDeadlines = () => {
    return collegeApplications
      .filter(app => app.deadline)
      .map(app => ({
        college: app.collegeName,
        deadline: app.deadline!,
        type: app.applicationType || "Regular Decision",
        status: app.status,
      }))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5)
  }

  const value: DataContextType = {
    gpaEntries,
    addGpaEntry,
    updateGpaEntry,
    deleteGpaEntry,
    testScores,
    addTestScore,
    updateTestScore,
    deleteTestScore,
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    honorsAwards,
    addHonorAward,
    updateHonorAward,
    deleteHonorAward,
    essays,
    addEssay,
    updateEssay,
    deleteEssay,
    collegeApplications,
    addCollegeApplication,
    updateCollegeApplication,
    deleteCollegeApplication,
    getDashboardStats,
    getRecentActivities,
    getUpcomingDeadlines,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
