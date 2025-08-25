-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    graduation_year INTEGER,
    high_school VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    acceptance_rate DECIMAL(5,2),
    avg_sat_score INTEGER,
    avg_act_score INTEGER,
    avg_gpa DECIMAL(3,2),
    tuition_in_state INTEGER,
    tuition_out_state INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_colleges table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_colleges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    application_status VARCHAR(50) DEFAULT 'planning', -- planning, applied, accepted, rejected, waitlisted
    application_type VARCHAR(50), -- early_decision, early_action, regular_decision
    deadline DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, college_id)
);

-- Create gpa_records table
CREATE TABLE IF NOT EXISTS gpa_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    gpa_unweighted DECIMAL(3,2),
    gpa_weighted DECIMAL(3,2),
    class_rank INTEGER,
    class_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    course_level VARCHAR(50), -- regular, honors, ap, ib, dual_enrollment
    grade VARCHAR(5), -- A+, A, A-, B+, etc.
    credits DECIMAL(3,1) DEFAULT 1.0,
    semester VARCHAR(50),
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_scores table
CREATE TABLE IF NOT EXISTS test_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL, -- SAT, ACT, SAT_SUBJECT, AP
    test_date DATE,
    composite_score INTEGER,
    math_score INTEGER,
    reading_score INTEGER,
    writing_score INTEGER,
    science_score INTEGER, -- for ACT
    subject VARCHAR(100), -- for SAT Subject tests and AP tests
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create extracurriculars table
CREATE TABLE IF NOT EXISTS extracurriculars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100), -- sports, clubs, volunteer, work, etc.
    position VARCHAR(100),
    description TEXT,
    hours_per_week INTEGER,
    weeks_per_year INTEGER,
    start_date DATE,
    end_date DATE,
    is_leadership BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create honors_awards table
CREATE TABLE IF NOT EXISTS honors_awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50), -- school, local, state, national, international
    date_received DATE,
    organization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essays table
CREATE TABLE IF NOT EXISTS essays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    prompt TEXT,
    content TEXT,
    word_count INTEGER,
    essay_type VARCHAR(100), -- personal_statement, supplemental, scholarship
    status VARCHAR(50) DEFAULT 'draft', -- draft, in_review, completed
    colleges TEXT[], -- array of college names this essay is for
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_colleges_user_id ON user_colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_gpa_records_user_id ON gpa_records(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_test_scores_user_id ON test_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_extracurriculars_user_id ON extracurriculars(user_id);
CREATE INDEX IF NOT EXISTS idx_honors_awards_user_id ON honors_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
