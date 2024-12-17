const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3000;

// Define the rate limit configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Send rate limit info in the response headers
});

// Apply the rate limiter to all requests
app.use(limiter);

// Test route
app.get("/", (req, res) => {
  res.send("This is a rate-limited endpoint.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


/*

windowMs: Sets the time window for rate limiting (e.g., 1 minute).
max: The maximum number of requests allowed within the time window.
message: Custom message sent when the rate limit is exceeded.
headers: Includes rate limit details (e.g., remaining requests, reset time) in the response headers.

*/