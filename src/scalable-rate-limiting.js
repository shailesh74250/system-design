// Rate Limiting with Redis for Scalability
// For distributed systems or multiple servers, use Redis as a backend to store rate limit data.
const express = require("express");
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");

const app = express();
const PORT = 3000;

// Redis client
const redisClient = new Redis();

// Configure rate limiter with Redis store
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests
  message: "Too many requests, please try again later.",
});

// Apply rate limiter
app.use(limiter);

// Example route
app.get("/", (req, res) => {
  res.send("Rate-limited API with Redis backend.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
