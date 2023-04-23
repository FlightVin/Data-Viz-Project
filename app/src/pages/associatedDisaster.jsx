import * as d3 from "d3";
import * as React from 'react';
import Loading from './loading';

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";

export default function AssociatedDisaster(props) {
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
        const drawAssociations = () => {
            // console.log(data);

            const disasterData = [];
            data.forEach(d => {
                disasterData.push({
                    type1: d['Disaster Type'],
                    type2: d['Associated Dis'],
                    type3: d['Associated Dis2'],
                })
            })

            console.log(disasterData);

            
        }

        if (!isLoading) drawAssociations();
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
                    Associated Disasters: Disasters that lead to other disasters
                </p>
                <div className="visual-div">
                    <div className="svg-div2">
                        <svg id="svg-viz" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                        </svg>
                        <svg id="legend-viz" width={width/3 + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                        </svg>
                    </div>
                </div>
            </main>
        </>
    );
}
