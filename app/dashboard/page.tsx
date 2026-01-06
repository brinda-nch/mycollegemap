"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Trophy, FileText, Target, TrendingUp, Calendar, Award, ArrowRight, Sparkles, BarChart3, CheckCircle2, Clock, X, CheckCircle } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { getDashboardStats, getRecentActivities, getUpcomingDeadlines, gpaEntries, testScores, activities, essays, collegeApplications } = useData()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [bannerMessage, setBannerMessage] = useState<{ title: string; message: string } | null>(null)

  useEffect(() => {
    const subscriptionParam = searchParams?.get('subscription')
    
    if (subscriptionParam === 'success') {
      setBannerMessage({
        title: '🎉 Subscription Activated!',
        message: 'Welcome to MyCollegeMap Standard. You now have full access to all features!'
      })
      setShowSuccessBanner(true)
      // Remove query param from URL
      router.replace('/dashboard', { scroll: false })
      // Hide banner after 5 seconds
      const timer = setTimeout(() => setShowSuccessBanner(false), 5000)
      return () => clearTimeout(timer)
    } else if (subscriptionParam === 'updated') {
      setBannerMessage({
        title: '✅ Subscription Updated',
        message: 'Your subscription changes have been saved. Your access will update accordingly.'
      })
      setShowSuccessBanner(true)
      // Remove query param from URL
      router.replace('/dashboard', { scroll: false })
      // Hide banner after 5 seconds
      const timer = setTimeout(() => setShowSuccessBanner(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  const dashboardStats = getDashboardStats()
  
  const stats = [
    {
      title: "Current GPA",
      value: dashboardStats.currentGPA,
      description: gpaEntries.length > 0 ? "Weighted GPA" : "No GPA data",
      icon: GraduationCap,
      color: "#f89880",
      gradient: "from-red-100 to-orange-100",
    },
    {
      title: "SAT Score",
      value: dashboardStats.satScore,
      description: testScores.length > 0 ? "Latest attempt" : "No test scores",
      icon: BookOpen,
      color: "#60a5fa",
      gradient: "from-blue-100 to-cyan-100",
    },
    {
      title: "Applications",
      value: dashboardStats.applicationsCount,
      description: collegeApplications.length > 0 ? "In progress" : "No applications",
      icon: Target,
      color: "#a78bfa",
      gradient: "from-purple-100 to-pink-100",
    },
    {
      title: "Essays",
      value: dashboardStats.essaysCount,
      description: essays.length > 0 ? "Completed" : "No essays",
      icon: FileText,
      color: "#34d399",
      gradient: "from-green-100 to-emerald-100",
    },
  ]

  const quickActions = [
    {
      title: "Academics",
      description: "Track your GPA and test scores",
      icon: BarChart3,
      href: "/gpa",
      color: "#f89880",
      gradient: "from-red-50 to-orange-50",
    },
    {
      title: "Extracurriculars",
      description: "Manage activities, honors, and awards",
      icon: Trophy,
      href: "/extracurriculars",
      color: "#60a5fa",
      gradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Application Tracking",
      description: "Manage all your applications",
      icon: Target,
      href: "/college-estimations",
      color: "#a78bfa",
      gradient: "from-purple-50 to-pink-50",
    },
  ]

  const recentActivities = getRecentActivities()
  const upcomingDeadlines = getUpcomingDeadlines()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50">
      {/* Success Banner */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-bold text-lg">{bannerMessage?.title || '🎉 Subscription Activated!'}</p>
                    <p className="text-sm text-green-100">{bannerMessage?.message || 'Welcome to MyCollegeMap Standard. You now have full access to all features!'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessBanner(false)}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#f89880] to-[#60a5fa] text-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                Welcome back, {session?.user?.firstName || session?.user?.name}!
              </h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/90 max-w-2xl">
              Here's your college application journey at a glance
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className={`bg-gradient-to-br ${stat.gradient} border-2 border-transparent hover:border-gray-300 transition-all shadow-lg hover:shadow-xl`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" style={{ color: stat.color }} />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: "#0f172a" }}>
                Quick Actions
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your college application materials</p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link href={action.href}>
                  <Card className={`bg-gradient-to-br ${action.gradient} border-2 border-transparent hover:border-gray-300 transition-all shadow-lg hover:shadow-2xl group cursor-pointer h-full`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div
                              className="p-2 sm:p-3 rounded-xl flex-shrink-0"
                              style={{ backgroundColor: `${action.color}20` }}
                            >
                              <action.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: action.color }} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg lg:text-xl font-bold truncate" style={{ color: "#0f172a" }}>
                                {action.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{action.description}</p>
                          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: action.color }}>
                            <span>Manage</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: "#f89880" }} />
                  <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Recent Activities
                  </CardTitle>
                </div>
                <CardDescription className="text-base">Your latest updates and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg" style={{ backgroundColor: activity.type === "activity" ? "#fef3c7" : "#e9d5ff" }}>
                          {activity.type === "activity" && <Trophy className="h-4 w-4 text-yellow-600" />}
                          {activity.type === "honor" && <Award className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No recent activities yet</p>
                    <p className="text-xs text-gray-400 mt-1">Add activities or honors to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-200 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: "#60a5fa" }} />
                  <CardTitle className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Upcoming Deadlines
                  </CardTitle>
                </div>
                <CardDescription className="text-base">Don't miss these important dates</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">{deadline.name}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                deadline.category === 'college'
                                  ? 'border-purple-300 text-purple-700 bg-purple-50'
                                  : 'border-blue-300 text-blue-700 bg-blue-50'
                              }`}
                            >
                              {deadline.category === 'college' ? 'College' : 'Program'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{deadline.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 mb-1">{deadline.deadline}</p>
                          <Badge
                            variant={
                              deadline.status === "overdue"
                                ? "destructive"
                                : deadline.status === "urgent"
                                ? "destructive"
                                : deadline.status === "soon"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {deadline.status === "overdue"
                              ? "Overdue"
                              : deadline.status === "urgent"
                              ? "Due Soon"
                              : deadline.status === "soon"
                              ? "This Month"
                              : "Upcoming"}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No upcoming deadlines</p>
                    <p className="text-xs text-gray-400 mt-1">Add college applications or programs/internships with deadlines to track them here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Getting Started Guide for New Users */}
        {gpaEntries.length === 0 && testScores.length === 0 && activities.length === 0 && essays.length === 0 && collegeApplications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-gradient-to-br from-[#f89880]/10 to-[#60a5fa]/10 border-2 border-dashed border-[#f89880]">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "#f89880" }}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
                    Welcome to MyCollegeMap! 🎉
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Start your college application journey by adding your information. Use the Quick Actions above to get started!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
