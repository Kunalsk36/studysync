/**
 * Catches requests to undefined routes. Matches the standard response
 * envelope defined in 05-API.md §5.
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
}

module.exports = notFound;
