# Heart Disease Prediction System

A full-stack web application that predicts the risk of heart disease using machine learning, built with Python, Flask, and a Random Forest Classifier. Users input health parameters through a modern, responsive website and receive personalized risk assessments with interactive visualizations.

---

## Features

- Machine learning model trained on key health features such as age, sex, chest pain type, blood pressure, cholesterol, etc.
- Uses Random Forest algorithm for high-accuracy binary prediction.
- Responsive frontend with healthcare-themed design (light blue/white palette).
- Dynamic risk probability visualization using Chart.js.
- Personalized health messages and doctor tips based on prediction.
- Multipage Flask app with Home, Prediction, Result, and About pages.
- Self-contained with synthetic data generation or supports external CSV dataset.

---

## Technologies

- Python 3.10+
- Flask (backend web framework)
- scikit-learn (Random Forest classifier)
- Pandas, NumPy (data handling)
- HTML, CSS, JavaScript (frontend)
- Chart.js (interactive charts)
- joblib (model persistence)

---

## Getting Started

### Prerequisites

- Python 3.10 or higher
- pip package manager

### Installation

1. Clone the repository:


2. Create and activate a Python virtual environment:
python -m venv venv
venv\Scripts\activate # Windows
source venv/bin/activate # macOS/Linux

3. Install dependencies:
pip install -r requirements.txt

4. Prepare the model:

- Option 1: Use synthetic dataset (default in `train_model.py`)
- Option 2: Place your own dataset CSV named `heart.csv` in project root and update `train_model.py` accordingly.

Train the model:python train_model.py

5. Run the application:

python app.py
6. Open your browser and visit:

http://127.0.0.1:5000

---

## Usage

- Input your health details on the Prediction page.
- Submit to get your heart disease risk prediction and health recommendations.
- Navigate through Home, About, and Result pages via navigation bar.

---
## Disclaimer

This tool is intended for educational and informational purposes only. It is NOT a substitute for professional medical diagnosis. Consult a healthcare professional for medical advice.

---
