"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCircle, Sparkles, Trophy, Award, Target, Lightbulb, BookOpen, TrendingUp, Users, Briefcase, Beaker, PenTool, Music, Globe, Calculator, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useData } from "@/lib/data-context"
import { useSession } from "next-auth/react"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
// Trial status is fetched via API route
import { Settings, CreditCard } from "lucide-react"

interface SpikeAnalysis {
  primarySpike: {
    category: string
    strength: number
    activities: string[]
    totalHours: number
  } | null
  secondarySpikes: Array<{
    category: string
    strength: number
    activities: string[]
  }>
  recommendedMajors: Array<{
    major: string
    relevance: number
    reasoning: string
  }>
  suggestedActivities: Array<{
    activity: string
    reasoning: string
  }>
  missionStatements: string[]
}

// Mapping of activity categories to related majors
const CATEGORY_TO_MAJORS: Record<string, Array<{ major: string; icon: any }>> = {
  "Academic": [
    { major: "Education", icon: BookOpen },
    { major: "Research & Development", icon: Beaker },
    { major: "Academic Studies", icon: BookOpen }
  ],
  "Leadership": [
    { major: "Business Administration", icon: Briefcase },
    { major: "Political Science", icon: Users },
    { major: "Public Policy", icon: Globe },
    { major: "Management", icon: Target }
  ],
  "Sports": [
    { major: "Kinesiology", icon: Trophy },
    { major: "Sports Management", icon: Users },
    { major: "Physical Therapy", icon: Trophy }
  ],
  "Arts": [
    { major: "Fine Arts", icon: PenTool },
    { major: "Graphic Design", icon: PenTool },
    { major: "Music", icon: Music },
    { major: "Theater", icon: Users }
  ],
  "Community Service": [
    { major: "Social Work", icon: Users },
    { major: "Public Health", icon: Globe },
    { major: "Nonprofit Management", icon: Target },
    { major: "Psychology", icon: MessageSquare }
  ],
  "Work Experience": [
    { major: "Business", icon: Briefcase },
    { major: "Entrepreneurship", icon: Lightbulb },
    { major: "Marketing", icon: TrendingUp }
  ]
}

