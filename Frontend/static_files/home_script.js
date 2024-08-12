document.addEventListener('DOMContentLoaded', () => {
    fetch('../mock-api/data/places.json')
        .then(response => response.json())
        .then(data => {
            // Filtrar lugares con al menos una reseña
            const topPlaces = data
                .filter(place => place.reviews && place.reviews.length > 0)
                .map(place => {
                    // Calcular el rating promedio
                    const ratings = place.reviews.map(review => review.rating);
                    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                    return { ...place, averageRating };
                })
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3);

            topPlaces.forEach((place, index) => {
                const placeElement = document.getElementById(`place${index + 1}`);
                placeElement.innerHTML = `
                    <br>
                    <img src="${place.images[0]}" alt="Place Image" class="place-image">
                    <br>
                    <p>${place.description}</p>
                    <p>Average Rating: ${place.averageRating.toFixed(1)}</p>
                    <p>Price per night: $${place.price_per_night}</p>
                    <p>Location: ${place.city_name}, ${place.country_name}</p>
                    <br>
                `;
            });
        })
        .catch(error => console.error('Error loading places:', error));
});
