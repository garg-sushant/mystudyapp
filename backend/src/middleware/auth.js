import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    // ❗ FIX: never fallback to hardcoded secret in production
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { id: decoded.id }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' }) // ✅ improved message
  }
}