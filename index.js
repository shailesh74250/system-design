require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse json
app.use(express.json());

// mongodb connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// routes 
app.use('/users', userRoutes);


// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});