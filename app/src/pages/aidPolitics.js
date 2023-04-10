import * as d3 from "d3";
import Slider from '@mui/material/Slider';
import * as React from 'react';
import Box from '@mui/material/Box';
import Loading from './loading.js';

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function AidPolitics(props) {
    const [yearRange, setYearRange] = React.useState([1900, 2023]);
    const [data, setData] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            d3.csv(datasetLink)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
        }, 3000);
    }, []);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    const drawAidPolitics = () => {
        console.log(data.length);
    }

    const handleYearChange = (event, newValue) => {
        setYearRange(newValue);
    }

    const yearRangeText = (value) => {
        return `${value}`;
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
                International Aid Visualization
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
            </main>

            <div className="visual-div">

            </div>
            {drawAidPolitics()}
        </>
    );
}
