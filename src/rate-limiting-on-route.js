const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3000;

// Rate limiter for the /login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 10, // Allow 10 login attempts
  message: "Too many login attempts. Try again after 15 minutes.",
});

// Apply to the /login route only
app.post("/login", loginLimiter, (req, res) => {
  res.send("Login endpoint");
});

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
