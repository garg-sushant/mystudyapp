const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
// ensure the base URL ends with '/api' but avoid duplicate '/api' when VITE_API_URL already includes it
const cleanedRaw = rawBase.replace(/\/$/, '')
const BASE_URL = /\/api$/i.test(cleanedRaw) ? cleanedRaw : cleanedRaw + '/api'
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
  get: (path) => {
    const url = `${BASE_URL}${normalizePath(path)}`
    console.debug('API GET ->', url)
    return fetch(url, {
      headers: { ...authHeaders() }
    }).then(handleResponse)
  },

  post: (path, body) => {
    const url = `${BASE_URL}${normalizePath(path)}`
    console.debug('API POST ->', url)
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body)
    }).then(handleResponse)
  },

  put: (path, body) => {
    const url = `${BASE_URL}${normalizePath(path)}`
    console.debug('API PUT ->', url)
    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body)
    }).then(handleResponse)
  },

  del: (path) => {
    const url = `${BASE_URL}${normalizePath(path)}`
    console.debug('API DEL ->', url)
    return fetch(url, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    }).then(handleResponse)
  }
}

export default api
