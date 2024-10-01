// src/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const redis = require('redis');
const { promisify } = require('util');

// Redis Client Setup
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

// Promisify Redis methods for async/await
const GET_ASYNC = promisify(redisClient.get).bind(redisClient);
const SETEX_ASYNC = promisify(redisClient.setex).bind(redisClient);
const DEL_ASYNC = promisify(redisClient.del).bind(redisClient);

// Helper function to generate cache key
const getCacheKey = (id) => `product:${id}`;

// CREATE a new product
router.post('/', async (req, res) => {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || stock == null) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newProduct = new Product({ name, description, price, stock });
        const savedProduct = await newProduct.save();

        // Optionally, cache the new product
        await SETEX_ASYNC(getCacheKey(savedProduct._id), 3600, JSON.stringify(savedProduct));

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('❌ Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ a product by ID with caching
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = getCacheKey(id);

    try {
        // Check Redis cache first
        const cachedProduct = await GET_ASYNC(cacheKey);
        if (cachedProduct) {
            console.log('✅ Serving from Redis cache');
            return res.status(200).json(JSON.parse(cachedProduct));
        }

        // If not in cache, query MongoDB
        const product = await Product.findById(id).exec();
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Store the result in Redis with an expiration time (e.g., 1 hour)
        await SETEX_ASYNC(cacheKey, 3600, JSON.stringify(product));

        console.log('🟡 Serving from MongoDB and caching to Redis');
        res.status(200).json(product);
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE a product by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    if (!name && !description && !price && stock == null) {
        return res.status(400).json({ error: 'At least one field must be provided for update.' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: { name, description, price, stock } },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Update cache
        const cacheKey = getCacheKey(id);
        await SETEX_ASYNC(cacheKey, 3600, JSON.stringify(updatedProduct));

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('❌ Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Remove from cache
        const cacheKey = getCacheKey(id);
        await DEL_ASYNC(cacheKey);

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ all products (with optional caching)
router.get('/', async (req, res) => {
    const cacheKey = 'products:all';

    try {
        // Check Redis cache first
        const cachedProducts = await GET_ASYNC(cacheKey);
        if (cachedProducts) {
            console.log('✅ Serving all products from Redis cache');
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        // If not in cache, query MongoDB
        const products = await Product.find().exec();
        if (!products.length) {
            return res.status(404).json({ error: 'No products found.' });
        }

        // Store the result in Redis with an expiration time (e.g., 10 minutes)
        await SETEX_ASYNC(cacheKey, 600, JSON.stringify(products));

        console.log('🟡 Serving all products from MongoDB and caching to Redis');
        res.status(200).json(products);
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
