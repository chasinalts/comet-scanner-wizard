-- Create tables for COMET Scanner Wizard

-- Images table to store image data
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  image_data TEXT NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT
);

-- Contents table to store content metadata
CREATE TABLE IF NOT EXISTS contents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  image_id TEXT REFERENCES images(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  scale NUMERIC DEFAULT 1,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for larger images
-- Note: This needs to be done in the Supabase dashboard or via the API

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_content_type ON images(content_type);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_user_id ON contents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Create RLS (Row Level Security) policies
-- Note: These are basic policies and should be adjusted based on your specific requirements

-- Enable RLS on tables
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for images table
CREATE POLICY "Images are viewable by everyone" 
  ON images FOR SELECT 
  USING (true);

CREATE POLICY "Images are insertable by authenticated users" 
  ON images FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Images are updatable by owner" 
  ON images FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Images are deletable by owner" 
  ON images FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create policies for contents table
CREATE POLICY "Contents are viewable by everyone" 
  ON contents FOR SELECT 
  USING (true);

CREATE POLICY "Contents are insertable by authenticated users" 
  ON contents FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Contents are updatable by owner" 
  ON contents FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Contents are deletable by owner" 
  ON contents FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create policies for user_settings table
CREATE POLICY "User settings are viewable by owner" 
  ON user_settings FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "User settings are insertable by authenticated users" 
  ON user_settings FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "User settings are updatable by owner" 
  ON user_settings FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "User settings are deletable by owner" 
  ON user_settings FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create functions for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at timestamp
CREATE TRIGGER update_images_updated_at
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
BEFORE UPDATE ON contents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
