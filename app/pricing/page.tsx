"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { PlanSelectorModal } from "@/components/plan-selector-modal"

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "MyCollegeMap's free version gives you the essentials: organized tracking, progress monitoring, and easy updates to your application profile.",
    features: [
      "GPA Tracking",
      "Application Tracking",
      "Extra-Curricular & Awards Tracking",
      "Test Score Tracking"
    ],
    color: "#64748b",
    highlighted: false
  },
  {
    name: "Standard",
    price: "$2.99",
    period: "per month",
    description: "Unlock your strongest application with the Standard Plan. It includes powerful features designed to give you the clarity, structure, and strategic edge that traditional counselors charge thousands for. If you're serious about standing out, this is where your journey starts.",
    features: [
      "Student Profile Generation (Spike Analysis)",
      "Essay Proofreader",
      "Activities and Awards Analyzer",
      "Student Profile Examples"
    ],
    color: "#f89880",
    highlighted: true
  },
  {
    name: "Premium",
    price: "$5.99",
    period: "per month",
    description: "The Premium Plan gives you the highest level of guidance MyCollegeMap offers. Gain exclusive access to insights from admissions officers, tools to shape a compelling application narrative, curated opportunities to strengthen your profile, and personalized major-matching support. Designed for students aiming for top-tier schools, the Premium experience delivers expert strategy, deeper personalization, and the kind of targeted advice usually found only through expensive private counselors.",
    features: [
      "Advice from Admissions Officers",
      "Application Narrative Tool",
      "Access Opportunities to Grow",
      "Find which major is best for you"
    ],
    color: "#a78bfa",
    highlighted: false
  }
]

export default function PricingPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const isTrialExpired = searchParams?.get('expired') === 'true'

  // If user is logged in, show plan selector instead
  if (session?.user?.id) {
    return <PlanSelectorModal userId={session.user.id} isTrialExpired={isTrialExpired} />
  }

  // Otherwise show marketing page for non-logged-in users
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
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-base font-medium"
              style={{ color: '#f89880' }}
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
            Simple, Transparent
            <br />
            <span style={{ color: '#f89880' }}>Pricing</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto">
            Choose the plan that fits your college journey. All plans include unlimited updates and access to your profile anytime.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative rounded-3xl bg-white/90 backdrop-blur-sm border-2 overflow-hidden ${
                  plan.highlighted ? 'shadow-2xl scale-105' : 'shadow-lg'
                }`}
                style={{ 
                  borderColor: plan.highlighted ? plan.color : '#e2e8f0'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Highlighted Badge */}
                {plan.highlighted && (
                  <div 
                    className="absolute top-0 left-0 right-0 py-2 text-center text-white text-sm font-semibold"
                    style={{ backgroundColor: plan.color }}
                  >
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.highlighted ? 'pt-16' : 'pt-8'}`}>
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold" style={{ color: plan.color }}>
                      {plan.price}
                    </span>
                    <span className="text-slate-600 text-lg ml-2">
                      {plan.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 mb-8 leading-relaxed min-h-[120px]">
                    {plan.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href="/auth/signup"
                    className={`block w-full py-3 px-6 rounded-full text-center font-semibold transition-all mb-8 ${
                      plan.highlighted 
                        ? 'text-white hover:shadow-xl hover:scale-105' 
                        : 'border-2 hover:shadow-lg'
                    }`}
                    style={{
                      backgroundColor: plan.highlighted ? plan.color : 'transparent',
                      borderColor: plan.highlighted ? plan.color : plan.color,
                      color: plan.highlighted ? 'white' : plan.color
                    }}
                  >
                    Get Started
                  </Link>

                  {/* Features List */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-900 mb-4">What's included:</p>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0 mt-0.5" 
                          style={{ color: plan.color }} 
                        />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ or Additional Info */}
      <section className="py-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0f172a' }}>
            All plans include
          </h2>
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
              MyCollegeMap Premium vs
              <br />
              <span style={{ color: '#f89880' }}>Traditional College Counseling</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get the same strategic guidance and application support at a fraction of the cost
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

            {/* MyCollegeMap Premium */}
            <motion.div
              className="rounded-3xl border-4 overflow-hidden shadow-2xl relative"
              style={{ borderColor: '#a78bfa' }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Best Value Badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-sm font-bold z-10">
                98% Savings
              </div>

              <div className="text-white py-6 px-8 text-center" style={{ backgroundColor: '#a78bfa' }}>
                <h3 className="text-2xl font-bold mb-2">MyCollegeMap Premium</h3>
                <div className="text-5xl font-bold mb-2">$5.99</div>
                <p className="text-purple-100 mb-2">per month</p>
                <p className="text-sm text-purple-200">Only $71.88/year</p>
              </div>
              
              <div className="p-8 bg-white">
                <p className="font-semibold mb-6" style={{ color: '#0f172a' }}>Everything you need:</p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Strategic planning tools</strong> for course selection & activities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Application tracking system</strong> with deadline management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>College list builder</strong> with data-driven recommendations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Profile generation & spike analysis</strong> to identify your unique strengths</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Activities optimizer</strong> with 150-char description help</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Essay proofreader</strong> with grammar & structure feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Application narrative tool</strong> to craft your story</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Advice from admissions officers</strong> (insider tips)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Major discovery tools</strong> aligned with your goals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Summer program database</strong> & internship finder</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Student profile examples</strong> from successful applicants</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>24/7 access</strong> from any device</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <span><strong>Unlimited updates</strong> throughout your journey</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: '#f3f0ff' }}>
                  <p className="text-center font-bold text-lg mb-2" style={{ color: '#a78bfa' }}>
                    Save $3,928+ per year
                  </p>
                  <p className="text-center text-sm text-slate-700">
                    Get comprehensive application support at less than the cost of a coffee per month
                  </p>
                </div>

                <Link
                  href="/auth/signup"
                  className="block w-full mt-6 py-4 px-6 rounded-full text-center font-bold text-white transition-all hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: '#a78bfa' }}
                >
                  Start Premium Free Trial
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
                Why pay thousands when you can get it all for $5.99/month?
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                MyCollegeMap gives you the same strategic planning, essay support, profile optimization, and admissions guidance that expensive counselors provide, but with the convenience of 24/7 access and a fraction of the cost. We've made elite college counseling accessible to everyone.
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
          <p className="mt-8 text-sm text-slate-500">
            © 2024 MyCollegeMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

