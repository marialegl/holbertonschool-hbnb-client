const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(express.json());

// Ruta para agregar una nueva reseña
app.post('/places/:placeId/reviews', (req, res) => {
    const placeId = req.params.placeId;
    const newReview = req.body.reviewData;

    const dataPath = path.join(__dirname, 'mock-api', 'data', 'places.json');

    // Leer el archivo JSON
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data');
        }

        // Parsear los datos y buscar el lugar
        const places = JSON.parse(data);
        const place = places.find(p => p.id === placeId);

        if (!place) {
            return res.status(404).send('Place not found');
        }

        // Agregar la nueva reseña
        if (!place.reviews) {
            place.reviews = [];
        }
        place.reviews.push(newReview);

        // Escribir los datos de nuevo en el archivo
        fs.writeFile(dataPath, JSON.stringify(places, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing data');
            }

            res.status(200).send('Review added successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
