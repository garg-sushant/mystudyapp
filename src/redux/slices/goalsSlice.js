import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  goals: [],
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science'],
  loading: false,
  error: null
}

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state.goals = action.payload
    },
    addGoal: (state, action) => {
      const incoming = action.payload || {}
      const id = incoming.id || incoming._id || Date.now()
      state.goals.push({
        id,
        _id: incoming._id,
        ...incoming,
        progress: typeof incoming.progress === 'number' && !isNaN(incoming.progress) ? incoming.progress : 0,
        createdAt: incoming.createdAt || new Date().toISOString(),
        completed: typeof incoming.completed === 'boolean' ? incoming.completed : false
      })
    },
    updateGoal: (state, action) => {
      const { id, updates } = action.payload
      const goalIndex = state.goals.findIndex(goal => (goal.id || goal._id) === id)
      if (goalIndex !== -1) {
        const prevCompleted = state.goals[goalIndex].completed
        const newCompleted = typeof updates.completed === 'boolean' ? updates.completed : prevCompleted
        let newProgress = typeof updates.progress === 'number' && !isNaN(updates.progress) ? updates.progress : (state.goals[goalIndex].progress || 0)
        if (prevCompleted && !newCompleted && newProgress === 100) {
          newProgress = 99
        }
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates, progress: newProgress, completed: newCompleted }
      }
    },
    deleteGoal: (state, action) => {
      state.goals = state.goals.filter(goal => (goal.id || goal._id) !== action.payload)
    },
    updateProgress: (state, action) => {
      const { goalId, progress } = action.payload
      const goal = state.goals.find(goal => goal.id === goalId)
      if (goal) {
        goal.progress = Math.min(goal.targetProgress || 100, Math.max(0, progress))
        if (goal.progress >= (goal.targetProgress || 100)) {
          goal.completed = true
        }
      }
    },
    addSubject: (state, action) => {
      if (!state.subjects.includes(action.payload)) {
        state.subjects.push(action.payload)
      }
    },
    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(subject => subject !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const {
  addGoal,
  setGoals,
  updateGoal,
  deleteGoal,
  updateProgress,
  addSubject,
  removeSubject,
  setLoading,
  setError
} = goalsSlice.actions

export default goalsSlice.reducer 