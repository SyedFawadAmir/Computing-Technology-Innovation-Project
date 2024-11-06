import React, { useState, useEffect, useRef } from 'react';
import FlightForm from './FlightForm';
import axios from 'axios';
import * as d3 from 'd3';
import './FlightPrediction.css';

const FlightPrediction = () => {
  const [pricingData, setPricingData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const svgRef = useRef();

  // Function to handle form submission
  const handleFormSubmit = async (formData) => {
    // Clear previous data and set loading state
    setLabels([]);
    setPricingData([]);
    setIsLoading(true);

    // Generate a range of dates: 3 months before and 3 months after the provided travelDate
    const dates = generateDateRange(formData.travelDate);

    // Fetch predictions for each date in the range
    for (const date of dates) {
      await fetchPricingPrediction({ ...formData, travelDate: date });
    }

    // Clear loading state once all data is fetched
    setIsLoading(false);
  };

  // Function to fetch pricing prediction for each date
  const fetchPricingPrediction = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/predict-pricing/', {
        airline: data.airline,
        departure_port: data.departurePort,
        arrival_port: data.arrivalPort,
        date: data.travelDate
      });

      const pricingPrediction = parseFloat(response.data.pricing_prediction);
      const dateObj = new Date(data.travelDate);
      const monthLabel = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });

      setLabels((prevLabels) => [...prevLabels, monthLabel]);
      setPricingData((prevData) => [...prevData, pricingPrediction]);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  // Generate a 7-month date range: 3 months before and 3 months after the start date
  const generateDateRange = (startDate) => {
    const start = new Date(startDate);
    const dates = [];
    
    // Generate 3 months before, current month, and 3 months after
    for (let i = -3; i <= 3; i++) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + i);
      dates.push(date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }));
    }
    return dates;
  };

  // Draw the D3 chart whenever pricingData or labels change
  useEffect(() => {
    if (pricingData.length === 0 || labels.length === 0) return;

    // Set up chart dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Select the SVG element and clear previous content
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f0f0f0")
      .style("margin-top", "20px")
      .style("overflow", "visible");

    svg.selectAll("*").remove();

    // Set up scales
    const xScale = d3.scalePoint()
      .domain(labels)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(pricingData) * 1.1])
      .range([height - margin.bottom, margin.top]);

    // Draw x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Draw y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => `$${d}`));

    // Define the line generator
    const line = d3.line()
      .x((d, i) => xScale(labels[i]))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    // Draw the line
    svg.append("path")
      .datum(pricingData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw circles at each data point
    svg.selectAll(".dot")
      .data(pricingData)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => xScale(labels[i]))
      .attr("cy", d => yScale(d))
      .attr("r", 4)
      .attr("fill", "steelblue");

  }, [pricingData, labels]);

  return (
    <div className="flight-prediction">
      <FlightForm onSubmit={handleFormSubmit} />

      {isLoading && <p className="loading-message">Loading predictions...</p>}

      {!isLoading && pricingData.length > 0 && (
        <div className="chart-container">
          <h3>Pricing Prediction for 3 Months Before and After the Travel Date</h3>
          <svg ref={svgRef}></svg>
        </div>
      )}
    </div>
  );
};

export default FlightPrediction;
