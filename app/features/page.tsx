"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Trophy, FileText, User, Edit, Award, Users, MessageSquare, Compass, Briefcase, LineChart } from "lucide-react"

const featureCategories = [
  {
    category: "Academics",
    subtitle: "GPA & Test Scores",
    icon: GraduationCap,
    color: "#f89880",
    features: [
      {
        icon: LineChart,
        title: "GPA Tracking",
        description: "Monitor your academic performance with detailed tracking across all semesters"
      },
      {
        icon: BookOpen,
        title: "Test Score Tracking",
        description: "Manage SAT, ACT, AP exams, and subject tests in one place"
      }
    ]
  },
  {
    category: "Extracurriculars & Awards",
    subtitle: "Activities & Achievements",
    icon: Trophy,
    color: "#60a5fa",
    features: [
      {
        icon: Trophy,
        title: "Activity Tracking",
        description: "Document extracurriculars, leadership roles, and honors"
      },
      {
        icon: Award,
        title: "Activities Analyzer",
        description: "Get feedback to strengthen your activity descriptions"
      }
    ]
  },
  {
    category: "Student Profile & Essays",
    subtitle: "Build Your Story",
    icon: User,
    color: "#a78bfa",
    features: [
      {
        icon: User,
        title: "Profile Generation",
        description: "Analyze your achievements to identify your unique spike and build a compelling profile"
      },
      {
        icon: Users,
        title: "Profile Examples",
        description: "Browse successful student profiles and learn from real examples"
      },
      {
        icon: Edit,
        title: "Essay Proofreader",
        description: "Review and refine essays with detailed feedback"
      },
      {
        icon: FileText,
        title: "Application Narrative",
        description: "Craft a compelling narrative connecting all aspects of your application"
      }
    ]
  },
  {
    category: "Applications & Planning",
    subtitle: "Stay Organized",
    icon: Compass,
    color: "#34d399",
    features: [
      {
        icon: FileText,
        title: "Application Tracking",
        description: "Track deadlines, requirements, and submission status for every school"
      },
      {
        icon: MessageSquare,
        title: "Admissions Advice",
        description: "Access insider tips from actual college admissions officers"
      },
      {
        icon: Compass,
        title: "Major Discovery",
        description: "Find majors aligned with your interests and career goals"
      },
      {
        icon: Briefcase,
        title: "Growth Opportunities",
        description: "Explore summer programs, internships, and research opportunities"
      }
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#1e293b' }}>
              MyCollegeMap
            </Link>
            <Link 
              href="/features" 
              className="text-base font-medium"
              style={{ color: '#f89880' }}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/auth/login"
              className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 text-sm font-medium rounded-full text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#f89880' }}
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#0f172a' }}>
            Powerful Features for Your
            <br />
            <span style={{ color: '#f89880' }}>College Journey</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto">
            Everything you need to organize, track, and optimize your college applications, all in one comprehensive platform.
          </p>
        </motion.div>
      </section>

      {/* Mind Map Style Categories */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {featureCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header - Center Node */}
              <div className="flex justify-center mb-16">
                <motion.div 
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div 
                    className="flex flex-col items-center p-8 rounded-3xl border-4 bg-white/90 backdrop-blur-sm shadow-xl min-w-[300px]"
                    style={{ borderColor: category.color }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <category.icon 
                        className="w-16 h-16 mb-4" 
                        style={{ color: category.color }} 
                      />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>
                      {category.category}
                    </h2>
                    <p className="text-lg text-slate-600">{category.subtitle}</p>
                  </div>
                  {/* Connection lines */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                </motion.div>
              </div>

              {/* Features - Branch Nodes */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="relative"
                    initial={{ opacity: 0, x: featureIndex % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + featureIndex * 0.1 }}
                  >
                    {/* Connection line to center */}
                    <div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 opacity-30"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    
                    <motion.div
                      className="p-6 rounded-2xl border-2 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all h-full"
                      style={{ borderColor: `${category.color}40` }}
                      whileHover={{ 
                        y: -5, 
                        borderColor: category.color,
                        boxShadow: `0 20px 25px -5px ${category.color}20`
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${category.color}20` }}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <feature.icon className="w-6 h-6" style={{ color: category.color }} />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: '#0f172a' }}>
                            {feature.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0f172a' }}>
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already using MyCollegeMap to organize their college applications.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-medium rounded-full text-white transition-all hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: '#f89880' }}
          >
            Get started for free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-slate-600">
          <p className="mb-2">Questions or support?</p>
          <a 
            href="mailto:mycollegemap@gmail.com" 
            className="hover:underline"
            style={{ color: '#f89880' }}
          >
            mycollegemap@gmail.com
          </a>
          <p className="mt-8 text-sm text-slate-300">
            © 2025 MyCollegeMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
