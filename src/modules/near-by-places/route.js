// routes/userRoutes.js
const express = require('express');
const userController = require('./controller');

const router = express.Router();

router.post('/', userController.nearPlaces);

module.exports = router;
