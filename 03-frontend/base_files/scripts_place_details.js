function getPlaceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('placeId');
}

function checkAuthentication() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';
        const placeId = getPlaceIdFromUrl();
        fetchPlaceDetails(placeId);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaceDetails(placeId) {
    try {
        const response = await fetch('/mock-api/data/places.json'); // Cargar el archivo places.json

        if (response.ok) {
            const places = await response.json();
            const place = places.find(p => p.id === placeId); // Buscar el lugar por ID
            if (place) {
                displayPlaceDetails(place);
            } else {
                console.error('Place not found');
            }
        } else {
            console.error('Failed to load places.json', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetailsSection = document.querySelector('.info-card1');
    placeDetailsSection.innerHTML = '';

    // Create a container for the place details
    const placeInfo = document.createElement('section');
    placeInfo.className = 'card1';

    // Create and append the place name
    const nameElement = document.createElement('h1');
    nameElement.textContent = place.name;
    placeInfo.appendChild(nameElement);

    // Create and append the place host
    const hostElement = document.createElement('p');
    hostElement.innerHTML = `<b>Host:</b> ${place.host}`;
    placeInfo.appendChild(hostElement);

    // Create and append the price per night
    const priceElement = document.createElement('p');
    priceElement.innerHTML = `<b>Price per night:</b> $${place.price}`;
    placeInfo.appendChild(priceElement);

    // Create and append the location
    const locationElement = document.createElement('p');
    locationElement.innerHTML = `<b>Location:</b> ${place.location}`;
    placeInfo.appendChild(locationElement);

    // Create and append the description
    const descriptionElement = document.createElement('p');
    descriptionElement.innerHTML = `<b>Description:</b> ${place.description}`;
    placeInfo.appendChild(descriptionElement);

    // Create and append amenities
    const amenitiesElement = document.createElement('p');
    amenitiesElement.innerHTML = `<b>Amenities:</b> ${place.amenities.join(', ')}`;
    placeInfo.appendChild(amenitiesElement);

    // Create and append images
    if (place.images && place.images.length > 0) {
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'place-images';
        place.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Place Image';
            imagesContainer.appendChild(img);
        });
        placeInfo.appendChild(imagesContainer);
    }

    // Append the newly created place details to the section
    placeDetailsSection.appendChild(placeInfo);

    // Populate reviews
    const reviewsContainer = document.querySelector('.reviews');
    reviewsContainer.innerHTML = '<h2>Reviews</h2>';
    place.reviews.forEach(review => {
        const reviewCard = document.createElement('section');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <section>
                <p><b>${review.user}</b></p>
                <p><b>${review.comment}</b></p>
                <p><b>Rating</b> ${'★'.repeat(review.rating)}</p>
            </section>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}