import * as d3 from 'd3';

let width = 1000;
let height = 500;

let margin = {
	top: 30,
	right: 100,
	bottom: 50,
	left: 100
};

let svg = d3.select("#scatterplot")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

svg.append("rect")			
	.attr("x",0)
	.attr("y",0)
	.attr("width", width)
	.attr("height", height)
	.attr("fill", "white");

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', drawScatter);

function drawScatter(dataJSON){
	let data = dataJSON;
	let fastestTime = data[0].Time;
	let slowestTime = data[data.length-1].Time;
	let secCount = secondsCount(fastestTime,slowestTime);
	//console.log(d3.timeSecond.count(time2,time1));
	

	let xScale = d3.scaleLinear()
					.domain([0, secCount])
					.range([margin.left, width - margin.right]);

	let yScale = d3.scaleLinear()
					.domain([0, d3.max(data, d=>d.Place)])
					.range([height - margin.bottom, margin.top]);

	

	let circles = svg.selectAll("circle")
					.data(data);

	circles.enter()
			.append("circle")
			.attr("cx", d=>xScale(secondsCount(fastestTime,d.Time)))
			.attr("cy", d=>yScale(d.Place))
			.attr("r", "5");



}

function secondsCount(start, end){
	let parseTime = d3.timeParse("%M:%S");
	let startTime = parseTime(start);
	let endTime = parseTime(end);
	
	return d3.timeSecond.count(startTime, endTime);
}



/*let parseTime = d3.timeParse("%M:%S");
	let baseTime = parseTime(data[0].Time);
	let endTime = d3.timeSecond.count(baseTime, parseTime(data[data.length-1].Time));*/