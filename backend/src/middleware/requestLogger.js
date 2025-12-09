export const requestLogger = (req, _res, next) => {
  const user = req.user?.id || 'public'
  const msg = `[req] ${req.method} ${req.originalUrl} user:${user}`
  console.log(msg)
  next()
}




