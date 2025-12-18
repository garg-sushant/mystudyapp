import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button, Modal, Form, ListGroup, ProgressBar, Alert } from 'react-bootstrap'
import { addTask, updateTask, deleteTask, setTasks } from '../redux/slices/scheduleSlice'
import { api } from '../api/client'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'

const Schedule = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { tasks } = useSelector(state => state.schedule)
  const { subjects } = useSelector(state => state.goals)
  const { token } = useSelector(state => state.auth)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    subject: subjects[0] || '',
    duration: ''
  })

  // Initial load from backend
  useEffect(() => {
    if (!token) return
    api.get('/tasks')
      .then(data => {
        const normalized = data.map(t => ({ ...t, id: t._id || t.id }))
        dispatch(setTasks(normalized))
      })
      .catch(err => {
        console.error('Failed to load tasks', err)
        if (err.message?.toLowerCase().includes('token')) {
          dispatch(logout())
          navigate('/login')
        }
      })
  }, [dispatch, token, navigate])

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editingTask) {
        const payload = { ...formData }
        const updated = await api.put(`/tasks/${editingTask._id || editingTask.id}`, payload)
        dispatch(updateTask({ id: updated._id || updated.id, updates: updated }))
        handleClose()
      } else {
        const created = await api.post('/tasks', formData)
        dispatch(addTask({ ...created, id: created._id || created.id }))
        handleClose()
      }
    } catch (err) {
      console.error('Failed to save task', err)
      setError(err.message || 'Failed to save task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingTask(null)
    setError('')
    setFormData({ title: '', description: '', progress: 0, subject: subjects[0] || '', duration: '' })
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      progress: task.progress || 0,
      subject: task.subject || subjects[0] || '',
      duration: task.duration || ''
    })
    setShowModal(true)
  }

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      api.del(`/tasks/${taskId}`)
        .then(() => dispatch(deleteTask(taskId)))
        .catch(err => console.error('Failed to delete task', err))
    }
  }

  const handleToggleComplete = (task) => {
    const updates = { completed: !task.completed }
    api.put(`/tasks/${task._id || task.id}`, updates)
      .then(updated => {
        dispatch(updateTask({ id: updated._id || updated.id, updates: updated }))
        api.get('/streak?mode=today').catch(() => {})
      })
      .catch(err => console.error('Failed to toggle complete', err))
  }

  const handleProgressUpdate = (task, newProgress) => {
    const updates = { progress: Math.min(100, Math.max(0, newProgress)) }
    api.put(`/tasks/${task._id || task.id}`, updates)
      .then(updated => dispatch(updateTask({ id: updated._id || updated.id, updates: updated })))
      .catch(err => console.error('Failed to update progress', err))
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">🗓️ Schedule</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Add Task
            </Button>
          </div>
          <div className="mb-3">
            <ProgressBar now={completionRate} max={100} label={`${completionRate}%`} />
            <div className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>
              {completedTasks.length} of {totalTasks} tasks completed
            </div>
          </div>
          <div className="row" style={{ gap: '2rem 0' }}>
            <div className="col-md-6" style={{ minWidth: 320 }}>
              <h4 className="mb-3">Pending Tasks</h4>
              <ListGroup>
                {pendingTasks.length === 0 && (
                  <ListGroup.Item className="text-center text-muted">No pending tasks.</ListGroup.Item>
                )}
                {pendingTasks.map(task => (
                  <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      {task.description && (
                        <div className="text-muted small">{task.description}</div>
                      )}
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <ProgressBar 
                          now={task.progress || 0} 
                          max={100} 
                          style={{ width: 120, height: 8 }} 
                          variant="info"
                        />
                        <span style={{ fontSize: 12 }}>{task.progress || 0}%</span>
                      </div>
                      <div className="text-muted small mt-1">Subject: {task.subject || '-'} | Duration: {task.duration || '-'} min</div>
                    </div>
                    <div className="d-flex flex-column gap-1 align-items-end">
                      <Button size="sm" variant="success" onClick={() => handleToggleComplete(task)}>
                        Complete
                      </Button>
                      <Button size="sm" variant="outline-primary" onClick={() => handleEdit(task)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(task.id)}>
                        Delete
                      </Button>
                      <Button size="sm" variant="outline-info" onClick={() => handleProgressUpdate(task, (task.progress || 0) + 10)}>
                        +10%
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="col-md-6" style={{ minWidth: 320 }}>
              <h4 className="mb-3">Completed Tasks</h4>
              <ListGroup>
                {completedTasks.length === 0 && (
                  <ListGroup.Item className="text-center text-muted">No completed tasks yet.</ListGroup.Item>
                )}
                {completedTasks.map(task => (
                  <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      {task.description && (
                        <div className="text-muted small">{task.description}</div>
                      )}
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <ProgressBar 
                          now={100} 
                          max={100} 
                          style={{ width: 120, height: 8 }} 
                          variant="success"
                        />
                        <span style={{ fontSize: 12 }}>100%</span>
                      </div>
                      <div className="text-muted small mt-1">Subject: {task.subject || '-'} | Duration: {task.duration || '-'} min</div>
                    </div>
                    <div className="d-flex flex-column gap-1 align-items-end">
                      <Button size="sm" variant="secondary" onClick={() => handleToggleComplete(task)}>
                        Undo
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Task Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Task Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                required
                disabled={loading}
              >
                {subjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (min)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                required
                disabled={loading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Add Task')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Schedule 