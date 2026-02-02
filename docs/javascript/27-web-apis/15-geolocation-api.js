/**
 * WEB APIS: 15 - Geolocation API
 *
 * ONE CONCEPT: Get user's geographic location
 */


// =============================================================================
// GEOLOCATION API
// =============================================================================

console.log('=== Geolocation API ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  KEY POINTS                                                         │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  • Requires HTTPS (security)                                        │
 *   │  • Requires USER PERMISSION                                         │
 *   │  • Can get one-time position or watch continuously                  │
 *   │  • Returns latitude, longitude, accuracy                            │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const geolocationCode = `
// ═══════════════════════════════════════════════════════════════════════
// GET CURRENT POSITION (One-time)
// ═══════════════════════════════════════════════════════════════════════

navigator.geolocation.getCurrentPosition(
  // Success callback
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
    console.log('Accuracy:', position.coords.accuracy, 'meters');
    console.log('Altitude:', position.coords.altitude);  // May be null
    console.log('Speed:', position.coords.speed);        // May be null
  },
  // Error callback
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied location access');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location unavailable');
        break;
      case error.TIMEOUT:
        console.log('Request timed out');
        break;
    }
  },
  // Options
  {
    enableHighAccuracy: true,  // Use GPS if available
    timeout: 10000,            // Max wait time (ms)
    maximumAge: 60000          // Cache position for 1 minute
  }
);


// ═══════════════════════════════════════════════════════════════════════
// WATCH POSITION (Continuous tracking)
// ═══════════════════════════════════════════════════════════════════════

const watchId = navigator.geolocation.watchPosition(
  (position) => {
    updateMap(position.coords.latitude, position.coords.longitude);
  },
  (error) => console.error(error),
  { enableHighAccuracy: true }
);

// Stop watching
navigator.geolocation.clearWatch(watchId);


// ═══════════════════════════════════════════════════════════════════════
// REAL-WORLD: Find Nearby Stores
// ═══════════════════════════════════════════════════════════════════════

async function findNearbyStores() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Send to API
        const response = await fetch(
          \`/api/stores?lat=\${latitude}&lng=\${longitude}&radius=10\`
        );
        const stores = await response.json();

        resolve(stores);
      },
      (error) => reject(error),
      { timeout: 10000 }
    );
  });
}

// Usage
try {
  const stores = await findNearbyStores();
  displayStoreList(stores);
} catch (error) {
  showMessage('Could not get your location. Please enter your address.');
}


// ═══════════════════════════════════════════════════════════════════════
// CALCULATE DISTANCE BETWEEN TWO POINTS
// ═══════════════════════════════════════════════════════════════════════

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
`;

console.log(geolocationCode);


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The Geolocation API lets you get the user's location. It requires HTTPS
 * and user permission. You call getCurrentPosition for a one-time request
 * or watchPosition for continuous tracking. The callback receives
 * coordinates with latitude, longitude, and accuracy. I use it for
 * features like 'find nearby stores' or delivery apps. Always handle
 * errors gracefully - the user might deny permission or be in an area
 * with no signal."
 */


// RUN: node docs/27-web-apis/15-geolocation-api.js
