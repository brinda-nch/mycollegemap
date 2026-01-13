"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle, BarChart3, Calendar, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "authenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-8">
            <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#1e293b' }}>
              MyCollegeMap
            </Link>
            <Link 
              href="/features" 
              className="hidden sm:inline-block text-sm lg:text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="hidden sm:inline-block text-sm lg:text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center">
            <Link
              href="/auth/login"
              className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#f89880' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight" style={{ color: '#0f172a' }}>
              Navigate your path
              <br />
              to <span style={{ color: '#f89880' }}>college success</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 lg:mb-12 max-w-3xl leading-relaxed">
              The complete platform to track applications, manage deadlines, and organize your college journey, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/auth/signup"
                className="group px-6 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-4 text-base sm:text-lg font-medium rounded-full text-white transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-fit"
                style={{ backgroundColor: '#f89880' }}
              >
                Get started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img 
              src="/titlep.png" 
              alt="Student climbing ladder to graduation cap"
              className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl h-auto"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-4 lg:px-6">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-700 mb-6 sm:mb-7 lg:mb-8 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Making college admissions guidance accessible, affordable, and equitable.
            {" "}
            MyCollegeMap helps every student understand requirements, build a competitive profile, and stay organized without the cost of traditional counseling.
          </motion.p>
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold leading-tight tracking-tight" 
            style={{ color: '#0f172a' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Everyone deserves to go
            <br />
            to go to college
          </motion.h2>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 lg:mb-4" style={{ color: '#0f172a' }}>
              Everything you need
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-2">
              Powerful tools to streamline your college application process
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: BarChart3,
                title: "Track everything",
                description: "GPA, test scores, extracurriculars, essays, and deadlines, all organized in one dashboard."
              },
              {
                icon: Calendar,
                title: "Stay organized",
                description: "Never miss a deadline with smart reminders and comprehensive calendar management."
              },
              {
                icon: Sparkles,
                title: "Get insights",
                description: "Customized analysis to strengthen your profile and improve your applications."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl mb-3 sm:mb-4 lg:mb-6 flex items-center justify-center" style={{ backgroundColor: '#fef3f2' }}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#f89880' }} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3" style={{ color: '#0f172a' }}>
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 text-center" 
            style={{ backgroundColor: '#fef3f2' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-7 lg:mb-8" 
              style={{ color: '#0f172a' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Trusted by students everywhere
            </motion.h2>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
              {[
                { stat: "10K+", label: "Active students" },
                { stat: "50K+", label: "Applications tracked" },
                { stat: "95%", label: "Satisfaction rate" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2" style={{ color: '#f89880' }}>{item.stat}</div>
                  <div className="text-slate-600 text-xs sm:text-sm md:text-base lg:text-lg">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-12 text-center" 
            style={{ color: '#0f172a' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why MyCollegeMap?
          </motion.h2>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {[
              "Comprehensive tracking for GPA, test scores, activities, and essays",
              "Smart deadline management with automated reminders",
              "Customized insights to strengthen your applications",
              "Summer programs and internship tracking",
              "Beautiful, intuitive interface that's easy to use",
              "Secure cloud storage, access anywhere, anytime"
            ].map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-start gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-4 lg:p-6 rounded-lg lg:rounded-xl hover:bg-slate-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0 mt-0.5 sm:mt-1" style={{ color: '#f89880' }} />
                <p className="text-sm sm:text-base lg:text-lg text-slate-700">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-4 lg:px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 lg:mb-6" style={{ color: '#0f172a' }}>
            Start your journey today
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-2">
            Join thousands of students using MyCollegeMap to organize their college applications and achieve their dreams.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg font-medium rounded-full text-white transition-all hover:shadow-xl"
              style={{ backgroundColor: '#f89880' }}
            >
              Get started for free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 sm:py-10 lg:py-12 px-3 sm:px-4 lg:px-6">
        <motion.div 
          className="max-w-6xl mx-auto text-center text-slate-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-1 sm:mb-2 text-sm sm:text-base">Questions or support?</p>
          <a 
            href="mailto:mycollegemap@gmail.com" 
            className="hover:underline text-sm sm:text-base"
            style={{ color: '#f89880' }}
          >
            mycollegemap@gmail.com
          </a>
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-300">
            © 2025 MyCollegeMap. All rights reserved.
          </p>
        </motion.div>
      </footer>
    </div>
  )
}
