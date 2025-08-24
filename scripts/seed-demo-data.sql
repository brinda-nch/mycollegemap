-- Insert demo user profile
INSERT INTO user_profiles (user_id, email, full_name, graduation_year, school_name, intended_major) 
VALUES (
  gen_random_uuid(),
  'demo@example.com',
  'Demo Student',
  2025,
  'Demo High School',
  'Computer Science'
) ON CONFLICT (email) DO NOTHING;

-- Get the demo user ID for foreign key references
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT user_id INTO demo_user_id FROM user_profiles WHERE email = 'demo@example.com';
    
    -- Insert demo GPA records
    INSERT INTO gpa_records (user_id, semester, year, gpa, weighted_gpa, credits) VALUES
    (demo_user_id, 'Fall', 2023, 3.85, 4.2, 6),
    (demo_user_id, 'Spring', 2024, 3.92, 4.3, 6),
    (demo_user_id, 'Fall', 2024, 3.88, 4.25, 6)
    ON CONFLICT DO NOTHING;
    
    -- Insert demo test scores
    INSERT INTO test_scores (user_id, test_type, subject, score, max_score, test_date) VALUES
    (demo_user_id, 'SAT', 'Total', 1450, 1600, '2024-03-15'),
    (demo_user_id, 'SAT', 'Math', 750, 800, '2024-03-15'),
    (demo_user_id, 'SAT', 'Reading/Writing', 700, 800, '2024-03-15'),
    (demo_user_id, 'AP', 'Calculus BC', 5, 5, '2024-05-10'),
    (demo_user_id, 'AP', 'Computer Science A', 5, 5, '2024-05-12')
    ON CONFLICT DO NOTHING;
    
    -- Insert demo activities
    INSERT INTO activities (user_id, activity_name, activity_type, description, position, hours_per_week, weeks_per_year, years_participated) VALUES
    (demo_user_id, 'Robotics Team', 'academic', 'FIRST Robotics Competition team member', 'Programming Lead', 15, 30, 3),
    (demo_user_id, 'Math Tutoring', 'volunteer', 'Tutoring underclassmen in mathematics', 'Volunteer Tutor', 3, 36, 2),
    (demo_user_id, 'Tennis Team', 'sport', 'Varsity tennis team member', 'Team Captain', 12, 20, 4),
    (demo_user_id, 'National Honor Society', 'academic', 'Member of school honor society', 'Member', 2, 36, 2)
    ON CONFLICT DO NOTHING;
    
    -- Insert demo honors and awards
    INSERT INTO honors_awards (user_id, title, description, level, date_received) VALUES
    (demo_user_id, 'National Merit Semifinalist', 'Recognized for outstanding PSAT performance', 'national', '2024-09-15'),
    (demo_user_id, 'Regional Science Fair Winner', 'First place in computer science category', 'regional', '2024-04-20'),
    (demo_user_id, 'Principal''s Honor Roll', 'Maintained 4.0+ GPA for consecutive semesters', 'school', '2024-06-15'),
    (demo_user_id, 'AP Scholar with Distinction', 'Scored 3+ on 5+ AP exams with average of 3.5+', 'national', '2024-07-01')
    ON CONFLICT DO NOTHING;
    
    -- Insert demo essays
    INSERT INTO essays (user_id, title, prompt, content, word_count, status) VALUES
    (demo_user_id, 'Common App Personal Statement', 'Describe a challenge you overcame', 'My journey with robotics began in freshman year when I joined our school''s FIRST Robotics team...', 650, 'completed'),
    (demo_user_id, 'MIT Supplemental Essay', 'Describe the world you come from', 'Growing up in a family of engineers, I was surrounded by problem-solving and innovation...', 250, 'in_progress'),
    (demo_user_id, 'Stanford Supplemental', 'What matters to you and why?', 'Education equity matters deeply to me because I believe every student deserves...', 300, 'draft')
    ON CONFLICT DO NOTHING;
    
    -- Insert demo college applications
    INSERT INTO college_applications (user_id, college_name, application_type, deadline, status, application_fee, notes) VALUES
    (demo_user_id, 'Massachusetts Institute of Technology', 'early_action', '2024-11-01', 'submitted', 85.00, 'Strong engineering program, submitted all materials'),
    (demo_user_id, 'Stanford University', 'regular_decision', '2025-01-05', 'in_progress', 90.00, 'Working on supplemental essays'),
    (demo_user_id, 'University of California, Berkeley', 'regular_decision', '2024-11-30', 'submitted', 80.00, 'In-state tuition, good backup option'),
    (demo_user_id, 'Carnegie Mellon University', 'regular_decision', '2025-01-03', 'not_started', 75.00, 'Excellent computer science program')
    ON CONFLICT DO NOTHING;
    
END $$;
