-- Migration: create_dale_tables
-- Created at: 1761721137

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'rider' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Ride table
CREATE TABLE IF NOT EXISTS "Ride" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  from_city TEXT NOT NULL,
  from_lat DOUBLE PRECISION NOT NULL,
  from_lon DOUBLE PRECISION NOT NULL,
  to_city TEXT NOT NULL,
  to_lat DOUBLE PRECISION NOT NULL,
  to_lon DOUBLE PRECISION NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  seats_total INTEGER NOT NULL,
  seats_available INTEGER NOT NULL,
  price DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (driver_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create Booking table
CREATE TABLE IF NOT EXISTS "Booking" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL,
  rider_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  FOREIGN KEY (ride_id) REFERENCES "Ride"(id) ON DELETE CASCADE,
  FOREIGN KEY (rider_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ride_cities_date ON "Ride"(from_city, to_city, date_time);
CREATE INDEX IF NOT EXISTS idx_ride_driver ON "Ride"(driver_id);
CREATE INDEX IF NOT EXISTS idx_booking_ride ON "Booking"(ride_id);
CREATE INDEX IF NOT EXISTS idx_booking_rider ON "Booking"(rider_id);
;