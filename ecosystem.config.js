// ecosystem.config.js — single file for all environments
module.exports = {
  apps: [{
    name: "my-api",
    script: "server.js",
    instances: 1,
    exec_mode: "fork",

    // env block = default (local)
    env: {
      NODE_ENV: "development",
      PORT: 3000,
    },

    // activated with --env staging
    env_staging: {
      NODE_ENV: "staging",
      PORT: 3000,
      instances: 2,
      exec_mode: "cluster",
    },

    // activated with --env production
    env_production: {
      NODE_ENV: "production",
      PORT: 8080,
      instances: "max",
      exec_mode: "cluster",
    }
  }]
};

/*
pm2 start ecosystem.config.js                  # local
pm2 start ecosystem.config.js --env staging    # staging
pm2 start ecosystem.config.js --env production # production
*/
