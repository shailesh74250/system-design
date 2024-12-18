// This file sets up the clustering logic and uses app.js to handle requests.
const cluster = require("cluster");
const os = require("os");
const app = require("./app");

// Get the number of available CPU cores
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  // Master process
  console.log(`Master process is running on PID: ${process.pid}`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork a worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit and respawn
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Starting a new worker...`);
    cluster.fork();
  });
} else {
  // Worker process
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${PORT}`);
  });
}
