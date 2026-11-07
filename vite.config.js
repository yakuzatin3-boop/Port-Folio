import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import contactHandler from './api/contact.js'

function localContactApi(env) {
  const middleware = async (req, res) => {
    if (!process.env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_BOT_TOKEN) {
      process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN
    }
    if (!process.env.TELEGRAM_CHAT_ID && env.TELEGRAM_CHAT_ID) {
      process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID
    }

    res.status = (code) => {
      res.statusCode = code
      return res
    }
    res.json = (payload) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(payload))
      return res
    }

    try {
      await contactHandler(req, res)
    } catch (error) {
      console.error('Local contact API failed', error)
      if (!res.writableEnded) res.status(500).json({ error: 'Contact form failed' })
    }
  }

  return {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/contact', middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [tailwindcss(), react(), localContactApi(env)],
  }
})
