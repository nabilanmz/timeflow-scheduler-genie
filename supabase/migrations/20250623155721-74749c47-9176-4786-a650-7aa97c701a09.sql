
-- Create enum types for better data integrity
CREATE TYPE user_role AS ENUM ('student', 'lecturer', 'admin');
CREATE TYPE activity_type AS ENUM ('lecture', 'tutorial', 'lab', 'seminar');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    building VARCHAR(100),
    floor INTEGER,
    capacity INTEGER NOT NULL DEFAULT 50,
    type VARCHAR(50) DEFAULT 'classroom',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    section_number VARCHAR(10) NOT NULL,
    lecturer_id UUID REFERENCES profiles(id),
    max_students INTEGER NOT NULL DEFAULT 50,
    enrolled_students INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subject_id, section_number)
);

-- Create classes table (individual class sessions)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue_id UUID REFERENCES venues(id),
    tied_to UUID REFERENCES classes(id), -- For tutorials tied to lectures
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timetable preferences table
CREATE TABLE timetable_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_subjects UUID[] NOT NULL DEFAULT '{}',
    preferred_days day_of_week[] NOT NULL DEFAULT '{}',
    start_time TIME NOT NULL DEFAULT '09:00',
    end_time TIME NOT NULL DEFAULT '17:00',
    preferred_lecturers UUID[] NOT NULL DEFAULT '{}',
    max_days_per_week INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated timetables table
CREATE TABLE generated_timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    timetable_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT FALSE
);

-- Create timetable change requests table
CREATE TABLE timetable_change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    generated_timetable_id UUID NOT NULL REFERENCES generated_timetables(id),
    message TEXT,
    status request_status NOT NULL DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student enrollments table
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, section_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Subjects policies (read-only for students/lecturers, full access for admins)
CREATE POLICY "Everyone can view subjects" ON subjects
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage subjects" ON subjects
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Venues policies
CREATE POLICY "Everyone can view venues" ON venues
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage venues" ON venues
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Sections policies
CREATE POLICY "Everyone can view sections" ON sections
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage sections" ON sections
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Classes policies
CREATE POLICY "Everyone can view classes" ON classes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage classes" ON classes
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Timetable preferences policies
CREATE POLICY "Users can manage their own preferences" ON timetable_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Generated timetables policies
CREATE POLICY "Users can manage their own timetables" ON generated_timetables
    FOR ALL USING (auth.uid() = user_id);

-- Timetable change requests policies
CREATE POLICY "Users can view their own requests" ON timetable_change_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" ON timetable_change_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" ON timetable_change_requests
    FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all requests" ON timetable_change_requests
    FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Student enrollments policies
CREATE POLICY "Students can view their own enrollments" ON student_enrollments
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can manage their own enrollments" ON student_enrollments
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all enrollments" ON student_enrollments
    FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role user_role;
BEGIN
    -- Determine user role based on email domain
    IF NEW.email LIKE '%@student.mmu.edu.my' THEN
        user_role := 'student';
    ELSIF NEW.email LIKE '%@mmu.edu.my' THEN
        user_role := 'lecturer';
    ELSE
        user_role := 'student'; -- Default fallback
    END IF;

    -- Insert into profiles table
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        user_role
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update section enrollment count
CREATE OR REPLACE FUNCTION update_section_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE sections 
        SET enrolled_students = enrolled_students + 1 
        WHERE id = NEW.section_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE sections 
        SET enrolled_students = enrolled_students - 1 
        WHERE id = OLD.section_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for enrollment count
CREATE TRIGGER enrollment_count_trigger
    AFTER INSERT OR DELETE ON student_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_section_enrollment_count();
