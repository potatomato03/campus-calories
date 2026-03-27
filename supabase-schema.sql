-- Campus Calories V2 - Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- ==================== TABLES ====================

-- Admins Table (for admin panel access)
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- User Profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gender TEXT,
  age INTEGER,
  weight REAL,
  height REAL,
  activity_level TEXT CHECK (activity_level IN ('lite', 'moderate', 'pro')),
  goal_mode TEXT DEFAULT 'maintenance' CHECK (goal_mode IN ('cutting', 'maintenance', 'bulking')),
  daily_calorie_goal INTEGER,
  daily_protein_goal INTEGER,
  custom_calories INTEGER,
  custom_protein INTEGER,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Logs (individual food entries)
CREATE TABLE IF NOT EXISTS daily_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('mess', 'anc', 'packaged', 'custom')),
  calories INTEGER DEFAULT 0,
  protein REAL DEFAULT 0,
  carbs REAL DEFAULT 0,
  fat REAL DEFAULT 0,
  portion TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Summaries (aggregated for analytics)
CREATE TABLE IF NOT EXISTS daily_summaries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  total_protein REAL DEFAULT 0,
  total_carbs REAL DEFAULT 0,
  total_fat REAL DEFAULT 0,
  calorie_goal INTEGER,
  protein_goal INTEGER,
  meal_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Meal Logs Table (for syncing from localStorage)
CREATE TABLE IF NOT EXISTS meal_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_kcal INTEGER DEFAULT 0,
  total_protein REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streaks Table (for tracking consecutive days)
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_logged_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals Table (user nutrition goals)
CREATE TABLE IF NOT EXISTS goals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal INTEGER DEFAULT 50,
  goal_mode TEXT DEFAULT 'maintenance' CHECK (goal_mode IN ('cutting', 'maintenance', 'bulking')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date ON daily_summaries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON meal_logs(user_id, date);

-- ==================== ROW LEVEL SECURITY ====================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Admins Policies (only admins can read admin list)
CREATE POLICY "Users can check if they are admin" ON admins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage other admins" ON admins
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Daily Logs Policies
CREATE POLICY "Users can view own logs" ON daily_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON daily_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON daily_logs
  FOR DELETE USING (auth.uid() = user_id);
-- Admins can view all logs
CREATE POLICY "Admins can view all logs" ON daily_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- Daily Summaries Policies
CREATE POLICY "Users can view own summaries" ON daily_summaries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON daily_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON daily_summaries
  FOR UPDATE USING (auth.uid() = user_id);

-- Meal Logs Policies
CREATE POLICY "Users can view own meal logs" ON meal_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal logs" ON meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal logs" ON meal_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal logs" ON meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Streaks Policies
CREATE POLICY "Users can view own streaks" ON streaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Goals Policies
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

-- ==================== HELPER FUNCTIONS ====================

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_date DATE := CURRENT_DATE;
  v_has_log BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM daily_logs 
      WHERE user_id = p_user_id AND date = v_date
    ) INTO v_has_log;
    
    IF NOT v_has_log THEN
      EXIT;
    END IF;
    
    v_streak := v_streak + 1;
    v_date := v_date - 1;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== ADD FIRST ADMIN ====================
-- Run this separately after creating your admin user:
-- INSERT INTO admins (user_id, created_by) 
-- VALUES ('your-admin-user-uuid', 'your-admin-user-uuid');
