const crypto = require('crypto');

function generateSlug() {
  return crypto.randomBytes(3).toString('hex');
}

module.exports = generateSlug;
