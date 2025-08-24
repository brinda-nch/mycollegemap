import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL format")
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types
export interface User {
  id: string
  email: string
  password_hash: string
  first_name?: string
  last_name?: string
  graduation_year?: number
  high_school?: string
  created_at: string
  updated_at: string
}

export interface GPA {
  id: string
  user_id: string
  semester: string
  year: number
  gpa: number
  weighted_gpa?: number
  credits?: number
  class_rank?: number
  class_size?: number
  created_at: string
  updated_at: string
}

export interface TestScore {
  id: string
  user_id: string
  test_type: string
  subject?: string
  score: number
  max_score?: number
  test_date?: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_id: string
  activity_name: string
  category?: string
  description?: string
  leadership_position?: string
  hours_per_week?: number
  weeks_per_year?: number
  years_participated?: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface HonorAward {
  id: string
  user_id: string
  title: string
  description?: string
  level?: string
  date_received?: string
  created_at: string
  updated_at: string
}

export interface Essay {
  id: string
  user_id: string
  title: string
  prompt?: string
  content?: string
  word_count?: number
  status: string
  created_at: string
  updated_at: string
}

export interface CollegeApplication {
  id: string
  user_id: string
  college_name: string
  application_type?: string
  deadline?: string
  status: string
  application_fee?: number
  notes?: string
  created_at: string
  updated_at: string
}
