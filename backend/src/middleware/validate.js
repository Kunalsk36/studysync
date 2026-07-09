/**
 * Generic request-body validation middleware — wraps any Joi schema so
 * routes stay declarative (`validate(loginSchema)`) per 05-API.md's
 * standard error envelope.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(422).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    next();
  };
}

module.exports = validate;
