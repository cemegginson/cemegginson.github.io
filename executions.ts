"use strict";

import * as d3 from 'd3';
import * as _ from 'lodash';

// We'll make this global since it should be useful.
let years = _.range(1977, 2015);

function GenerateGraph(data_row, iter:number) {
    // define dimensions of graph
    let margins:number[] = [80, 80, 80, 80];
    let width:number = 1000 - margins[1] - margins[3];
    let height:number = 400 - margins[0] - margins[2];

    // create a simple data array that we'll plot with a line (this array
    // represents only the Y values, X will just be the index location)
    // X scale will fit all values from data[] within pixels 0-w
    let x = d3.scale.linear().domain([1977, 2014]).range([0, height]);
    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted
    // domain for the y-scale: bigger is up!)
    let y = d3.scale.linear().domain([0, 10]).range([height, 0]);
    // automatically determining max range can work something like this
    // let y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
    // create a line function that can convert data[] into x and y points
    let line = d3.svg.line()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; })
        .interpolate("basis");
    // Add an SVG element with the desired dimensions and margin.
    let div_element = "#graph_" + iter;
    let graph = d3.select(div_element).append("svg:svg")
          .attr("width", width + margins[1] + margins[3])
          .attr("height", height + margins[0] + margins[2])
        .append("svg:g")
          .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");
    // create yAxis
    let xAxis = d3.svg.axis().scale(x).tickSize(-height); //.tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
    // create left yAxis
    let yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);

    // Add the line by appending an svg:path element with the data line
    // we created above do this AFTER the axes above so that the line is
    // above the tick-lines

    graph.append("svg:path").attr("d", line(data_row));
}

let current_graph:number = 1;
d3.csv("data/cp_executed.csv", function(data){
for (let i in data) {
    let actual_data:number[] = [];
    for (let j in years) {
        actual_data.push(parseInt(data[i][j]))
    }
    GenerateGraph(data[i], current_graph);
    current_graph++;
}
});
