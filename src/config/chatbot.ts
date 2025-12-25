/**
 * Chatbot backend configuration
 * 
 * This endpoint points to a Cloudflare Worker that securely handles
 * API calls to Groq. The API key is stored server-side and never
 * exposed to the client.
 */
export const CHATBOT_BACKEND_URL = 
  import.meta.env.VITE_CHATBOT_BACKEND_URL || 
  'https://groq-chat-worker.groq-chat-worker.workers.dev';

