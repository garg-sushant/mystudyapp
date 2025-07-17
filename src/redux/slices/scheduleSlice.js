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
    addTask: (state, action) => {
      state.tasks.push({
        id: Date.now(),
        ...action.payload,
        progress: typeof action.payload.progress === 'number' && !isNaN(action.payload.progress) ? action.payload.progress : 0,
        completed: false,
        createdAt: new Date().toISOString()
      })
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        const prevCompleted = state.tasks[taskIndex].completed;
        const newCompleted = typeof updates.completed === 'boolean' ? updates.completed : prevCompleted;
        let newProgress = typeof updates.progress === 'number' && !isNaN(updates.progress) ? updates.progress : (state.tasks[taskIndex].progress || 0);
        if (prevCompleted && !newCompleted && newProgress === 100) {
          newProgress = 99;
        }
        const finalProgress = Math.min(100, Math.max(0, newProgress));
        const shouldComplete = finalProgress >= 100;
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          progress: finalProgress,
          completed: shouldComplete || newCompleted
        };
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
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
      state.studySessions.push({
        id: Date.now(),
        ...action.payload
      });
    }
  }
})

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  startSession,
  endSession,
  setLoading,
  setError,
  addStudySession
} = scheduleSlice.actions

export default scheduleSlice.reducer 