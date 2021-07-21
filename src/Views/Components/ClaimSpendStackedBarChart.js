import * as d3 from "d3";
import React, { useRef, useEffect } from 'react';

const width = 1000;
const height = 300;
const margin = {top: 20, right: 30, bottom: 40, left: 40};
const color = "steelblue";


String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
const removeKey = (propKey, { [propKey]: propValue, ...rest }) => rest;
const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");

export const ClaimSpendStackedBarChart = ({ data }) => {
    const d3Container = useRef(null);

    useEffect(
        () => {
            if (data && d3Container.current) {

                const svg = d3.select(d3Container.current)
                      .attr("viewBox", [0, 0, width, height]);

                var div = d3.select("body").append("div")	
                    .attr("class", "tooltip")				
                    .style("opacity", 100);

                const x = d3.scaleBand()
                      .domain(data.map(d => d.date))
                      .range([margin.left, width - margin.right])
                      .padding(0.1);

                const columns = Array.from(new Set(data.map(i => Object.keys(removeKey('date', i))).flat(1))).sort();
                const series = d3.stack()
                      .keys(columns)(data)
                      .map(d => (d.forEach(v => v.key = d.key), d));

                const hexCodes = d3.schemeBlues[Math.max(3, series.length)];
                const colorNames = columns.map(i => i.toProperCase());
                const colors = colorNames.map(function(e, i) {
                    return [e, hexCodes[i]];
                });
                const color = d3.scaleOrdinal()
                      .domain(series.map(d => d.key))
                      .range(hexCodes)
                      .unknown("#ccc");

                const y = d3.scaleLinear()
                      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
                      .range([height - margin.bottom, margin.top]);

                const xAxis = g => g
                      .attr("transform", `translate(0,${height - margin.bottom})`)
                      .call(d3.axisBottom(x).tickSizeOuter(0))
                      .call(g => g.selectAll(".domain").remove());
                
                const yAxis = g => g
                      .attr("transform", `translate(${margin.left},0)`)
                      .call(d3.axisLeft(y).ticks(null, "s"))
                      .call(g => g.selectAll(".domain").remove());

                svg.append("g")
                    .selectAll("g")
                    .data(series)
                    .join("g")
                    .attr("fill", d => color(d.key))
                    .selectAll("rect")
                    .data(d => d)
                    .join("rect")
                    .attr("x", (d, i) => x(d.data.date))
                    .attr("y", d => y(d[1]))
                    .attr("height", d => y(d[0]) - y(d[1]))
                    .attr("width", x.bandwidth())
                    .append("title")
                    .text(d => `${d.data.date} ${d.key}:  $${formatValue(d.data[d.key])}`);

                svg.append("g")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", "2em")
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "end");

                svg.append("g")
                    .call(yAxis);

                var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("height", 300)
                    .attr("width", 400)
                    .attr('transform', 'translate(-50,5)');

                var legendRect = legend.selectAll('rect').data(colors);

                legendRect.enter()
                    .append("rect")
                    .attr("x", width - 65)
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("y", (d, i) => i * 15)
                    .style("fill", (d, i) => d[1]);
                
                var legendText = legend.selectAll('text').data(colors);
                
                legendText.enter()
                    .append("text")
                    .attr("x", width - 52)
                    .attr("y", (d, i) => i * 15 + 9)
                    .text((d, i) => d[0])
                    .style("font-size", 10);
                
            }
        }, [data, d3Container.current])
    
    return (
        <svg
          className="d3-component"
          ref={d3Container}
          />
    )
};

