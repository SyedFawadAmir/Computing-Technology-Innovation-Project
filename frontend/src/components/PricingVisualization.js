import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PriceBarChart = ({ price }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set chart dimensions
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };

    // Clear previous SVG content if any
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f9f9f9')
      .style('border-radius', '8px')
      .style('margin', '0 auto')
      .style('display', 'block');

    // Define scales
    const xScale = d3.scaleBand()
      .domain(['Price Prediction'])
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(price * 1.2, 500)])  // Adding padding to the max price for better visuals
      .range([height - margin.bottom, margin.top]);

    // Draw X-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "14px");

    // Draw Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => `Au$${d}`))
      .selectAll("text")
      .style("font-size", "12px");

    // Draw bar
    svg.selectAll('.bar')
      .data([price])
      .join('rect')
      .attr('class', 'bar')
      .attr('x', xScale('Price Prediction'))
      .attr('y', yScale(price))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale(0) - yScale(price))
      .attr('fill', '#4CAF50')
      .attr('rx', 4);  // Rounded corners for the bar

    // Add text label above the bar
    svg.selectAll('.label')
      .data([price])
      .join('text')
      .attr('class', 'label')
      .attr('x', xScale('Price Prediction') + xScale.bandwidth() / 2)
      .attr('y', yScale(price) - 10)
      .attr('text-anchor', 'middle')
      .text(`Au$${price.toFixed(2)}`)
      .style('fill', '#333')
      .style('font-size', '16px')
      .style('font-weight', 'bold');

    // Add title for the chart
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text('Predicted Pricing');
  }, [price]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PriceBarChart;
