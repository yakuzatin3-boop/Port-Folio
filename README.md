# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Contact form → Telegram

Messages from the contact form are delivered to Telegram through `api/contact.js`
(a Vercel serverless function). Add these environment variables locally in
`.env.local` and in your Vercel project settings:

```bash
TELEGRAM_BOT_TOKEN=123456:your-bot-token
TELEGRAM_CHAT_ID=your-numeric-chat-id
```

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token.
2. Send your bot a message (press Start), then call
   `https://api.telegram.org/bot<TOKEN>/getUpdates` and read `message.chat.id`.
   You can also use [@userinfobot](https://t.me/userinfobot) to get your own ID.
3. Restart `npm run dev`. `vite.config.js` serves the same `/api/contact`
   endpoint locally, so the form works without `vercel dev`.

The token is used only on the server and is never shipped to the browser.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
