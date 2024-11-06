from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
from datetime import datetime
from sklearn.preprocessing import LabelEncoder

# Initialize FastAPI app
app = FastAPI()

# Load the trained models and scalers
delay_model = joblib.load("models/DelayModel_compressed.joblib")
pricing_model = joblib.load("models/PricingModel.joblib")
month_encoder = joblib.load("models/month_encoder.pkl")  # Load your custom month encoder
poly = joblib.load("models/poly.joblib")
x_scaler = joblib.load("models/x_scaler.joblib")
y_scaler = joblib.load("models/y_scaler.joblib")

# Define label encoders based on the provided categorical features seen during training
airline_encoder = LabelEncoder().fit([
    'Qantas', 'QantasLink', 'Regional Express', 'Skywest', 'Virgin Australia', 'Jetstar', 
    'Macair', 'Ozjet', 'MacAir', 'Tigerair Australia', 'Virgin Australia - ATR/F100 Operations', 
    'Virgin Australia Regional Airlines', 'Rex Airlines', 'virgin Australia', 'Skytrans', 'Bonza'
])

departing_port_encoder = LabelEncoder().fit([
    'Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns', 
    'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast', 
    'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth', 
    'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga', 
    'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay', 
    'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock', 
    'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah', 
    'Armidale', 'Tamworth'
])

arriving_port_encoder = LabelEncoder().fit([
    'Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns', 
    'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast', 
    'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth', 
    'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga', 
    'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay', 
    'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock', 
    'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah', 
    'Armidale', 'Tamworth'
])

# Define request model for delay prediction
class DelayRequest(BaseModel):
    airline: str
    departure_port: str
    arrival_port: str
    date: str  # Expecting format "DD/MM/YYYY"

# Helper function for preprocessing user input for delay prediction
def preprocess_delay_input(data):
    try:
        # Parse the date to extract month and year
        date_obj = datetime.strptime(data["date"], "%d/%m/%Y")
        month = date_obj.month
        year = date_obj.year
        
        # Encode categorical features
        airline_encoded = airline_encoder.transform([data["airline"]])[0]
        departing_port_encoded = departing_port_encoder.transform([data["departure_port"]])[0]
        arriving_port_encoded = arriving_port_encoder.transform([data["arrival_port"]])[0]
        
        # Create a DataFrame that includes all expected features in the correct order
        processed_data = pd.DataFrame({
            "Airline_Encoded": [airline_encoded],
            "Departing_Port_Encoded": [departing_port_encoded],
            "Arriving_Port_Encoded": [arriving_port_encoded],
            "Month_Num": [month],
            "Cancellations": [0.000834],  # Average value as default
            "Sectors_Flown": [0.0005],  # Average value as default
            "Sectors_Scheduled": [0.0005],  # Average value as default
            "Year": [year]
        })

        # Reorder columns to match the training set’s feature order
        expected_columns = [
            "Sectors_Scheduled", "Sectors_Flown", "Cancellations", "Year", "Month_Num",
            "Airline_Encoded", "Departing_Port_Encoded", "Arriving_Port_Encoded"
        ]
        processed_data = processed_data[expected_columns]

        return processed_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Input contains values that were not seen during training.")

# Endpoint for delay prediction
@app.post("/predict-delay/")
async def predict_delay(request: DelayRequest):
    # Preprocess the input data
    input_data = preprocess_delay_input(request.dict())

    # Make prediction
    prediction = delay_model.predict_proba(input_data)[:, 1][0]  # Probability of delay

    # Convert to percentage for user-friendly output
    delay_probability = round(prediction * 100, 2)
    return {"delay_probability": f"{delay_probability}%"}

# Define request model for pricing prediction 
class PricingRequest(BaseModel):
    airline: str
    departure_port: str
    arrival_port: str
    date: str  # Expecting format "DD/MM/YYYY"

# Helper function for preprocessing user input for pricing prediction
def preprocess_pricing_input(data):
    try:
        # Parse the date to extract month abbreviation
        date_obj = datetime.strptime(data["date"], "%d/%m/%Y")
        month_abbreviation = date_obj.strftime("%b")  # Get first 3 letters of the month name

        # Encode categorical features
        month_encoded = month_encoder.transform([month_abbreviation])[0]
        departing_port_encoded = departing_port_encoder.transform([data["departure_port"]])[0]
        arriving_port_encoded = arriving_port_encoder.transform([data["arrival_port"]])[0]
        
        # Create a DataFrame with the original features
        input_data = pd.DataFrame({
            "departure_port": [departing_port_encoded],
            "arrival_port": [arriving_port_encoded],
            "month": [month_encoded]
        })

        # Apply scaling
        input_data_scaled = x_scaler.transform(input_data)

        # Apply polynomial transformation
        input_data_poly = poly.transform(input_data_scaled)

        return input_data_poly
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# Endpoint for pricing prediction
@app.post("/predict-pricing/")
async def predict_pricing(request: PricingRequest):
    # Preprocess the input data
    input_data = preprocess_pricing_input(request.dict())

    # Predict using the model on scaled data
    pricing_prediction_scaled = pricing_model.predict(input_data)[0]

    # Inverse-transform the prediction to get it back to the original price scale
    pricing_prediction = y_scaler.inverse_transform([[pricing_prediction_scaled]])[0, 0]

    return {"pricing_prediction": pricing_prediction}
