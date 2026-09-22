// server/config.js
//
// Connection settings for your local MySQL (the one bundled inside XAMPP).
// These defaults match a totally default, freshly-installed XAMPP: MySQL
// running on port 3306, username "root", no password.
//
// If your XAMPP setup is different (you set a root password, changed the
// port, etc.), either edit the values below directly, or set them as
// environment variables before starting the server — env vars always win.
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "shieldbox",
};
