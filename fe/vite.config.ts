import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: Number(env.WEB_SERVER_PORT) || 5173,
    },
    preview: {
      port: Number(env.WEB_SERVER_PORT) || 5173,
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      __APP_SERVER_URL__: JSON.stringify(env.APP_SERVER_URL),
    },
  }
})