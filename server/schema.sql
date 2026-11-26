CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  submission_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  service TEXT NOT NULL,
  package_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  project TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  admin_email_state TEXT NOT NULL DEFAULT 'pending',
  client_email_state TEXT NOT NULL DEFAULT 'pending',
  admin_email_error TEXT,
  client_email_error TEXT
);
CREATE INDEX IF NOT EXISTS enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_email ON enquiries(email);
CREATE TABLE IF NOT EXISTS admin_codes (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at INTEGER
);
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);
