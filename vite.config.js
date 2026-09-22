import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    proxy: {
      // Any frontend fetch("/reports/...") gets forwarded to the Express
      // backend running on port 3001, so the browser never has to know
      // it's actually a different server.
      "/reports": "http://localhost:3001",
    },
  },
=======
>>>>>>> 9bba6ce77c3726aafab437b3e35756faa296f174
})
