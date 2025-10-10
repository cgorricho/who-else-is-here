-- Initialize Who Else Is Here Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create database and user (already handled by environment variables)
-- POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD are set in docker-compose.yml

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    event_code VARCHAR(50) UNIQUE NOT NULL, -- Short code for QR/links
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Future: session support
    has_sessions BOOLEAN DEFAULT false
);

-- Users/Attendees table
CREATE TABLE attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

    -- LinkedIn users
    linkedin_id VARCHAR(255), -- LinkedIn user ID
    linkedin_profile_url VARCHAR(500),

    -- All users (LinkedIn + manual)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    job_title VARCHAR(255),
    bio TEXT, -- 500 char max for manual users
    profile_image_url VARCHAR(500),

    -- Meta
    is_linkedin_user BOOLEAN DEFAULT false,
    privacy_consent BOOLEAN DEFAULT false, -- GDPR compliance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE(event_id, linkedin_id), -- One LinkedIn user per event
    UNIQUE(event_id, email) -- One email per event
);

-- Connection requests tracking
CREATE TABLE connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) NOT NULL, -- 'linkedin' or 'contact_save'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE(event_id, requester_id, target_id), -- Prevent duplicate requests
    CHECK (requester_id != target_id) -- Can't connect to yourself
);

-- Sessions table (for future multi-session events)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session attendance (for future)
CREATE TABLE session_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE(session_id, attendee_id) -- One attendance record per session
);

-- Indexes for performance
CREATE INDEX idx_events_code ON events(event_code);
CREATE INDEX idx_events_active ON events(is_active);
CREATE INDEX idx_attendees_event ON attendees(event_id);
CREATE INDEX idx_attendees_linkedin ON attendees(linkedin_id);
CREATE INDEX idx_connection_requests_event ON connection_requests(event_id);
CREATE INDEX idx_connection_requests_requester ON connection_requests(requester_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendees_updated_at BEFORE UPDATE ON attendees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO events (name, description, organizer_name, organizer_email, event_code)
-- VALUES ('Test Event', 'A sample networking event', 'Test Organizer', 'test@example.com', 'TEST001');