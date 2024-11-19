// controllers/userController.js
const GOOGLE_API_KEY = 'AIzaSyDbeuYo4lbljyiTl-aQNto-6BUQBttkaV4';
const axios = require('axios');
const GEOCODEURL = 'https://maps.googleapis.com/maps/api/geocode/json';
const PLACEURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Get all users
exports.nearPlaces = async (req, res) => {
  try {
    const {address, place} = req.body;
    const coordinates = await getCoordinatesFromAddress(address);
    if (!coordinates) {
      console.log('Could not get coordinates.');
      return;
    }
    const data = await findNearbyHospitals(coordinates.lat, coordinates.lng, place);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 1: Convert address to latitude and longitude
async function getCoordinatesFromAddress(address) {
const geocodeUrl = `${GEOCODEURL}?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(geocodeUrl);
    const location = response.data.results[0].geometry.location;
    return location; // { lat: ..., lng: ... }
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

// Step 2: Find nearby hospitals
async function findNearbyHospitals(lat, lng, place) {
const placesUrl = `${PLACEURL}?location=${lat},${lng}&radius=5000&type=${place}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(placesUrl);
    return response.data.results.map(item => ({
      name: item.name,
      address: item.vicinity,
      rating: item.rating,
      userRatingsTotal: item.user_ratings_total
    }));
  } catch (error) {
    console.error('Error finding hospitals:', error);
    return [];
  }
}
