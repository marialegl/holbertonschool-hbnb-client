document.addEventListener('DOMContentLoaded', checkAuthentication);
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        // Fetch places data if the user is authenticated
        fetchPlaces(token);
    }
}
function getCookie(name) {
    // Function to get a cookie value by its name
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Fetch places data:

async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places data');
        }
    } catch (error) {
        console.error('Error:', error);
    } 
}

let countries = [];

// Cargar los datos de países
fetch('03-frontend/mock-api/data/countries.json')
    .then(response => response.json())
    .then(data => {
        countries = data;
        // Ahora que los países se han cargado, podemos mostrar los lugares
        displayPlaces(places);
    })
    .catch(error => console.error('Error loading countries:', error));

// populate places list:

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    const countryFilter = document.getElementById('country-filter');
    const uniqueCountries = new Set();
    placesList.innerHTML = ''; // Clear any existing content
    countryFilter.innerHTML = '<option value="all">All</option>';

    places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-item';
        placeElement.innerHTML = `
            <h3>${place.id}</h3>
            <p>${place.description}</p>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
            <p><strong>Price per night:</strong> $${place.price_per_night}</p>
        `;
        placesList.appendChild(placeElement);
        uniqueCountries.add(place.country_code);
    });

        uniqueCountries.forEach(code => {
        const country = countries.find(country => country.code === code);
        if (country) {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countryFilter.appendChild(option);
        }
    });
}

// Implement client-side filtering

document.getElementById('country-filter').addEventListener('change', (event) => {
    const selectedCountryCode = event.target.value;
    const placesItems = document.querySelectorAll('.place-item');

    placesItems.forEach(item => {
        const countryCode = item.dataset.countryCode;
        if (selectedCountryCode === 'all' || countryCode === selectedCountryCode) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }); 
});