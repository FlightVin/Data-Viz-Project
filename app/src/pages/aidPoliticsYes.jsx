import * as d3 from "d3";
import * as React from 'react';
import './aidPolitics.css'
import worldImage from '../images/squares-world-new.jpg';

// for the image
const imgHeight = 736;
const imgWidth = 1600;
const scaleFactor = 0.8;
const viewHeight = imgHeight*scaleFactor;
const viewWidth = imgWidth*scaleFactor;

const boxSize = 400;


export default function AidPoliticsYes({start, end, data}) {
    console.log('Aid analytics for year', start, end);

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    React.useEffect(() => {
        const drawAidPolitics = () => {

            var tooltip = d3
                .select(".viz-div-map")
                .append("div")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("z-index", "10")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");

            const checkDate = (d) => {
                return Number(d['Start Year']) >= start && Number(d['Start Year']) <= end;
            }

            var yesData = data.filter(d => d['Appeal'] === 'Yes' && checkDate(d));

            // getting set of continents
            const continentSet = new Set();
            yesData.forEach(d => {
                continentSet.add(d['Continent']);
            })
            const continentArray = [];
            continentSet.forEach(d => {
                continentArray.push(d);
            });
            console.log(continentArray);

            // Aggregating all aids given to countries
            const countrySet = new Set();
            yesData.forEach(d => {
                countrySet.add(d['Country']);
            })
            const countryArray = [];
            countrySet.forEach(d => {
                countryArray.push({Country: d, Aid: 0});
            })
            yesData.forEach(d => {
                countryArray.forEach(cData => {
                    if (cData['Country'] === d['Country']){
                        var aidAMt = d["AID Contribution ('000 US$)"];
                        aidAMt === '' ? aidAMt = 0 : aidAMt = Number(aidAMt);
                        cData['Aid'] += aidAMt;

                        // adding continent
                        cData['Continent'] = d['Continent']
                    }
                })
            })
            // console.log(countryArray);

            var maxAmt = -Infinity;
            var minAmt = Infinity;
            countryArray.forEach(d => {
                if (d['Aid'] > maxAmt){
                    maxAmt = d['Aid'];
                } 

                if (d['Aid'] < minAmt){
                    minAmt = d['Aid']
                }
            })

            // making scales
            var color = d3.scaleOrdinal()
                .domain(continentArray)
                .range(d3.schemeSet1);

            var size = d3.scaleLinear()
                .domain([minAmt - 100, maxAmt + 100])
                .range([20, 60]);

            let USDollar = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            continentArray.forEach(continent => {
                console.log(continent);
                const curArray = countryArray.filter(d => d.Continent === continent);
                console.log(curArray);

                d3.select(`#id`+continent).remove();
                const svg = d3.select(`#${continent}`).append('svg')
                    .attr('width', boxSize)
                    .attr('height', boxSize)
                    .attr("transform", `translate(${-boxSize/2},${-boxSize/2})`)
                    .attr('id', 'id'+continent);

                var node = svg
                    .selectAll("circle")
                    .data(curArray)
                    .enter()
                    .append("circle")
                    .attr("class", "country-circle")
                    .style('z-index', 6)
                    .attr("cx", width / 2)
                    .attr("cy", height / 2)
                    .attr("id", d => d['Country']+'-'+d['Aid'])
                    .attr("r", d => {
                        if (d['Aid'] === 0){
                            return 10;
                        }
                        return size(d['Aid'])
                    })
                    .style("fill", d => { 
                        return color(d['Continent'])
                    })
                    .style("fill-opacity", 0.8)
                    .attr("stroke", "black")
                    .style("stroke-width", 0.6)
                    .on("mouseover", function (e, d) {
                        tooltip.style("opacity", 1);
                      })
                    .on("mousemove", function (e, d) {  
                        const countryName = e.currentTarget.id.split('-')[0];
                        const aidAmount = e.currentTarget.id.split('-')[1]*1000;
                        var toolTipStr = 
                            aidAmount > 0 ? `${countryName} received ${USDollar.format(aidAmount)} in aid`
                            : `${countryName} received no recorded aid`;
                        tooltip
                          .html(toolTipStr)
                          .style("left", e.pageX + 20 + "px")
                          .style("top", e.pageY + "px");
                      })
                      .on("mouseout", function (e, d) {
                        tooltip.style("opacity", 0);
                      });

                var simulation = d3.forceSimulation()
                    .force("center", d3.forceCenter().x(boxSize / 2).y(boxSize / 2))
                    .force("charge", d3.forceManyBody().strength(.1))
                    .force("collide", d3.forceCollide().strength(.2).radius( d => { return (size(d['Aid']) + 4) }).iterations(1))

                simulation
                    .nodes(curArray)
                    .on("tick", function(d){
                      node
                          .attr("cx", d => d.x)
                          .attr("cy", d => d.y)
                    });
            })

            d3.select('#legend-svg').remove();
            const svg = d3.select('#legend-viz').append('svg')
                .attr('width', boxSize)
                .attr('height', boxSize)
                .attr('id', 'legend-svg');

            svg.selectAll("legend-circle")
                .data(continentArray)
                .enter()
                .append("circle")
                .attr("cx", 100)
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
                .attr("x", 120)
                .attr("y",  (d,i) => { return height/3 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", d => { return color(d)})
                .text( d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }

        drawAidPolitics();
    }, []);

    return (
        <>
            <main
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                }}
                className="mr-4"
            >

                <div className="viz-div-map"
                    style={{
                        marginTop:'30px',
                        width:`${viewWidth*4/5}px`,
                        height:`${viewHeight*4/5}px`,
                    }}
                >

                    <div id='Asia'
                        style={{
                            position:'absolute',
                            marginLeft:`${viewWidth*0.76}px`,
                            marginTop:`${viewHeight*0.21}px`,
                            zIndex: 5,
                            width:1,
                            height:1,
                        }}
                    >
                    </div>

                    <div id='Africa'
                        style={{
                            position:'absolute',
                            marginLeft:`${viewWidth*0.53}px`,
                            marginTop:`${viewHeight*0.81}px`,
                            zIndex: 5,
                            width:1,
                            height:1,
                        }}
                    >
                    </div>

                    <div id='Oceania'
                        style={{
                            position:'absolute',
                            marginLeft:`${viewWidth*0.81}px`,
                            marginTop:`${viewHeight*0.72}px`,
                            zIndex: 5,
                            width:1,
                            height:1,
                        }}
                    >
                        
                    </div>

                    <div id='Europe'
                        style={{
                            position:'absolute',
                            marginLeft:`${viewWidth*0.49}px`,
                            marginTop:`${viewHeight*0.27}px`,
                            zIndex: 5,
                            width:1,
                            height:1,
                        }}
                    >
                        
                    </div>

                    <div id='Americas'
                        style={{
                            position:'absolute',
                            marginLeft:`${viewWidth*0.2}px`,
                            marginTop:`${viewHeight*0.5}px`,
                            zIndex: 5,
                            width:1,
                            height:1,
                        }}
                    >
                        
                    </div>

                    <div id='legend-viz'
                        style={{
                            position:'absolute',
                            marginLeft:`${viewWidth*0.86}px`,
                            marginTop:`${viewHeight*0.18}px`,
                            zIndex: 5,
                            width:1,
                            height:1,
                        }}
                    >
                        
                    </div>

                    <img className="h-full w-full opacity-50" 
                    src={worldImage} alt="Hero" 
                    />

                </div>
            </main>
        </>
    );
}
