# Flight Network Web Application

## Project Overview
The Flight Network web application is designed to provide users with real-time insights on flight fares and delay risks. This project leverages React.js for the frontend, FastAPI for the backend, and D3.js for visualizing the model's predictions. It predicts the potential delay probability and flight pricing based on user input, creating an interactive and informative user experience.

## Features
- **Flight Delay Prediction**: Displays a probability of delay based on airline, departure, and arrival details.
- **Pricing Prediction**: Provides an estimated flight price based on the provided route and travel date.
- **Interactive Visualizations**: Uses D3.js to render visual insights related to predictions.
- **Responsive UI**: A sleek, responsive user interface that adapts to various screen sizes.

## Project Structure
- `frontend/`: Contains all React components and related assets for the frontend.
- `backend/`: Contains FastAPI code for handling prediction requests.
- `public/`: Static assets for the React app (e.g., images, logo).
- `src/components/`: React components for the website.
- `src/pages/`: Pages such as About and Video Presentation.

## Installation and Setup
1. **Clone the repository**:
git clone <repository-url> cd <repository-folder>


2. **Backend Setup**:
- Ensure Python is installed on your machine.
- Install dependencies using:
  ```
  pip install -r requirements.txt
  ```
- Run the FastAPI server:
  ```
  uvicorn main:app --reload
  ```

3. **Frontend Setup**:
- Ensure Node.js is installed on your machine.
- Install dependencies using:
  ```
  npm install
  ```
- Start the development server:
  ```
  npm start
  ```

4. **Navigate to the application**:
Open your browser and visit `http://localhost:3000` to access the app.

## Usage
- Enter flight details in the form on the main page to get delay and pricing predictions.
- Navigate to different sections using the navbar (e.g., About Us, Video Presentation).
- View visual representations of the predictions provided by D3.js components.

## Technology Stack
- **Frontend**: React.js, D3.js, CSS
- **Backend**: FastAPI, Python
- **Visualization**: D3.js
- **Other**: Axios for API calls, React Router for navigation

## License
This project is created for educational purposes as part of an academic assignment. Please ensure to adhere to your institution's academic integrity policies.

---

**requirements_submission.txt**
fastapi==0.95.2 uvicorn==0.23.1 pandas==1.5.3 scikit-learn==1.2.2 joblib==1.2.0 d3.js integration (handled in React) react==18.2.0 react-dom==18.2.0 axios==1.4.0 react-router-dom==6.14.1


