# MindfulSpace Backend Deployment Guide

## Complete Backend Setup for Render Deployment

### Prerequisites
- Render account
- Supabase project
- OpenRouter API key

### 1. Environment Variables for Render

Set these environment variables in your Render dashboard:

\`\`\`env
# Database Configuration
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# Server Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_here

# URLs
SITE_URL=https://your-backend-domain.onrender.com
FRONTEND_URL=https://your-frontend-domain.vercel.app
\`\`\`

### 2. Required Database Tables

Run this SQL in your Supabase SQL editor:

\`\`\`sql
-- Enable RLS
ALTER TABLE IF EXISTS journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  emotions TEXT[] DEFAULT '{}',
  notes TEXT,
  activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages from own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );
\`\`\`

### 3. API Endpoints

Your backend will provide these endpoints:

- `GET /health` - Health check
- `POST /api/chat` - AI chat conversations
- `GET /api/models` - Available AI models
- `GET /api/auth/user` - Get current user
- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create journal entry
- `GET /api/mood` - Get mood entries
- `POST /api/mood` - Create mood entry

### 4. Render Deployment Steps

1. **Create New Web Service** in Render
2. **Connect GitHub Repository** with your backend code
3. **Configure Build & Deploy**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
4. **Set Environment Variables** (from step 1)
5. **Deploy**

### 5. Frontend Configuration

Update your Vercel frontend environment variables:

\`\`\`env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.onrender.com
\`\`\`

### 6. Testing

Test your deployment:

\`\`\`bash
# Health check
curl https://your-backend-domain.onrender.com/health

# Test chat endpoint
curl -X POST https://your-backend-domain.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
\`\`\`

## Single Deployment Prompt

**Copy this prompt to deploy your backend:**

"Create a Node.js Express backend for a mental wellness app with the following requirements:

1. **API Endpoints**: Chat AI (OpenRouter integration), Models list, Journal CRUD, Mood tracking CRUD, User authentication
2. **Database**: Supabase integration with RLS policies for journal_entries, mood_entries, chat_sessions, chat_messages tables
3. **Security**: CORS, Helmet, Rate limiting, Input validation, JWT authentication
4. **Deployment**: Render-ready with Dockerfile, health checks, environment variables
5. **Features**: OpenRouter AI chat with mental health prompts, Supabase auth integration, Express.js with TypeScript

Environment variables needed: DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY, JWT_SECRET, CORS_ORIGIN, PORT, NODE_ENV

Deploy to Render with build command 'npm install && npm run build' and start command 'npm start'."
