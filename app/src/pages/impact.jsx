import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";
import "./impactSpider.css";

const disFilePath =
  "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";

export default function ImpactSpider(props) {
  const [disasterdata, SetDData] = useState(null); // contains the average data of each part and type
  const [graph, SetGraph] = useState(null);
  const [type, SetType] = useState("Earthquake");
  const [typearray, SetTypeArray] = useState([
    "Earthquake",
    "Wildfire",
    "Extreme temperature ",
    "Drought",
    "Landslide",
    "Volcanic activity",
    "Epidemic",
    "Insect infestation",
  ]);
  const [UnitArray, SetUnitArray] = useState({
    'Earthquake': "Richter", 'Wildfire': "Km2", 'Flood': "Km2", 'Storm': "Kph", 'Extreme temperature ': "°C", 'Drought': "Km2", 'Landslide': "Kph", 'Volcanic activity': "Kph", 'Epidemic': "Vaccinated", 'Insect infestation': "km2"
  });

  useEffect(() => {
    const getdisasterdata = async () => {
      try {
        const disasterdata = await d3.csv(disFilePath, (d) => ({
          Declaration: d["Declaration"],
          Magnitude: +d["Dis Mag Value"],
          Type: d["Disaster Type"],
        }));
        const disasterdata1 = disasterdata.filter(
          (d) => d["Declaration"] === "Yes" || d["Declaration"] === "No"
        );
        console.log(disasterdata1);
        const disasterdata2 = disasterdata1.filter((d) => d["Type"] === type);

        // count of yes and no for each magnitude
        const countYes = d3.rollup(
          disasterdata2,
          (v) => d3.sum(v, (d) => d.Declaration === "Yes"),
          (d) => d.Magnitude
        );
        const countNo = d3.rollup(
          disasterdata2,
          (v) => d3.sum(v, (d) => d.Declaration === "No"),
          (d) => d.Magnitude
        );

        // count of total occurrences for each magnitude
        const countTotal = d3.rollup(
          disasterdata2,
          (v) => v.length,
          (d) => d.Magnitude
        );

        // combine the above counts for each magnitude
        const magCounts = Array.from(countTotal.entries()).map(
          ([magnitude, totalCount]) => {
            const yesCount = countYes.get(magnitude) || 22;
            const noCount = countNo.get(magnitude) || 0;
            return {
              magnitude:
                (type === "Earthquake" && magnitude === 0 ? 2 : magnitude) || (type === "Drought" && magnitude === 0 ? 521800 : magnitude) || (type === "Landslide" && magnitude === 0 ? 30000 : magnitude) || (type === "Volcanic activity" && magnitude === 0 ? 100 : magnitude),
              yesCount,
              noCount,
              totalCount,
            };
          }
        );
        magCounts.sort((a, b) => a.magnitude - b.magnitude);

        SetDData(magCounts);
      } catch (error) {
        console.error(error);
      }
    };
    if (type) {
      getdisasterdata();
    }
  }, [type]);

  useEffect(() => {
    if (disasterdata) {
      // Assuming each object in the disasterarray has a "magnitude" property
      var magnitudes = disasterdata.map((d) => d.magnitude);

      // Sorting the magnitudes in ascending order
      magnitudes.sort((a, b) => a - b);
      console.log(magnitudes.length);

      var cfg = {
        w: magnitudes.length * 15, //Width of the graph
        h: 1000, // height of graph
        margin: { top: 20, right: 50, bottom: 100, left: 100 }, //The margins of the SVG
      };
      if (cfg.w < 1200) {
        cfg.w = 1200;
      }
      console.log(disasterdata);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(disasterdata, (d) => d.totalCount)])
        .range([cfg.h, 0]); // adjust the range as per your requirement
      // Set up x-axis scale
      magnitudes.push(d3.max(disasterdata, (d) => d.magnitude) + 1);
      const xScale = d3
        .scalePoint()
        .domain(
          magnitudes.map(function (d) {
            return d;
          })
        )
        .range([0, cfg.w]);

      // Remove whatever chart with the same id/class was present before
      d3.select("#my_dataviz").select("svg").remove();

      var svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + cfg.margin.left + "," + cfg.margin.top + ")"
        );

      // Create and render x and y axis
      const xAxis = d3.axisBottom(xScale).tickSize(0);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + (cfg.margin.left + 1) + "," + cfg.h + ")"
        )
        .call(xAxis);

      svg.selectAll("text").attr("transform", "translate(20,0)");

      var tooltip = d3
        .select(".example-container")
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + cfg.margin.left + "," + (cfg.margin.top - 20) + ")"
        )
        .call(yAxis)
        .selectAll("text")
        .attr("font-size", "16px");

      // Create a group element to hold the circles
      const circlesGroup = svg.append("g");
      var p = 0;
      // Create a loop to append the circles
      for (let j = 0; j < disasterdata.length; j++) {
        const x = disasterdata[j]["magnitude"];
        const yescount = disasterdata[j]["yesCount"];
        const nocount = disasterdata[j]["noCount"];
        for (let i = 0; i < yescount; i++) {
          circlesGroup
            .append("circle")
            .attr("cx", xScale(x) + cfg.margin.left + 20) // set the x position
            .attr("cy", yScale(i) + cfg.margin.top - 24) // set the y position
            .attr("r", 8) // set the radius
            .style("fill", "green") // set the fill color
            .style("opacity", "0.7")
            .on("mouseover", function () {
              tooltip.style("opacity", 1);
            })
            // Add mouseover event to circles
            .on("mousemove", function (event, d) {
              d3.select(this).attr("r", 10);
              tooltip
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(
                  `Magnitude: ${x}` +
                  "</br>" +
                  `Emergency declared:${yescount}` +
                  "</br>" +
                  `Not Declared: ${nocount}` +
                  "</br>" +
                  `Total Occurrences: ${yescount + nocount}`
                )
                .attr("font-size", "10px");
            })
            .on("mouseout", function () {
              d3.select(this).attr("r", 8);
              tooltip.style("opacity", 0);
            });
        }
        for (let i = 0; i < nocount; i++) {
          circlesGroup
            .append("circle")
            .attr("cx", xScale(x) + cfg.margin.left + 20) // set the x position
            .attr("cy", yScale(i + yescount) + cfg.margin.top - 24) // set the y position
            .attr("r", 8) // set the radius
            .style("fill", "red") // set the fill color
            .style("opacity", "0.7")
            .on("mouseover", function () {
              tooltip.style("opacity", 1);
            })
            .on("mousemove", function (event, d) {
              d3.select(this).attr("r", 10);
              tooltip
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(
                  `Magnitude: ${x}` +
                  "</br>" +
                  `Emergency declared: ${yescount}` +
                  "</br>" +
                  `Not Declared: ${nocount}` +
                  "</br>" +
                  `Total Occurrences: ${yescount + nocount}`
                )
                .attr("font-size", "10px");
            })
            .on("mouseout", function () {
              d3.select(this).attr("r", 8);
              tooltip.style("opacity", 0);
            });
        }
      }



      const legend = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + cfg.w / 1.5 + "," + (cfg.margin.top + 10) + ")"
        )
        .selectAll("g")
        .data(["Emergency was declared", "Emergency was not declared"])
        .enter()
        .append("g")
        .attr("transform", (d, i) => "translate(" + i * 1 + ",0)");

      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", (d, i) => 10 + i * 20)
        .attr("r", 6)
        .style("fill", (d) =>
          d === "Emergency was declared" ? "red" : "green"
        );

      legend
        .append("text")
        .attr("x", 13)
        .attr("y", (d, i) => 10 + i * 20)
        .attr("dy", ".35em")
        .text((d) => d)
        .style("font-size", "15px");

      // Add x-axis label
      svg
        .append("text")
        .attr("x", cfg.w / 2 + cfg.margin.left)
        .attr("y", cfg.h + 40)
        .attr("text-anchor", "middle")
        .text("Magnitude");

      // Add y-axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - cfg.h / 2)
        .attr("y", cfg.margin.left - 60)
        .attr("text-anchor", "middle")
        .text("Number of occurrences");

      svg
        .selectAll(".domain")
        .style("stroke", "black")
        .style("stroke-width", "1px");

      svg
        .selectAll(".tick line")
        .style("stroke", "black")
        .style("stroke-width", "0.8px");

      svg
        .selectAll(".tick text")
        .style("fill", "black")
        .style("font-size", "12px");
    }
  }, [disasterdata]);

  const handleOptionChange = (event) => {
    SetType(event.target.value);
  };

  return (
    <div className="example-container">
      <div className="custom-select">
        <div className="custom-select">
          {typearray && (
            <div>
              <select
                value={type}
                onChange={handleOptionChange}
                className="select"
              >
                {typearray.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>


      </div>
      <div>
        Units of Magnitude is : <strong>{UnitArray[type]}</strong>
        <br />
        <strong>
          Impact of Disasters by Magnitude
        </strong>
      </div>

      <div id="my_dataviz"></div>
    </div>
  );
}
