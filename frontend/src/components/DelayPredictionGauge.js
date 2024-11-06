import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const DelayPredictionGauge = ({ percentage }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set up dimensions and margins
    const width = 250;
    const height = 150;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const radius = Math.min(width, height) / 2 - margin.left;

    // Clear any previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 1.5})`);

    // Create scale for the percentage
    const arcScale = d3.scaleLinear()
      .domain([0, 100])
      .range([-Math.PI / 2, Math.PI / 2]);

    // Define arc generator
    const arc = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(arcScale(0))
      .endAngle(d => arcScale(d));

    // Background arc (for the entire range)
    svg.append("path")
      .datum(100)  // Full 100% range
      .attr("d", arc)
      .attr("fill", "#e0e0e0");

    // Foreground arc (for the actual percentage)
    svg.append("path")
      .datum(percentage)
      .attr("d", arc)
      .attr("fill", "#28a745")
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attrTween("d", function(d) {
        const interpolate = d3.interpolate(0, d);
        return t => arc(interpolate(t));
      });

    // Add text in the middle of the gauge
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .attr("font-size", "32px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(`${percentage}%`);

    // Add label below the percentage text
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("font-size", "16px")
      .attr("fill", "#666")
      .text("Delay Prediction");

  }, [percentage]);

  return <svg ref={svgRef}></svg>;
};

export default DelayPredictionGauge;
