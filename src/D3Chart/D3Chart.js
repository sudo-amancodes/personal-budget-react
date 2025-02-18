import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import axios from "axios";

const D3Chart = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      const fetchData = async () => {
        try {
          var { data } = await axios.get("http://localhost:3001/budget");
          data = data.myBudget.map((item) => ({
            category: item.title,
            budget: item.budget,
          }));

          drawChart(data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      //   const labels = data.myBudget.map((item) => item.title);

      //   const dataValues = data.myBudget.map((item) => item.budget);

      //   const new_data = [{ ...labels, ...dataValues }];
      fetchData();
    }
  }, []);

  const drawChart = (data) => {
    d3.select(d3Container.current).select("svg").remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.category))
      .attr("y", (d) => yScale(d.budget))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - margin.bottom - yScale(d.budget))
      .attr("fill", "#36A2EB");
  };

  return <div ref={d3Container} />;
};

export default D3Chart;
