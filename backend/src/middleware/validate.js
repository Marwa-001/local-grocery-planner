function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }
    req[source] = result.data; // sanitized data
    next();
  };
}
module.exports = validate;