import AppError from '../errors/AppError.js'

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const firstIssue = result.error.issues[0]
    const errorMessage = `${firstIssue.message}`

    throw new AppError(errorMessage, 400)
  }

  req.body = result.data
  next()
}
