import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [],
  currentSession: null,
  studySessions: [],
  loading: false,
  error: null
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    addTask: (state, action) => {
      const incoming = action.payload || {}
      const id = incoming.id || incoming._id || Date.now()
      state.tasks.push({
        id,
        _id: incoming._id,
        ...incoming,
        progress: typeof incoming.progress === 'number' && !isNaN(incoming.progress) ? incoming.progress : 0,
        completed: typeof incoming.completed === 'boolean' ? incoming.completed : false,
        createdAt: incoming.createdAt || new Date().toISOString()
      })
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => (task.id || task._id) === id)
      if (taskIndex !== -1) {
        const prevCompleted = state.tasks[taskIndex].completed
        const newCompleted = typeof updates.completed === 'boolean' ? updates.completed : prevCompleted
        let newProgress = typeof updates.progress === 'number' && !isNaN(updates.progress) ? updates.progress : (state.tasks[taskIndex].progress || 0)
        if (prevCompleted && !newCompleted && newProgress === 100) {
          newProgress = 99
        }
        const finalProgress = Math.min(100, Math.max(0, newProgress))
        const shouldComplete = finalProgress >= 100
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          progress: finalProgress,
          completed: shouldComplete || newCompleted
        }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => (task.id || task._id) !== action.payload)
    },
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
        // If marking as completed, set progress to 100%
        if (task.completed) {
          task.progress = 100
        }
      }
    },
    startSession: (state, action) => {
      state.currentSession = {
        id: Date.now(),
        taskId: action.payload.taskId,
        startTime: new Date().toISOString(),
        subject: action.payload.subject,
        topic: action.payload.topic
      }
    },
    endSession: (state, action) => {
      if (state.currentSession) {
        const session = {
          ...state.currentSession,
          endTime: new Date().toISOString(),
          duration: action.payload.duration
        }
        state.studySessions.push(session)
        state.currentSession = null
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addStudySession: (state, action) => {
      // action.payload: { subject, duration, startTime, endTime, topic }
      const incoming = action.payload || {}
      const id = incoming.id || incoming._id || Date.now()
      // Ensure no duplicates and proper data types
      const exists = state.studySessions.some(s => (s.id || s._id) === id)
      if (!exists) {
        state.studySessions.push({
          id,
          _id: incoming._id,
          ...incoming,
          duration: Number(incoming.duration) || 0
        })
      }
    },
    setStudySessions: (state, action) => {
      state.studySessions = (action.payload || []).map(session => ({
        ...session,
        id: session._id || session.id,
        duration: Number(session.duration) || 0
      }))
    }
  }
})

export const {
  addTask,
  setTasks,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  startSession,
  endSession,
  setLoading,
  setError,
  addStudySession,
  setStudySessions
} = scheduleSlice.actions

export default scheduleSlice.reducer 