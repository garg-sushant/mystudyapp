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
// Allow CORS from the configured frontend origin (or allow all in development)
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VITE_API_URL || ''
app.use(cors({
  origin: FRONTEND_URL || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
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

    const shutdown = () => {
      console.log('Shutting down gracefully...')
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('Mongo connection closed')
          process.exit(0)
        })
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })
