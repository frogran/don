import 'dotenv/config';
import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
    console.error('REDIS_URL not found in environment variables');
    process.exit(1);
}

const redis = new Redis(process.env.REDIS_URL);

async function checkRedis() {
    try {
        console.log('Checking Redis...');
        const currentAmount = await redis.get('raised');
        console.log('Current raised amount:', currentAmount || 'not set');
        
        // Initialize if not set
        if (!currentAmount) {
            await redis.set('raised', '0');
            console.log('Initialized raised amount to 0');
        }
    } catch (error) {
        console.error('Redis error:', error);
    } finally {
        redis.quit();
        process.exit(0);
    }
}

checkRedis();
