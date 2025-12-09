import React, { useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { setCredentials } from '../redux/slices/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const res = await api.post(path, payload)
      dispatch(setCredentials(res))
      navigate('/schedule')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm" style={{ width: 380 }}>
        <Card.Body>
          <h3 className="mb-3 text-center">{mode === 'login' ? 'Login' : 'Register'}</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            {mode === 'login' ? (
              <Button variant="link" onClick={() => setMode('register')}>Need an account? Register</Button>
            ) : (
              <Button variant="link" onClick={() => setMode('login')}>Have an account? Login</Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login




