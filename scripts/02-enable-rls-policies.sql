-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE honors_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (true);

-- Create policies for user-specific tables
CREATE POLICY "Users can view own colleges" ON user_colleges
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own GPA records" ON gpa_records
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own courses" ON courses
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own test scores" ON test_scores
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own extracurriculars" ON extracurriculars
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own honors and awards" ON honors_awards
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own essays" ON essays
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Allow public read access to colleges table
CREATE POLICY "Anyone can view colleges" ON colleges
    FOR SELECT USING (true);

-- Create policies for gpa table
CREATE POLICY "Users can view own GPA" ON gpa
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own GPA" ON gpa
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own GPA" ON gpa
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own GPA" ON gpa
    FOR DELETE USING (true);

-- Create policies for activities table
CREATE POLICY "Users can view own activities" ON activities
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own activities" ON activities
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own activities" ON activities
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own activities" ON activities
    FOR DELETE USING (true);

-- Create policies for honors_awards table
CREATE POLICY "Users can view own honors and awards" ON honors_awards
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own honors and awards" ON honors_awards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own honors and awards" ON honors_awards
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own honors and awards" ON honors_awards
    FOR DELETE USING (true);

-- Create policies for essays table
CREATE POLICY "Users can view own essays" ON essays
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own essays" ON essays
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own essays" ON essays
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own essays" ON essays
    FOR DELETE USING (true);

-- Create policies for college_applications table
CREATE POLICY "Users can view own applications" ON college_applications
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own applications" ON college_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own applications" ON college_applications
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own applications" ON college_applications
    FOR DELETE USING (true);
