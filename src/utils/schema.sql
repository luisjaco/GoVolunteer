-- GoVolunteer Database Schema

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOM TYPES (Enums)
-- ============================================
-- Enums restrict column values to a predefined list
CREATE TYPE user_type AS ENUM ('volunteer', 'organization');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE rsvp_status AS ENUM ('registered', 'cancelled', 'attended', 'no_show');

-- ============================================
-- TABLES
-- ============================================

-- Base profile table (linked to Supabase auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_type user_type NOT NULL,
    account_status account_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extended profile for volunteers
CREATE TABLE volunteer_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    bio TEXT,
    interests TEXT[], -- Array of text values
    total_volunteer_hours INTEGER DEFAULT 0,
    profile_picture_url TEXT,
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extended profile for organizations
CREATE TABLE organization_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone_number VARCHAR(20),
    website_url TEXT,
    about_me TEXT,
    address TEXT,
    profile_picture_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event categories lookup table
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events created by organizations
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
    location_address TEXT NOT NULL,
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_zip VARCHAR(20),
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_volunteers INTEGER,
    current_volunteers INTEGER DEFAULT 0, -- Updated automatically by trigger
    is_published BOOLEAN DEFAULT TRUE,
    is_cancelled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE event_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table: links volunteers to events
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    status rsvp_status DEFAULT 'registered',
    hours_logged INTEGER,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, volunteer_id) -- Prevent duplicate registrations
);

-- Messaging between volunteers and organizations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organization_profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(volunteer_id, organization_id) -- One conversation per pair
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers can "follow" organizations
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization_profiles(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, volunteer_id)
);

-- ============================================
-- INDEXES (Speed up queries)
-- ============================================
-- Indexes make lookups faster on frequently queried columns
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_events_organization ON events(organization_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_volunteer ON event_registrations(volunteer_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- RLS controls who can see/modify which rows
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================
-- Policies define the rules for who can access what data
-- auth.uid() returns the ID of the currently logged-in user

-- Users can only see and edit their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK ((SELECT auth.uid()) = id);

-- Volunteers manage their own profile, organizations can view
CREATE POLICY "Volunteers can manage own profile"
ON volunteer_profiles FOR ALL
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Organizations can view volunteer profiles"
ON volunteer_profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (SELECT auth.uid())
        AND profiles.user_type = 'organization'
    )
);

-- Organizations manage their profile, everyone can view
CREATE POLICY "Organizations can manage own profile"
ON organization_profiles FOR ALL
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Anyone can view organization profiles"
ON organization_profiles FOR SELECT
USING (TRUE);

-- Everyone can view event categories
CREATE POLICY "Anyone can view event categories"
ON event_categories FOR SELECT
USING (TRUE);

-- Public can view published events, organizations see their own drafts
CREATE POLICY "Anyone can view published events OR organizations can view own"
ON events FOR SELECT
USING (
    (is_published = TRUE AND is_cancelled = FALSE) 
    OR (SELECT auth.uid()) = organization_id
);

CREATE POLICY "Organizations can manage own events"
ON events FOR ALL
USING ((SELECT auth.uid()) = organization_id)
WITH CHECK ((SELECT auth.uid()) = organization_id);

CREATE POLICY "View event images"
ON event_images FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_images.event_id
        AND (events.is_published = TRUE OR events.organization_id = (SELECT auth.uid()))
    )
);

CREATE POLICY "Organizations can manage event images"
ON event_images FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_images.event_id
        AND events.organization_id = (SELECT auth.uid())
    )
);

