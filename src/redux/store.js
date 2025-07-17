import { configureStore } from '@reduxjs/toolkit'
import scheduleReducer from './slices/scheduleSlice'
import goalsReducer from './slices/goalsSlice'
import analyticsReducer from './slices/analyticsSlice'

// localStorage middleware
const localStorageMiddleware = store => next => action => {
  const result = next(action)
  localStorage.setItem('studyPlannerState', JSON.stringify(store.getState()))
  return result
}

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('studyPlannerState')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
    goals: goalsReducer,
    analytics: analyticsReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
}) 