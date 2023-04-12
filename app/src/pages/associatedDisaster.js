import * as d3 from "d3";
import * as React from 'react';
import Loading from './loading.js';

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";

export default function AssociatedDisaster(props) {
    const [data, setData] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);

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
            console.log(data);
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

        </>
    );
}
