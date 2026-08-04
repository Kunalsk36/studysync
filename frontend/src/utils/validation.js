/**
 * Maps raw backend validation errors into friendly messages and 
 * groups them by field name for UI consumption.
 * 
 * Expected input format from api.js:
 * errors = [
 *   { field: "title", message: "\"title\" is required" },
 *   { field: "priority", message: "\"priority\" must be one of [low, medium, high]" }
 * ]
 */
export function mapValidationErrors(errors = []) {
  const fieldErrors = {};

  for (const err of errors) {
    const field = err.field || err.path?.[0] || 'general';
    let msg = err.message || "Invalid input.";

    // Simplify quotes
    msg = msg.replace(/"/g, '');

    // Friendly mapping
    if (msg.includes('is required') || msg.includes('is not allowed to be empty')) {
      msg = `Please enter a ${field}.`;
    } else if (msg.includes('must be one of')) {
      msg = `Please select a valid ${field}.`;
    } else if (msg.includes('must be a valid email')) {
      msg = "Please enter a valid email address.";
    } else if (msg.includes('length must be at least')) {
      msg = `Must be at least ${msg.match(/\d+/)[0]} characters.`;
    }

    // Capitalize first letter
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);

    fieldErrors[field] = msg;
  }

  return fieldErrors;
}
