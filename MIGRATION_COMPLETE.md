# Mental Wellness App - Complete Google Vertex AI Migration

This is a comprehensive mental wellness application that has been completely migrated from OpenRouter to Google Cloud Vertex AI using the Gemini model.

## 🚀 Features

### Core Features
- **AI Chat Support**: Compassionate, empathetic AI companion using Google Vertex AI Gemini
- **Mood Tracking**: Track daily moods with detailed analytics and insights
- **Journal**: Digital journaling with AI-powered insights and reflections
- **Gamification**: Achievement system with XP, badges, and progress tracking
- **Streak Tracking**: Activity streaks for mood, journal, and chat activities
- **Soundscapes**: Mood-adaptive audio recommendations for relaxation
- **Crisis Support**: Real-time crisis detection and support resources

### Technical Architecture
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with TypeScript, Google Cloud Vertex AI integration
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **AI Integration**: Google Cloud Vertex AI with Gemini 1.5 Flash model
- **Authentication**: Supabase Auth with JWT tokens
- **Deployment**: Docker containers on Render (backend) and Vercel (frontend)

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- Google Cloud Project with Vertex AI API enabled
- Supabase project setup
- Docker (for deployment)

### Environment Configuration

#### Backend (.env)
```bash
# Application Configuration
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

# Database Configuration (Supabase)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Cloud Configuration (Vertex AI)
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"your_project_id","private_key_id":"..."}

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Security
JWT_SECRET=your_secure_jwt_secret_key
SESSION_SECRET=your_secure_session_secret

# Site Configuration
SITE_URL=https://your-backend-domain.onrender.com
```

#### Frontend (.env.local)
```bash
# Backend API Configuration
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation & Development

#### Backend Setup
```bash
cd backend
npm install
npm run build
npm run dev
```

#### Frontend Setup
```bash
npm install
npm run dev
```

#### Database Setup
Run the database schema in Supabase:
```bash
psql -f scripts/001_create_database_schema.sql
```

## 🏗️ Architecture Overview

### Backend API Routes
- `/api/chat/message` - AI chat with Vertex AI Gemini
- `/api/chat/history` - Chat conversation history
- `/api/models` - Available AI models and capabilities
- `/api/mood` - Mood tracking and analytics
- `/api/journal` - Journal entries and insights
- `/api/achievements` - Gamification achievements system
- `/api/streaks` - Activity streak tracking
- `/api/soundscapes` - Mood-adaptive audio recommendations
- `/api/auth` - Authentication and user management

### Frontend API Proxy Routes
The frontend includes API proxy routes that forward requests to the backend:
- `/api/chat` → Backend `/api/chat/message`
- `/api/models` → Backend `/api/models`
- `/api/mood` → Backend `/api/mood`
- `/api/journal` → Backend `/api/journal`
- `/api/achievements` → Backend `/api/achievements`
- `/api/streaks` → Backend `/api/streaks`
- `/api/soundscapes` → Backend `/api/soundscapes`
- `/api/auth` → Backend `/api/auth`

### Database Schema
The application uses a comprehensive database schema with:
- User management and authentication
- Chat messages and session tracking
- Mood entries with analytics
- Journal entries with insights
- Achievement progress tracking
- Activity streaks calculation
- Soundscape usage history
- Crisis event logging

## 🤖 AI Integration Details

### Google Cloud Vertex AI
- **Model**: Gemini 1.5 Flash
- **System Prompt**: CBT-focused mental health support
- **Safety Settings**: Enhanced safety for mental health use
- **Crisis Detection**: Real-time monitoring for crisis situations
- **Context Awareness**: Conversation history maintained

### Migration from OpenRouter
The application has been completely migrated from OpenRouter to Google Cloud Vertex AI:
- ✅ Removed all OpenRouter dependencies
- ✅ Implemented Google Cloud Vertex AI integration
- ✅ Updated frontend API routes to use backend proxy
- ✅ Created backend client library
- ✅ Updated environment configuration

## 🎮 Gamification System

### Achievements (6 Types)
1. **First Steps** - First mood entry, journal entry, chat message
2. **Consistency** - Daily streaks for various activities
3. **Milestones** - Total activity counts (10, 50, 100 entries)
4. **Exploration** - Using different features
5. **Wellness** - Positive mood patterns
6. **Community** - Social features (future expansion)

### Streak Tracking
- **Mood Streaks**: Consecutive days with mood entries
- **Journal Streaks**: Consecutive days with journal entries
- **Chat Streaks**: Consecutive days with AI chat sessions
- **Milestone Rewards**: Special achievements for streak milestones

### Soundscapes System
- **30+ Audio Options**: Categorized by mood and situation
- **Mood Matching**: Recommendations based on current mood
- **Usage Tracking**: Personal soundscape history
- **Categories**: Nature, Ambient, Focus, Sleep, Meditation

## 🔒 Security Features

### Authentication
- Supabase Auth with JWT tokens
- Row Level Security (RLS) policies
- Protected API routes with middleware
- Session management and refresh

### Data Protection
- Encrypted environment variables
- CORS configuration
- Rate limiting on API endpoints
- Input validation and sanitization

## 🚀 Deployment

### Backend (Render)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend (Vercel)
Deploy using Vercel CLI or GitHub integration with automatic deployments.

## 📊 Monitoring & Analytics

### Logging
- Comprehensive error logging with context
- API request/response logging
- Performance monitoring
- Crisis event tracking

### Analytics
- Mood patterns and trends
- Feature usage statistics
- Achievement progress tracking
- User engagement metrics

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### API Testing
Use the provided Postman collection or test individual endpoints:
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need support"}'
```

## 📝 Development Notes

### Migration Completed
- ✅ Complete OpenRouter to Vertex AI migration
- ✅ All backend routes implemented and tested
- ✅ Frontend API proxy routes created
- ✅ Database schema updated with all required tables
- ✅ Error handling and logging implemented
- ✅ Environment configuration documented
- ✅ Comprehensive feature set implemented

### Current Status
The application is production-ready with:
- Complete AI integration using Google Cloud Vertex AI
- Full gamification system with achievements and streaks
- Comprehensive mental health features
- Secure authentication and data protection
- Proper error handling and logging
- Detailed documentation and setup instructions

## 🆘 Support & Resources

### Crisis Resources
The application includes built-in crisis detection and provides immediate access to:
- National Suicide Prevention Lifeline
- Crisis Text Line
- Local emergency services
- Mental health professional directories

### Documentation
- API documentation available in the backend routes
- Database schema documentation in scripts/
- Environment configuration examples provided
- Deployment guides for both frontend and backend

---

This mental wellness application provides a comprehensive, secure, and scalable platform for mental health support using cutting-edge AI technology and best practices in web development.