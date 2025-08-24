-- Insert demo user (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password_hash, first_name, last_name, graduation_year, high_school) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'alex.johnson@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'Alex', 'Johnson', 2024, 'Lincoln High School');

-- Insert some colleges
INSERT INTO colleges (id, name, location, acceptance_rate, avg_sat_score, avg_act_score, avg_gpa, tuition_in_state, tuition_out_state) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Harvard University', 'Cambridge, MA', 3.4, 1520, 34, 4.18, 54269, 54269),
('660e8400-e29b-41d4-a716-446655440002', 'Stanford University', 'Stanford, CA', 3.9, 1505, 34, 4.18, 56169, 56169),
('660e8400-e29b-41d4-a716-446655440003', 'MIT', 'Cambridge, MA', 6.7, 1535, 35, 4.17, 55510, 55510),
('660e8400-e29b-41d4-a716-446655440004', 'UC Berkeley', 'Berkeley, CA', 14.5, 1415, 32, 4.0, 14226, 44007),
('660e8400-e29b-41d4-a716-446655440005', 'UCLA', 'Los Angeles, CA', 12.3, 1405, 31, 4.0, 13239, 42993);

-- Insert user college applications
INSERT INTO user_colleges (user_id, college_id, application_status, application_type, deadline, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 'applied', 'early_action', '2023-11-01', 'Submitted early action application'),
('550e8400-e29  'applied', 'early_action', '2023-11-01', 'Submitted early action application'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 'planning', 'regular_decision', '2024-01-01', 'Planning to apply regular decision'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440003', 'planning', 'regular_decision', '2024-01-01', 'Reach school - MIT'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440004', 'applied', 'regular_decision', '2023-11-30', 'UC application submitted'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440005', 'applied', 'regular_decision', '2023-11-30', 'UC application submitted');

-- Insert GPA records
INSERT INTO gpa_records (user_id, semester, year, gpa_unweighted, gpa_weighted, class_rank, class_size) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Fall', 2023, 3.8, 4.2, 15, 320),
('550e8400-e29b-41d4-a716-446655440000', 'Spring', 2023, 3.9, 4.3, 12, 320),
('550e8400-e29b-41d4-a716-446655440000', 'Fall', 2022, 3.7, 4.0, 18, 315),
('550e8400-e29b-41d4-a716-446655440000', 'Spring', 2022, 3.8, 4.1, 16, 315);

-- Insert courses
INSERT INTO courses (user_id, course_name, course_level, grade, credits, semester, year) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'AP Calculus BC', 'ap', 'A', 1.0, 'Fall', 2023),
('550e8400-e29b-41d4-a716-446655440000', 'AP Physics C', 'ap', 'A-', 1.0, 'Fall', 2023),
('550e8400-e29b-41d4-a716-446655440000', 'AP English Literature', 'ap', 'A', 1.0, 'Fall', 2023),
('550e8400-e29b-41d4-a716-446655440000', 'AP US History', 'ap', 'A+', 1.0, 'Spring', 2023),
('550e8400-e29b-41d4-a716-446655440000', 'Honors Chemistry', 'honors', 'A', 1.0, 'Spring', 2023),
('550e8400-e29b-41d4-a716-446655440000', 'Spanish IV', 'regular', 'A-', 1.0, 'Fall', 2022);

-- Insert test scores
INSERT INTO test_scores (user_id, test_type, test_date, composite_score, math_score, reading_score, writing_score, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'SAT', '2023-10-07', 1450, 750, 700, NULL, 'Second attempt - improved from 1380'),
('550e8400-e29b-41d4-a716-446655440000', 'SAT', '2023-06-03', 1380, 720, 660, NULL, 'First attempt'),
('550e8400-e29b-41d4-a716-446655440000', 'AP', '2023-05-15', 5, NULL, NULL, NULL, 'AP Calculus BC'),
('550e8400-e29b-41d4-a716-446655440000', 'AP', '2023-05-10', 4, NULL, NULL, NULL, 'AP US History'),
('550e8400-e29b-41d4-a716-446655440000', 'AP', '2023-05-08', 4, NULL, NULL, NULL, 'AP English Language');

