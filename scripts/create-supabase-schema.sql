-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own GPA records" ON gpa_records;
DROP POLICY IF EXISTS "Users can insert own GPA records" ON gpa_records;
DROP POLICY IF EXISTS "Users can update own GPA records" ON gpa_records;
DROP POLICY IF EXISTS "Users can delete own GPA records" ON gpa_records;

DROP POLICY IF EXISTS "Users can view own test scores" ON test_scores;
DROP POLICY IF EXISTS "Users can insert own test scores" ON test_scores;
DROP POLICY IF EXISTS "Users can update own test scores" ON test_scores;
DROP POLICY IF EXISTS "Users can delete own test scores" ON test_scores;

DROP POLICY IF EXISTS "Users can view own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
DROP POLICY IF EXISTS "Users can update own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete own activities" ON activities;

DROP POLICY IF EXISTS "Users can view own honors/awards" ON honors_awards;
DROP POLICY IF EXISTS "Users can insert own honors/awards" ON honors_awards;
DROP POLICY IF EXISTS "Users can update own honors/awards" ON honors_awards;
DROP POLICY IF EXISTS "Users can delete own honors/awards" ON honors_awards;

DROP POLICY IF EXISTS "Users can view own essays" ON essays;
DROP POLICY IF EXISTS "Users can insert own essays" ON essays;
DROP POLICY IF EXISTS "Users can update own essays" ON essays;
DROP POLICY IF EXISTS "Users can delete own essays" ON essays;

DROP POLICY IF EXISTS "Users can view own applications" ON college_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON college_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON college_applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON college_applications;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_essays_updated_at ON essays;
DROP TRIGGER IF EXISTS update_college_applications_updated_at ON college_applications;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  graduation_year INTEGER,
  school_name TEXT,
  intended_major TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create GPA records table
CREATE TABLE IF NOT EXISTS gpa_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  year INTEGER NOT NULL,
  gpa DECIMAL(3,2) NOT NULL CHECK (gpa >= 0 AND gpa <= 4.0),
  weighted_gpa DECIMAL(3,2) CHECK (weighted_gpa >= 0 AND weighted_gpa <= 5.0),
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_scores table
CREATE TABLE IF NOT EXISTS test_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  subject TEXT,
  score INTEGER NOT NULL,
  max_score INTEGER,
  test_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  activity_type TEXT,
  description TEXT,
  position TEXT,
  hours_per_week INTEGER,
  weeks_per_year INTEGER,
  years_participated INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create honors_awards table
CREATE TABLE IF NOT EXISTS honors_awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT,
  date_received DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essays table
CREATE TABLE IF NOT EXISTS essays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'submitted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create college_applications table
CREATE TABLE IF NOT EXISTS college_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  application_type TEXT,
  deadline DATE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'accepted', 'rejected', 'waitlisted')),
  application_fee DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE honors_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON user_profiles FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gpa_records
CREATE POLICY "Users can view own GPA records" ON gpa_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own GPA records" ON gpa_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own GPA records" ON gpa_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own GPA records" ON gpa_records FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for test_scores
CREATE POLICY "Users can view own test scores" ON test_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own test scores" ON test_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own test scores" ON test_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own test scores" ON test_scores FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for activities
CREATE POLICY "Users can view own activities" ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activities" ON activities FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for honors_awards
CREATE POLICY "Users can view own honors/awards" ON honors_awards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own honors/awards" ON honors_awards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own honors/awards" ON honors_awards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own honors/awards" ON honors_awards FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for essays
CREATE POLICY "Users can view own essays" ON essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own essays" ON essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own essays" ON essays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own essays" ON essays FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for college_applications
CREATE POLICY "Users can view own applications" ON college_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON college_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON college_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON college_applications FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_gpa_records_user_id ON gpa_records(user_id);
CREATE INDEX IF NOT EXISTS idx_test_scores_user_id ON test_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_honors_awards_user_id ON honors_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_college_applications_user_id ON college_applications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_essays_updated_at BEFORE UPDATE ON essays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_college_applications_updated_at BEFORE UPDATE ON college_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
