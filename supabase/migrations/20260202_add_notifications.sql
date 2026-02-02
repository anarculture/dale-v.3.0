-- Migration: Create notifications table for notification system
-- Date: 2026-02-02

-- Create notifications table (following spec 007-notifications-system.md)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- 'booking_update', 'booking_confirmed', 'booking_rejected', 'ride_cancelled', 'system_alert', etc.
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own notifications
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can update (mark as read) only their own notifications
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Note: INSERT is handled by service role key (backend), no user-facing insert policy needed
-- The service role key bypasses RLS, so the backend can insert notifications for any user
