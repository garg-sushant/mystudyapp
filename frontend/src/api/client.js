const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
console.log('🔥 ACTUAL BASE_URL:', BASE_URL)

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
    fetch(`${BASE_URL}${path}`, {
      headers: { ...authHeaders() }
    }).then(handleResponse),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body)
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body)
    }).then(handleResponse),

  del: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    }).then(handleResponse)
}

export default api
