"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
export default function PricingPage() {
  const { data: session } = useSession()

  // Redirect logged-in users to dashboard since platform is now free
  if (session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#0f172a' }}>
              🎉 MyCollegeMap is <span style={{ color: '#f89880' }}>Free!</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              You already have full access to all features. No subscription needed!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: '#f89880' }}
            >
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show marketing page for non-logged-in users
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
              className="hidden sm:inline-block text-sm lg:text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="hidden sm:inline-block text-sm lg:text-base font-medium"
              style={{ color: '#f89880' }}
            >
              About
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
              Get Started
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
            100% Free
            <br />
            <span style={{ color: '#f89880' }}>Forever</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto">
            MyCollegeMap is completely free. No subscriptions, no hidden fees, no credit card required.
          </p>
        </motion.div>
      </section>

      {/* Free Platform Card */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="relative rounded-3xl bg-white/90 backdrop-blur-sm border-4 overflow-hidden shadow-2xl"
              style={{ borderColor: '#f89880' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Badge */}
              <div 
                className="py-3 text-center text-white text-lg font-bold"
                style={{ backgroundColor: '#f89880' }}
              >
                🎉 Completely Free
              </div>

              <div className="p-10">
                {/* "Price" */}
                <div className="text-center mb-8">
                  <div className="text-7xl font-bold mb-4" style={{ color: '#f89880' }}>
                    $0
                  </div>
                  <p className="text-2xl text-slate-600">
                    No subscriptions. No hidden fees. Forever free.
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href="/auth/signup"
                  className="block w-full py-4 px-6 rounded-full text-center font-bold text-xl text-white transition-all hover:shadow-xl hover:scale-105 mb-8"
                  style={{ backgroundColor: '#f89880' }}
                >
                  Get Started Free
                </Link>

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-lg font-bold text-slate-900 mb-6 text-center">Everything Included:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "GPA Tracking & Analytics",
                      "Application Tracking & Deadlines",
                      "Extra-Curricular & Awards Management",
                      "Test Score Tracking",
                      "AI Essay Proofreader",
                      "Activities & Awards Analyzer",
                      "Student Profile Generation",
                      "Advice from Admissions Officers",
                      "Application Narrative Tool",
                      "Access Opportunities to Grow",
                      "Major Recommendation Tool",
                      "College List Builder",
                      "Unlimited Updates & Cloud Storage",
                      "Email Support"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0 mt-0.5" 
                          style={{ color: '#f89880' }} 
                        />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="py-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0f172a' }}>
            Why is MyCollegeMap Free?
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
            We believe every student deserves access to excellent college application tools, regardless of their financial situation.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { title: "Unlimited Updates", description: "Update your profile anytime" },
              { title: "Cloud Storage", description: "Access from anywhere, anytime" },
              { title: "Email Support", description: "We're here to help you succeed" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#0f172a' }}>
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0f172a' }}>
              MyCollegeMap vs
              <br />
              <span style={{ color: '#f89880' }}>Traditional College Counseling</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get the same strategic guidance and application support — completely free
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Traditional Counseling */}
            <motion.div
              className="rounded-3xl bg-slate-100 border-2 border-slate-300 overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-slate-700 text-white py-6 px-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Traditional Counseling</h3>
                <div className="text-4xl font-bold mb-2">$4,000 - $15,000+</div>
                <p className="text-slate-300">per year</p>
              </div>
              
              <div className="p-8">
                <p className="text-slate-700 font-semibold mb-6">What you get:</p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Strategic planning & roadmapping</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Course selection guidance (AP/IB optimization)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Extracurricular strategy</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>College list development (reach/match/safety)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Application project management & deadlines</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Profile & resume development with spike identification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Activities list optimization (150-char descriptions)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Essay brainstorming & multiple draft reviews</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Personal statement & supplemental essay guidance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Application narrative development</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Mock interviews & coaching</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Recommendation letter strategy</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Testing strategy (SAT/ACT planning)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Financial aid & scholarship guidance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Application polishing & submission review</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Weekly accountability meetings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Summer program recommendations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Building a "spike" or specialty area</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-300">
                  <p className="text-xs text-slate-600 italic">
                    * High-tier counselors may charge $10,000-$15,000+ for comprehensive packages
                  </p>
                </div>
              </div>
            </motion.div>

            {/* MyCollegeMap */}
            <motion.div
              className="rounded-3xl border-4 overflow-hidden shadow-2xl relative"
              style={{ borderColor: '#f89880' }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Best Value Badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-sm font-bold z-10">
                100% Free
              </div>

              <div className="text-white py-6 px-8 text-center" style={{ backgroundColor: '#f89880' }}>
                <h3 className="text-2xl font-bold mb-2">MyCollegeMap</h3>
                <div className="text-6xl font-bold mb-2">$0</div>
                <p className="text-orange-100 mb-2">Forever</p>
                <p className="text-sm text-orange-200">No subscriptions ever</p>
              </div>
              
              <div className="p-8 bg-white">
                <p className="font-semibold mb-6" style={{ color: '#0f172a' }}>Everything you need:</p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Strategic planning tools</strong> for course selection & activities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Application tracking system</strong> with deadline management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>College list builder</strong> with data-driven recommendations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Profile generation & spike analysis</strong> to identify your unique strengths</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Activities optimizer</strong> with 150-char description help</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Essay proofreader</strong> with grammar & structure feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Application narrative tool</strong> to craft your story</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Advice from admissions officers</strong> (insider tips)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Major discovery tools</strong> aligned with your goals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Summer program database</strong> & internship finder</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Student profile examples</strong> from successful applicants</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>24/7 access</strong> from any device</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f89880' }} />
                    <span><strong>Unlimited updates</strong> throughout your journey</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: '#fff5f2' }}>
                  <p className="text-center font-bold text-lg mb-2" style={{ color: '#f89880' }}>
                    Save $4,000+ per year
                  </p>
                  <p className="text-center text-sm text-slate-700">
                    Get comprehensive application support completely free
                  </p>
                </div>

                <Link
                  href="/auth/signup"
                  className="block w-full mt-6 py-4 px-6 rounded-full text-center font-bold text-white transition-all hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: '#f89880' }}
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom Summary */}
          <motion.div
            className="mt-16 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2" style={{ borderColor: '#f89880' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#0f172a' }}>
                Why pay thousands when you can get it all for free?
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                MyCollegeMap gives you the same strategic planning, essay support, profile optimization, and admissions guidance that expensive counselors provide, but with the convenience of 24/7 access and zero cost. We've made elite college counseling accessible to everyone.
              </p>
            </div>
          </motion.div>
        </div>
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

