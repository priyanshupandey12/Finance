const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const errors = err.issues
      ?.map((i) => `${i.path[0]}: ${i.message}`)
      .join(", ");

    return res.status(400).json({ error: errors });
  }
};

module.exports = { validate };