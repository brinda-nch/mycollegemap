"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { motion } from "framer-motion"

export default function StudentProfilesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0f172a" }}>
            Student Profiles
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Browse example student profiles to get inspiration for your own
          </p>
        </motion.div>

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
                <Users className="h-12 w-12" style={{ color: "#f89880" }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#0f172a" }}>
                Coming Soon
              </h3>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                This feature is currently under development. Browse example student profiles to help build your own competitive application profile.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

