import * as d3 from "d3";
import Slider from '@mui/material/Slider';
import * as React from 'react';
import './aidPolitics.css'
import Box from '@mui/material/Box';
import Loading from './loading.js';
import Button from '@mui/material/Button';
import { useNavigate, useParams} from "react-router-dom";
const cloud = require("d3-cloud");

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";

export default function AidPoliticsYes(props) {
    const {start, end} = useParams();
    console.log('Aid analytics for year', start, end);

    const [data, setData] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    React.useEffect(() => {
        setTimeout(() => {
            d3.csv(datasetLink)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
        }, 1000);
    }, []);

    React.useEffect(() => {
        const drawAidPolitics = () => {
            const svg = d3.select('#svg-viz');
            svg.selectAll('*').remove();

            var tooltip = d3
                .select(".visual-div")
                .append("div")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("z-index", "10")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");

            const checkDate = (d) => {
                return Number(d['Start Year']) >= start && Number(d['Start Year']) <= end;
            }

            var yesData = data.filter(d => d['Appeal'] === 'Yes' && checkDate(d));

            console.log(yesData); 

            // getting set of continents
            const continentSet = new Set();
            yesData.forEach(d => {
                continentSet.add(d['Continent']);
            })
            const continentArray = new Array();
            continentSet.forEach(d => {
                continentArray.push(d);
            });
            console.log(continentArray);

            // Aggregating all aids given to countries
            const countrySet = new Set();
            yesData.forEach(d => {
                countrySet.add(d['Country']);
            })
            const countryArray = new Array();
            countrySet.forEach(d => {
                countryArray.push({Country: d, Aid: 0});
            })
            yesData.forEach(d => {
                countryArray.forEach(cData => {
                    if (cData['Country'] === d['Country']){
                        var aidAMt = d["AID Contribution ('000 US$)"];
                        aidAMt === '' ? aidAMt = 0 : aidAMt = Number(aidAMt);
                        cData['Aid'] += aidAMt;

                        // adding continent
                        cData['Continent'] = d['Continent']
                    }
                })
            })
            // console.log(countryArray);

            var maxAmt = -Infinity;
            var minAmt = Infinity;
            countryArray.forEach(d => {
                if (d['Aid'] > maxAmt){
                    maxAmt = d['Aid'];
                } 

                if (d['Aid'] < minAmt){
                    minAmt = d['Aid']
                }
            })

            // making scales
            var color = d3.scaleOrdinal()
                .domain(continentArray)
                .range(d3.schemeSet1);

            var size = d3.scaleLinear()
                .domain([minAmt - 100, maxAmt + 100])
                .range([20, 60]);

            var node = svg.append("g")
                .selectAll("circle")
                .data(countryArray)
                .enter()
                .append("circle")
                .attr("class", "country-circle")
                .attr("id", d => d['Country']+'-'+d['Aid'])
                .attr("r", d => {
                    if (d['Aid'] === 0){
                        return 10;
                    }
                    return size(d['Aid'])
                })
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .style("fill", d => { 
                    return color(d['Continent'])
                })
                .style("fill-opacity", 0.8)
                .attr("stroke", "black")
                .style("stroke-width", 1)
                .on("mouseover", function (e, d) {
                    tooltip.style("opacity", 1);
                  })
                .on("mousemove", function (e, d) {  
                    const countryName = e.currentTarget.id.split('-')[0];
                    const aidAmount = e.currentTarget.id.split('-')[1];
                    var toolTipStr = 
                        aidAmount > 0 ? `${countryName} received ${aidAmount}000 USD in aid`
                        : `${countryName} received no recorded aid`;
                    tooltip
                      .html(toolTipStr)
                      .style("left", e.pageX + 20 + "px")
                      .style("top", e.pageY + "px");
                  })
                  .on("mouseout", function (e, d) {
                    tooltip.style("opacity", 0);
                  });

            var simulation = d3.forceSimulation()
                .force("center", d3.forceCenter().x(width / 2).y(height / 2))
                .force("charge", d3.forceManyBody().strength(.1))
                .force("collide", d3.forceCollide().strength(.2).radius( d => { return (size(d['Aid']) + 4) }).iterations(1))

            simulation
                .nodes(countryArray)
                .on("tick", function(d){
                  node
                      .attr("cx", function(d){ return d.x; })
                      .attr("cy", function(d){ return d.y; })
                });
        }

        if (!isLoading) drawAidPolitics();
    }, [isLoading]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <>
            <main
                style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                }}
            >
                <p
                id="vineeth_heading"
                >
                    International Aid Visualization: Countries which appealed for international aid
                </p>
                <div className="visual-div">
                    <div className="svg-div">
                        <svg id="svg-viz" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                        </svg>
                    </div>
                </div>
            </main>
        </>
    );
}
