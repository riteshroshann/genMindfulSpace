import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import compression from "compression"
import morgan from "morgan"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
import { VertexAI } from "@google-cloud/vertexai"
import { GoogleAuth } from "google-auth-library"

// Import routes
import chatRoutes from "./routes/chat"
import modelsRoutes from "./routes/models"
import journalRoutes from "./routes/journal"
import moodRoutes from "./routes/mood"
import authRoutes from "./routes/auth"
import achievementsRoutes from "./routes/achievements"
import streaksRoutes from "./routes/streaks"
import soundscapesRoutes from "./routes/soundscapes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy for rate limiting (required for Render deployment)
app.set('trust proxy', 1)

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Initialize Google Cloud services
export let vertexAI: VertexAI

const initializeGoogleCloud = async () => {
  try {
    // Initialize Google Auth with service account key or default credentials
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })

    // Initialize Vertex AI
    vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    })

    console.log('✅ Google Cloud Vertex AI initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Vertex AI:', error)
    throw error
  }
}

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

// Compression middleware for production
app.use(compression())

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.googleapis.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://vercel.app',
      /\.vercel\.app$/
    ].filter(Boolean)
    
    if (!origin || allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin
      if (allowed instanceof RegExp) return allowed.test(origin)
      return false
    })) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime()
  })
})

// API routes
app.use("/api/chat", chatRoutes)
app.use("/api/models", modelsRoutes)
app.use("/api/journal", journalRoutes)
app.use("/api/mood", moodRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/achievements", achievementsRoutes)
app.use("/api/streaks", streaksRoutes)
app.use("/api/soundscapes", soundscapesRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// 404 handler
app.use("*", (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Route not found" })
})

// Graceful shutdown
const startServer = async () => {
  try {
    // Initialize Google Cloud services
    await initializeGoogleCloud()
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 MindfulSpace Backend running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`☁️ Google Cloud Project: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`)
    })

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully')
      server.close(() => {
        console.log('Process terminated')
      })
    })

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully')
      server.close(() => {
        console.log('Process terminated')
      })
    })

    return server
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

export default app
