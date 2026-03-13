'use strict';

const { Router } = require('express');
const employeeModel = require('../models/employee');
const { validateEmployee } = require('../middleware/validate');

const router = Router();

/**
 * GET /api/employees
 * Retrieve all employees
 */
router.get('/', (req, res) => {
  const employees = employeeModel.findAll();
  res.json(employees);
});

/**
 * GET /api/employees/:id
 * Retrieve a single employee by ID
 */
router.get('/:id', (req, res) => {
  const employee = employeeModel.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(employee);
});

/**
 * POST /api/employees
 * Create a new employee
 */
router.post('/', validateEmployee, (req, res) => {
  const { name, phoneNumber, emailId, role, hireDate, department } = req.body;
  const employee = employeeModel.create({ name, phoneNumber, emailId, role, hireDate, department });
  res.status(201).json(employee);
});

/**
 * PUT /api/employees/:id
 * Update an existing employee
 */
router.put('/:id', validateEmployee, (req, res) => {
  const { name, phoneNumber, emailId, role, hireDate, department } = req.body;
  const employee = employeeModel.update(req.params.id, {
    name,
    phoneNumber,
    emailId,
    role,
    hireDate,
    department,
  });
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(employee);
});

/**
 * DELETE /api/employees/:id
 * Delete an employee
 */
router.delete('/:id', (req, res) => {
  const deleted = employeeModel.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.status(204).send();
});

module.exports = router;
