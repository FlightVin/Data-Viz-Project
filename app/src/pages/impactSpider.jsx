import * as d3 from 'd3';
import { useEffect, useState, useRef } from "react";
import Select from 'react-select'
import './impactSpider.css'

const disFilePath = 'https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv';

export default function ImpactSpider(props) {
    const [disasterdata, SetDData] = useState(null); // contains the average data of each part and type
    const [graph, SetGraph] = useState(null);
    const [magParts, SetMagParts] = useState(null); // needed for labels and colour of clouds
    const [type, SetType] = useState("Earthquake");
    const [typearray, SetTypeArray] = useState(['Earthquake', 'Wildfire', 'Flood', 'Storm', 'Extreme temperature ', 'Drought', 'Landslide', 'Volcanic activity', 'Epidemic', 'Insect infestation'])
    const [Scale, SetScale] = useState(null);
    const [UnitArray, SetUnitArray] = useState({
        'Earthquake': "Richter", 'Wildfire': "Km2", 'Flood': "Km2", 'Storm': "Kph", 'Extreme temperature ': "°C", 'Drought': "Km2", 'Landslide': "Kph", 'Volcanic activity': "Kph", 'Epidemic': "Vaccinated", 'Insect infestation': "km2"
    });
    const [clicked, SetClick] = useState(null)
    const [bardata, SetBarData] = useState(null);

    useEffect(() => {
        const getdisasterdata = async () => {

            try {
                const disasterdata = await d3.csv(disFilePath, d => ({
                    "Type": d["Disaster Type"],
                    "Magnitude": +d["Dis Mag Value"],
                    "Ttl_Deaths": +d["Total Deaths"],
                    "Ttl_Injured": +d["No Injured"],
                    "Ttl_Affected": +d["No Affected"],
                    "Ttl_Homeless": +d["No Homeless"],
                    "Reconstruction_Cost": +d["Reconstruction Costs ('000 US$)"],
                    "Insured_Damage": +d["Insured Damages ('000 US$)"],
                    "Total_Damage": +d["Total Damages ('000 US$)"],
                    "CPI": +d["CPI"]
                }));

                // console.log(disasterdata)
                // SetDData(disasterdata);

                // Group data by Disaster Type and find maximum Dis Mag Value for each group
                const maxDisMagValues = Array.from(d3.rollup(disasterdata,
                    g => d3.max(g, d => d["Magnitude"]),
                    d => d["Type"]
                ));

                // console.log(maxDisMagValues);
                // output: [["Drought", 2.3], ["Earthquake", 9.1], ["Extreme temperature", 4.4], ... ]

                // Calculate four parts of the total magnitude for each group
                const magParts = maxDisMagValues.map(([type, maxMag]) => {
                    const magPart = maxMag / 4;

                    return [type, magPart, magPart * 2, magPart * 3, maxMag];
                });

                // console.log(magParts);
                // output: [["Drought", 0.575, 1.15, 1.725, 2.3], ["Earthquake", 2.275, 4.55, 6.825, 9.1], ["Extreme temperature", 1.1, 2.2, 3.3, 4.4], ... ]


                const magparts_type = magParts.filter(d => d[0] == type)

                SetMagParts(magparts_type)
                // Remove the "Type" column from the average_type array

                // Add new property to each element indicating which part it belongs to
                const dataWithPart = disasterdata.filter(d => d.Magnitude != 0)
                    .map(d => {
                        const [type, magPart1, magPart2, magPart3, maxMag] = magParts.find(([t]) => t === d["Type"]);
                        let part;
                        if (d["Magnitude"] <= magPart1) {
                            part = 1;
                        } else if (d["Magnitude"] <= magPart2) {
                            part = 2;
                        } else if (d["Magnitude"] <= magPart3) {
                            part = 3;
                        } else {
                            part = 4;
                        }
                        return { ...d, part };
                    });


                // Calculate average values for each part and column
                const averages = Array.from(d3.rollup(dataWithPart,
                    v => ({
                        "Type": v[0]["Type"],
                        "Part": v[0]["part"],
                        "Total Deaths": d3.mean(v, d => d["Ttl_Deaths"]),
                        "Total Injured": d3.mean(v, d => d["Ttl_Injured"]),
                        "Total Affected": d3.mean(v, d => d["Ttl_Affected"]),
                        "Total Homeless": d3.mean(v, d => d["Ttl_Homeless"]),
                        "Total Reconstruction Cost": d3.mean(v, d => d["Reconstruction_Cost"]),
                        "Average Insured Damage": d3.mean(v, d => d["Insured_Damage"]),
                        "Total Damage Incurred": d3.mean(v, d => d["Total_Damage"])
                    }),
                    d => d["Type"] + d.part,
                ).values());

                const average_type = averages.filter(d => d.Type == type)
                // console.log(average_type)
                const allParts = [4, 3, 2, 1]; // replace with all possible part numbers

                const average_type_with_zero = allParts.map(part => {
                    const obj = average_type.find(d => d.Part === part);
                    return obj || {
                        "Type": type,
                        "Part": part,
                        "Total Deaths": 0,
                        "Total Injured": 0,
                        "Total Affected": 0,
                        "Total Homeless": 0,
                        "Total Reconstruction Cost": 0,
                        "Average Insured Damage": 0,
                        "Total Damage Incurred": 0
                    };
                });

                console.log(average_type_with_zero);

                // Remove the "Type" column from the average_type array
                const average_type_without_type = average_type_with_zero.map(({ Type, ...rest }) => rest);
                SetBarData(average_type_without_type)
                const averages_type_without_type1 = average_type_without_type.map(d => {
                    const axes = [
                        { axis: "Total Deaths", value: d["Total Deaths"] },
                        { axis: "Total Injured", value: d["Total Injured"] },
                        { axis: "Total Affected", value: d["Total Affected"] },
                        { axis: "Total Homeless", value: d["Total Homeless"] },
                        { axis: "Total Reconstruction Cost (in $)", value: d["Total Reconstruction Cost"] },
                        { axis: "Average Insured Damage (in $)", value: d["Average Insured Damage"] },
                        { axis: "Total Damage Incurred (in $)", value: d["Total Damage Incurred"] }
                    ];
                    return [...axes];
                });


                console.log(averages_type_without_type1);
                SetDData(averages_type_without_type1);


            } catch (error) {
                console.error(error);
            }
        }

        if (type) {
            getdisasterdata();

        }
    }, [type])

    useEffect(() => {
        const RadarChart = (id, data, options) => {
            var cfg = {
                w: 600,				//Width of the circle
                h: 600,				//Height of the circle
                margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
                levels: 4,				//How many levels or inner circles should there be drawn
                maxValue: 0, 			//What is the value that the biggest circle will represent
                labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
                wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
                opacityArea: 0.35, 	//The opacity of the area of the blob
                dotRadius: 4, 			//The size of the colored circles of each blog
                opacityCircles: 0.1, 	//The opacity of the circles of each blob
                strokeWidth: 2, 		//The width of the stroke around each blob
                roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
                color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
                format: '.0f',		//The format function for the text on the axes
            }

            //Put all of the options into a variable called cfg
            if ('undefined' !== typeof options) {
                for (var i in options) {
                    if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
                }
            }

            // Transpose the data array
            const transposedData = d3.transpose(data);
            // Calculate the maximum value for each column
            const maxValuesArray = transposedData.map(function (column) {
                const maxVal = d3.max(column, function (d) { return d.value; });
                const axis = column[0].axis;
                return { axis: `Max_${axis}`, value: maxVal };
            });

            //If the supplied maxValue is smaller than the actual one, replace by the max in the data
            var maxValue = d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })) });

            var allAxis = (data[0].map(function (i, j) { return i.axis })),	//Names of each axis
                total = allAxis.length,					//The number of different axes
                radius = Math.min(cfg.w / 2, cfg.h / 2),	//Radius of the outermost circle
                Format = d3.format('.0%'),			 	//Formatting
                angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

            //Scale for the radius
            var rScale = d3.scaleLinear()
                .range([0, radius])
                .domain([0, maxValue]);

            //Remove whatever chart with the same id/class was present before
            d3.select(id).select("svg").remove();

            //Initiate the radar chart SVG
            var svg = d3.select(id).append("svg")
                .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
                .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
                .attr("class", "radar" + id);
            //Append a g element		
            var g = svg.append("g")
                .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

            /////////////////////////////////////////////////////////
            ////////// Glow filter for some extra pizzazz ///////////
            /////////////////////////////////////////////////////////

            //Filter for the outside glow
            var filter = g.append('defs').append('filter').attr('id', 'glow'),
                feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur'),
                feMerge = filter.append('feMerge'),
                feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
                feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

            /////////////////////////////////////////////////////////
            /////////////// Draw the Circular grid //////////////////
            /////////////////////////////////////////////////////////

            //Wrapper for the grid & axes
            var axisGrid = g.append("g").attr("class", "axisWrapper");
            //Draw the background circles
            axisGrid.selectAll(".levels")
                .data(d3.range(1, (cfg.levels + 1)).reverse())
                .enter()
                .append("circle")
                .attr("class", "gridCircle")
                .attr("r", function (d, i) {
                    return radius / cfg.levels * d;
                })
                .style("fill", "#CDCDCD")
                .style("stroke", "#CDCDCD")
                .style("fill-opacity", cfg.opacityCircles)
                .style("filter", "url(#glow)");

            //Text indicating at what % each level is
            axisGrid.selectAll(".axisLabel")
                .data(d3.range(1, (cfg.levels + 1)).reverse())
                .enter().append("text")
                .attr("class", "axisLabel")
                .attr("x", 4)
                .attr("y", function (d) {
                    return -d * radius / cfg.levels;
                })
                .attr("dy", "0.4em")
                .style("font-size", "10px")
                .attr("fill", "#737373")
                .text(function (d, i) {
                    // console.log(d)
                    return Format(d / cfg.levels);
                });

            ////till here we just made concentric circles and percent values
            /////////////////////////////////////////////////////////
            //////////////////// Draw the axes //////////////////////
            /////////////////////////////////////////////////////////

            //Create the straight lines radiating outward from the center
            var axis = axisGrid.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");
            //Append the lines
            axis.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", function (d, i) { return (rScale(maxValue * 1.1) - 70) * Math.cos(angleSlice * i - Math.PI / 2); })
                .attr("y2", function (d, i) { return (rScale(maxValue * 1.1) - 70) * Math.sin(angleSlice * i - Math.PI / 2); })
                .attr("class", "line")
                .style("stroke", "white")
                .style("stroke-width", "2px");

            //Append the labels at each axis
            axis.append("text")
                .attr("class", "legend")
                .style("font-size", "20px")
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .attr("x", function (d, i) { return (rScale(maxValue * cfg.labelFactor) - 80) * Math.cos(angleSlice * i - Math.PI / 2); })
                .attr("y", function (d, i) { return (rScale(maxValue * cfg.labelFactor) - 80) * Math.sin(angleSlice * i - Math.PI / 2); })
                .text(function (d) { return d })
                .call(wrap, cfg.wrapWidth);

            //// lines
            /////////////////////////////////////////////////////////
            ///////////// Draw the radar chart blobs ////////////////
            /////////////////////////////////////////////////////////

            //The radial line function
            var radarLine = d3.lineRadial()
                .curve(d3.curveBasisClosed)
                .radius(function (d) {
                    const maxValueObj = maxValuesArray.find(function (b) {
                        return b.axis === `Max_${d.axis}`;
                    });
                    if (maxValueObj.value === 0) {
                        return 0;
                    }
                    return rScale((d.value / maxValueObj.value) * maxValue);
                })
                .angle(function (d, i) { return i * angleSlice; });

            if (cfg.roundStrokes) {
                radarLine.curve(d3.curveCardinalClosed);
            }

            //Create a wrapper for the blobs	
            var blobWrapper = g.selectAll(".radarWrapper")
                .data(data)
                .enter().append("g")
                .attr("class", "radarWrapper");

            //Append the backgrounds	
            blobWrapper
                .append("path")
                .attr("class", "radarArea")
                .attr("d", function (d, i) {
                    return radarLine(d);
                })
                .style("fill", function (d, i) {
                    return cfg.color(i);
                })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d, i) {
                    //Dim all blobs
                    d3.selectAll(".radarArea")
                        .transition().duration(200)
                        .style("fill-opacity", 0.1);
                    //Bring back the hovered over blob
                    d3.select(this)
                        .transition().duration(200)
                        .style("fill-opacity", 0.7);
                })
                .on('mouseout', function () {
                    //Bring back all blobs
                    d3.selectAll(".radarArea")
                        .transition().duration(200)
                        .style("fill-opacity", cfg.opacityArea);
                });

            //Create the outlines	
            blobWrapper.append("path")
                .attr("class", "radarStroke")
                .attr("d", function (d, i) {
                    return radarLine(d);
                })
                .style("stroke-width", cfg.strokeWidth + "px")
                .style("stroke", function (d, i) {
                    return cfg.color(i);
                })
                .style("fill", "none")
                .style("filter", "url(#glow)");

            //Append the circles
            blobWrapper.selectAll(".radarCircle")
                .data(function (d, i) { return d; })
                .enter().append("circle")
                .attr("class", "radarCircle")
                .attr("r", cfg.dotRadius)
                .attr("cx", function (d, i) {
                    const maxValueObj = maxValuesArray.find(function (b) {
                        return b.axis === `Max_${d.axis}`;
                    });
                    if (maxValueObj.value === 0) {
                        return 0;
                    }
                    return rScale((d.value / maxValueObj.value) * maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
                })
                .attr("cy", function (d, i) {
                    const maxValueObj = maxValuesArray.find(function (b) {
                        return b.axis === `Max_${d.axis}`;
                    });
                    if (maxValueObj.value === 0) {
                        return 0;
                    }
                    return rScale((d.value / maxValueObj.value) * maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
                })
                .style("fill", function (d, i, j) {
                    return cfg.color(j);
                })
                .style("fill-opacity", 0.8);


            /////////////////////////////////////////////////////////
            //////// Append invisible circles for tooltip ///////////
            /////////////////////////////////////////////////////////

            //Wrapper for the invisible circles on top
            var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
                .data(data)
                .enter().append("g")
                .attr("class", "radarCircleWrapper");
            const formatter = d3.format(",.0f");
            //Append a set of invisible circles on top for the mouseover pop-up
            blobCircleWrapper.selectAll(".radarInvisibleCircle")
                .data(function (d, i) { return d; })
                .enter().append("circle")
                .attr("class", "radarInvisibleCircle")
                .attr("r", cfg.dotRadius * 1.5)
                .attr("cx", function (d, i) {
                    const maxValueObj = maxValuesArray.find(function (b) {
                        return b.axis === `Max_${d.axis}`;
                    });
                    if (maxValueObj.value === 0) {
                        return 0;
                    }
                    return rScale((d.value / maxValueObj.value) * maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
                })
                .attr("cy", function (d, i) {
                    const maxValueObj = maxValuesArray.find(function (b) {
                        return b.axis === `Max_${d.axis}`;
                    });
                    if (maxValueObj.value === 0) {
                        return 0;
                    }
                    return rScale((d.value / maxValueObj.value) * maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
                })
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function (d, i) {
                    const newX = parseFloat(d3.select(this).attr('cx')) - 10;
                    const newY = parseFloat(d3.select(this).attr('cy')) - 10;
                    const maxValueObj = maxValuesArray.find(function (b) {
                        return b.axis === `Max_${i.axis}`;
                    });
                    if (maxValueObj.value === 0) {
                        maxValueObj.value = 100000000000
                    }
                    tooltip
                        .attr('x', newX)
                        .attr('y', newY)
                        .text(formatter(i.value))
                        .transition().duration(200)
                        .style('opacity', 1);
                })
                .on("mouseout", function () {
                    tooltip.transition().duration(200)
                        .style("opacity", 0);
                });

            //Set up the small tooltip for when you hover over a circle
            var tooltip = g.append("text")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("font-size", "20px")
                ;

            //////////////////////////////////////////////////////////
            /////////////////// Legend ///////////////////////////////
            /////////////////////////////////////////////////////////
            var legendData = [
                { name: "Magnitude", color: "white" },
                { name: `${magParts[0][3]} - ${magParts[0][4]} `, color: "#EDC951" },
                { name: `${magParts[0][2]} - ${magParts[0][3]}`, color: "#CC333F" },
                { name: `${magParts[0][1]} - ${magParts[0][2]}`, color: "#00A0B0" },
                { name: `0 - ${magParts[0][1]}`, color: "#8B008B" }
            ];
            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (cfg.w) + ", 20)");

            var legendRect = legend.selectAll("rect")
                .data(legendData)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", function (d, i) { return i * 40; })
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", function (d) { return d.color; });

            var legendText = legend.selectAll("text")
                .data(legendData)
                .enter()
                .append("text")
                .attr("font-size", "30px")
                .attr("x", 20)
                .attr("y", function (d, i) { return i * 40 + 18; })
                .text(function (d) { return d.name; });

            /////////////////////////////////////////////////////////
            /////////////////// Helper Function /////////////////////
            /////////////////////////////////////////////////////////

            //Taken from http://bl.ocks.org/mbostock/7555321
            //Wraps SVG text	
            function wrap(text, width) {
                text.each(function () {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.4, // ems
                        y = text.attr("y"),
                        x = text.attr("x"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });
            }//wrap	


            /// bar chart 

        }
        const Chart1 = (dataKey, color, type) => {

            const margin = { top: 20, right: 200, bottom: 30, left: 60 };
            const width = 700;
            const height = 700;

            const svg = d3.select(".barChart1").append("svg")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .style("position", "absolute")
                .style("top", "200px")
                .style("left", "0px")
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            var tooltip = d3
                .select(".example-container")
                .append("div")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("z-index", "10")
                .style("background-color", "white")
                .style("border", "solid")
                .style("font-size", "30px")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(bardata.map(d => d.Part));

            const y = d3.scaleLog()
                .range([height, 0])
                .domain([1, d3.max(bardata, d => d[dataKey])]);

            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .append("text")
                .attr("y", 25)
                .attr("x", width / 1.25)
                .attr("font-size", "25px")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text("Magnitude Parts(defined in legend)");

            svg.append('g')
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y",60)
                .attr("font-size", "25px")
                .attr("x", -height / 2.5)
                .attr("dy", "-4em")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text(dataKey.charAt(0).toUpperCase() + dataKey.slice(1));

            svg.selectAll('.bar')
                .data(bardata)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.Part))
                .attr('y', d => y(d[dataKey]))
                .style("fill", function (d, i) {
                    return color(i);
                })
                .on("mouseover", function () {
                    tooltip.style("opacity", 1);
                })
                // Add mouseover event to circles
                .on("mousemove", function (event, d) {
                    d3.select(this).attr("r", 10);
                    tooltip
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .html(
                            `<div>${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}: ${d[dataKey]}</div>`
                        )
                        .attr("font-size", "10px");
                })
                .on("mouseout", function () {
                    d3.select(this).attr("r", 8);
                    tooltip.style("opacity", 0);
                })
                .attr('width', x.bandwidth())
                .attr('height', d => height - y(d[dataKey]))

            var legendData = [
                { name: `${magParts[0][3]} - ${magParts[0][4]} `, color: "#EDC951" },
                { name: `${magParts[0][2]} - ${magParts[0][3]}`, color: "#CC333F" },
                { name: `${magParts[0][1]} - ${magParts[0][2]}`, color: "#00A0B0" },
                { name: `0 - ${magParts[0][1]}`, color: "#8B008B" }
            ];

        }


        const Chart = (dataKey, color, type) => {
            const margin = { top: 100, right: 100, bottom: 100, left: 100 };
            const width = 40;
            const height = 40;

            var cfg = {
                w: Math.min(1500, window.innerWidth - 10) - margin.left - margin.right,
                h: Math.min(Math.min(1500, window.innerWidth - 10) - margin.left - margin.right, window.innerHeight - margin.top - margin.bottom - 20),
                margin: { top: 100, right: 100, bottom: 100, left: 100 }
            }
            //If the supplied maxValue is smaller than the actual one, replace by the max in the data
            var maxValue = d3.max(disasterdata, function (i) { return d3.max(i.map(function (o) { return o.value; })) });

            //Scale for the radius
            var rScale = d3.scaleLinear()
                .range([0, 150])
                .domain([0, maxValue]);

            const svg = d3.select(".barChart").append("svg")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('transform', `translate(${(cfg.w / 2 + cfg.margin.left)}, ${(cfg.h / 2 + cfg.margin.top)})`)


            const angleSlice = Math.PI * 2 / 7;
            var p = 0;
            if (cfg.w < 1300) {
                p = 4.8 * (cfg.w/1300)
            }
            else {
                p = 4.8
            }
            svg.style('position', 'absolute')
                .style('top', rScale(maxValue * p) * Math.sin(angleSlice * type - Math.PI / 2 + Math.PI / 45))
                .style('left', rScale(maxValue * p) * Math.cos(angleSlice * type - Math.PI / 2 + Math.PI / 45))
                .append('g')


            var tooltip = d3
                .select(".example-container")
                .append("div")

                .style("opacity", 0)
                .style("position", "absolute")
                .style("z-index", "10")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)

                .domain(bardata.map(d => d.Part));

            const y = d3.scaleLog()
                .range([height, 0])
                .domain([1, d3.max(bardata, d => d[dataKey])]);

            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .append("text")
                .attr("y", 27)
                .attr("x", width / 1.2)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("font-size", width / 10 + "px")
                .text("Magnitude Parts(defined in legend)");

            svg.append('g')
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("x", -height / 2.5)
                .attr("dy", "-4em")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("font-size", width / 10 + "px")
                .text(dataKey.charAt(0).toUpperCase() + dataKey.slice(1));

            svg.selectAll('.bar')
                .data(bardata)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.Part))
                .attr('y', d => y(d[dataKey]))
                .style("fill", function (d, i) {
                    return color(i);
                })
                .on("mouseover", function () {
                    tooltip.style("opacity", 1);
                })
                // Add mouseover event to circles
                .on("mousemove", function (event, d) {
                    d3.select(this).attr("r", 10);
                    tooltip
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .html(
                            `<div>${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}: ${d[dataKey]}</div>`
                        )
                        .attr("font-size", "10px");
                })
                .on("mouseout", function () {
                    d3.select(this).attr("r", 8);
                    tooltip.style("opacity", 0);
                })
                .on("click", function () {
                    d3.select('.barChart1').selectAll("svg").remove();

                    Chart1(dataKey, color, type);


                })
                .attr('width', x.bandwidth())
                .attr('height', d => height - y(d[dataKey]));
        }

        if (disasterdata && bardata && !graph) {
            var margin = { top: 100, right: 100, bottom: 100, left: 100 },
                width = Math.min(1500, window.innerWidth - 10) - margin.left - margin.right,
                height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

            // console.log(disasterdata);
            var color = d3.scaleOrdinal()
                .range(["#EDC951", "#CC333F", "#00A0B0", "#8B008B"]);

            var radarChartOptions = {
                w: width,
                h: height,
                margin: margin,
                maxValue: 0.5,
                levels: 4,
                roundStrokes: true,
                color: color
            };
            //Call function to draw the Radar chart
            RadarChart(".radarChart", disasterdata, radarChartOptions);
            // Remove the previously drawn SVG
            console.log(d3.select('.barChart').select("svg"))
            d3.select('.barChart').selectAll("svg").remove();

            Chart("Total Deaths", color, 0);

            Chart("Total Injured", color, 1)
            Chart("Total Affected", color, 2)
            Chart("Total Homeless", color, 3)
            Chart("Total Reconstruction Cost", color, 4)
            Chart("Average Insured Damage", color, 5)
            Chart("Total Damage Incurred", color, 6)

        }
    }, [disasterdata]);

    const handleOptionChange = (event) => {
        SetType(event.target.value);
    };


    return (
        <div className='example-container'>
            <div className='custom-select'>
                <div className='custom-select'>
                    {typearray && (
                        <div>
                            <select
                                value={type}
                                onChange={handleOptionChange}
                                className="select"
                            >
                                {typearray.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

            </div>
            <div className='units'>
                Units of Magnitude is : {UnitArray[type]}
            </div>
            <div className="chart-container">
                <div className='radarChart'></div>
                <div className='barChart'></div>

            </div>
            <br />
            <br />


            <div>

                <div className='barChart1'></div>
            </div>


        </div >
    );
}

