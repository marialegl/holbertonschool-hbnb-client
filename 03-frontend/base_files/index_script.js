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

// populate places list:

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear any existing content

    places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-item';
        placeElement.innerHTML = `
            <h3>${place.id}</h3>
            <p>${place.description}</p>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
            <p><strong>Price per night:</strong> $${place.price_per_night}</p>
            <a href="place.html" class="button-card-places">View details</a>
        `;
        placesList.appendChild(placeElement);
    });
}

// Implement client-side filtering

// Cargar lugares y configurar el filtro
fetch('../mock-api/data/places.json')
    .then(response => response.json())
    .then(places => {
        displayPlaces(places); // Mostrar todos los lugares inicialmente

        document.getElementById('country-filter').addEventListener('change', function() {
            const selectedCountry = this.value;
            const filteredPlaces = places.filter(place => selectedCountry === 'all' || place.country_code === selectedCountry);
            displayPlaces(filteredPlaces); 
        });
    });

// Cargar y popular el filtro de países
fetch('../mock-api/data/countries.json')
    .then(response => response.json())
    .then(countries => {
        const countryFilter = document.getElementById('country-filter');

        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Countries';
        countryFilter.appendChild(allOption);

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countryFilter.appendChild(option);
        });
    }); 