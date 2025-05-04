// Map variables
// let map;
// let hazardLayer, shelterLayer, resourceLayer, communityLayer;

// function initMap() {
//     // Initialize the map centered on India
//     map = L.map('map').setView([20.5937, 78.9629], 5);
    
//     // Add OpenStreetMap tiles
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         maxZoom: 18
//     }).addTo(map);

//     // Initialize layer groups
//     hazardLayer = L.layerGroup().addTo(map);
//     shelterLayer = L.layerGroup().addTo(map);
//     resourceLayer = L.layerGroup().addTo(map);
//     communityLayer = L.layerGroup().addTo(map);

//     // Add sample data for Indian cities
//     addIndianCityData();
    
//     // Set up button event listeners
//     setupMapControls();
// }

// function addIndianCityData() {
//     // Delhi Data
//     L.marker([28.6139, 77.2090]).addTo(hazardLayer)
//         .bindPopup("<b>Delhi</b><br>Heatwave Alert")
//         .openPopup();
    
//     // Mumbai Data
//     L.marker([19.0760, 72.8777]).addTo(shelterLayer)
//         .bindPopup("<b>Mumbai</b><br>Emergency Shelter");
    
//     // Bangalore Data
//     L.marker([12.9716, 77.5946]).addTo(resourceLayer)
//         .bindPopup("<b>Bangalore</b><br>Medical Resources");
// }

// function setupMapControls() {
//     document.getElementById('showShelters').addEventListener('click', function() {
//         map.removeLayer(hazardLayer);
//         map.removeLayer(resourceLayer);
//         map.removeLayer(communityLayer);
//         shelterLayer.addTo(map);
//         map.setView([19.0760, 72.8777], 10); // Focus on Mumbai
//     });
    
//     document.getElementById('showHazards').addEventListener('click', function() {
//         map.removeLayer(shelterLayer);
//         map.removeLayer(resourceLayer);
//         map.removeLayer(communityLayer);
//         hazardLayer.addTo(map);
//         map.setView([28.6139, 77.2090], 10); // Focus on Delhi
//     });
    
//     document.getElementById('showResources').addEventListener('click', function() {
//         map.removeLayer(hazardLayer);
//         map.removeLayer(shelterLayer);
//         map.removeLayer(communityLayer);
//         resourceLayer.addTo(map);
//         map.setView([12.9716, 77.5946], 10); // Focus on Bangalore
//     });
    
//     document.getElementById('showCommunity').addEventListener('click', function() {
//         // For demonstration - same as resources
//         map.removeLayer(hazardLayer);
//         map.removeLayer(shelterLayer);
//         map.removeLayer(resourceLayer);
//         communityLayer.addTo(map);
//         map.setView([20.5937, 78.9629], 5); // Back to India view
//     });
// }

// // Initialize the map when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     initMap();
// });


//for news alert api connection
// In your script.js
// News API Configuration
// // Map variables
// fetch('newsupdate.html')
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('newsWidgetContainer').innerHTML += data;
//         })
//         .catch(error => console.error('Error loading news widget:', error));
const API_KEY = '0f0b1a6904ba46caaef35433250405';
const BASE_URL = 'https://api.weatherapi.com/v1';

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        // Get current weather and forecast
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`Error: ${error.message}`);
    }
}

