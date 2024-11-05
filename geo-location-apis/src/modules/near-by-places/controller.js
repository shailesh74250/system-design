// controllers/userController.js
const GOOGLE_API_KEY = 'AIzaSyDbeuYo4lbljyiTl-aQNto-6BUQBttkaV4';
const axios = require('axios');

// Get all users
exports.nearPlaces = async (req, res) => {
  try {
    const address = req.body.address;
    console.log('address', address);
    const coordinates = await getCoordinatesFromAddress(address);
    if (!coordinates) {
        console.log('Could not get coordinates.');
        return;
    }

    const hospitals = await findNearbyHospitals(coordinates.lat, coordinates.lng);
    console.log('Nearby Hospitals:', hospitals);
    res.json({ hospitals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 1: Convert address to latitude and longitude
async function getCoordinatesFromAddress(address) {
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(geocodeUrl);
        console.log('response', response);
        const location = response.data.results[0].geometry.location;
        return location; // { lat: ..., lng: ... }
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

// Step 2: Find nearby hospitals
async function findNearbyHospitals(lat, lng) {
const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${GOOGLE_API_KEY}`;
    try {
        const response = await axios.get(placesUrl);
        return response.data.results.map(hospital => ({
        name: hospital.name,
        address: hospital.vicinity,
        rating: hospital.rating,
        userRatingsTotal: hospital.user_ratings_total
        }));
    } catch (error) {
        console.error('Error finding hospitals:', error);
        return [];
    }
}
