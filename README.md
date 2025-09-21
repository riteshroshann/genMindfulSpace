# MindfulSpace - Mental Wellness App

A compassionate AI-powered mental health support platform built with Next.js, Supabase, and OpenRouter AI.

## Features

- **AI Chat Support**: 24/7 empathetic AI companion using OpenRouter's language models
- **Dynamic Model Selection**: Choose from various AI models including free options
- **Anonymous Journaling**: Private space for reflection and personal growth
- **Mood Tracking**: Track emotional patterns over time
- **Crisis Support**: Direct access to mental health resources and hotlines
- **Trusted Connections**: Build and maintain your support network
- **Resilience Games**: Interactive activities to build coping skills
- **Art & Music Therapy**: Creative expression tools

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **AI**: OpenRouter API with multiple model support
- **Authentication**: Supabase Auth

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd mental-wellness-app
npm install
\`\`\`

### 2. Environment Variables

Copy the example environment file and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required environment variables:

#### Supabase Configuration
1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Add to `.env.local`:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

#### OpenRouter API Configuration
1. Go to [OpenRouter](https://openrouter.ai) and create an account
2. Generate an API key from your dashboard
3. Add to `.env.local`:
   \`\`\`
   OPENROUTER_API_KEY=your_openrouter_api_key
   \`\`\`

#### Site URL (Optional)
\`\`\`
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

Run the database schema script to create the necessary tables:

1. In your Supabase dashboard, go to SQL Editor
2. Run the script from `scripts/001_create_database_schema.sql`

Or use the Supabase CLI:
\`\`\`bash
supabase db reset
\`\`\`

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## OpenRouter Models

The app supports dynamic model selection from OpenRouter's catalog. Popular models include:

### Free Models
- **Llama 3.1 8B Instruct** (Free) - Fast and capable
- **Qwen 2.5 7B Instruct** (Free) - Good for conversations
- **Gemma 2 9B** (Free) - Google's efficient model

### Premium Models
- **Claude 3.5 Sonnet** - Excellent for nuanced conversations
- **GPT-4o** - OpenAI's latest model
- **Llama 3.1 70B** - More capable version

The app automatically loads available models and shows pricing information.

## Key Features Explained

### AI Chat System
- Real-time chat with empathetic AI responses
- Model selection with free and premium options
- Session management and chat history
- Specialized mental health prompting

### Crisis Support
- International crisis hotlines and resources
- Immediate emergency contact information
- Coping strategies and warning signs
- Location-based resource filtering

### Privacy & Security
- All data encrypted and stored securely
- Anonymous usage options
- HIPAA-compliant data handling
- Row Level Security (RLS) policies

## Development

### Project Structure
\`\`\`
├── app/                    # Next.js app directory
│   ├── ai-chat/           # AI chat interface
│   ├── api/               # API routes
│   ├── crisis-support/    # Crisis resources
│   ├── journal/           # Journaling feature
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   └── navigation.tsx    # Main navigation
├── lib/                  # Utility functions
│   └── supabase/        # Supabase client setup
└── scripts/             # Database scripts
\`\`\`

### API Endpoints

- `POST /api/chat` - Send messages to AI models
- `GET /api/models` - Get available OpenRouter models

### Database Schema

The app uses PostgreSQL with the following main tables:
- `ai_chat_sessions` - Chat session management
- `ai_chat_messages` - Individual chat messages
- `journal_entries` - Private journal entries
- `mood_entries` - Mood tracking data
- `trusted_contacts` - User support network

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you need help setting up the project or have questions about mental health resources, please:

1. Check the documentation
2. Open an issue on GitHub
3. Contact the development team

## Disclaimer

This app is designed to provide support and resources for mental wellness. It is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.

## Crisis Resources

### United States
- **988 Suicide & Crisis Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741

### United Kingdom
- **Samaritans**: 116 123

### Canada
- **Talk Suicide Canada**: 1-833-456-4566

For more resources, visit the Crisis Support section in the app.
