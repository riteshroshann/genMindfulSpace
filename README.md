# MindfulSpace Backend

Production-ready Express.js API for the MindfulSpace Mental Wellness Application.

## Features

- 🔐 JWT Authentication with Supabase
- 🤖 AI Chat with OpenRouter integration
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
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/sessions` - Get user's chat sessions
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions/:id/messages` - Get session messages

### Models
- `GET /api/models` - Get available AI models
- `GET /api/models/:id` - Get specific model details
- `GET /api/models/recommendations/mental-health` - Get recommended models

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

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

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

The AI integration is specifically designed for mental health support:

- Empathetic conversation prompts
- Crisis detection and appropriate responses
- Privacy-first approach
- Therapeutic conversation patterns
- Support for various mental health scenarios

## License

MIT License
