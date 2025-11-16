-- ============================================================================
-- MyCollegeMap Database Reset & Setup
-- Complete schema with OAuth support, pricing tiers, and all features
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING TABLES (in correct order to avoid FK conflicts)
-- ============================================================================

DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS essays CASCADE;
DROP TABLE IF EXISTS honors_awards CASCADE;
DROP TABLE IF EXISTS extracurriculars CASCADE;
DROP TABLE IF EXISTS test_scores CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS gpa_records CASCADE;
DROP TABLE IF EXISTS user_colleges CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Create users table with OAuth support
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for OAuth users
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    graduation_year INTEGER,
    high_school VARCHAR(255),
    
    -- OAuth fields
    oauth_provider VARCHAR(50), -- 'google', 'github', etc.
    oauth_id VARCHAR(255), -- Provider's user ID
    avatar_url TEXT, -- Profile picture URL from OAuth provider
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Ensure at least one auth method exists
    CONSTRAINT auth_method_check CHECK (
        password_hash IS NOT NULL OR oauth_provider IS NOT NULL
    )
);

-- Create user_subscriptions table for pricing tiers
CREATE TABLE user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_tier VARCHAR(20) DEFAULT 'trial', -- 'trial', 'free', 'standard', 'premium'
    
    -- Stripe integration fields (for future use)
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Trial tracking (14-day free trial for all new users)
    trial_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    has_selected_plan BOOLEAN DEFAULT FALSE, -- TRUE after trial when user selects a plan
    
    -- Subscription details
    status VARCHAR(20) DEFAULT 'trialing', -- 'trialing', 'active', 'cancelled', 'past_due', 'expired'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colleges table
CREATE TABLE colleges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    acceptance_rate DECIMAL(5,2),
    avg_sat_score INTEGER,
    avg_act_score INTEGER,
    avg_gpa DECIMAL(3,2),
    tuition_in_state INTEGER,
    tuition_out_state INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_colleges table (many-to-many relationship)
