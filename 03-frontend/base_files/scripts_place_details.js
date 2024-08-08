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
        const response = await fetch('../mock-api/data/places.json');

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
    console.log(place);
    
    const placeDetailsSection = document.querySelector('.info-card1');
    placeDetailsSection.innerHTML = '';

    const placeInfo = document.createElement('section');
    placeInfo.className = 'card1';

    const nameElement = document.createElement('h1');
    nameElement.textContent = place.id;
    placeInfo.appendChild(nameElement);

    const hostElement = document.createElement('p');
    hostElement.innerHTML = `<b>Host:</b> ${place.host_name}`;
    placeInfo.appendChild(hostElement);

    const priceElement = document.createElement('p');
    priceElement.innerHTML = `<b>Price per night:</b> $${place.price_per_night}`;
    placeInfo.appendChild(priceElement);

    const locationElement = document.createElement('p');
    locationElement.innerHTML = `<b>Location:</b> ${place.city_name}`;
    placeInfo.appendChild(locationElement);


    const descriptionElement = document.createElement('p');
    descriptionElement.innerHTML = `<b>Description:</b> ${place.description}`;
    placeInfo.appendChild(descriptionElement);

    const amenitiesElement = document.createElement('p');
    amenitiesElement.innerHTML = `<b>Amenities:</b> ${place.amenities.join(', ')}`;
    placeInfo.appendChild(amenitiesElement);


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

    placeDetailsSection.appendChild(placeInfo);

    const reviewsContainer = document.querySelector('.reviews');
    reviewsContainer.innerHTML = '<h2>Reviews</h2>';
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
        
        reviewsContainer.appendChild(reviewCard);
    });

    const reviewButton = document.createElement('section');
    reviewButton.className = 'submit-button'
    reviewButton.innerHTML = `
        <section>
            <a href="add_review.html?placeId=${place.id}" class="button-reviews">Add review</a>
        </section>
    `;
    reviewsContainer.appendChild(reviewButton);
}