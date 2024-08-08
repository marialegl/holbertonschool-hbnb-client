document.addEventListener('DOMContentLoaded', function() {
    const placeId = getPlaceIdFromUrl();
    if (placeId) {
        fetchPlaceDetails(placeId);
    } else {
        console.error('No placeId in the URL');
    }
});

function getPlaceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('placeId');
}

async function fetchPlaceDetails(placeId) {
    try {
        const response = await fetch('https://127.0.0.1:5000/places/${placeId}');

        if (response.ok) {
            const places = await response.json();
            const place = places.find(p => p.id === placeId);
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
    console.log(place); // For debugging

    const placeImage = document.getElementById('place-image');
    if (place.images && place.images.length > 0) {
        placeImage.src = place.images[0]; // Use the first available image
        placeImage.style.display = 'block';
    } else {
        placeImage.style.display = 'none';
    }

    document.getElementById('place-name').textContent = place.description;
    document.getElementById('place-host').innerHTML = `<b>Host:</b> ${place.host_name}`;
    document.getElementById('place-price').innerHTML = `<b>Price per night:</b> $${place.price_per_night}`;
    document.getElementById('place-location').innerHTML = `<b>Location:</b> ${place.city_name}, ${place.country_name}`;
    document.getElementById('place-description').innerHTML = `<b>Description:</b> ${place.description}`;

    const amenitiesList = document.getElementById('place-amenities');
    amenitiesList.innerHTML = '';
    place.amenities.forEach(amenity => {
        const li = document.createElement('li');
        li.textContent = amenity;
        amenitiesList.appendChild(li);
    });

    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '<h2>Reviews</h2>';
    place.reviews.forEach(review => {
        const reviewCard = document.createElement('section');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <section>
                <p><b>${review.user_name}</b></p>
                <p><b>${review.comment}</b></p>
                <p><b>Rating</b> ${'★'.repeat(review.rating)}</p>
            </section>
        `;
        reviewsList.appendChild(reviewCard);
    });
}
