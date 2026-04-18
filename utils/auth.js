function ensureAdmin(req, res, next) {
  if (req.session.role === 'admin') {
    return next();
  }
  res.redirect('/admin/login');
}

function ensureAgent(req, res, next) {
  if (req.session.role === 'agent') {
    return next();
  }
  res.redirect('/agent/login');
}

module.exports = { ensureAdmin, ensureAgent };
