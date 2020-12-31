import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = redis.createClient(process.env.REDIS_URL);

export default redisClient;
