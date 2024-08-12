from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json

app = Flask(__name__)
CORS(app, origins=["http://localhost:5500"], supports_credentials=True)
app.config.from_object('config.Config')
jwt = JWTManager(app)

def read_json_file(file_path):
    """Lee el contenido de un archivo JSON."""
    with open(file_path, 'r') as file:
        return json.load(file)

def write_json_file(file_path, data):
    """Escribe datos en un archivo JSON."""
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

# Ruta de los archivos JSON
USERS_FILE = 'data/users.json'
PLACES_FILE = 'data/places.json'

# Leer datos iniciales
users = read_json_file(USERS_FILE)
places = read_json_file(PLACES_FILE)

@app.route('/')
def index():
    return '¡Hola, mundo!'

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    
    if not user:
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user['id'])
    return jsonify(access_token=access_token)

@app.route('/places', methods=['GET'])
def get_places():
    response = [
        {
            "id": place['id'],
            "host_id": place['host_id'],
            "host_name": place['host_name'],
            "description": place['description'],
            "price_per_night": place['price_per_night'],
            "city_id": place['city_id'],
            "city_name": place['city_name'],
            "country_code": place['country_code'],
            "country_name": place['country_name']
        }
        for place in places
    ]
    return jsonify(response)

@app.route('/places/<place_id>', methods=['GET'])
def get_place(place_id):
    place = next((p for p in places if p['id'] == place_id), None)

    if not place:
        return jsonify({"msg": "Place not found"}), 404

    response = {
        "id": place['id'],
        "host_id": place['host_id'],
        "host_name": place['host_name'],
        "description": place['description'],
        "number_of_rooms": place['number_of_rooms'],
        "number_of_bathrooms": place['number_of_bathrooms'],
        "max_guests": place['max_guests'],
        "price_per_night": place['price_per_night'],
        "latitude": place['latitude'],
        "longitude": place['longitude'],
        "city_id": place['city_id'],
        "city_name": place['city_name'],
        "country_code": place['country_code'],
        "country_name": place['country_name'],
        "amenities": place['amenities'],
        "reviews": place['reviews']
    }
    return jsonify(response)

@app.route('/places/<place_id>/reviews', methods=['GET', 'POST'])
@jwt_required()  # Optional JWT for GET requests
def handle_reviews(place_id):
    global places
    if request.method == 'GET':
        # Obtener reseñas
        place = next((p for p in places if p['id'] == place_id), None)
        if not place:
            return jsonify({"msg": "Place not found"}), 404
        return jsonify(place['reviews'])

    elif request.method == 'POST':
        current_user_id = get_jwt_identity()
        user = next((u for u in users if u['id'] == current_user_id), None)

        if not user:
            return jsonify({"msg": "User not found"}), 404

        review_data = {
            "user_name": user['name'],
            "title": request.json.get('title'),
            "rating": request.json.get('rating'),
            "comment": request.json.get('comment'),
            "visit_date": request.json.get('visit_date'),
            "service_rating": request.json.get('service_rating'),
            "cleanliness_rating": request.json.get('cleanliness_rating'),
            "comfort_rating": request.json.get('comfort_rating'),
            "price_rating": request.json.get('price_rating'),
            "place_id": place_id
        }

        # Agregar la nueva reseña al archivo JSON
        place = next((p for p in places if p['id'] == place_id), None)
        if not place:
            return jsonify({"msg": "Place not found"}), 404

        place['reviews'].append(review_data)
        
        # Escribir de vuelta en el archivo JSON
        write_json_file(PLACES_FILE, places)

        return jsonify({"msg": "Review added"}), 201

if __name__ == '__main__':
    app.run(debug=True)
