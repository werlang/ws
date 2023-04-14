const redis = require('redis');
const redisClient = redis.createClient({ url: 'redis://redis' });

const counter = {
    connected: false,

    connect: async function() {
        await redisClient.connect();
        this.connected = true;
    },

    count: async function() {
        if (!this.connected) {
            await this.connect();
        }

        const value = await redisClient.get('counter');
        if (!value) {
            await redisClient.set('counter', 1);
            return 1;
        }

        const newValue = parseInt(value) + 1;
        await redisClient.set('counter', newValue);
        return newValue;
    },

    reset: async function() {
        await redisClient.set('counter', 0);
    },

    get: async function() {
        const value = await redisClient.get('counter');
        return value;
    },
}

setInterval(async () => {
    const value = await counter.count();
    console.log(value);
}, 1000);



