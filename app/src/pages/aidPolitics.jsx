import * as d3 from "d3";
import Slider from '@mui/material/Slider';
import * as React from 'react';
import './aidPolitics.css'
import Box from '@mui/material/Box';
import Loading from './loading';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Tree from 'react-d3-tree';
import CircularProgress from '@mui/material/CircularProgress';
import Header from "../partials/Header";
import AidPoliticsYes from "./aidPoliticsYes";

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function AidPolitics(props) {
    const [yearRange, setYearRange] = React.useState([1900, 2023]);
    const [data, setData] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);
    const [changeState, setChangeState] = React.useState(true);
    const [treeData, setTreeData] = React.useState({});
    const [vizLoading, setVizLoading] = React.useState(false);
    const navigate = useNavigate();

    const navigateTo = (route) => {
        return function() {
            navigate(route);
        }
    }

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
        // console.log(continentArray);

        // making scales
        var color = d3.scaleOrdinal()
            .domain(continentArray)
            .range(d3.schemeSet1);

        const countrySet = new Set();
        yesData.forEach(d => {
            countrySet.add(d['Country']);
        })
        var countryArray = [];
        countrySet.forEach(d => {
            countryArray.push({Country: d, AidCalls: []});
        })
        yesData.forEach(d => {
            countryArray.forEach(cData => {
                if (cData['Country'] === d['Country']){
                    cData['AidCalls'].push(d.Year);

                    // adding continent
                    cData['Continent'] = d['Continent']
                }
            })
        })
        function compareByName(a, b) {
            const nameA = a.Country.toUpperCase(); 
            const nameB = b.Country.toUpperCase(); 
            if (nameA < nameB) {
              return -1;
            }
          
            if (nameA > nameB) {
              return 1;
            }
                      return 0;
        }

        countryArray.sort(compareByName)
        
        /*
            data in countryArray
                AidCalls -  array of years in which they appealed for aid
                Continent
                Country
        */

        // formatting tree data from countryArray
        const curYesTreeData = {
            name: 'Yes',
            children: [],
        };

        // adding subdivision of continents
        continentArray.forEach(c => {
            curYesTreeData.children.push({
                name: c,
                children: [],
            })
        })

        // pushing contries onto the object
        countryArray.forEach(d => {
            curYesTreeData.children.forEach(continent => {
                if (continent.name === d.Continent){
                    const yearArray = [];
                    d['AidCalls'].forEach(y => {
                        yearArray.push({
                            name: y,
                        })
                    })

                    continent.children.push({
                        name: d.Country.slice(0, 14),
                        children: yearArray,
                    })
                }
            })
        })

        // doing the same for no data
        countryArray = []
        countrySet.forEach(d => {
            countryArray.push({Country: d, AidCalls: []});
        })
        noData.forEach(d => {
            countryArray.forEach(cData => {
                if (cData['Country'] === d['Country']){
                    cData['AidCalls'].push(d.Year);

                    // adding continent
                    cData['Continent'] = d['Continent']
                }
            })
        })

        // formatting tree data from countryArray
        const curNoTreeData = {
            name: 'No',
            children: [],
        };

        // adding subdivision of continents
        continentArray.forEach(c => {
            curNoTreeData.children.push({
                name: c,
                children: [],
            })
        })

        // pushing contries onto the object
        countryArray.forEach(d => {
            curNoTreeData.children.forEach(continent => {
                if (continent.name === d.Continent){
                    const yearArray = [];
                    d['AidCalls'].forEach(y => {
                        yearArray.push({
                            name: y,
                        })
                    })

                    continent.children.push({
                        name: d.Country.slice(0, 14),
                        children: yearArray,
                    })
                }
            })
        })

        const curTreeData = {
            name: 'Appealed for aid?',
            children:[
                curYesTreeData,
                curNoTreeData
            ]
        }

        setTreeData(curTreeData);
    }

    React.useEffect(() => {
        setVizLoading(true);
        setTimeout(() => {
            if (!isLoading) drawAidPolitics();
            setVizLoading(false);
        }, 1000);
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
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                padding: '20px',
                }}
            >
                <div className="w-full flex items-center justify-center flex-col">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="mt-24 text-2xl"
                    >
                        Aid requests
                    </p>
                    <p>
                        <Box sx={{ width: 500 }}
                        >
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
                

                    <div style={{display: 'flex', justifyContent: 'space-between'}}
                    >
                        <Button variant="outlined" onClick={handleViz}>Visualize</Button> 
                    </div>
                </div>


                <div className="w-full flex flex-row items-center">
                    <div className="visual-div flex items-center justify-center ml-32" style={{ width: '800px', height: '500px' }}>
                        {
                            !vizLoading ? 
                                <Tree 
                                    data={treeData} 
                                    separation= {{ nonSiblings: 0.5, siblings: 0.3 }}    
                                    translate={{x:180, y:150}}
                                    depthFactor={200}
                                    rootNodeClassName="node__root"
                                    branchNodeClassName="node__branch"
                                    leafNodeClassName="node__leaf"
                                />


                            :
                                <CircularProgress />
                        }
                    </div>

                    <div className="ml-48 w-96">
                    <p className="text-xl text-slate-700 hover:text-gray-500 mb-10 text-justify"
                    data-aos="zoom-out" data-aos-delay="350">
The collapsible chart categorises countries into those that have requested international aid and those that have not. The chart can be expanded to reveal additional information such as the years.
                    </p>
                    <p className="text-xl text-slate-700 hover:text-gray-500 text-justify"
                    data-aos="zoom-out" data-aos-delay="350">
In the map, circles are positioned as close together as possible without overlapping and are colour-coded to represent different continents. Hovering over a circle displays information about the country, the type of disaster, and the amount of aid received. 
                    </p>
                    </div>
                </div>


                <div className="map-div">
                    {
                        !vizLoading ? 
                            <AidPoliticsYes start={yearRange[0]} end={yearRange[1]} data={data}/>

                        :
                            <CircularProgress />
                    }
                    
                </div>
            </main>
        </>
    );
}