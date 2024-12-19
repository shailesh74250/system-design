const axios = require("axios");
const express = require("express");
const Event = require("../models/event");
const router = express.Router();

const CALENDLY_API_BASE = "https://api.calendly.com";
const TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

// Axios instance for API calls
const calendlyAPI = axios.create({
  baseURL: CALENDLY_API_BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Fetch scheduled events
router.get("/events", async (req, res) => {
  try {
    const response = await calendlyAPI.get("/scheduled_events");
    const events = response.data.collection;

    // Save events to the database
    await Event.insertMany(events, { ordered: false });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
