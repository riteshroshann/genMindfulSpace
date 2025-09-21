# MindfulSpace Backend

Production-ready Express.js API for the MindfulSpace Mental Wellness Application with Google Cloud Vertex AI integration.

## Features

- 🔐 JWT Authentication with Supabase
- 🤖 **Google Cloud Vertex AI** chat with Gemini models
- 🧠 **CBT-focused AI** for therapeutic conversations
- 🚨 **Crisis detection** with real-time monitoring
- 📓 Journal management with CRUD operations
- 📊 Mood tracking with analytics
- 🔒 Rate limiting and security middleware
- 📈 Health monitoring and logging
- 🐳 Docker support for easy deployment

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/user` - Get current user profile
- `POST /api/auth/refresh` - Refresh user session
- `POST /api/auth/logout` - Logout user

### AI Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat/message` - Send message to Vertex AI assistant
- `GET /api/chat/sessions` - Get user's chat sessions
- `GET /api/chat/sessions/:sessionId` - Get specific session messages
- `DELETE /api/chat/sessions/:sessionId` - Delete chat session

### Models
- `GET /api/models` - Get available Vertex AI models
- `GET /api/models/:id` - Get specific model details
- `GET /api/models/recommendations/mental-health` - Get recommended Gemini models
- `GET /api/models/capabilities/mental-health` - Get AI capabilities

### Journal
- `GET /api/journal` - Get journal entries (paginated)
- `POST /api/journal` - Create journal entry
- `GET /api/journal/:id` - Get specific journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry
- `GET /api/journal/stats/overview` - Get journal statistics

### Mood Tracking
- `GET /api/mood` - Get mood entries (paginated)
- `POST /api/mood` - Create mood entry
- `GET /api/mood/:id` - Get specific mood entry
- `PUT /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry
- `GET /api/mood/analytics/overview` - Get mood analytics

### Health
- `GET /health` - Server health check

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Cloud Vertex AI Configuration
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}

# Optional: Logging
LOG_LEVEL=info
SITE_URL=https://your-backend-domain.onrender.com
```

## Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Docker Deployment

```bash
# Build the image
docker build -t mindfulspace-backend .

# Run the container
docker run -p 3001:3001 --env-file .env mindfulspace-backend
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 req/15min global, 10 req/min for chat)
- Input validation
- Authentication middleware
- Environment-based configurations

## Mental Health Focus

The Google Cloud Vertex AI integration is specifically designed for mental health support:

- **CBT-focused prompting** for therapeutic conversations
- **Crisis detection** with automatic resource provision
- **Empathetic conversation** patterns using Gemini models
- **Safety filters** to prevent harmful content
- **Professional boundaries** maintained at all times
- **Privacy-first** approach with secure data handling
- **Real-time monitoring** for mental health emergencies

## License

MIT License
