// update-amount.js
import 'dotenv/config';
import Redis from 'ioredis';
import readline from 'readline';

if (!process.env.REDIS_URL) {
    console.error('REDIS_URL not found in environment variables');
    process.exit(1);
}

const redis = new Redis(process.env.REDIS_URL);

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function updateAmount() {
    try {
        // Get current amount
        const currentAmount = await redis.get('raised');
        console.log(`Current amount: $${currentAmount || '0'}`);

        // Prompt for new amount
        rl.question('Enter new amount (numbers only, no commas or dollar signs): ', async (answer) => {
            const newAmount = parseInt(answer);
            
            if (isNaN(newAmount)) {
                console.error('Invalid amount entered');
                redis.quit();
                rl.close();
                return;
            }

            try {
                await redis.set('raised', newAmount.toString());
                console.log(`Successfully updated amount to: $${newAmount.toLocaleString()}`);
            } catch (error) {
                console.error('Error updating amount:', error);
            }

            redis.quit();
            rl.close();
        });
    } catch (error) {
        console.error('Redis error:', error);
        redis.quit();
        rl.close();
    }
}

updateAmount();
