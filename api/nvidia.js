// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) { rateLimitMap.set(ip, { count: 1, windowStart: now }); return true; }
  if (now - record.windowStart > RATE_LIMIT_WINDOW) { rateLimitMap.set(ip, { count: 1, windowStart: now }); return true; }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

const ALLOWED_ORIGINS = [
  'https://campus-calories.vercel.app',
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5173',
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.github.io'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow non-browser requests (like curl/postman during dev) but restrict in prod if preferred
    // res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute before trying again.' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    
    // Prefer server-side environment variable for highest security. Fallback to client-provided key.
    const apiKey = process.env.NVIDIA_API_KEY ? `Bearer ${process.env.NVIDIA_API_KEY}` : authHeader;

    if (!apiKey) {
      return res.status(401).json({ error: 'Missing Nvidia API Key' });
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA Response Error:', response.status, errorText);
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('NVIDIA Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
