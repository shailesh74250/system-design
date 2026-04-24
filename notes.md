# Clustering
-  PM2 (recommended for production)
-  PM2 handles clustering, restarts, monitoring, and zero-downtime reloads out of the box — without changing a single line of your app code.

```
npm install -g pm2

# Spawn one process per CPU core automatically
pm2 start app.js -i max

# Or specify count manually
pm2 start app.js -i 4
```
```
// ecosystem.config.js — commit this to your repo
module.exports = {
  apps: [{
    name: "my-api",
    script: "app.js",
    instances: "max",      // uses all CPU cores
    exec_mode: "cluster",  // required for load balancing
    watch: false,
    max_memory_restart: "500M",  // restart if memory leaks
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
```

```
pm2 start ecosystem.config.js --env production

pm2 reload my-api   # zero-downtime restart
pm2 monit           # live CPU + memory per worker
pm2 logs            # aggregated logs across all workers
```

## One critical thing to watch — shared state
- When you cluster, each worker is a separate process with its own memory. This breaks anything stored in-memory:

```
// ❌ Breaks with clustering — each worker has its own map
const sessions = new Map();
app.post("/login", (req, res) => {
  sessions.set(req.body.userId, token); // only in THIS worker
});

// ✅ Fix — move shared state to Redis
const redis = require("ioredis");
const client = new redis();

app.post("/login", async (req, res) => {
  await client.set(req.body.userId, token, "EX", 3600);
});
```
- Same applies to: in-memory caches, rate limiters, WebSocket rooms, cron jobs (run on only one worker using a lock).

## The right order 
- Add PM2 with instances: "max" — immediate win, no code changes
- Move any shared state to Redis
- Profile with pm2 monit — see if all cores are actually being used
- Only after this saturates, then go horizontal (multiple machines behind a load balancer like Nginx or AWS ALB)

-- PM2 alone can often give you near-linear throughput gains — a 8-core machine can handle roughly 8x the requests of a single-threaded process for CPU-bound work.

## Detect environment and conditionally cluster
- On local should not use clustering

```
// app.js — your express app, untouched
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello"));

module.exports = app; // export instead of listen here
```
```
// server.js — entry point
const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
- Then in ecosystem.config.js for PM2:
```
module.exports = {
  apps: [{
    name: "my-api",
    script: "server.js",
    instances: process.env.NODE_ENV === "production" ? "max" : 1,
    exec_mode: process.env.NODE_ENV === "production" ? "cluster" : "fork",
  }]
};
```

```
node server.js        # so on local we run like this
```

```
# On production run
pm2 start ecosystem.config.js --env production  # full clustering
```

## Why keeping local simple matters

- Debugging is painful with multiple worker processes — breakpoints, logs, and errors get split across workers
- console.log output gets jumbled from different PIDs
- Hot reload tools like nodemon don't play well with cluster mode
- You don't need the performance locally anyway

- This pattern keeps your actual app code completely clean — no clustering logic bleeds into your routes or middleware. PM2 handles all of it at the process level.

## Developer vs Production commands
- Entry
  - Local (node server.js)
  - Production (pm2 start ecosystem.config.js)
- Workers
  -  Local (1)
  -  Production (max) all cores
- Exec Mode
  - Local (fork)
  - Production (cluster)
- Reload
  - Local (nodemon)
  - Production (pm2 reload) zero downtime
- Logs
  - Local (terminal)
  - Production (pm2 logs)
- Monitoring
  - Local
  - Production (pm2 monit) 
