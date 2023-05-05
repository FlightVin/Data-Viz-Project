import * as d3 from "d3";
import * as React from 'react';
import Loading from './loading';
import Header from "../partials/Header";

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";

export default function AssociatedDisaster(props) {
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([])

    React.useEffect(() => {
        setTimeout(() => {
            d3.csv(datasetLink)
                .then(res => {
                    const retData = {
                        name:'natural',
                        children: [

                        ]
                    };

                    const disasterData = [];
                    res.forEach(d => {
                        disasterData.push({
                            type1: d['Disaster Type'],
                            type2: d['Associated Dis'],
                            type3: d['Associated Dis2'],
                        })
                    })

                    const type1Set = new Set();
                    disasterData.forEach(d => {
                        type1Set.add(d.type1);
                    })
                    const type1Array = [];
                    type1Set.forEach(d => {
                        type1Array.push(d);
                    })

                    // first level of data
                    type1Array.forEach(type1Dis => {

                        const pushVal = {
                            name: type1Dis,
                            children: [],
                        }

                        const type2Set = new Set();
                        disasterData.forEach(d => {
                            if (d.type1 === type1Dis){
                                type2Set.add(d.type2 === '' ? 'No subsequent disasters' : d.type2);
                            }
                        })
                        const type2Array = [];
                        type2Set.forEach(d => {
                            type2Array.push(d);
                        })

                        // 2nd level of data
                        type2Array.forEach(type2Dis => {
                            const type2Obj = {
                                name: type2Dis,
                                children: [],
                            }

                            const type3Set = new Set();
                            disasterData.forEach(d => {
                                if (d.type1 === type1Dis && d.type2 === type2Dis){
                                    type3Set.add(d.type3 === '' ? 'No subsequent disasters' : d.type3);
                                }
                            })
                            const type3Array = [];
                            type3Set.forEach(d => {
                                type3Array.push(d);
                            })

                            // 3rd level of data
                            type3Array.forEach(type3Dis => {
                                const type3Obj = {
                                    name: type3Dis,
                                    value: 0,
                                }

                                disasterData.forEach(d => {
                                    const type1Name = type1Dis;
                                    const type2Name = type2Dis === 'No subsequent disasters' ? '' : type2Dis;
                                    const type3Name = type3Dis === 'No subsequent disasters' ? '' : type3Dis;

                                    if (d.type1 === type1Name 
                                        && d.type2 === type2Name
                                        && d.type3 === type3Name){
                                            type3Obj.value++;
                                        }
                                })

                                type2Obj.children.push(type3Obj);
                            })

                            pushVal.children.push(type2Obj)
                        })

                        retData.children.push(pushVal);
                    })

                    console.log(retData);

                    setData(retData);
                    setLoading(false);
                })
        }, 1000);
    }, []);


    React.useEffect(() => {
        const drawAssociations = () => {
            // removing older svgs
            try {   
                d3.selectAll('#associated-svg').remove();
            } catch {
                // nothing
            }
            
            // code to draw sunburst
            const width = 932;
            const radius = width / 6;
            const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
            const format = d3.format(",d");
            const arc = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                .padRadius(radius * 1.5)
                .innerRadius(d => d.y0 * radius)
                .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
            const partition = data => {
                const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => b.value - a.value);
                return d3.partition()
                    .size([2 * Math.PI, root.height + 1])
                  (root);
              }

                const chart = () =>  {
                    const root = partition(data);
                  
                    root.each(d => d.current = d);
                  
                    const svg = d3.create("svg")
                        .attr('id', 'associated-svg')
                        .attr("viewBox", [0, 0, width, width])
                        .style("font", "13px sans-serif");
                  
                    const g = svg.append("g")
                        .attr("transform", `translate(${width / 2},${width / 2})`);
                  
                    const path = g.append("g")
                        .selectAll("path")
                        .data(root.descendants().slice(1))
                        .join("path")
                            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
                            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                            .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
                    
                            .attr("d", d => arc(d.current));
                  
                    path.filter(d => d.children)
                        .style("cursor", "pointer")
                        .on("click", clicked);
                  
                    path.append("title")
                        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
                  
                    const label = g.append("g")
                            .attr("pointer-events", "none")
                            .attr("text-anchor", "middle")
                            .style("user-select", "none")
                        .selectAll("text")
                        .data(root.descendants().slice(1))
                        .join("text")
                            .attr("dy", "0.35em")
                            .attr("fill-opacity", d => +labelVisible(d.current))
                            .attr("transform", d => labelTransform(d.current))
                            .text(d => d.data.name);
                  
                    const parent = g.append("circle")
                        .datum(root)
                        .attr("r", radius)
                        .attr("fill", "none")
                        .attr("pointer-events", "all")
                        .on("click", clicked);
                  
                    function clicked(event, p) {
                        parent.datum(p.parent || root);
                    
                        root.each(d => d.target = {
                            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                            y0: Math.max(0, d.y0 - p.depth),
                            y1: Math.max(0, d.y1 - p.depth)
                        });
                    
                        const t = g.transition().duration(750);
                    
                        path.transition(t)
                            .tween("data", d => {
                                const i = d3.interpolate(d.current, d.target);
                                return t => d.current = i(t);
                            })
                            .filter(function(d) {
                            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                            })
                            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none") 
                    
                            .attrTween("d", d => () => arc(d.current));
                    
                        label.filter(function(d) {
                            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
                            }).transition(t)
                            .attr("fill-opacity", d => +labelVisible(d.target))
                            .attrTween("transform", d => () => labelTransform(d.current));
                    }
                    
                    function arcVisible(d) {
                        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
                    }
                  
                    function labelVisible(d) {
                        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
                    }
                  
                    function labelTransform(d) {
                        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                        const y = (d.y0 + d.y1) / 2 * radius;
                        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
                    }
                  
                    return svg.node();
            }

            const ele = chart();
            const parent = document.getElementById('viz-div-associated');
            parent.appendChild(ele);
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
            <Header/>

            <main
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                }}
            >

                <p
                    id="vineeth_heading_sankey"
                    data-aos="zoom-in" data-aos-delay="100"
                    className="mt-5 text-2xl"
                >
                    Associated Disasters: Disasters that lead to other disasters
                </p>

                <div id='viz-div-associated'
                    style={{
                        width: '900px',
                        marginTop:'30px'
                    }}
                    data-aos="zoom-in" data-aos-delay="400"
                    >

                </div>

            </main>
        </>
    );
}
