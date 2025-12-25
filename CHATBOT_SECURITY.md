# Chatbot Security Architecture

## Overview

The portfolio chatbot uses a **secure backend architecture** to protect API keys and ensure production-ready security. This document explains the architecture and deployment process.

## Why a Backend Worker?

### The Problem
- **GitHub Pages** is a static hosting service that cannot store secrets
- Frontend code is publicly visible in the browser
- API keys in frontend code can be extracted by anyone
- Environment variables prefixed with `VITE_` are bundled into client code

### The Solution
We use a **Cloudflare Worker** as a secure proxy:
- API keys are stored server-side only
- The worker handles all communication with Groq's API
- The frontend only communicates with our secure backend
- No secrets are ever exposed to the client

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Browser   │────────▶│ Cloudflare Worker│────────▶│  Groq API   │
│  (Frontend) │  POST   │  (Backend Proxy) │  POST   │             │
└─────────────┘         └──────────────────┘         └─────────────┘
     No API Key              API Key Stored              API Key Used
     Exposed                 Server-Side Only             Securely
```

## Security Guarantees

✅ **API keys never appear in:**
- Frontend source code
- Built JavaScript bundles (`dist/`)
- Git repository history
- Browser developer tools
- Network requests from the browser

✅ **API keys are only:**
- Stored in Cloudflare's secure secret storage
- Accessed server-side in the Worker
- Never transmitted to the client

## Deployment

### 1. Deploy Cloudflare Worker

```bash
cd cloudflare-worker
npm install
wrangler secret put GROQ_API_KEY
# When prompted, paste your Groq API key
npm run deploy
```

After deployment, note your worker URL (e.g., `https://groq-chat-worker.<your-subdomain>.workers.dev`)

### 2. Configure Frontend

The frontend automatically uses the backend URL from `src/config/chatbot.ts`. 

To use a custom URL, set the environment variable:
```bash
VITE_CHATBOT_BACKEND_URL=https://your-worker.workers.dev
```

### 3. Verify Deployment

1. Visit your portfolio site
2. Open the chatbot
3. Send a test message
4. Verify the response comes from the backend

## Local Development

For local development, you can either:

**Option A:** Use the deployed worker (recommended)
- No local setup needed
- Uses production backend

**Option B:** Run worker locally
```bash
cd cloudflare-worker
npm run dev
# Update src/config/chatbot.ts to point to localhost:8787
```

## Files Changed

### Frontend Changes
- `src/components/Chatbot.tsx` - Removed direct Groq API calls
- `src/components/FloatingChatbot.tsx` - Removed direct Groq API calls
- `src/config/chatbot.ts` - Added backend URL configuration

### Backend (New)
- `cloudflare-worker/src/index.ts` - Worker implementation
- `cloudflare-worker/wrangler.toml` - Worker configuration
- `cloudflare-worker/package.json` - Dependencies
- `cloudflare-worker/README.md` - Worker setup instructions

## Verification Checklist

- [ ] No `gsk_` patterns in frontend code
- [ ] No `VITE_GROQ_API_KEY` references in components
- [ ] `.env` file is in `.gitignore`
- [ ] Worker deployed and accessible
- [ ] Chatbot works in production
- [ ] Network tab shows requests to worker, not Groq directly

## For Recruiters/Reviewers

This implementation demonstrates:
- **Security best practices** - Never exposing secrets to clients
- **Production-ready architecture** - Using server-side proxies for API calls
- **Modern deployment** - Cloudflare Workers for edge computing
- **Clean separation** - Frontend and backend concerns properly separated

The chatbot functionality is identical to users, but the implementation follows industry-standard security practices for handling third-party API keys.

