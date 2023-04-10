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

            const checkDate = (d) => {
                return Number(d['Start Year']) >= start && Number(d['Start Year']) <= end;
            }

            var yesData = data.filter(d => d['Appeal'] === 'Yes' && checkDate(d));

            console.log(yesData); 

            
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
