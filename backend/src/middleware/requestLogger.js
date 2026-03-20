export const requestLogger = (req, _res, next) => {
  const user = req.user?.id || 'public'
  const msg = `[req] ${req.method} ${req.originalUrl} user:${user}`

  if (process.env.NODE_ENV !== 'production') {
    console.log(msg) // ✅ avoid noisy logs in production
  }

  next()
}