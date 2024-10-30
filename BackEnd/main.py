from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel

app = FastAPI()

# Enable CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to match your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the models with the updated filenames
delay_model = joblib.load('models/DelayModel_compressed.joblib')
pricing_model = joblib.load('models/PricingModel.joblib')

# Define input data structure
class PredictionInput(BaseModel):
    airline: str
    departure_port: str
    arrival_port: str
    month: int

# Prediction endpoint for delay
@app.post("/predict-delay/")
async def predict_delay(input_data: PredictionInput):
    data = pd.DataFrame([[input_data.airline, input_data.departure_port, input_data.arrival_port, input_data.month]],
                        columns=['Airline', 'Departure Port', 'Arrival Port', 'Month'])
    delay_prediction = delay_model.predict(data)[0]
    return {"delay_prediction": delay_prediction}

# Prediction endpoint for pricing
@app.post("/predict-pricing/")
async def predict_pricing(input_data: PredictionInput):
    data = pd.DataFrame([[input_data.airline, input_data.departure_port, input_data.arrival_port, input_data.month]],
                        columns=['Airline', 'Departure Port', 'Arrival Port', 'Month'])
    pricing_prediction = pricing_model.predict(data)[0]
    return {"pricing_prediction": pricing_prediction}
