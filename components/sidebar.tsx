"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, GraduationCap, Target, Trophy, Award, BookOpen, FileText, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "GPA Tracking", href: "/gpa", icon: GraduationCap },
  { name: "Test Scores", href: "/test-scores", icon: Target },
  { name: "Extracurriculars", href: "/extracurriculars", icon: Trophy },
  { name: "Honors & Awards", href: "/honors-awards", icon: Award },
  { name: "College Estimations", href: "/college-estimations", icon: BookOpen },
  { name: "Essay Grading", href: "/essays", icon: FileText },
  { name: "Grade Impact", href: "/grade-impact", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">College Tracker</h2>
      </div>
      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-secondary")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
