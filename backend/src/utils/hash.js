const bcrypt = require("bcrypt");

// Approved decision: bcrypt, 12 salt rounds.
const SALT_ROUNDS = 12;

function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

module.exports = { hashPassword, comparePassword };
