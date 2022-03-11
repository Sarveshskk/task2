const { body, validationResult } = require('express-validator')
const loginValidateRules = () => {
  return [
    body("username").not().isEmpty().withMessage('username must have value'),
    body("password").not().isEmpty().withMessage("password must have value"),
  ]
}

const loginValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  loginValidateRules,
  loginValidate,
}