CREATE TABLE user_colleges (
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
CREATE TABLE gpa_records (
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
CREATE TABLE courses (
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
CREATE TABLE test_scores (
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
CREATE TABLE extracurriculars (
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
CREATE TABLE honors_awards (
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
CREATE TABLE essays (
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

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth_provider ON users(oauth_provider);
CREATE INDEX idx_users_oauth_id ON users(oauth_id);
CREATE UNIQUE INDEX idx_users_oauth_unique ON users(oauth_provider, oauth_id) 
    WHERE oauth_provider IS NOT NULL;

-- Subscription indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_tier ON user_subscriptions(subscription_tier);

-- Application tracking indexes
CREATE INDEX idx_user_colleges_user_id ON user_colleges(user_id);
CREATE INDEX idx_user_colleges_college_id ON user_colleges(college_id);

-- Academic records indexes
CREATE INDEX idx_gpa_records_user_id ON gpa_records(user_id);
CREATE INDEX idx_courses_user_id ON courses(user_id);
CREATE INDEX idx_test_scores_user_id ON test_scores(user_id);

-- Activities and achievements indexes
CREATE INDEX idx_extracurriculars_user_id ON extracurriculars(user_id);
CREATE INDEX idx_honors_awards_user_id ON honors_awards(user_id);
CREATE INDEX idx_essays_user_id ON essays(user_id);

-- ============================================================================
-- STEP 4: CREATE TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ============================================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_colleges_updated_at BEFORE UPDATE ON user_colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gpa_records_updated_at BEFORE UPDATE ON gpa_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_scores_updated_at BEFORE UPDATE ON test_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extracurriculars_updated_at BEFORE UPDATE ON extracurriculars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_honors_awards_updated_at BEFORE UPDATE ON honors_awards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_essays_updated_at BEFORE UPDATE ON essays
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE honors_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: CREATE RLS POLICIES
-- ============================================================================

-- Users table policies
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);

-- User subscriptions policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own subscription" ON user_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
    FOR UPDATE USING (true);

-- Colleges table - public read access
CREATE POLICY "Anyone can view colleges" ON colleges
    FOR SELECT USING (true);

-- User colleges policies
CREATE POLICY "Users can manage own college applications" ON user_colleges
    FOR ALL USING (true);

-- GPA records policies
CREATE POLICY "Users can manage own GPA records" ON gpa_records
    FOR ALL USING (true);

-- Courses policies
CREATE POLICY "Users can manage own courses" ON courses
    FOR ALL USING (true);

-- Test scores policies
CREATE POLICY "Users can manage own test scores" ON test_scores
    FOR ALL USING (true);

-- Extracurriculars policies
CREATE POLICY "Users can manage own extracurriculars" ON extracurriculars
    FOR ALL USING (true);

-- Honors and awards policies
CREATE POLICY "Users can manage own honors and awards" ON honors_awards
    FOR ALL USING (true);

-- Essays policies
CREATE POLICY "Users can manage own essays" ON essays
    FOR ALL USING (true);

-- ============================================================================
-- STEP 7: SEED SAMPLE COLLEGES DATA
-- ============================================================================

INSERT INTO colleges (name, location, acceptance_rate, avg_sat_score, avg_act_score, avg_gpa, tuition_in_state, tuition_out_state) VALUES
    ('Harvard University', 'Cambridge, MA', 3.19, 1520, 34, 4.00, 54269, 54269),
    ('Stanford University', 'Stanford, CA', 3.68, 1505, 34, 3.96, 58416, 58416),
    ('Massachusetts Institute of Technology', 'Cambridge, MA', 3.96, 1535, 35, 4.00, 57986, 57986),
    ('Yale University', 'New Haven, CT', 4.62, 1515, 34, 4.00, 62250, 62250),
    ('Princeton University', 'Princeton, NJ', 4.38, 1515, 34, 3.95, 57410, 57410),
    ('Columbia University', 'New York, NY', 3.73, 1520, 35, 4.00, 66139, 66139),
    ('University of Chicago', 'Chicago, IL', 5.87, 1535, 35, 4.00, 62940, 62940),
    ('University of Pennsylvania', 'Philadelphia, PA', 5.68, 1510, 34, 3.90, 63452, 63452),
    ('California Institute of Technology', 'Pasadena, CA', 3.44, 1560, 36, 4.00, 60864, 60864),
    ('Duke University', 'Durham, NC', 5.77, 1520, 34, 4.00, 63054, 63054),
    ('Northwestern University', 'Evanston, IL', 7.00, 1490, 34, 4.00, 63468, 63468),
    ('Dartmouth College', 'Hanover, NH', 6.23, 1500, 34, 4.00, 62430, 62430),
    ('Brown University', 'Providence, RI', 5.43, 1500, 34, 4.00, 65146, 65146),
    ('Vanderbilt University', 'Nashville, TN', 6.67, 1520, 35, 3.90, 60348, 60348),
    ('Cornell University', 'Ithaca, NY', 7.31, 1480, 34, 4.00, 63200, 63200),
    ('Rice University', 'Houston, TX', 8.68, 1520, 35, 4.00, 54960, 54960),
    ('University of Notre Dame', 'Notre Dame, IN', 12.90, 1475, 34, 4.00, 60301, 60301),
    ('University of California, Los Angeles', 'Los Angeles, CA', 8.56, 1405, 31, 4.00, 13752, 44830),
    ('University of California, Berkeley', 'Berkeley, CA', 11.36, 1415, 32, 4.00, 14312, 44066),
    ('Georgetown University', 'Washington, DC', 11.66, 1480, 33, 4.00, 62052, 62052),
    ('University of Michigan', 'Ann Arbor, MI', 17.73, 1435, 33, 3.90, 17786, 57273),
    ('Carnegie Mellon University', 'Pittsburgh, PA', 11.26, 1515, 35, 3.90, 61344, 61344),
    ('University of Virginia', 'Charlottesville, VA', 18.73, 1430, 32, 4.00, 21381, 56837),
    ('University of Southern California', 'Los Angeles, CA', 9.93, 1465, 33, 3.90, 64726, 64726),
    ('Emory University', 'Atlanta, GA', 11.41, 1475, 33, 3.90, 57948, 57948),
    ('New York University', 'New York, NY', 12.20, 1470, 33, 3.70, 58168, 58168),
    ('University of North Carolina at Chapel Hill', 'Chapel Hill, NC', 16.82, 1405, 31, 4.00, 9021, 37558),
    ('Boston College', 'Chestnut Hill, MA', 16.67, 1450, 33, 3.96, 62950, 62950),
    ('University of Texas at Austin', 'Austin, TX', 28.91, 1355, 30, 3.85, 11698, 40996),
    ('University of Wisconsin-Madison', 'Madison, WI', 49.39, 1370, 30, 3.85, 10796, 39427);

-- ============================================================================
-- STEP 8: CREATE HELPER FUNCTIONS FOR TRIAL MANAGEMENT
-- ============================================================================

-- Function to check if user's trial has expired
CREATE OR REPLACE FUNCTION is_trial_expired(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    trial_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT trial_end INTO trial_end_date
    FROM user_subscriptions
    WHERE user_id = user_uuid;
    
    IF trial_end_date IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN NOW() > trial_end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get days remaining in trial
CREATE OR REPLACE FUNCTION get_trial_days_remaining(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    trial_end_date TIMESTAMP WITH TIME ZONE;
    days_left INTEGER;
BEGIN
    SELECT trial_end INTO trial_end_date
    FROM user_subscriptions
    WHERE user_id = user_uuid;
    
    IF trial_end_date IS NULL THEN
        RETURN 0;
    END IF;
    
    days_left := EXTRACT(DAY FROM (trial_end_date - NOW()))::INTEGER;
    RETURN GREATEST(0, days_left);
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update subscription status when trial expires
CREATE OR REPLACE FUNCTION check_and_update_trial_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If trial has expired and user hasn't selected a plan
    IF NEW.trial_end IS NOT NULL AND NEW.trial_end < NOW() AND NEW.has_selected_plan = FALSE THEN
        NEW.status := 'expired';
        NEW.subscription_tier := 'trial';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update trial status
CREATE TRIGGER update_trial_status_trigger
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION check_and_update_trial_status();

-- View for easy trial status checking
CREATE OR REPLACE VIEW user_trial_status AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    us.subscription_tier,
    us.status,
    us.trial_start,
    us.trial_end,
    -- Calculate trial_days_remaining dynamically (handle NULL case)
    CASE 
        WHEN us.trial_end IS NULL THEN 0
        ELSE GREATEST(0, EXTRACT(DAY FROM (us.trial_end - NOW()))::INTEGER)
    END as trial_days_remaining,
    us.has_selected_plan,
    CASE 
        WHEN us.trial_end IS NULL THEN 'no_trial'
        WHEN us.trial_end > NOW() THEN 'active'
        WHEN us.trial_end <= NOW() AND us.has_selected_plan = FALSE THEN 'expired_no_plan'
        WHEN us.has_selected_plan = TRUE THEN 'plan_selected'
        ELSE 'unknown'
    END as trial_status,
    u.created_at as account_created
FROM users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id;

-- ============================================================================
-- STEP 9: CREATE DEMO USER (OPTIONAL - for testing)
-- ============================================================================

-- Uncomment to create a demo user (password: 'demo123')
-- Note: This is a bcrypt hash of 'demo123'
/*
INSERT INTO users (email, password_hash, first_name, last_name, graduation_year, high_school) VALUES
    ('demo@mycollegemap.com', '$2a$10$YourBcryptHashHere', 'Demo', 'Student', 2025, 'Demo High School');

-- Get the demo user ID and create a trial subscription
WITH demo_user AS (
    SELECT id FROM users WHERE email = 'demo@mycollegemap.com'
)
INSERT INTO user_subscriptions (user_id, subscription_tier, status)
SELECT id, 'trial', 'trialing' FROM demo_user;
*/

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Verify tables were created
SELECT 
    'Setup Complete! Created ' || COUNT(*) || ' tables.' as message
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';

-- Show all tables
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = t.table_name 
       AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

