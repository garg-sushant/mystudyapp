import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import Schedule from './components/Schedule'
import Goals from './components/Goals'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  )
}

export default App
