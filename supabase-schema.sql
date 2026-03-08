-- Run this in your Supabase SQL Editor
-- (supabase.com → your project → SQL Editor → New query → paste → Run)

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  inquiry_type  TEXT,
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  read          BOOLEAN DEFAULT FALSE
);

-- Row Level Security: only service role can read/write (API uses service role)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Newsletter signups table (for future use)
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  source     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Product updates / launch waitlist (for future products)
CREATE TABLE IF NOT EXISTS waitlist (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  product    TEXT NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
