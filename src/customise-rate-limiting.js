const rateLimit = require("express-rate-limit");

// Dynamic rate limiter
const dynamicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: (req) => (req.user && req.user.role === "admin" ? 100 : 10), // Admins get higher limits
  message: "Too many requests, slow down.",
});

app.use(dynamicLimiter);
