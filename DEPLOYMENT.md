# Chatbot Backend Deployment Guide

## Quick Start

### 1. Deploy Cloudflare Worker

```bash
cd cloudflare-worker
npm install
wrangler secret put GROQ_API_KEY
# Paste your Groq API key when prompted
npm run deploy
```

After deployment, you'll see a URL like:
```
https://groq-chat-worker.<your-subdomain>.workers.dev
```

### 2. Update Frontend Configuration (if needed)

The default backend URL is already configured in `src/config/chatbot.ts`. If your worker URL differs, update it:

```typescript
export const CHATBOT_BACKEND_URL = 'https://your-worker-url.workers.dev';
```

### 3. Deploy Frontend

The frontend changes are ready. Just push to GitHub:

```bash
git add .
git commit -m "Secure chatbot: use Cloudflare Worker backend"
git push origin main
```

GitHub Actions will automatically build and deploy to GitHub Pages.

## Verification

1. **Check Worker is Live:**
   ```bash
   curl -X POST https://your-worker-url.workers.dev \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"test"}]}'
   ```

2. **Check Frontend:**
   - Visit your GitHub Pages site
   - Open chatbot
   - Send a message
   - Check browser Network tab - should see requests to your worker, not Groq

3. **Security Check:**
   ```bash
   # Should return nothing
   grep -r "gsk_" src/ dist/
   grep -r "api.groq.com" src/
   ```

## Files Changed

### Modified Files
- `src/components/Chatbot.tsx` - Removed direct Groq calls, uses backend
- `src/components/FloatingChatbot.tsx` - Removed direct Groq calls, uses backend

### New Files
- `src/config/chatbot.ts` - Backend URL configuration
- `cloudflare-worker/src/index.ts` - Worker implementation
- `cloudflare-worker/wrangler.toml` - Worker config
- `cloudflare-worker/package.json` - Worker dependencies
- `cloudflare-worker/tsconfig.json` - TypeScript config
- `cloudflare-worker/README.md` - Worker documentation
- `CHATBOT_SECURITY.md` - Security architecture documentation

## Troubleshooting

**Worker returns 500:**
- Check that `GROQ_API_KEY` secret is set: `wrangler secret list`
- Verify API key is valid

**Frontend can't connect:**
- Check worker URL in `src/config/chatbot.ts`
- Verify worker is deployed and accessible
- Check browser console for CORS errors

**Chatbot not responding:**
- Check worker logs: `wrangler tail`
- Verify Groq API is accessible from Cloudflare
- Check request format matches expected schema

