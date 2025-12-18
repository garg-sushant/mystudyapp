import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

import tasksRouter from './src/routes/tasks.js'
import goalsRouter from './src/routes/goals.js'
import sessionsRouter from './src/routes/sessions.js'
import authRouter from './src/routes/auth.js'
import streakRouter from './src/routes/streak.js'
import { auth } from './src/middleware/auth.js'
import { requestLogger } from './src/middleware/requestLogger.js'

dotenv.config()

const app = express()

// ===== Middleware =====
// Safe dynamic CORS: allow explicit FRONTEND_URL(s) and localhost for dev.
// Set FRONTEND_URL (single) or FRONTEND_URLS (comma-separated) in production.
const FRONTEND_URL = process.env.FRONTEND_URL || ''
const FRONTEND_URLS = process.env.FRONTEND_URLS || ''
const allowedOrigins = new Set()
if (FRONTEND_URL) allowedOrigins.add(FRONTEND_URL.replace(/\/$/, ''))
if (FRONTEND_URLS) {
  FRONTEND_URLS.split(',').map(s => s.trim()).filter(Boolean).forEach(u => allowedOrigins.add(u.replace(/\/$/, '')))
}
// always allow common localhost origins for developer convenience
allowedOrigins.add('http://localhost:5173')
allowedOrigins.add('http://localhost:3000')
allowedOrigins.add('http://localhost:5000')

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like curl, server-to-server)
    if (!origin) return callback(null, true)
    const cleaned = origin.replace(/\/$/, '')
    if (allowedOrigins.has(cleaned)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
// ensure preflight (OPTIONS) requests are handled
app.options('*', cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))
app.use(requestLogger)

// ===== Health Check =====
app.get('/', (_, res) => {
  res.json({ status: 'ok', message: 'Study Planner API running' })
})

// ===== API ROUTES (FIXED) =====
app.use('/api/auth', authRouter)
app.use('/api/tasks', auth, tasksRouter)
app.use('/api/goals', auth, goalsRouter)
app.use('/api/sessions', auth, sessionsRouter)
app.use('/api/streak', auth, streakRouter)

// ===== Env =====
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined')
  process.exit(1)
}

// ===== Start Server =====
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`)
        process.exit(1)
      }
      console.error('Server error:', err)
      process.exit(1)
    })

    const shutdown = async () => {
      console.log('Shutting down gracefully...')
      try {
        await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()))
        await mongoose.connection.close()
        console.log('Mongo connection closed')
        process.exit(0)
      } catch (err) {
        console.error('Error during shutdown', err)
        process.exit(1)
      }
    }

    process.on('SIGINT', () => { shutdown().catch(() => {}) })
    process.on('SIGTERM', () => { shutdown().catch(() => {}) })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })
