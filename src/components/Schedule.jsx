import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button, Modal, Form, ListGroup, ProgressBar, Row, Col } from 'react-bootstrap'
import { addTask, updateTask, deleteTask, addStudySession } from '../redux/slices/scheduleSlice'

const Schedule = () => {
  const dispatch = useDispatch()
  const { tasks } = useSelector(state => state.schedule)
  const { subjects } = useSelector(state => state.goals)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    subject: subjects[0] || '',
    duration: ''
  })
  const [sessionForm, setSessionForm] = useState({ subject: subjects[0] || '', duration: '', topic: '' })

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, updates: formData }))
    } else {
      dispatch(addTask(formData))
    }
    handleClose()
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingTask(null)
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
      dispatch(deleteTask(taskId))
    }
  }

  const handleToggleComplete = (task) => {
    dispatch(updateTask({ id: task.id, updates: { completed: !task.completed } }))
  }

  const handleProgressUpdate = (task, newProgress) => {
    dispatch(updateTask({ id: task.id, updates: { progress: Math.min(100, Math.max(0, newProgress)) } }))
  }

  // Study Session Form Handlers
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
            <Form.Group className="mb-3">
              <Form.Label>Task Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                required
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
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Schedule 