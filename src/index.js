// Import Express
const express = require('express');
const imageRoutes = require('./route');

// Initialize the app
const app = express();

// Define the port
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// A simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/image', imageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});