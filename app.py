# Heart Disease Prediction System - Flask Backend
# Flask application with routes and prediction logic

from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load the trained model, scaler, and feature names
MODEL_PATH = 'model/heart_model.pkl'
SCALER_PATH = 'model/scaler.pkl'
FEATURES_PATH = 'model/feature_names.pkl'

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    feature_names = joblib.load(FEATURES_PATH)
    print("✓ Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    scaler = None
    feature_names = None

# Route: Home page
@app.route('/')
def index():
    return render_template('index.html')

# Route: Prediction page
@app.route('/predict')
def predict_page():
    return render_template('predict.html')

# Route: About page
@app.route('/about')
def about():
    return render_template('about.html')

# Route: Handle prediction request
@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.'
            }), 500
        
        # Get form data
        data = request.form
        
        # Extract and validate features
        features = []
        required_fields = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
                          'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
        
        for field in required_fields:
            value = data.get(field)
            if value is None or value == '':
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
            
            try:
                features.append(float(value))
            except ValueError:
                return jsonify({
                    'error': f'Invalid value for {field}. Must be a number.'
                }), 400
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        
        # Prepare result
        result = {
            'prediction': int(prediction),
            'probability': {
                'no_disease': float(probability[0] * 100),
                'disease': float(probability[1] * 100)
            },
            'risk_level': 'High' if prediction == 1 else 'Low',
            'message': get_health_message(prediction, features)
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'error': f'Prediction error: {str(e)}'
        }), 500

def get_health_message(prediction, features):
    """Generate personalized health message based on prediction and features"""
    age, sex, cp, trestbps, chol = features[0], features[1], features[2], features[3], features[4]
    
    if prediction == 1:
        message = "⚠️ High Risk Detected. Based on your health parameters, you may be at risk for heart disease. "
        message += "Please consult a cardiologist immediately for a comprehensive evaluation. "
        
        # Personalized tips
        tips = []
        if trestbps > 140:
            tips.append("Monitor your blood pressure regularly")
        if chol > 240:
            tips.append("Reduce cholesterol intake")
        if age > 55:
            tips.append("Regular cardiac checkups recommended")
        
        if tips:
            message += "Recommendations: " + ", ".join(tips) + "."
    else:
        message = "✓ Low Risk. Your heart health parameters look good! "
        message += "Continue maintaining a healthy lifestyle with regular exercise, balanced diet, and stress management. "
        message += "Schedule annual checkups to monitor your heart health."
    
    return message

# Route: Result page (displays prediction results)
@app.route('/result')
def result():
    return render_template('result.html')

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return render_template('index.html'), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/images', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    os.makedirs('model', exist_ok=True)
    
    print("\n" + "="*50)
    print("Heart Disease Prediction System")
    print("="*50)
    print("Server starting on http://127.0.0.1:5000")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
