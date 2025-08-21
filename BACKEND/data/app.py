from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import pickle
import joblib
import numpy as np
app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mediLink"]
collection = db["DoctorInformation"]

# Load Pickle Files

vectorizer = joblib.load('vectorizer.pkl')
model = joblib.load('model.pkl')
encoder = joblib.load('encoder.pkl')


@app.route('/recommend_doctor', methods=['GET', 'POST'])
def recommend_doctor():
    doctors_data = []

    if request.method == 'POST':
        symptoms = request.form.get('symptoms')
        if symptoms:
            # Predict department from symptoms
            vect_input = vectorizer.transform([symptoms])
            dept_encoded = model.predict(vect_input)
            department = encoder.inverse_transform(dept_encoded)[0]

            # Query MongoDB for doctors in the predicted department
            doctors_cursor = collection.find({"department": department})

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

    return render_template(
        'recommendation.html',
        doctors=doctors_data
    )

if __name__ == '__main__':
    app.run(debug=True, port=3001)
