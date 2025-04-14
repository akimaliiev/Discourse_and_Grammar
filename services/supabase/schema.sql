-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  username TEXT UNIQUE,
  avatar_url TEXT,
  preferred_language TEXT,
  last_active TIMESTAMPTZ
);

-- Syntax Trees Table
CREATE TABLE syntax_trees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  sentence TEXT NOT NULL,
  language TEXT NOT NULL,
  tree_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_public BOOLEAN DEFAULT false,
  title TEXT,
  description TEXT
);

-- Learning Progress Table
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  language TEXT NOT NULL,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  last_lesson_completed TIMESTAMPTZ,
  proficiency_level TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat History Table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  language TEXT NOT NULL,
  context JSONB
);

-- Saved Resources Table
CREATE TABLE saved_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT,
  description TEXT
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_syntax_trees_user_id ON syntax_trees(user_id);
CREATE INDEX idx_syntax_trees_language ON syntax_trees(language);
CREATE INDEX idx_syntax_trees_created_at ON syntax_trees(created_at);
CREATE INDEX idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_language ON learning_progress(language);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
CREATE INDEX idx_saved_resources_user_id ON saved_resources(user_id);
CREATE INDEX idx_saved_resources_resource_type ON saved_resources(resource_type);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE syntax_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Syntax Trees Policies
CREATE POLICY "Users can view their own trees" ON syntax_trees
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trees" ON syntax_trees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trees" ON syntax_trees
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trees" ON syntax_trees
  FOR DELETE USING (auth.uid() = user_id);

-- Learning Progress Policies
CREATE POLICY "Users can view their own progress" ON learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Chat History Policies
CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved Resources Policies
CREATE POLICY "Users can view their own saved resources" ON saved_resources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved resources" ON saved_resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved resources" ON saved_resources
  FOR DELETE USING (auth.uid() = user_id); 