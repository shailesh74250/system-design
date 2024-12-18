// This file contains the main Express application logic.

const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send(`Hello from Worker ${process.pid}`);
});

// Simulate a CPU-intensive task
app.get("/heavy", (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 5000); // Simulates a 5-second delay
  res.send(`Heavy computation done by Worker ${process.pid}`);
});

module.exports = app;
