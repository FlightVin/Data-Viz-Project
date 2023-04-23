import * as d3 from "d3";
import * as React from 'react';
import Loading from './loading';
import Header from "../partials/Header";

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function DisasterTypes(props) {
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([])

    React.useEffect(() => {
        setTimeout(() => {
            d3.csv(datasetLink)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
        }, 1000);
    }, []);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <>
            <Header/>
            <main
                style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: '20px',
                }}
            >
                <p
                id="vineeth_heading"
                >
                    Disaster Types
                </p>
                
            </main>
        </>
    );
}
