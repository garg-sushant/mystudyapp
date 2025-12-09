import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

import tasksRouter from './src/routes/tasks.js'
import goalsRouter from './src/routes/goals.js'
import sessionsRouter from './src/routes/sessions.js'
import authRouter from './src/routes/auth.js'
import { auth } from './src/middleware/auth.js'
import { requestLogger } from './src/middleware/requestLogger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/study_planner'

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(requestLogger)

app.get('/', (_, res) => {
  res.json({ status: 'ok', message: 'Study Planner API running' })
})

app.use('/api/auth', authRouter)
app.use('/api/tasks', auth, tasksRouter)
app.use('/api/goals', auth, goalsRouter)
app.use('/api/sessions', auth, sessionsRouter)

mongoose
  .connect(MONGODB_URI, { dbName: 'study_planner' })
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection error', err)
    process.exit(1)
  })



