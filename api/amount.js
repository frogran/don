import Redis from 'ioredis';

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const amount = await redis.get('raised');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ amount: parseInt(amount || '0') });
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).json({ error: 'Failed to fetch amount' });
  }
}