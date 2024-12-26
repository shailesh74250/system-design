if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      console.error("Error retrieving location:", error);
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}


/** Explanation:
  navigator.geolocation.getCurrentPosition prompts the user for permission and returns the current position if granted.
  Latitude and Longitude values are retrieved from the coords property of the position object.

**/

/**
 * Limitations:
  Requires the user to allow location access.
  Only available on secure (HTTPS) pages.
  Using this, you can integrate location-based features, like finding nearby points of interest or adjusting app data based on the user’s region.
 */