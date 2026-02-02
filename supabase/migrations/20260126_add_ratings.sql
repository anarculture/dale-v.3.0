-- Migration: Add ratings table for reputation system
-- Date: 2026-01-26

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  role TEXT NOT NULL CHECK (role IN ('rider', 'driver')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, author_id)
);

-- Add reputation columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ratings_subject_id ON ratings(subject_id);
CREATE INDEX IF NOT EXISTS idx_ratings_author_id ON ratings(author_id);
CREATE INDEX IF NOT EXISTS idx_ratings_booking_id ON ratings(booking_id);

-- Enable RLS on ratings
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all ratings
CREATE POLICY "ratings_select_policy" ON ratings
  FOR SELECT USING (true);

-- Policy: Authenticated users can insert their own ratings
CREATE POLICY "ratings_insert_policy" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = author_id);
