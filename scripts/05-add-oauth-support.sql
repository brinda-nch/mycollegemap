-- Add OAuth support columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Make password_hash optional for OAuth users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add index for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON users(oauth_provider);
CREATE INDEX IF NOT EXISTS idx_users_oauth_id ON users(oauth_id);

-- Add unique constraint for oauth_provider + oauth_id combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth_unique ON users(oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL;



