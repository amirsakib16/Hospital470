from flask import Flask, render_template, request, redirect, url_for
import joblib
from pymongo import MongoClient
import numpy as np
import re

app = Flask(__name__)

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mediLink"]
collection = db["DoctorInformation"]

vectorizer = joblib.load('vectorizer.pkl')
model = joblib.load('model.pkl')
encoder = joblib.load('encoder.pkl')

def filterDust(data):
    # Remove URLs
    data = re.sub(r'''(?i)\b((?:https?://|www\d{0,3}[.]|ftp://|file://|mailto:|tel:|[\w-]+\.(?:com|org|net|edu|gov|info|io|me|co|biz|us|uk|in|dev))(?:(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+)(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))''', ' ', data)
    data = re.sub(r'\b(RT|CC)\b', ' ', data)
    data = re.sub(r'#\S+', ' ', data)
    data = re.sub(r'@\S+', ' ', data)
    data = re.sub(r'\b[\w.-]+@gmail\.com\b', ' ', data)
    emoji_pattern = re.compile(
        "[" 
        "\U0001F600-\U0001F64F"  # Emoticons
        "\U0001F300-\U0001F5FF"  # Symbols & Pictographs
        "\U0001F680-\U0001F6FF"  # Transport & Map
        "\U0001F1E0-\U0001F1FF"  # Flags
        "\U00002702-\U000027B0"  # Dingbats
        "\U000024C2-\U0001F251"  # Enclosed characters
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

@app.route('/recommend_doctor', methods=['GET', 'POST'])
def recommend_doctor():
    doctors_data = []
    predicted_department = None
    symptoms = None

    if request.method == 'POST':
        symptoms = request.form.get('symptoms')
        if symptoms:
            cleaned = filterDust(symptoms)
            vect_input = vectorizer.transform([cleaned])
            dept_prob = model.predict(vect_input)
            dept_index = np.argmax(dept_prob, axis=1)
            predicted_department = encoder.inverse_transform(dept_index.reshape(-1, 1))[0, 0]

            print("Input:", symptoms)
            print("Cleaned:", cleaned)
            print("Predicted Department:", predicted_department)
            print("Probabilities:", dept_prob)
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

    return render_template(
        'recommendation.html',
        doctors=doctors_data,
        department=predicted_department,
        symptoms=symptoms
    )

if __name__ == '__main__':
    app.run(debug=True, port=3000)
