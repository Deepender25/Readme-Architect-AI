-- Create the readme_history table for storing user's README generation history
CREATE TABLE IF NOT EXISTS readme_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    repository_url TEXT NOT NULL,
    repository_name TEXT NOT NULL,
    project_name TEXT,
    readme_content TEXT NOT NULL,
    generation_params JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_readme_history_user_id ON readme_history(user_id);
CREATE INDEX IF NOT EXISTS idx_readme_history_created_at ON readme_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readme_history_user_created ON readme_history(user_id, created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_readme_history_updated_at ON readme_history;
CREATE TRIGGER update_readme_history_updated_at
    BEFORE UPDATE ON readme_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies for user data protection
ALTER TABLE readme_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own history
CREATE POLICY "Users can view own history" ON readme_history
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

-- Policy: Users can only insert their own history
CREATE POLICY "Users can insert own history" ON readme_history
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Policy: Users can only update their own history
CREATE POLICY "Users can update own history" ON readme_history
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- Policy: Users can only delete their own history
CREATE POLICY "Users can delete own history" ON readme_history
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- Grant necessary permissions to authenticated users
GRANT ALL ON readme_history TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create a view for easier querying (optional)
CREATE OR REPLACE VIEW user_readme_history AS
SELECT 
    id,
    user_id,
    username,
    repository_url,
    repository_name,
    project_name,
    LENGTH(readme_content) as content_length,
    generation_params,
    created_at,
    updated_at
FROM readme_history
ORDER BY created_at DESC;

GRANT SELECT ON user_readme_history TO authenticated;