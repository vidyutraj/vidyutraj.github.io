# Groq Chat Worker

A Cloudflare Worker that securely proxies requests to Groq's API, keeping API keys server-side.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your Groq API key as a secret:
```bash
wrangler secret put GROQ_API_KEY
```
When prompted, paste your Groq API key (starts with `gsk_`).

3. Deploy the worker:
```bash
npm run deploy
```

## Development

Run locally with:
```bash
npm run dev
```

View logs:
```bash
npm run tail
```

## Environment Variables

- `GROQ_API_KEY`: Your Groq API key (set via `wrangler secret put`)

## API

**Endpoint:** `https://groq-chat-worker.<your-subdomain>.workers.dev`

**Method:** POST

**Request Body:**
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ]
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "Hello! How can I help you?"
      }
    }
  ]
}
```

