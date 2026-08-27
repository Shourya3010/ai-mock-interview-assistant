const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;
    next();
  } catch (error) {
    const issueMessages = error.errors
      ? error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      : error.message;

    return res.status(400).json({
      success: false,
      message: `Validation Error: ${issueMessages}`
    });
  }
};

module.exports = validate;
