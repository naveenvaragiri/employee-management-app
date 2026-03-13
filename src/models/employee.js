'use strict';

const { randomUUID } = require('crypto');

const employees = [];

function findAll() {
  return [...employees];
}

function findById(id) {
  return employees.find((e) => e.id === id) || null;
}

function create(data) {
  const employee = {
    id: randomUUID(),
    name: data.name,
    phoneNumber: data.phoneNumber,
    emailId: data.emailId,
    role: data.role,
    hireDate: data.hireDate,
    department: data.department,
  };
  employees.push(employee);
  return employee;
}

function update(id, data) {
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...data, id };
  return employees[index];
}

function remove(id) {
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return false;
  employees.splice(index, 1);
  return true;
}

function clear() {
  employees.length = 0;
}

module.exports = { findAll, findById, create, update, remove, clear };