-- Volunteers see their registrations, organizations see registrations for their events
CREATE POLICY "View registrations"
ON event_registrations FOR SELECT
USING (
    (SELECT auth.uid()) = volunteer_id
    OR EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_registrations.event_id
        AND events.organization_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Volunteers can manage own registrations"
ON event_registrations FOR ALL
USING ((SELECT auth.uid()) = volunteer_id)
WITH CHECK ((SELECT auth.uid()) = volunteer_id);

CREATE POLICY "Organizations can update registrations"
ON event_registrations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_registrations.event_id
        AND events.organization_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (
    (SELECT auth.uid()) = volunteer_id 
    OR (SELECT auth.uid()) = organization_id
);

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (
    (SELECT auth.uid()) = volunteer_id 
    OR (SELECT auth.uid()) = organization_id
);

CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM conversations
        WHERE conversations.id = messages.conversation_id
        AND ((SELECT auth.uid()) = conversations.volunteer_id 
             OR (SELECT auth.uid()) = conversations.organization_id)
    )
);

CREATE POLICY "Users can manage messages"
ON messages FOR ALL
USING (
    (SELECT auth.uid()) = sender_id
    OR EXISTS (
        SELECT 1 FROM conversations
        WHERE conversations.id = messages.conversation_id
        AND ((SELECT auth.uid()) = conversations.volunteer_id 
             OR (SELECT auth.uid()) = conversations.organization_id)
    )
)
WITH CHECK (
    (SELECT auth.uid()) = sender_id
    AND EXISTS (
        SELECT 1 FROM conversations
        WHERE conversations.id = conversation_id
        AND ((SELECT auth.uid()) = conversations.volunteer_id 
             OR (SELECT auth.uid()) = conversations.organization_id)
    )
);

CREATE POLICY "View organization members"
ON organization_members FOR SELECT
USING (TRUE);

CREATE POLICY "Volunteers can join/leave organizations"
ON organization_members FOR ALL
USING ((SELECT auth.uid()) = volunteer_id)
WITH CHECK ((SELECT auth.uid()) = volunteer_id);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================
-- Triggers run automatically when data changes

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER -- Run with function creator's permissions
SET search_path = public -- Security: only use public schema
LANGUAGE plpgsql -- Written in PL/pgSQL
AS $$
BEGIN
    NEW.updated_at = NOW(); -- Set updated_at to current time
    RETURN NEW; -- Return the modified row
END;
$$;

-- Apply update_updated_at to multiple tables
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteer_profiles_updated_at 
    BEFORE UPDATE ON volunteer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_profiles_updated_at 
    BEFORE UPDATE ON organization_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update conversation timestamp when message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- Function: Auto-update event volunteer count
CREATE OR REPLACE FUNCTION update_event_volunteer_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- When volunteer registers
    IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
        UPDATE events 
        SET current_volunteers = current_volunteers + 1 
        WHERE id = NEW.event_id;
    -- When status changes from registered to something else
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'registered' AND NEW.status != 'registered' THEN
        UPDATE events 
        SET current_volunteers = current_volunteers - 1 
        WHERE id = NEW.event_id;
    -- When status changes to registered from something else
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'registered' AND NEW.status = 'registered' THEN
        UPDATE events 
        SET current_volunteers = current_volunteers + 1 
        WHERE id = NEW.event_id;
    -- When registration is deleted
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'registered' THEN
        UPDATE events 
        SET current_volunteers = current_volunteers - 1 
        WHERE id = OLD.event_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_volunteer_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_volunteer_count();

-- ============================================
-- SEED DATA
-- ============================================
-- Insert initial event categories
INSERT INTO event_categories (name, description, icon_name) VALUES
    ('Community Service', 'General community service and outreach', 'people'),
    ('Environmental', 'Environmental conservation and cleanup', 'leaf'),
    ('Education', 'Tutoring, mentoring, and educational programs', 'book'),
    ('Health & Wellness', 'Healthcare support and wellness programs', 'heart'),
    ('Animal Welfare', 'Animal shelters and wildlife conservation', 'paw'),
    ('Arts & Culture', 'Museums, theaters, and cultural events', 'palette'),
    ('Food Security', 'Food banks and meal services', 'restaurant'),
    ('Youth Development', 'Youth programs and activities', 'school'),
    ('Senior Support', 'Programs for elderly and senior citizens', 'elderly'),
    ('Disaster Relief', 'Emergency response and disaster recovery', 'warning')
ON CONFLICT (name) DO NOTHING; -- Skip if already exists