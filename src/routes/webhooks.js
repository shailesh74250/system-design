const axios = require("axios");
const express = require("express");
const Event = require("../models/event");
const router = express.Router();

const calendlyAPI = axios.create({
  baseURL: "https://api.calendly.com",
  headers: {
    Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Register webhook
router.post("/register", async (req, res) => {
  try {
    const webhookURL = `${process.env.WEBHOOK_BASE_URL}/event`;
    const response = await calendlyAPI.post("/webhook_subscriptions", {
      url: webhookURL,
      events: ["invitee.created", "invitee.canceled"],
    });
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Handle webhook events
router.post("/event", async (req, res) => {
  const { event, payload } = req.body;

  if (event === "invitee.created") {
    const newEvent = payload.event;
    await Event.create(newEvent); // Save to DB
    console.log("New meeting created:", newEvent);
  } else if (event === "invitee.canceled") {
    const canceledEventId = payload.event.uuid;
    await Event.deleteOne({ uuid: canceledEventId }); // Remove from DB
    console.log("Meeting canceled:", canceledEventId);
  }

  res.status(200).send("Webhook event processed.");
});

module.exports = router;
