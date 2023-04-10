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

    React.useEffect(() => {
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

            // draw for yes
            var layout = cloud()
                .size([width, height])
                .words(yesData.map(function(d) { return {text: d['Country']}; }))
                .padding(5)
                .rotate(-45)
                .fontSize(20)
                .on("end", yesDraw);
            layout.start();

            function yesDraw(words) {
                yesSvg
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                        .data(words)
                    .enter().append("text")
                        .style("font-size", 20)
                        .style("fill", "#69b3a2")
                        .attr("text-anchor", "middle")
                        .style("font-family", "Impact")
                        .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function(d) { return d.text; });
            }

            // draw for no
            layout = cloud()
                .size([width, height])
                .words(noData.map(function(d) { return {text: d['Country']}; }))
                .padding(5)
                .rotate(-45)
                .fontSize(20)
                .on("end", noDraw);
            layout.start();

            function noDraw(words) {
                noSvg
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                        .data(words)
                    .enter().append("text")
                        .style("font-size", 20)
                        .style("fill", "#69b3a2")
                        .attr("text-anchor", "middle")
                        .style("font-family", "Impact")
                        .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function(d) { return d.text; });
            }
        }

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
                </div>
            </main>
        </>
    );
}
