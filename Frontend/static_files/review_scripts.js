function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        alert('User not authenticated. Please log in first.');
        window.location.href = 'index.html';
    }
    return token;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('placeId');
}

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const token = checkAuthentication();  // Obtener el token JWT
    const placeId = getPlaceIdFromURL();  // Obtener el placeId de la URL

    document.getElementById('placeId').value = placeId;  // Establecer el placeId en el formulario

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const reviewTitle = document.getElementById('review-title').value;
            const reviewText = document.getElementById('review-text').value;
            const reviewRating = document.querySelectorAll('#review-rating .selected').length;
            const visitDate = document.getElementById('visit-date').value;
            const serviceRating = document.getElementById('service-rating').value;
            const cleanlinessRating = document.getElementById('cleanliness-rating').value;
            const comfortRating = document.getElementById('comfort-rating').value;
            const priceRating = document.getElementById('price-rating').value;

            const reviewData = {
                title: reviewTitle,
                comment: reviewText,
                rating: reviewRating,
                visit_date: visitDate,
                service_rating: serviceRating,
                cleanliness_rating: cleanlinessRating,
                comfort_rating: comfortRating,
                price_rating: priceRating,
            };

            await submitReview(token, placeId, reviewData);
        });
    }

    const stars = document.querySelectorAll('#review-rating a');
    stars.forEach((star, index) => {
        star.addEventListener('click', (e) => {
            e.preventDefault();
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });
});

async function submitReview(token, placeId, reviewData) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        });

        handleResponse(response);
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
}

function handleResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
        document.querySelectorAll('#review-rating .selected').forEach(star => {
            star.classList.remove('selected');
        });
    } else {
        alert('Failed to submit review');
    }
}