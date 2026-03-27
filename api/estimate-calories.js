/**
 * Campus Calories - AI Calorie Estimator API
 * Vercel Serverless Function
 * 
 * Accepts: POST { description: string }
 * Returns: { kcal, protein, carbs, fat }
 */

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  
  // Reset window if expired
  if (now - record.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  
  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  // Increment count
  record.count++;
  return true;
}

// Validate and clamp nutrition values
function validateNutrition(data) {
  return {
    kcal: Math.max(150, Math.min(1500, Math.round(data.kcal || 0))),
    protein: Math.max(2, Math.min(120, Math.round((data.protein || 0) * 10) / 10)),
    carbs: Math.max(0, Math.min(300, Math.round(data.carbs || 0))),
    fat: Math.max(0, Math.min(100, Math.round(data.fat || 0)))
  };
}

// Check if values are within reasonable range
function isWithinRange(data) {
  const kcal = data.kcal || 0;
  const protein = data.protein || 0;
  return kcal >= 150 && kcal <= 1500 && protein >= 2 && protein <= 120;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get client IP for rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.socket?.remoteAddress || 
             'unknown';
  
  // Check rate limit
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please wait a minute before trying again.',
      retryAfter: 60
    });
  }
  
  // Parse body
  const { description } = req.body || {};
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: 'Missing or invalid description' });
  }
  
  // Limit description length
  const trimmedDescription = description.trim().slice(0, 500);
  
  // Get API key from environment
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('No AI API key configured');
    return res.status(500).json({ error: 'AI service not configured' });
  }
  
  try {
    let nutrition = null;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount < maxRetries) {
      // Use OpenAI API if available
      if (process.env.OPENAI_API_KEY) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a nutrition expert. Estimate calories and macros for Indian mess food using IFCT/NIN reference values:
- Plain rice: 130 kcal/100g, 2.7g protein
- Roti/chapati: 104 kcal/piece (40g), 3.1g protein
- Toor dal: 102 kcal/100g, 6.8g protein
- Rajma: 144 kcal/100g, 8.7g protein
- Chole: 160 kcal/100g, 8.3g protein
- Paneer dishes: 170-210 kcal/100g, 8-10g protein
- Chicken curry: 165 kcal/100g, 14.6g protein
- Egg curry: 148 kcal/100g, 11.2g protein
- Samosa: 252 kcal/piece

Respond ONLY with a JSON object: {"kcal": number, "protein": number, "carbs": number, "fat": number}
Total meal should be 150-1500 kcal, protein 2-120g. Be realistic for mess portions (typically 150-200g servings).`
              },
              {
                role: 'user',
                content: `Estimate nutrition for: ${trimmedDescription}`
              }
            ],
            temperature: 0.3,
            max_tokens: 100
          })
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        // Parse JSON from response
        const jsonMatch = content.match(/\{[^}]+\}/);
        if (jsonMatch) {
          nutrition = JSON.parse(jsonMatch[0]);
        }
      }
      // Fallback to Anthropic API
      else if (process.env.ANTHROPIC_API_KEY) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            messages: [
              {
                role: 'user',
                content: `Estimate nutrition for Indian mess food: "${trimmedDescription}"

Use IFCT/NIN reference values. Respond ONLY with JSON: {"kcal": number, "protein": number, "carbs": number, "fat": number}
Keep values realistic: 150-1500 kcal, 2-120g protein for typical mess portions.`
              }
            ]
          })
        });
        
        if (!response.ok) {
          throw new Error(`Anthropic API error: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        
        // Parse JSON from response
        const jsonMatch = content.match(/\{[^}]+\}/);
        if (jsonMatch) {
          nutrition = JSON.parse(jsonMatch[0]);
        }
      }
      
      // Check if values are within range
      if (nutrition && isWithinRange(nutrition)) {
        break;
      }
      
      retryCount++;
    }
    
    if (!nutrition) {
      return res.status(500).json({ error: 'Failed to estimate nutrition. Please try again.' });
    }
    
    // Validate and clamp values
    const validatedNutrition = validateNutrition(nutrition);
    
    return res.status(200).json(validatedNutrition);
    
  } catch (error) {
    console.error('AI estimation error:', error);
    return res.status(500).json({ error: 'Failed to estimate nutrition. Please try again.' });
  }
}
