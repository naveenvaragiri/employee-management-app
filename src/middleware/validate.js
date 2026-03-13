'use strict';

const REQUIRED_FIELDS = ['name', 'phoneNumber', 'emailId', 'role', 'hireDate', 'department'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateEmployee(req, res, next) {
  const body = req.body;
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  if (!EMAIL_RE.test(body.emailId)) {
    errors.push('emailId must be a valid email address');
  }

  if (!PHONE_RE.test(body.phoneNumber)) {
    errors.push('phoneNumber must be a valid phone number');
  }

  if (!DATE_RE.test(body.hireDate) || isNaN(Date.parse(body.hireDate))) {
    errors.push('hireDate must be in YYYY-MM-DD format');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateEmployee };
