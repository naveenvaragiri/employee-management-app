'use strict';

const express = require('express');
const employeesRouter = require('./routes/employees');

function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/employees', employeesRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}

module.exports = { createApp };
