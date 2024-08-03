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
        const response = await fetch('https://127.0.0.1:5000/places', {
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
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p><strong>Location:</strong> ${place.location}</p>
        `;
        placesList.appendChild(placeElement);
    });
}

// Implement client-side filtering

document.getElementById('country-filter').addEventListener('change', (event) => {
    const selectedCountry = event.target.value;
    const placesItems = document.querySelectorAll('.place-item');

    placesItems.forEach(item => {
        const location = item.querySelector('p strong').nextSibling.textContent.trim();
        if (selectedCountry === 'all' || location === selectedCountry) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});