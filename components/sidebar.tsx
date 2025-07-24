"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, GraduationCap, Target, Trophy, Award, BookOpen, FileText, BarChart3, MapPin } from "lucide-react"

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
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold">MyCollegeMap</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Your path to college success</p>
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
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>© 2024 MyCollegeMap</p>
          <p>cmap.com</p>
        </div>
      </div>
    </div>
  )
}
