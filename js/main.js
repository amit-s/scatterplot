import * as d3 from 'd3';

let width = 1000;
let height = 550;

let margin = {
	top: 30,
	right: 100,
	bottom: 50,
	left: 100
};

let dopingColor = "rgba(255,0,0,1)";
let noDopingColor = "rgba(70,130,180,1)";

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

	let xAxis = d3.axisBottom()
					.scale(xScale);

	let yAxis = d3.axisLeft()
					.scale(yScale);					

	let circles = svg.selectAll("circle")
					.data(data);

	let text = svg.selectAll("text")
					.data(data);

	circles.enter()
			.append("circle")
			.attr("cx", d=>xScale(secondsCount(fastestTime,d.Time)))
			.attr("cy", d=>yScale(d.Place))
			.attr("r", "5")
			.attr("fill", d=>d.Doping.length > 1 ? dopingColor : noDopingColor)
			.on('mouseover', function(d,i){
				//console.log("here");


				d3.select("#infoBox")
					.classed("hidden", false);
					
				d3.select("#infoBox")
					.style("top", "200px")
					.style("left", "200px");

				d3.select("#nameInfo")
					.text(`${d.Place}. ${d.Name} - ${d.Nationality}`);

				d3.select("#stats")
					.text(`Year:${d.Year} , Time:${d.Time} (+${secondsCount(fastestTime,d.Time)} seconds)`);

				d3.select("#doping")
					.text(d.Doping);				
			})
			.on('mouseout', function(){
				d3.select("#infoBox")										
					.classed("hidden", true);
			});
			

	text.enter()
		.append("text")
		.text(d=>d.Name)
		.attr("x", d=>xScale(secondsCount(fastestTime,d.Time))+7)
		.attr("y", d=>yScale(d.Place)+3)
		.attr("font-size", "0.7em")
		.attr("class", d=>d.Doping.length>1 ? "nameLabel" : "")
		.on('click', d=>{
			if(d.Doping.length>1){
				window.open(d.URL, '_blank' );
			}else{
				return null;
			}
		});

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(0, ${height-margin.bottom})`)
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(${margin.left})`)
		.call(yAxis);



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