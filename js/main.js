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
			.attr("id","svg")
			.attr("width", width)
			.attr("height", height+20);

svg.append("rect")			
	.attr("x",0)
	.attr("y",0)
	.attr("width", width)
	.attr("height", height+20)
	.attr("fill", "white");

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', drawScatter);

function drawScatter(dataJSON){
	let data = dataJSON;
	let fastestTime = data[0].Time;
	let slowestTime = data[data.length-1].Time;
	let secCount = secondsCount(fastestTime,slowestTime);
	let radius = 5;
	
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
			.attr("r", radius)
			.attr("fill", d=>d.Doping.length > 1 ? dopingColor : noDopingColor)
			.on('mouseover', function(d,i){				
				d3.select(this)
					.transition()
					.attr("r","8");

				let xPos = document.getElementById("svg").getBoundingClientRect().left + 200;
				let yPos = 200;

				d3.select(`#label${i}`)					
					.style("font-size", "0.9em")
					.style("font-weight", "bold")
					.attr("transform", "translate(5,2)");

				d3.select("#infoBox")
					.classed("hidden", false);
					
				d3.select("#infoBox")					
					.style("top", `${yPos}px`)
					.style("left", `${xPos}px`)
					.style("background-color", d.Doping.length>1 ? dopingColor : noDopingColor)
					.style("color", "white");

				d3.select("#nameInfo")
					.text(`${d.Place}. ${d.Name} - ${d.Nationality}`);

				d3.select("#stats")
					.text(`Year: ${d.Year} , Time: ${d.Time} (+${secondsCount(fastestTime,d.Time)} seconds)`);

				d3.select("#doping")
					.text(d.Doping);				
			})
			.on('mouseout', function(d,i){
				d3.select("#infoBox")										
					.classed("hidden", true);
				
				d3.select(this)
					.transition()
					.attr("r", radius);

				d3.select(`#label${i}`)					
					.style("font-size", "0.7em")
					.style("font-weight", "normal");
			});
			

	text.enter()
		.append("text")
		.text(d=>d.Name)
		.attr("x", d=>xScale(secondsCount(fastestTime,d.Time))+7)
		.attr("y", d=>yScale(d.Place)+3)
		.attr("font-size", "0.7em")
		.attr("id", (d,i)=>`label${i}`)
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

	let legend = svg.append("g")
					.attr("transform", "translate(-50)");

	legend.append("rect")
			.attr("x", "740")
			.attr("y", "380")
			.attr("width", "200")
			.attr("height", "60")
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("stroke-width", "2")
			.attr("stroke-dasharray", "24, 5");

	legend.append("circle")
		.attr("cx", "750")
		.attr("cy", "400")
		.attr("r", "5")
		.attr("fill", noDopingColor);
	
	legend.append("text")
		.text("No doping allegations")		
		.attr("x", "760")
		.attr("y", "405")
		.attr("font-size", "0.9em");

	legend.append("circle")
		.attr("cx", "750")
		.attr("cy", "420")
		.attr("r", "5")
		.attr("fill", dopingColor);
	
	legend.append("text")
		.text("Riders with doping allegations")		
		.attr("x", "760")
		.attr("y", "425")
		.attr("font-size", "0.9em");

	svg.append("text")
		.text("ranking")
		.style("letter-spacing", "1em")
		.style("font-size", "2em")
		.attr("transform", `translate(50,400) rotate(270)`);

	svg.append("text")
		.text("seconds behind fastest time")
		.style("font-size", "1.3em")
		.style("word-spacing", "1.5em")
		.style("letter-spacing", "0.4em")
		.attr("transform", "translate(240,540)");

	let heading = svg.append("g")
					.attr("transform", "translate(100)");

	heading.append("text")
			.text("Doping in Professional Bicycle Racing")
			.attr("x","150")
			.attr("y", "50")
			.style("font-size", "2em")
			.style("text-shadow", "2px 2px 5px rgba(0,0,0,0.5)");

	heading.append("text")
			.text("35 Fastest times up Alpe d'Huez")
			.attr("x", "230")
			.attr("y", "80")
			.style("font-size", "1.6em");

	heading.append("text")
			.text("Normalized to 13.8km distance")
			.attr("x", "260")
			.attr("y", "100")
			.style("font-size", "1.4em");
}

function secondsCount(start, end){
	let parseTime = d3.timeParse("%M:%S");
	let startTime = parseTime(start);
	let endTime = parseTime(end);	
	return d3.timeSecond.count(startTime, endTime);
}