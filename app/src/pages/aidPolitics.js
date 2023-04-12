import * as d3 from "d3";
import Slider from '@mui/material/Slider';
import * as React from 'react';
import './aidPolitics.css'
import Box from '@mui/material/Box';
import Loading from './loading.js';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
const cloud = require("d3-cloud");

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function AidPolitics(props) {
    const [yearRange, setYearRange] = React.useState([1900, 2023]);
    const [data, setData] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);
    const [changeState, setChangeState] = React.useState(true);
    const navigate = useNavigate();

    const navigateTo = (route) => {
        return function() {
            navigate(route+"/"+yearRange[0]+"/"+yearRange[1]);
        }
    }

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    React.useEffect(() => {
        setTimeout(() => {
            d3.csv(datasetLink)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
        }, 1000);
    }, []);

    const drawAidPolitics = () => {
        const yesSvg = d3.select('#yes-svg');
        yesSvg.selectAll('*').remove();
        const noSvg = d3.select('#no-svg');
        noSvg.selectAll('*').remove();

        const checkDate = (d) => {
            return Number(d['Start Year']) >= yearRange[0] && Number(d['Start Year']) <= yearRange[1];
        }

        var yesData = data.filter(d => d['Appeal'] === 'Yes' && checkDate(d));
        var noData = data.filter(d => d['Appeal'] === 'No' && checkDate(d));

        // getting set of continents
        const continentSet = new Set();
        data.forEach(d => {
            continentSet.add(d['Continent']);
        })
        const continentArray = [];
        continentSet.forEach(d => {
            continentArray.push(d);
        });
        console.log(continentArray);

        // making scales
        var color = d3.scaleOrdinal()
            .domain(continentArray)
            .range(d3.schemeSet1);

        // draw for yes
        const yesDraw = (words) => {
            yesSvg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-size", 20)
                .style("fill", d => {
                    return color(d['Continent'])
                })
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", d => {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(d =>  { return d.text; });
        }

        var layout = cloud()
            .size([width, height])
            .words(yesData.map( d => {return {'text': d['Country'], 'Continent': d['Continent']}}))
            .padding(5)
            .rotate(-45)
            .fontSize(20)
            .on("end", yesDraw);
        layout.start();

        // draw for no
        const noDraw = (words) =>  {
            noSvg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-size", 20)
                .style("fill", d => {
                    return color(d['Continent'])
                })                    
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", d => {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(d =>  { return d.text; });
        }

        layout = cloud()
            .size([width, height])
            .words(noData.map( d => {return {'text': d['Country'], 'Continent': d['Continent']}}))
            .padding(5)
            .rotate(-45)
            .fontSize(20)
            .on("end", noDraw);
        layout.start();

        const svg = d3.select('#legend-viz');
        svg.selectAll('*').remove();

        svg.selectAll("legend-circle")
            .data(continentArray)
            .enter()
            .append("circle")
            .attr("cx", 30)
            .attr("cy", (d, i) => {return height/3 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 9)
            .style("fill", d => {return color(d)})
            .style("fill-opacity", 0.7)
            .attr("stroke", "black")
            .style("stroke-width", 0.4)

        svg.selectAll("legend-labeks")
            .data(continentArray)
            .enter()
            .append("text")
            .attr("x", 50)
            .attr("y",  (d,i) => { return height/3 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", d => { return color(d)})
            .text( d => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }

    React.useEffect(() => {
        if (!isLoading) drawAidPolitics();
    }, [changeState, isLoading]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    const handleYearChange = (event, newValue) => {
        setYearRange(newValue);
    }

    const yearRangeText = (value) => {
        return `${value}`;
    }

    const handleViz = () => {
        setChangeState(d => !d);
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
                    International Aid Visualization: Select Range of Years
                </p>
                <p>
                    <Box sx={{ width: 500 }}>
                        <Slider
                            getAriaLabel={() => 'Year range'}
                            value={yearRange}
                            onChange={handleYearChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={yearRangeText}
                            disableSwap
                            step={1}
                            min={1900}
                            max={2023}
                        /> 
                    </Box>
                </p>

                <p>
                    <Button variant="contained" onClick={handleViz}>Visualize</Button>
                </p>

                <div className="visual-div">
                    <div id="yes-div" className="svg-div" onClick={navigateTo('/aid-politics-yes')}>
                        <p>Appealed for International Aid</p>
                        <svg id="yes-svg" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}></svg>
                    </div>

                    <div id="no-div" className="svg-div">
                        <p>Didn't Appeal</p>
                        <svg id="no-svg" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}></svg>
                    </div>

                    <div className="legend-div">
                        <svg id="legend-viz" width={width/3 + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                        </svg>
                    </div>
                </div>

                <p>Countries that appealed as well as didn't appeal on various occasions are visualized in both the word clouds</p>
            </main>
        </>
    );
}
