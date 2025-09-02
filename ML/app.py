from flask import Flask, request, jsonify, redirect, url_for
import joblib
from pymongo import MongoClient
from flask_cors import CORS
import numpy as np
import re

app = Flask(__name__)
CORS(app)  # Enable CORS globally

# MongoDB connection
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mediLink"]
collection = db["DoctorInformation"]

# Load ML components
vectorizer = joblib.load('vectorizer.pkl')
model = joblib.load('model.pkl')
encoder = joblib.load('encoder.pkl')

def filterDust(data):
    """ Clean input text from unwanted noise like URLs, emojis, hashtags, mentions, etc. """
    data = re.sub(r'''(?i)\b((?:https?://|www\d{0,3}[.]|ftp://|file://|mailto:|tel:|[\w-]+\.(?:com|org|net|edu|gov|info|io|me|co|biz|us|uk|in|dev))(?:(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+)(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))''', ' ', data)
    data = re.sub(r'\b(RT|CC)\b', ' ', data)
    data = re.sub(r'#\S+', ' ', data)
    data = re.sub(r'@\S+', ' ', data)
    data = re.sub(r'\b[\w.-]+@gmail\.com\b', ' ', data)
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  
        "\U0001F300-\U0001F5FF"  
        "\U0001F680-\U0001F6FF"  
        "\U0001F1E0-\U0001F1FF"  
        "\U00002702-\U000027B0"  
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )
    data = emoji_pattern.sub(r'', data)
    data = re.sub(r'[^a-zA-Z0-9\s]', '', data)
    data = re.sub(r'\s+', ' ', data).strip()
    return data

@app.route('/')
def home():
    return redirect(url_for('recommend_doctor'))

@app.route('/api/doctors/recommend', methods=['GET','POST'])
def recommend_api():
    doctors_data = []
    predicted_department = None
    symptoms = request.json.get('symptoms')  # frontend sends JSON {symptoms: "fever headache"}

    if symptoms:
        cleaned = filterDust(symptoms)
        vect_input = vectorizer.transform([cleaned])

        # Use model.predict() (not predict_proba) since it's a Keras Sequential
        dept_prob = model.predict(vect_input)
        dept_index = np.argmax(dept_prob, axis=1)
        dept_index_2d = np.array(dept_index, dtype=np.int64).reshape(-1, 1)
        predicted_department = encoder.inverse_transform(dept_index_2d)[0][0]
        print(type(dept_index), dept_index.shape)




        # Fetch doctors from MongoDB
        doctors_cursor = collection.find({"department": predicted_department})
        for doc in doctors_cursor:
            doctors_data.append({
                "doctorName": doc.get('doctorName'),
                "department": doc.get('department'),
                "hospital": doc.get('hospital'),
                "degree": doc.get('degree'),
                "phoneNumber": doc.get('phoneNumber'),
                "email": doc.get('email'),
                "imagePath": doc.get('imagePath'),
                "id": doc.get('id')
            })

    return jsonify({
        "department": predicted_department,
        "symptoms": symptoms,
        "doctors": doctors_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=3001)  # Run on port 3001 to avoid conflict with React frontend on 3000
