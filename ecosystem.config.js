module.exports = {
  apps: [
    {
      name: "astrology-landing-page",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        AUTH_BASE_URL: "https://api.astroweb.in",
        NEXT_PUBLIC_AUTH_BASE_URL: "https://api.astroweb.in",
        ENCRYPTION_KEY:
          "c7af521da604493dd6d2f2cc343a8d1fcdfb43223533d0cf16a2fb9a7e8de965",
        ALGORITHM: "aes-256-cbc",
      },
    },
  ],
};
