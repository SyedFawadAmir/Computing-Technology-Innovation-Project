from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
from datetime import datetime
from sklearn.preprocessing import LabelEncoder

app = FastAPI()

# Load the trained models
delay_model = joblib.load("models/DelayModel_compressed.joblib")
pricing_model = joblib.load("models/PricingModel.joblib")

# Define label encoders based on the provided categorical features seen during training
airline_encoder = LabelEncoder().fit(['Qantas', 'QantasLink', 'Regional Express', 'Skywest', 'Virgin Australia', 'Jetstar', 
                                      'Macair', 'Ozjet', 'MacAir', 'Tigerair Australia', 'Virgin Australia - ATR/F100 Operations', 
                                      'Virgin Australia Regional Airlines', 'Rex Airlines', 'virgin Australia', 'Skytrans', 'Bonza'])

departing_port_encoder = LabelEncoder().fit(['Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns', 
                                             'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast', 
                                             'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth', 
                                             'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga', 
                                             'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay', 
                                             'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock', 
                                             'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah', 
                                             'Armidale', 'Tamworth'])

arriving_port_encoder = LabelEncoder().fit(['Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns', 
                                            'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast', 
                                            'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth', 
                                            'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga', 
                                            'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay', 
                                            'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock', 
                                            'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah', 
                                            'Armidale', 'Tamworth'])

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
            "Route_Encoded": [0],  # Default value
            "Sectors_Flown": [0.0005],  # Average value as default
            "Sectors_Scheduled": [0.0005],  # Average value as default
            "Year": [year]
        })

        # Reorder columns to match the training set’s feature order
        expected_columns = [
            "Sectors_Scheduled", "Sectors_Flown", "Cancellations", "Year", "Month_Num",
            "Airline_Encoded", "Departing_Port_Encoded", "Arriving_Port_Encoded", "Route_Encoded"
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

# Define request model for pricing prediction (reusing DelayRequest for simplicity)
class PricingRequest(BaseModel):
    airline: str
    departure_port: str
    arrival_port: str
    date: str  # Expecting format "DD/MM/YYYY"

# Helper function for preprocessing user input for pricing prediction
def preprocess_pricing_input(data):
    # This is similar to the delay preprocessing
    processed_data = preprocess_delay_input(data)
    return processed_data

# Endpoint for pricing prediction
@app.post("/predict-pricing/")
async def predict_pricing(input_data: PredictionInput):
    route = f"{input_data.departure_port}-{input_data.arrival_port}"
    data = pd.DataFrame([[input_data.airline, input_data.departure_port, input_data.arrival_port, input_data.month]],
                        columns=['Route', 'Month'])
    pricing_prediction = pricing_model.predict(data)[0]
    return {"pricing_prediction": pricing_prediction}
