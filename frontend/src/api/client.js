const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
// ensure the base URL ends with '/api'
const BASE_URL = rawBase.replace(/\/$/, '') + '/api'
console.log('🔥 ACTUAL BASE_URL:', BASE_URL)

// Normalize path so callers can pass '/sessions' or '/api/sessions'
const normalizePath = (path) => {
  let p = path || ''
  if (!p.startsWith('/')) p = '/' + p
  // remove leading '/api' if present
  p = p.replace(/^\/api(?=\/|$)/, '')
  return p || '/'
}

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err.error || res.statusText
    throw new Error(message)
  }
  return res.json()
}

const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  get: (path) =>
    fetch(`${BASE_URL}${normalizePath(path)}`, {
      headers: { ...authHeaders() }
    }).then(handleResponse),

  post: (path, body) =>
    fetch(`${BASE_URL}${normalizePath(path)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body)
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${BASE_URL}${normalizePath(path)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body)
    }).then(handleResponse),

  del: (path) =>
    fetch(`${BASE_URL}${normalizePath(path)}`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    }).then(handleResponse)
}

export default api
