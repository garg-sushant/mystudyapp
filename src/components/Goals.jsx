import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button, Modal, Form, ListGroup, ProgressBar } from 'react-bootstrap'
import { addGoal, updateGoal, deleteGoal, updateProgress } from '../redux/slices/goalsSlice'

const Goals = () => {
  const dispatch = useDispatch()
  const { goals } = useSelector(state => state.goals)
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0
  })

  const pendingGoals = goals.filter(goal => !goal.completed)
  const completedGoals = goals.filter(goal => goal.completed)
  const totalGoals = goals.length
  const completionRate = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingGoal) {
      dispatch(updateGoal({ id: editingGoal.id, updates: formData }))
    } else {
      dispatch(addGoal(formData))
    }
    handleClose()
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingGoal(null)
    setFormData({ title: '', description: '', progress: 0 })
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description || '',
      progress: goal.progress || 0
    })
    setShowModal(true)
  }

  const handleDelete = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      dispatch(deleteGoal(goalId))
    }
  }

  const handleToggleComplete = (goal) => {
    dispatch(updateGoal({ id: goal.id, updates: { completed: !goal.completed } }))
  }

  const handleProgressUpdate = (goal, newProgress) => {
    dispatch(updateProgress({ goalId: goal.id, progress: Math.min(100, Math.max(0, newProgress)) }))
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">🎯 Goals</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Add Goal
            </Button>
          </div>
          <div className="mb-3">
            <ProgressBar now={completionRate} max={100} label={`${completionRate}%`} />
            <div className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>
              {completedGoals.length} of {totalGoals} goals completed
            </div>
          </div>
          <div className="row" style={{ gap: '2rem 0' }}>
            <div className="col-md-6" style={{ minWidth: 320 }}>
              <h4 className="mb-3">Pending Goals</h4>
              <ListGroup>
                {pendingGoals.length === 0 && (
                  <ListGroup.Item className="text-center text-muted">No pending goals.</ListGroup.Item>
                )}
                {pendingGoals.map(goal => (
                  <ListGroup.Item key={goal.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontWeight: 500 }}>{goal.title}</div>
                      {goal.description && (
                        <div className="text-muted small">{goal.description}</div>
                      )}
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <ProgressBar 
                          now={goal.progress || 0} 
                          max={100} 
                          style={{ width: 120, height: 8 }} 
                          variant="info"
                        />
                        <span style={{ fontSize: 12 }}>{goal.progress || 0}%</span>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1 align-items-end">
                      <Button size="sm" variant="success" onClick={() => handleToggleComplete(goal)}>
                        Complete
                      </Button>
                      <Button size="sm" variant="outline-primary" onClick={() => handleEdit(goal)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(goal.id)}>
                        Delete
                      </Button>
                      <Button size="sm" variant="outline-info" onClick={() => handleProgressUpdate(goal, (goal.progress || 0) + 10)}>
                        +10%
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="col-md-6" style={{ minWidth: 320 }}>
              <h4 className="mb-3">Completed Goals</h4>
              <ListGroup>
                {completedGoals.length === 0 && (
                  <ListGroup.Item className="text-center text-muted">No completed goals yet.</ListGroup.Item>
                )}
                {completedGoals.map(goal => (
                  <ListGroup.Item key={goal.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontWeight: 500 }}>{goal.title}</div>
                      {goal.description && (
                        <div className="text-muted small">{goal.description}</div>
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
                    </div>
                    <div className="d-flex flex-column gap-1 align-items-end">
                      <Button size="sm" variant="secondary" onClick={() => handleToggleComplete(goal)}>
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

      {/* Add/Edit Goal Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Goal Title *</Form.Label>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Goals 