import * as d3 from "d3";
import * as React from 'react';
import * as d3Sankey from "d3-sankey"
import Loading from './loading';

// Inspiration from Observable, Inc.
    function SankeyChart({
        nodes,
        links 
    }, {
        format = ",", 
        align = "justify", 
        nodeId = d => d.id, 
        nodeGroup, 
        nodeGroups, 
        nodeLabel, 
        nodeTitle = d => `${d.id}\n${format(d.value)}`,
        nodeAlign = align, 
        nodeWidth = 15, 
        nodePadding = 10,
        nodeLabelPadding = 6,
        nodeStroke = "currentColor",
        nodeStrokeWidth,
        nodeStrokeOpacity, 
        nodeStrokeLinejoin, 
        linkSource = ({source}) => source, 
        linkTarget = ({target}) => target, 
        linkValue = ({value}) => value,
        linkPath = d3Sankey.sankeyLinkHorizontal(), 
        linkTitle = d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`,
        linkColor = "source-target",
        linkStrokeOpacity = 0.5,
        linkMixBlendMode = "multiply", 
        colors = d3.schemeTableau10,
        width = 640, 
        height = 400, 
        marginTop = 5, 
        marginRight = 1, 
        marginBottom = 5, 
        marginLeft = 1,
    } = {}) {
        if (typeof nodeAlign !== "function") nodeAlign = {
        left: d3Sankey.sankeyLeft,
        right: d3Sankey.sankeyRight,
        center: d3Sankey.sankeyCenter
        }[nodeAlign] ?? d3Sankey.sankeyJustify;
    
        const LS = d3.map(links, linkSource).map(intern);
        const LT = d3.map(links, linkTarget).map(intern);
        const LV = d3.map(links, linkValue);
        if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), id => ({id}));
        const N = d3.map(nodes, nodeId).map(intern);
        const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    
        nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
        links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i], value: LV[i]}));
    
        if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";
    
        if (G && nodeGroups === undefined) nodeGroups = G;
    
        console.log(nodeGroups)
        const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
    
        d3Sankey.sankey()
            .nodeId(({index: i}) => N[i])
            .nodeAlign(nodeAlign)
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
        ({nodes, links});
    
        if (typeof format !== "function") format = d3.format(format);
        const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel);
        const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
        const Lt = linkTitle == null ? null : d3.map(links, linkTitle);
    
        const uid = `O-${Math.random().toString(16).slice(2)}`;
    
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('id', 'disaster-types-svg')
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    
        const node = svg.append("g")
            .attr("stroke", nodeStroke)
            .attr("stroke-width", nodeStrokeWidth)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .attr("stroke-linejoin", nodeStrokeLinejoin)
        .selectAll("rect")
        .data(nodes)
        .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr('class', 'title-rect')
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0);
    
        if (G) node.attr("fill", ({index: i}) => color(G[i]));
        if (Tt) node.append("title").text(({index: i}) => Tt[i]);
    
        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", linkStrokeOpacity)
        .selectAll("g")
        .data(links)
        .join("g")
            .style("mix-blend-mode", linkMixBlendMode);
    
        if (linkColor === "source-target") link.append("linearGradient")
            .attr("id", d => `${uid}-link-${d.index}`)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", d => d.source.x1)
            .attr("x2", d => d.target.x0)
            .call(gradient => gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", ({source: {index: i}}) => color(G[i])))
            .call(gradient => gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", ({target: {index: i}}) => color(G[i])));
    
        link.append("path")
            .attr("d", linkPath)
            .attr("stroke", linkColor === "source-target" ? ({index: i}) => `url(#${uid}-link-${i})`
                : linkColor === "source" ? ({source: {index: i}}) => color(G[i])
                : linkColor === "target" ? ({target: {index: i}}) => color(G[i])
                : linkColor)
            .attr("stroke-width", ({width}) => Math.max(1, width))
            .call(Lt ? path => path.append("title").text(({index: i}) => Lt[i]) : () => {});
    
        if (Tl) svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 14)
        .selectAll("text")
        .data(nodes)
        .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(({index: i}) => Tl[i]);
    
        function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
        }
    
        return Object.assign(svg.node(), {scales: {color}});
        // return <></>
    }

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function DisasterTypes(props) {
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([])

    const drawFunc = () =>{

        // removing older svgs
        try {   
            d3.selectAll('#disaster-types-svg').remove();
        } catch {
            // nothing
        }

        // extracting data as needed from data
        const curData = [];
        data.forEach(d => {
            curData.push({
                'Group': d['Disaster Group'] === '' ? 'Other Natural Disasters' : d['Disaster Group'],
                'Subgroup': d['Disaster Subgroup'] === '' ? 'No further classification' : d['Disaster Subgroup'],
                'Type': d['Disaster Type']  === '' ? 'No further classification' : d['Disaster Type'],
                'Subtype': d['Disaster Subtype']  === ''  || d['Disaster Subtype']  ===  d['Disaster Type']
                    ? 'No further sub-classification' : d['Disaster Subtype'],
                'Subsubtype': d['Disaster Subsubtype']  === '' ||  d['Disaster Subsubtype']  === d['Disaster Subtype']
                    ? 'No further subsub-classification' : 'Subsubtype: ' + d['Disaster Subsubtype'],
            })
        })

        const plotData = [];
        curData.forEach(d => {
            var found;

            // subgroups and types
            found = false;
            plotData.forEach(existingEle => {
                if (existingEle.source === d.Subgroup
                && existingEle.target === d.Type){
                    existingEle.value++;   
                    found = true;
                }
            })

            if (!found){
                plotData.push({
                    source: d.Subgroup,
                    target: d.Type,
                    value: 1,
                })
            }

            // Types and subtype
            found = false;
            plotData.forEach(existingEle => {
                if (existingEle.source === d.Type
                && existingEle.target === d.Subtype){
                    existingEle.value++;   
                    found = true;
                }
            })

            if (!found){
                plotData.push({
                    source: d.Type,
                    target: d.Subtype,
                    value: 1,
                })
            }

            // Subtypes and subsubtypes
            found = false;
            plotData.forEach(existingEle => {
                if (existingEle.source === d.Subtype
                && existingEle.target === d.Subsubtype){
                    existingEle.value++;   
                    found = true;
                }
            })

            if (!found){
                plotData.push({
                    source: d.Subtype,
                    target: d.Subsubtype,
                    value: 1,
                })
            }
        })

        const ele = SankeyChart({
            links: plotData
            }, {
            nodeGroup: d => d.id,
            nodeAlign:'justify', 
            linkColor:'source', 
            format: (f => d => `${f(d)} Occurances`)(d3.format(",.1~f")),
            width:1200,
            height:1000,
            });


        const parent = document.getElementById('viz-div-sankey');
        parent.appendChild(ele);
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

    React.useEffect(() => {
        if (!isLoading) drawFunc();
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
                padding: '20px',
                }}
            >
                <p
                    id="vineeth_heading_sankey"
                    data-aos="zoom-in" data-aos-delay="100"
                    className="mt-5 text-2xl"
                >
                    Disaster Types
                </p>

            <div id='viz-div-sankey'
                data-aos="zoom-in" data-aos-delay="400"
            >
            </div>
                
            </main>
        </>
    );
}
