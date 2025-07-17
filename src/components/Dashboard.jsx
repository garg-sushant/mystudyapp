import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Row, Col, ProgressBar, Badge, Button, ListGroup } from 'react-bootstrap'
import { calculateAnalytics } from '../redux/slices/analyticsSlice'
import { addStudySession } from '../redux/slices/scheduleSlice'
import { useState } from 'react'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { tasks, studySessions, currentSession } = useSelector(state => state.schedule)
  const { goals, subjects } = useSelector(state => state.goals)
  const { productivityScore, subjectStats } = useSelector(state => state.analytics)
  // Default goals since settings are removed
  const dailyGoal = 120 // 2 hours default
  const weeklyGoal = 840 // 14 hours default
  const [sessionForm, setSessionForm] = useState({ subject: subjects[0] || '', duration: '', topic: '' })

  useEffect(() => {
    dispatch(calculateAnalytics({ studySessions, goals, tasks }))
  }, [dispatch, studySessions, goals, tasks])

  const handleSessionFormChange = (e) => {
    const { name, value } = e.target
    setSessionForm(f => ({ ...f, [name]: value }))
  }

  const handleSessionFormSubmit = (e) => {
    e.preventDefault()
    if (!sessionForm.subject || !sessionForm.duration) return
    dispatch(addStudySession({
      subject: sessionForm.subject,
      duration: Number(sessionForm.duration),
      topic: sessionForm.topic,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    }))
    setSessionForm({ subject: subjects[0] || '', duration: '', topic: '' })
  }

  const today = new Date().toISOString().split('T')[0]
  const todaySessions = studySessions.filter(session => 
    session.startTime?.startsWith(today)
  )
  const todayTime = todaySessions.reduce((total, session) => total + (session.duration || 0), 0)
  
  const pendingTasks = tasks.filter(task => !task.completed)
  const activeGoals = goals.filter(goal => !goal.completed)
  const completedGoals = goals.filter(goal => goal.completed)

  // Calculate total study time as sum of duration of completed tasks
  const completedTasks = tasks.filter(task => task.completed)
  const totalStudyTime = completedTasks.reduce((total, task) => total + (Number(task.duration) || 0), 0)

  const getStudySuggestions = () => {
    const suggestions = []
    
    // Suggest subjects with less study time
    const subjectTimes = Object.entries(subjectStats).sort((a, b) => a[1].totalTime - b[1].totalTime)
    if (subjectTimes.length > 0) {
      suggestions.push(`Focus on ${subjectTimes[0][0]} - you've spent less time on it`)
    }
    
    // Suggest based on pending tasks
    if (pendingTasks.length > 0) {
      const urgentTask = pendingTasks[0]
      suggestions.push(`Complete: ${urgentTask.title}`)
    }
    
    // Suggest based on goals
    if (activeGoals.length > 0) {
      const lowProgressGoal = activeGoals.sort((a, b) => a.progress - b.progress)[0]
      suggestions.push(`Work on goal: ${lowProgressGoal.title} (${lowProgressGoal.progress}% complete)`)
    }
    
    return suggestions.slice(0, 3)
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="container-fluid">
      <h1 className="mb-4">🏠 Dashboard</h1>
      
      
      {/* Productivity Score Card */}
      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Productivity Score</Card.Title>
              <div className="display-4 text-primary fw-bold">{productivityScore}</div>
              <ProgressBar 
                now={productivityScore} 
                max={100} 
                className="mt-2"
                variant={productivityScore > 70 ? 'success' : productivityScore > 40 ? 'warning' : 'danger'}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Today's Study Time</Card.Title>
              <div className="display-6 text-success fw-bold">{formatTime(todayTime)}</div>
              <ProgressBar 
                now={(todayTime / dailyGoal) * 100} 
                max={100} 
                className="mt-2"
                variant={todayTime >= dailyGoal ? 'success' : 'info'}
              />
              <small className="text-muted">Goal: {formatTime(dailyGoal)}</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Study Time</Card.Title>
              <div className="display-6 text-info fw-bold">{formatTime(totalStudyTime)}</div>
              <ProgressBar 
                now={(totalStudyTime / weeklyGoal) * 100} 
                max={100} 
                className="mt-2"
                variant={totalStudyTime >= weeklyGoal ? 'success' : 'info'}
              />
              <small className="text-muted">Weekly Goal: {formatTime(weeklyGoal)}</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Active Goals</Card.Title>
              <div className="display-6 text-warning fw-bold">{activeGoals.length}</div>
              <div className="mt-2">
                <Badge bg="success" className="me-1">{completedGoals.length} Completed</Badge>
                <Badge bg="info">{activeGoals.length} Active</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions and Suggestions */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📋 Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Pending Tasks ({pendingTasks.length})</h6>
                  <ListGroup variant="flush">
                    {pendingTasks.slice(0, 3).map(task => (
                      <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                        <span className={task.priority === 'high' ? 'fw-bold text-danger' : ''}>
                          {task.title}
                        </span>
                        <Badge bg={task.priority === 'high' ? 'danger' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {pendingTasks.length > 3 && (
                    <small className="text-muted">... and {pendingTasks.length - 3} more</small>
                  )}
                </Col>
                <Col md={6}>
                  <h6>Active Goals ({activeGoals.length})</h6>
                  <ListGroup variant="flush">
                    {activeGoals.slice(0, 3).map(goal => (
                      <ListGroup.Item key={goal.id}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{goal.title}</span>
                          <Badge bg="info">{goal.progress}%</Badge>
                        </div>
                        <ProgressBar 
                          now={goal.progress} 
                          size="sm" 
                          className="mt-1"
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {activeGoals.length > 3 && (
                    <small className="text-muted">... and {activeGoals.length - 3} more</small>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">💡 Study Suggestions</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {getStudySuggestions().map((suggestion, index) => (
                  <ListGroup.Item key={index} className="border-0">
                    <small>• {suggestion}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {getStudySuggestions().length === 0 && (
                <p className="text-muted small">Great job! Keep up the good work!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* How to Update Progress */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📖 How to Update Your Progress</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>🗓️ For Tasks (Schedule Tab):</h6>
                  <ul className="small">
                    <li><strong>Checkbox:</strong> Click the checkbox to mark task as completed</li>
                    <li><strong>+10% / +25%:</strong> Quick progress buttons</li>
                    <li><strong>Set %:</strong> Manually enter exact progress</li>
                    <li><strong>Start:</strong> Begin a study session with timer</li>
                    <li><strong>Edit:</strong> Modify task details and progress</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>🎯 For Goals (Goals Tab):</h6>
                  <ul className="small">
                    <li><strong>+10% / +25%:</strong> Quick progress buttons</li>
                    <li><strong>Set %:</strong> Manually enter exact progress</li>
                    <li><strong>Edit:</strong> Modify goal details and target progress</li>
                    <li><strong>Auto-complete:</strong> Goals complete when progress reaches target</li>
                  </ul>
                </Col>
              </Row>
              <div className="mt-3 p-3 bg-light rounded">
                <strong>💡 Tip:</strong> Use the Schedule tab to track daily tasks and the Goals tab for long-term objectives. 
                Progress is automatically saved and reflected in your analytics!
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Subject Performance */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📊 Subject Performance</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {subjects.map(subject => {
                  const stats = subjectStats[subject] || { totalTime: 0, sessions: 0 }
                  return (
                    <Col md={4} lg={3} key={subject} className="mb-3">
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <h6>{subject}</h6>
                          <div className="text-primary fw-bold">{formatTime(stats.totalTime)}</div>
                          <small className="text-muted">{stats.sessions} sessions</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard 