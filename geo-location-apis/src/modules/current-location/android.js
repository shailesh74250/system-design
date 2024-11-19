/**
 * To get the current position on an Android device, you can use JavaScript with the Geolocation API in a web app, or use native code if you’re building a mobile app in Android Studio with Kotlin/Java or React Native.
 */

// Using JavaScript in a Web App (e.g., React Native WebView or a Mobile Web Browser):

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
            console.error("Error retrieving location:", error);
        },
        { enableHighAccuracy: true }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}

// enableHighAccuracy helps get more precise data from the GPS sensor on the device.

// Using Native Android Code (Kotlin):
// If you are developing a native Android app, you can use Kotlin and the Android LocationManager or FusedLocationProviderClient (recommended) to access the GPS.
/* 
import android.location.Location
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

class MainActivity : AppCompatActivity() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        fusedLocationClient.lastLocation
            .addOnSuccessListener { location: Location? ->
                location?.let {
                    val latitude = location.latitude
                    val longitude = location.longitude
                    println("Latitude: $latitude, Longitude: $longitude")
                }
            }
            .addOnFailureListener {
                println("Failed to get location")
            }
    }
}
*/

// Using React Native (JavaScript)
// For React Native, the @react-native-community/geolocation package or the expo-location module can be used.
import * as Location from 'expo-location';

async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log("Permission to access location was denied");
        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("Latitude:", location.coords.latitude, "Longitude:", location.coords.longitude);
}

// Each approach is well-suited for different types of Android apps, whether they are native Android, hybrid (React Native), or a mobile web application.