-- Insert extracurriculars
INSERT INTO extracurriculars (user_id, activity_name, activity_type, position, description, hours_per_week, weeks_per_year, start_date, end_date, is_leadership) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Debate Team', 'clubs', 'Captain', 'Led team to state championships, organized practice sessions and tournaments', 8, 36, '2021-09-01', '2024-06-01', true),
('550e8400-e29b-41d4-a716-446655440000', 'Math Tutoring', 'volunteer', 'Tutor', 'Volunteer math tutor for underclassmen struggling with algebra and geometry', 3, 32, '2022-09-01', '2024-06-01', false),
('550e8400-e29b-41d4-a716-446655440000', 'National Honor Society', 'clubs', 'Member', 'Community service and academic excellence organization', 2, 36, '2022-09-01', '2024-06-01', false),
('550e8400-e29b-41d4-a716-446655440000', 'Part-time Job', 'work', 'Sales Associate', 'Retail sales associate at local bookstore, customer service and inventory management', 12, 50, '2022-06-01', '2024-06-01', false),
('550e8400-e29b-41d4-a716-446655440000', 'Varsity Tennis', 'sports', 'Team Member', 'Varsity tennis player, competed in regional tournaments', 10, 20, '2021-03-01', '2023-06-01', false);

-- Insert honors and awards
INSERT INTO honors_awards (user_id, title, description, level, date_received, organization) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'National Merit Semifinalist', 'Scored in top 1% of PSAT test takers nationwide', 'national', '2023-09-15', 'National Merit Scholarship Corporation'),
('550e8400-e29b-41d4-a716-446655440000', 'State Debate Championship', 'First place in state debate tournament', 'state', '2023-04-20', 'State Debate Association'),
('550e8400-e29b-41d4-a716-446655440000', 'Honor Roll', 'Maintained GPA above 3.5 for consecutive semesters', 'school', '2023-06-01', 'Lincoln High School'),
('550e8400-e29b-41d4-a716-446655440000', 'AP Scholar with Distinction', 'Scored 3 or higher on five or more AP exams with average of 3.5', 'national', '2023-07-01', 'College Board'),
('550e8400-e29b-41d4-a716-446655440000', 'Community Service Award', 'Recognized for 100+ hours of community service', 'local', '2023-05-15', 'City Volunteer Center');

-- Insert essays
INSERT INTO essays (user_id, title, prompt, content, word_count, essay_type, status, colleges) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Personal Statement', 'Describe a challenge you overcame and how it shaped you', 'The gavel struck the podium with finality, and I knew we had lost. After months of preparation for the state debate championship, our team fell short in the final round. As team captain, I felt the weight of disappointment not just for myself, but for my teammates who had trusted my leadership...', 650, 'personal_statement', 'completed', ARRAY['Harvard University', 'Stanford University', 'MIT']),
('550e8400-e29b-41d4-a716-446655440000', 'Why Harvard', 'Why do you want to attend Harvard?', 'Harvard represents the perfect intersection of academic rigor and intellectual curiosity that drives my passion for learning. The opportunity to engage with world-renowned faculty in mathematics and computer science...', 400, 'supplemental', 'completed', ARRAY['Harvard University']),
('550e8400-e29b-41d4-a716-446655440000', 'Stanford Engineering', 'Why did you choose your intended major?', 'My fascination with engineering began in middle school when I built my first robot for a science fair. The process of designing, coding, and troubleshooting taught me that engineering is not just about technical skills...', 450, 'supplemental', 'in_review', ARRAY['Stanford University']),
('550e8400-e29b-41d4-a716-446655440000', 'Community Impact', 'Describe how you have made an impact in your community', 'When I noticed several of my classmates struggling with algebra, I realized that academic success should not be limited by economic circumstances. This realization led me to start a free tutoring program...', 500, 'supplemental', 'draft', ARRAY['UC Berkeley', 'UCLA']);
