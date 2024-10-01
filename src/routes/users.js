// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const redis = require('redis');

// Redis Client Setup for Redis v4
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    }
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
    } catch (err) {
        console.error('❌ Redis connection error:', err);
    }
})();

// Helper function to generate cache key
const getCacheKey = (email) => `user:${email}`;

// CREATE a new user
router.post('/', async (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || age == null) {
        return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        const newUser = new User({ name, email, age });
        const savedUser = await newUser.save();

        // Cache the new user in Redis with a TTL of 1 hour (3600 seconds)
        await redisClient.setEx(getCacheKey(email), 3600, JSON.stringify(savedUser));

        res.status(201).json(savedUser);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ a user by email with caching
router.get('/:email', async (req, res) => {
    const { email } = req.params;
    const cacheKey = getCacheKey(email);

    try {
        // Attempt to retrieve the user from Redis
        const cachedUser = await redisClient.get(cacheKey);
        if (cachedUser) {
            console.log('✅ Serving from Redis cache');
            return res.status(200).json(JSON.parse(cachedUser));
        }

        // If not in cache, fetch from MongoDB
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Cache the user in Redis with a TTL of 1 hour
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));

        console.log('🟡 Serving from MongoDB and caching to Redis');
        res.status(200).json(user);
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE a user by email
router.put('/:email', async (req, res) => {
    const { email } = req.params;
    const { name, age } = req.body;

    if (!name && !age) {
        return res.status(400).json({ error: 'At least one of name or age must be provided.' });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { name, age } },
            { new: true }
        ).exec();

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update the cache in Redis
        await redisClient.setEx(getCacheKey(email), 3600, JSON.stringify(updatedUser));

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a user by email
router.delete('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const deletedUser = await User.findOneAndDelete({ email }).exec();
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Remove the user from Redis cache
        await redisClient.del(getCacheKey(email));

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
