// Import Express
require("dotenv").config();
const express = require('express');
const calendlyRoutes = require("./routes/calendly");
const webhookRoutes = require("./routes/webhooks");
const path = require("path");

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

// // Serve Calendly HTML
// app.get("/schedule", (req, res) => {
//   res.sendFile(path.join(__dirname, "calendly.html"));
// });

// Endpoint to fetch scheduled events
app.get('/api/schedule-events', async (req, res) => {
  try {
    const response = await axios.get('https://api.calendly.com/scheduled_events', {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

app.use("/api/webhooks", webhookRoutes);

// const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});