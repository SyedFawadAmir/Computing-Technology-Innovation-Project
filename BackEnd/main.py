from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from datetime import datetime
from sklearn.preprocessing import LabelEncoder

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained models and scalers
delay_model = joblib.load("../models/DelayModel_compressed.joblib")
pricing_model = joblib.load("../models/PricingModel.joblib")
month_encoder = joblib.load("../models/month_encoder.joblib")
poly = joblib.load("../models/poly.joblib")
x_scaler = joblib.load("../models/x_scaler.joblib")
y_scaler = joblib.load("../models/y_scaler.joblib")

# Define label encoders based on training data categories
airline_encoder = LabelEncoder().fit([
    'Qantas', 'QantasLink', 'Regional Express', 'Skywest', 'Virgin Australia',
    'Jetstar', 'Macair', 'Ozjet', 'MacAir', 'Tigerair Australia',
    'Virgin Australia - ATR/F100 Operations', 'Virgin Australia Regional Airlines',
    'Rex Airlines', 'virgin Australia', 'Skytrans', 'Bonza'
])

# Define encoders for departure and arrival ports inline as per the code you provided
departure_port_encoder = LabelEncoder().fit([
    'Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns',
    'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast',
    'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth',
    'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga',
    'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay',
    'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock',
    'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah',
    'Armidale', 'Tamworth'
])

arrival_port_encoder = LabelEncoder().fit([
    'Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns',
    'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast',
    'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth',
    'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga',
    'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay',
    'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock',
    'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah',
    'Armidale', 'Tamworth'
])

# Define request models
class DelayRequest(BaseModel):
    airline: str
    departure_port: str
    arrival_port: str
    date: str  # Format "YYYY-MM-DD" expected

class PricingRequest(BaseModel):
    airline: str
    departure_port: str
    arrival_port: str
    date: str  # Format "YYYY-MM-DD" expected

# Helper function for delay prediction preprocessing
def preprocess_delay_input(data):
    try:
        # Parse the date using 'YYYY-MM-DD' format
        date_obj = datetime.strptime(data["date"], "%Y-%m-%d")
        month = date_obj.month
        year = date_obj.year
        
        # Encode categorical features
        airline_encoded = airline_encoder.transform([data["airline"]])[0]
        departing_port_encoded = departure_port_encoder.transform([data["departure_port"]])[0]
        arriving_port_encoded = arrival_port_encoder.transform([data["arrival_port"]])[0]
        
        # Prepare data for the model
        processed_data = pd.DataFrame({
            "Airline_Encoded": [airline_encoded],
            "Departing_Port_Encoded": [departing_port_encoded],
            "Arriving_Port_Encoded": [arriving_port_encoded],
            "Month_Num": [month],
            "Cancellations": [0.000834],
            "Sectors_Flown": [0.0005],
            "Sectors_Scheduled": [0.0005],
            "Year": [year]
        })

        # Order columns as per model training data
        expected_columns = [
            "Sectors_Scheduled", "Sectors_Flown", "Cancellations", "Year", "Month_Num",
            "Airline_Encoded", "Departing_Port_Encoded", "Arriving_Port_Encoded"
        ]
        return processed_data[expected_columns]

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid input format or data")

# Endpoint for delay prediction
@app.post("/predict-delay/")
async def predict_delay(request: DelayRequest):
    input_data = preprocess_delay_input(request.dict())
    prediction = delay_model.predict_proba(input_data)[:, 1][0]
    delay_probability = round(prediction * 100, 2)
    return {"delay_probability": f"{delay_probability}%"}

# Helper function for pricing prediction preprocessing
def preprocess_pricing_input(data):
    try:
        # Parse the date using 'YYYY-MM-DD' format for the month abbreviation
        date_obj = datetime.strptime(data["date"], "%Y-%m-%d")
        month_abbreviation = date_obj.strftime("%b")
        
        # Encode the month, departure, and arrival ports
        month_encoded = month_encoder.transform([month_abbreviation])[0]
        departing_port_encoded = departure_port_encoder.transform([data["departure_port"]])[0]
        arriving_port_encoded = arrival_port_encoder.transform([data["arrival_port"]])[0]

        # Prepare data for the model
        input_data = pd.DataFrame({
            "departure_port": [departing_port_encoded],
            "arrival_port": [arriving_port_encoded],
            "month": [month_encoded]
        })

        # Apply scaling and polynomial transformation
        input_data_scaled = x_scaler.transform(input_data)
        input_data_poly = poly.transform(input_data_scaled)
        return input_data_poly

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid input format or data")

# Endpoint for pricing prediction
@app.post("/predict-pricing/")
async def predict_pricing(request: PricingRequest):
    input_data = preprocess_pricing_input(request.dict())
    pricing_prediction_scaled = pricing_model.predict(input_data)[0]
    pricing_prediction = y_scaler.inverse_transform([[pricing_prediction_scaled]])[0, 0]
    return {"pricing_prediction": pricing_prediction}