function displayWeather(data) {
    const current = data.current;
    const location = data.location;
    
    // Display current weather
    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    
    const currentWeatherHTML = `
        <img src="${current.condition.icon}" alt="${current.condition.text}">
        <p>${Math.round(current.temp_c)}°C</p>
        <p>${current.condition.text}</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind: ${current.wind_kph} km/h</p>
    `;
    document.getElementById('currentWeather').innerHTML = currentWeatherHTML;
    
    // Display forecast
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastHTML = `
            <div class="forecast-item">
                <p>${weekday}</p>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p>${Math.round(day.day.maxtemp_c)}°/${Math.round(day.day.mintemp_c)}°</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastHTML;
    });
    
    // Show the weather container
    document.getElementById('weatherInfo').style.display = 'block';
}
function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    container.style.display = container.style.display === 'block' ? 'none' : 'block';
  }
  // Configuration
// Configuration
const EMERGENCY_CONTACT = {
    email: "emergency@example.com",
    phone: "+1234567890"
};

// State variables
let pressCount = 0;
let lastPressTime = 0;
let mediaRecorder;
let audioChunks = [];
let map1;  // Changed from 'map' to 'map1'
let locationMarker;
let locationInterval;

// DOM Elements
const panicButton = document.getElementById('panicButton');
const statusText = document.getElementById('statusText');
const mapElement = document.getElementById('map');

// Initialize
function init() {
    panicButton.addEventListener('click', handlePanicButtonPress);
    updateStatus("Ready. Press button 3 times quickly to activate emergency mode.");
}

// Handle panic button press
function handlePanicButtonPress() {
    const currentTime = Date.now();
    
    // Reset count if more than 1 second between presses
    if (currentTime - lastPressTime > 1000) {
        pressCount = 0;
    }
    
    pressCount++;
    lastPressTime = currentTime;
    
    if (pressCount === 3) {
        activateEmergencyMode();
        pressCount = 0; // Reset after activation
    }
}

// Activate emergency mode
async function activateEmergencyMode() {
    panicButton.classList.add('activated');
    updateStatus("EMERGENCY ACTIVATED! Recording audio and sharing location...");
    
    try {
        // Start audio recording
        await startRecording();
        
        // Get and share location
        await shareLocation();
        
        // Simulate sending data to emergency contact
        setTimeout(() => {
            sendEmergencyData();
        }, 5000);
        
    } catch (error) {
        console.error("Emergency activation failed:", error);
        updateStatus(`Error: ${error.message}`);
    }
}

// Start audio recording
async function startRecording() {
    updateStatus("Starting audio recording...");
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            // In a real app, you would send this blob to your server
            console.log("Audio recording complete", audioBlob);
        };
        
        mediaRecorder.start();
        updateStatus("Recording audio... Speak clearly to leave a message.");
        
        // Stop recording after 30 seconds
        setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                updateStatus("Audio recording complete.");
            }
        }, 30000);
        
    } catch (error) {
        throw new Error("Could not access microphone: " + error.message);
    }
}

// Share location
async function shareLocation() {
    updateStatus("Getting your location...");
    
    try {
        // Show map
        mapElement.style.display = 'block';
        if (!map1) {  // Changed from 'map' to 'map1'
            map1 = L.map('map').setView([0, 0], 2);  // Changed from 'map' to 'map1'
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map1);  // Changed from 'map' to 'map1'
        }
        
        // Get initial position
        const position = await getCurrentPosition();
        updateLocationOnMap(position.coords);
        updateStatus(`Location found: ${position.coords.latitude}, ${position.coords.longitude}`);
        
        // Continue updating location every 10 seconds
        locationInterval = setInterval(async () => {
            try {
                const updatedPosition = await getCurrentPosition();
                updateLocationOnMap(updatedPosition.coords);
            } catch (error) {
                console.error("Error updating location:", error);
            }
        }, 10000);
        
    } catch (error) {
        throw new Error("Could not get location: " + error.message);
    }
}

// Get current position with timeout
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

// Update location on map
function updateLocationOnMap(coords) {
    const { latitude, longitude } = coords;
    
    if (locationMarker) {
        map1.removeLayer(locationMarker);  // Changed from 'map' to 'map1'
    }
    
    locationMarker = L.marker([latitude, longitude]).addTo(map1)  // Changed from 'map' to 'map1'
        .bindPopup("Your Location")
        .openPopup();
    
    map1.setView([latitude, longitude], 15);  // Changed from 'map' to 'map1'
}

// Simulate sending emergency data
function sendEmergencyData() {
    updateStatus("Sending emergency data to contacts...");
    
    // In a real implementation, you would:
    // 1. Upload audio recording to a server
    // 2. Send location data
    // 3. Notify emergency contacts via email/SMS
    
    // This is just a simulation
    setTimeout(() => {
        updateStatus(`Emergency data sent to ${EMERGENCY_CONTACT.email} and ${EMERGENCY_CONTACT.phone}`);
        
        // Create a downloadable link for the audio (demo only)
        if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = audioUrl;
            downloadLink.download = 'emergency-recording.wav';
            downloadLink.textContent = 'Download Recording (demo)';
            statusText.appendChild(document.createElement('br'));
            statusText.appendChild(downloadLink);
        }
    }, 2000);
}

// Update status text
function updateStatus(message, type = 'info') {
    statusText.textContent = message;
    statusText.className = 'status';
    
    if (type === 'error') {
        statusText.classList.add('error');
    } else if (type === 'recording') {
        statusText.classList.add('recording');
    } else if (type === 'location') {
        statusText.classList.add('location');
    }
}

// Clean up
function cleanup() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    
    if (locationInterval) {
        clearInterval(locationInterval);
    }
    
    panicButton.classList.remove('activated');
}

// Initialize when page loads
window.addEventListener('load', init);
window.addEventListener('beforeunload', cleanup);


document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const donateBtn = document.querySelector('.donate-btn');
    const qrContainer = document.getElementById('qrContainer');
    const qrImage = document.getElementById('qrImage');
    const backBtn = document.getElementById('backBtn');
    const donationOptions = document.querySelector('.donation-options > div:not(#qrContainer)');
    
    // Sample QR code image (replace with your actual QR code)
    const sampleQR = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/donate';
    
    // Handle amount button clicks
    amountButtons.forEach(button => {
      button.addEventListener('click', function() {
        amountButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        customAmountInput.value = this.dataset.amount;
      });
    });
    
    // Handle custom amount input
    customAmountInput.addEventListener('input', function() {
      amountButtons.forEach(btn => btn.classList.remove('active'));
    });
    
    // Handle donate button click
    donateBtn.addEventListener('click', function() {
      const amount = customAmountInput.value || '0';
      const method = document.querySelector('input[name="payment-method"]:checked').value;
      
      if (parseFloat(amount) <= 0) {
        alert('Please enter a valid donation amount');
        return;
      }
      
      // Show QR code for mobile/crypto payments
      if (method === 'crypto' || method === 'paypal') {
        // Hide donation options
        Array.from(donationOptions).forEach(el => el.style.display = 'none');
        
        // Set QR code image based on payment method
        if (method === 'crypto') {
          qrImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=crypto:0xYourCryptoAddress?amount=' + amount;
          qrImage.alt = 'Crypto Donation QR Code';
        } else {
          qrImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://paypal.com/donate?amount=' + amount;
          qrImage.alt = 'PayPal Donation QR Code';
        }
        
        // Show QR container
        qrContainer.style.display = 'block';
      } 
      else {
        // For credit card, proceed with normal payment flow
        alert(`Thank you for your donation of $${amount}! You selected ${method} payment.`);
        // In a real implementation, you would process the payment here
      }
    });
    
    // Handle back button click
    backBtn.addEventListener('click', function() {
      // Hide QR container
      qrContainer.style.display = 'none';
      
      // Show donation options
      Array.from(donationOptions).forEach(el => el.style.display = 'block');
    });
  });