export default function MyProfilePage() {
  const { data: session } = useSession()
  const { activities, honorsAwards, gpaEntries, testScores, essays } = useData()
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    async function fetchStatus() {
      if (session?.user) {
        try {
          const response = await fetch('/api/trial/status')
          if (response.ok) {
            const { status } = await response.json()
            setSubscriptionStatus(status)
          }
        } catch (error) {
          console.error('Error fetching subscription status:', error)
        }
      }
    }
    fetchStatus()
  }, [session])

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true)
    try {
      console.log('🔄 Opening subscription portal...')
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
      })

      console.log('📥 Portal response:', { status: response.status, ok: response.ok })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Portal error:', errorData)
        throw new Error(errorData.error || "Failed to open subscription portal")
      }

      const { url } = await response.json()
      console.log('✅ Portal URL received, redirecting...', url)
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No portal URL received")
      }
    } catch (error: any) {
      console.error('❌ Error opening portal:', error)
      alert(`Error: ${error.message || 'Failed to open subscription portal. Please make sure you have an active subscription.'}`)
      setIsLoadingPortal(false)
    }
  }

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true)
    setAiAnalysis(null)
    
    try {
      const response = await fetch("/api/analyze-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activities,
          honorsAwards,
          gpaEntries,
          testScores,
          essays,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis)
      } else {
        throw new Error("Invalid response from analysis API")
      }
    } catch (error: any) {
      console.error('❌ Analysis error:', error)
      alert(`Analysis failed: ${error.message || 'Please try again later.'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Analyze student's spike
  const analysis: SpikeAnalysis = useMemo(() => {
    if (activities.length === 0 && honorsAwards.length === 0) {
      return {
        primarySpike: null,
        secondarySpikes: [],
        recommendedMajors: [],
        suggestedActivities: [],
        missionStatements: []
      }
    }

    // Calculate time investment per category
    const categoryStats: Record<string, {
      activities: string[]
      totalHours: number
      count: number
      hasLeadership: boolean
      honors: string[]
    }> = {}

    activities.forEach(activity => {
      const cat = activity.category || "Other"
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          activities: [],
          totalHours: 0,
          count: 0,
          hasLeadership: false,
          honors: []
        }
      }

      categoryStats[cat].activities.push(activity.activityName)
      categoryStats[cat].count++

      if (activity.hoursPerWeek && activity.weeksPerYear && activity.yearsParticipated) {
        categoryStats[cat].totalHours += 
          activity.hoursPerWeek * activity.weeksPerYear * activity.yearsParticipated
      }

      if (activity.leadershipPosition) {
        categoryStats[cat].hasLeadership = true
      }
    })

    // Add honors to category stats
    honorsAwards.forEach(honor => {
      // Try to match honor to activity categories
      const titleLower = honor.title.toLowerCase()
      Object.keys(categoryStats).forEach(cat => {
        if (titleLower.includes(cat.toLowerCase()) || 
            categoryStats[cat].activities.some(act => 
              titleLower.includes(act.toLowerCase())
            )) {
          categoryStats[cat].honors.push(honor.title)
        }
      })
    })

    // Calculate strength score for each category
    const categoryScores = Object.entries(categoryStats).map(([category, stats]) => {
      let strength = 0
      strength += stats.count * 10 // 10 points per activity
      strength += Math.min(stats.totalHours / 100, 50) // Up to 50 points for time investment
      strength += stats.hasLeadership ? 20 : 0 // 20 points for leadership
      strength += stats.honors.length * 15 // 15 points per honor

      return {
        category,
        strength,
        activities: stats.activities,
        totalHours: stats.totalHours,
        honors: stats.honors
      }
    }).sort((a, b) => b.strength - a.strength)

    const primarySpike = categoryScores[0] || null
    const secondarySpikes = categoryScores.slice(1, 3)

    // Recommend majors based on spikes
    const recommendedMajors: Array<{ major: string; relevance: number; reasoning: string }> = []
    
    if (primarySpike) {
      const majorsForCategory = CATEGORY_TO_MAJORS[primarySpike.category] || []
      majorsForCategory.forEach(({ major }) => {
        recommendedMajors.push({
          major,
          relevance: 95,
          reasoning: `Strong alignment with your ${primarySpike.category.toLowerCase()} background (${primarySpike.activities.length} activities, ${Math.round(primarySpike.totalHours)} hours)`
        })
      })
    }

    secondarySpikes.forEach(spike => {
      const majorsForCategory = CATEGORY_TO_MAJORS[spike.category] || []
      majorsForCategory.slice(0, 2).forEach(({ major }) => {
        if (!recommendedMajors.find(m => m.major === major)) {
          recommendedMajors.push({
            major,
            relevance: 75,
            reasoning: `Complements your ${spike.category.toLowerCase()} experience`
          })
        }
      })
    })

    // Suggest activities to strengthen spike
    const suggestedActivities: Array<{ activity: string; reasoning: string }> = []
    
    if (primarySpike) {
      const hasLeadership = categoryStats[primarySpike.category]?.hasLeadership
      const hasHonors = (categoryStats[primarySpike.category]?.honors.length || 0) > 0

      if (!hasLeadership) {
        suggestedActivities.push({
          activity: `Leadership position in ${primarySpike.category.toLowerCase()}`,
          reasoning: `Take on a leadership role in one of your existing ${primarySpike.category.toLowerCase()} activities to demonstrate initiative and impact`
        })
      }

      if (!hasHonors) {
        suggestedActivities.push({
          activity: `Competition or award in ${primarySpike.category.toLowerCase()}`,
          reasoning: `Participate in competitions or apply for awards to validate your excellence in ${primarySpike.category.toLowerCase()}`
        })
      }

      if (primarySpike.category === "Academic") {
        suggestedActivities.push({
          activity: "Research project or internship",
          reasoning: "Demonstrate depth in your academic interests through hands-on research or real-world application"
        })
      } else if (primarySpike.category === "Leadership") {
        suggestedActivities.push({
          activity: "Launch a new initiative or club",
          reasoning: "Show entrepreneurial leadership by starting something new that addresses a need in your community"
        })
      } else if (primarySpike.category === "Community Service") {
        suggestedActivities.push({
          activity: "Long-term community project with measurable impact",
          reasoning: "Focus on sustained engagement and track quantifiable outcomes to demonstrate meaningful contribution"
        })
      }
    }

    // Generate mission statements
    const missionStatements: string[] = []
    
    if (primarySpike) {
      const topActivity = primarySpike.activities[0]
      
      missionStatements.push(
        `Passionate ${primarySpike.category.toLowerCase()} leader committed to ${primarySpike.category === "Community Service" ? "making a positive impact in my community" : primarySpike.category === "Academic" ? "advancing knowledge and innovation" : "excellence and collaboration"}`
      )

      if (primarySpike.honors.length > 0) {
        missionStatements.push(
          `${primarySpike.honors[0]} recipient dedicated to achieving excellence in ${primarySpike.category.toLowerCase()}`
        )
      }

      if (secondarySpikes.length > 0) {
        missionStatements.push(
          `Well-rounded student combining ${primarySpike.category.toLowerCase()} with ${secondarySpikes[0].category.toLowerCase()} to create unique perspectives and solutions`
        )
      }

      missionStatements.push(
        `Driven to leverage my ${primarySpike.category.toLowerCase()} experience to make meaningful contributions in ${recommendedMajors[0]?.major || "my field of study"}`
      )
    }

    return {
      primarySpike,
      secondarySpikes,
      recommendedMajors: recommendedMajors.slice(0, 6),
      suggestedActivities: suggestedActivities.slice(0, 4),
      missionStatements: missionStatements.slice(0, 4)
    }
  }, [activities, honorsAwards])

  const getMajorIcon = (major: string) => {
    // Find the icon from the category mappings
    for (const majors of Object.values(CATEGORY_TO_MAJORS)) {
      const match = majors.find(m => m.major === major)
      if (match) return match.icon
    }
    return BookOpen // default icon
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0f172a" }}>
            My Profile
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Your personalized academic profile and recommendations
          </p>
        </motion.div>

        {/* Subscription Management */}
        {subscriptionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6" style={{ color: "#f89880" }} />
                    <div>
                      <CardTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                        Subscription
                      </CardTitle>
                      <CardDescription>
                        {subscriptionStatus.subscriptionTier === 'standard' 
                          ? 'MyCollegeMap Standard - Active'
                          : subscriptionStatus.isTrialing
                          ? `${subscriptionStatus.daysRemaining} days left in your free trial`
                          : 'Trial expired - Subscribe to continue'}
                      </CardDescription>
                    </div>
                  </div>
                  {subscriptionStatus.subscriptionTier === 'standard' && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('🔘 Button clicked!', { isLoadingPortal, subscriptionStatus })
                        handleManageSubscription()
                      }}
                      disabled={isLoadingPortal}
                      className="flex items-center gap-2 cursor-pointer"
                      style={{ backgroundColor: isLoadingPortal ? "#ccc" : "#f89880" }}
                    >
                      {isLoadingPortal ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <Settings className="h-4 w-4" />
                          Manage Subscription
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              {subscriptionStatus.subscriptionTier === 'standard' && (
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Manage your subscription, update payment methods, view invoices, or cancel anytime.
                  </p>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}

        {/* AI Analysis Button */}
        {(activities.length > 0 || honorsAwards.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-6"
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#0f172a" }}>
                      Profile Analysis
                    </h3>
                    <p className="text-slate-600">
                      Get comprehensive analysis of your activities, honors, GPA, test scores, and essays to identify your academic spike, recommended majors, and strategic next steps.
                    </p>
                  </div>
                  <Button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="h-12 px-6 text-white font-semibold rounded-xl"
                    style={{ backgroundColor: "#f89880" }}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Analyze Profile
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Display AI Analysis if available, otherwise show basic analysis or empty state */}
        {aiAnalysis ? (
          <div className="space-y-6">
            {/* Academic Spike */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6" style={{ color: "#f89880" }} />
                    <div>
                      <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Your Academic Spike
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Analyzed based on your complete profile
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-6 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold mb-2" style={{ color: "#f89880" }}>
                          {aiAnalysis.academicSpike?.category || "Not identified"}
                        </h3>
                        <p className="text-slate-700 text-base leading-relaxed mb-4">
                          {aiAnalysis.academicSpike?.description || ""}
                        </p>
                        {aiAnalysis.academicSpike?.keyEvidence && aiAnalysis.academicSpike.keyEvidence.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700">Key Evidence:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                              {aiAnalysis.academicSpike.keyEvidence.map((evidence: string, idx: number) => (
                                <li key={idx}>{evidence}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white border-2 ml-4" style={{ borderColor: "#f89880" }}>
                        <p className="text-sm font-medium text-slate-600">Strength</p>
                        <div className="text-2xl font-bold" style={{ color: "#f89880" }}>
                          {aiAnalysis.academicSpike?.strength || 0}/100
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Majors */}
            {aiAnalysis.recommendedMajors && aiAnalysis.recommendedMajors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                          Recommended Majors
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          Based on your complete academic and extracurricular profile
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiAnalysis.recommendedMajors.map((major: any, idx: number) => {
                        const Icon = getMajorIcon(major.major)
                        return (
                          <div
                            key={idx}
                            className="p-5 rounded-xl border-2 hover:shadow-lg transition-all"
                            style={{
                              backgroundColor: major.relevance > 90 ? "rgba(96, 165, 250, 0.1)" : "rgba(241, 245, 249, 1)",
                              borderColor: major.relevance > 90 ? "#60a5fa" : "#e2e8f0"
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-white">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold text-slate-900">{major.major}</h4>
                                  <Badge 
                                    variant={major.relevance > 90 ? "default" : "secondary"}
                                    className={major.relevance > 90 ? "bg-blue-600" : ""}
                                  >
                                    {major.relevance}% match
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {major.reasoning}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Suggested Next Steps */}
            {aiAnalysis.suggestedNextSteps && aiAnalysis.suggestedNextSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Target className="h-6 w-6 text-green-600" />
                      <div>
                        <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                          Suggested Next Steps
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          Strategic recommendations to strengthen your profile
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiAnalysis.suggestedNextSteps.map((step: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl bg-green-50 border-2 border-green-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white mt-1">
                              <Lightbulb className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-green-900">{step.step}</h4>
                                <Badge 
                                  variant={step.priority === "high" ? "default" : "secondary"}
                                  className={step.priority === "high" ? "bg-red-600" : step.priority === "medium" ? "bg-yellow-600" : ""}
                                >
                                  {step.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-green-800 leading-relaxed">
                                {step.reasoning}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mission Statements */}
            {aiAnalysis.missionStatements && aiAnalysis.missionStatements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-6 w-6" style={{ color: "#a78bfa" }} />
                      <div>
                        <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                          Mission Statement Ideas
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          Synthesized from your complete profile
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiAnalysis.missionStatements.map((statement: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl bg-purple-50 border-2 border-purple-200"
                        >
                          <p className="text-base text-purple-900 leading-relaxed italic">
                            "{statement}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Overall Strength */}
            {aiAnalysis.overallStrength && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                          Overall Applicant Strength
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          Comprehensive assessment of your profile
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-6 rounded-xl bg-blue-50 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Overall Score</p>
                            <div className="text-4xl font-bold text-blue-600">
                              {aiAnalysis.overallStrength.score}/100
                            </div>
                          </div>
                          <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                            {aiAnalysis.overallStrength.tier}
                          </Badge>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {aiAnalysis.overallStrength.admissionsAdvice}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                          <h4 className="font-bold text-green-900 mb-3">Key Strengths</h4>
                          <ul className="space-y-2">
                            {aiAnalysis.overallStrength.strengths?.map((strength: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-green-800 text-sm">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
                          <h4 className="font-bold text-orange-900 mb-3">Areas for Growth</h4>
                          <ul className="space-y-2">
                            {aiAnalysis.overallStrength.areasForGrowth?.map((area: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-orange-800 text-sm">
                                <span className="text-orange-600 mt-1">→</span>
                                <span>{area}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : !analysis.primarySpike ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
              <CardContent className="text-center py-16">
                <div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                  style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}
                >
                  <UserCircle className="h-12 w-12" style={{ color: "#f89880" }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                  Build Your Profile
                </h3>
                <p className="text-lg text-slate-600 max-w-md mx-auto mb-6">
                  Add your activities and honors to get personalized recommendations for majors, activities, and mission statements.
                </p>
                <p className="text-base text-slate-500">
                  Visit the <span className="font-semibold">Extracurriculars</span> page to get started
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Profile Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-white">
                      <Trophy className="h-6 w-6" style={{ color: "#f89880" }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Activities</p>
                      <div className="text-3xl font-bold" style={{ color: "#f89880" }}>
                        {activities.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-white">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Honors & Awards</p>
                      <div className="text-3xl font-bold text-purple-600">
                        {honorsAwards.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-white">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Hours</p>
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(analysis.primarySpike.totalHours)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Spike */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6" style={{ color: "#f89880" }} />
                    <div>
                      <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Your Academic Spike
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Your strongest area of focus and excellence
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-6 rounded-xl" style={{ backgroundColor: "rgba(248, 152, 128, 0.1)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-3xl font-bold mb-2" style={{ color: "#f89880" }}>
                          {analysis.primarySpike.category}
                        </h3>
                        <p className="text-slate-600 text-lg">
                          {analysis.primarySpike.activities.length} activities • {Math.round(analysis.primarySpike.totalHours)} total hours invested
                        </p>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white border-2" style={{ borderColor: "#f89880" }}>
                        <p className="text-sm font-medium text-slate-600">Strength</p>
                        <div className="text-2xl font-bold" style={{ color: "#f89880" }}>
                          {Math.round(analysis.primarySpike.strength)}/100
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700">Related Activities:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.primarySpike.activities.map((activity, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white border-orange-300">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {analysis.secondarySpikes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3 text-slate-700">Secondary Strengths:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.secondarySpikes.map((spike, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                            <h5 className="font-bold text-slate-900 mb-1">{spike.category}</h5>
                            <p className="text-sm text-slate-600 mb-2">
                              {spike.activities.length} activities
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {spike.activities.map((activity, actIdx) => (
                                <Badge key={actIdx} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Majors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Recommended Majors
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Based on your activities and demonstrated interests
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.recommendedMajors.map((major, idx) => {
                      const Icon = getMajorIcon(major.major)
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer"
                          style={{
                            backgroundColor: major.relevance > 90 ? "rgba(96, 165, 250, 0.1)" : "rgba(241, 245, 249, 1)",
                            borderColor: major.relevance > 90 ? "#60a5fa" : "#e2e8f0"
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white">
                              <Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-900">{major.major}</h4>
                                <Badge 
                                  variant={major.relevance > 90 ? "default" : "secondary"}
                                  className={major.relevance > 90 ? "bg-blue-600" : ""}
                                >
                                  {major.relevance}% match
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {major.reasoning}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Suggested Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-green-600" />
                    <div>
                      <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Suggested Next Steps
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Activities to strengthen your profile and demonstrate depth
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.suggestedActivities.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-green-50 border-2 border-green-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white mt-1">
                            <Lightbulb className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-green-900 mb-2">{suggestion.activity}</h4>
                            <p className="text-sm text-green-800 leading-relaxed">
                              {suggestion.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission Statements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6" style={{ color: "#a78bfa" }} />
                    <div>
                      <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                        Mission Statement Ideas
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Ways to articulate your narrative in essays and interviews
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.missionStatements.map((statement, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-purple-50 border-2 border-purple-200"
                      >
                        <p className="text-base text-purple-900 leading-relaxed italic">
                          "{statement}"
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-slate-100 border-2 border-slate-200">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">💡 Tip:</span> Use these mission statements as inspiration for your college essays, personal statements, and interview talking points. Customize them to reflect your unique voice and experiences.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}


