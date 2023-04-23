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

        const countrySet = new Set();
        yesData.forEach(d => {
            countrySet.add(d['Country']);
        })
        const countryArray = [];
        countrySet.forEach(d => {
            countryArray.push({Country: d, AidCalls: 0});
        })
        yesData.forEach(d => {
            countryArray.forEach(cData => {
                if (cData['Country'] === d['Country']){
                    cData['AidCalls']++;

                    // adding continent
                    cData['Continent'] = d['Continent']
                }
            })
        })

        // console.log(countryArray);
        var treeData = {
            "name":"Countries that appealed for international aid",
            "pathColor":"black",
            "nodeColor":"white",
            "children":[
            ]
        }

        
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

                </div>
            </main>
        </>
    );
}
