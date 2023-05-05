import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import Box from "@mui/material/Box";
import "./geoDistro.css";
import Slider from "@mui/material/Slider";
import Fuse from "fuse.js";

const datasetLink =
  "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function GeoDistro(props) {
  const [worldMap, setWorldMap] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [disasterData, setDisasterData] = React.useState(null);
  const [countriesList, setCountriesList] = React.useState([]);
  const [disasterDataMap, setDisasterDataMap] = React.useState(new Map());
  const [type, SetType] = React.useState(null);
  const [typearray, SetTypeArray] = React.useState([
    "All",
    "Earthquake",
    "Wildfire",
    "Flood",
    "Storm",
    "Extreme temperature ",
    "Drought",
    "Landslide",
    "Volcanic activity",
    "Epidemic",
    "Insect infestation",
  ]);
  let fuse;

  var tooltip = d3
    .select(".geodistro-div")
    .append("div")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("z-index", "10")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
  React.useEffect(() => {
    setTimeout(() => {
      d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
      ).then(function (d) {
        setWorldMap(d);
        d3.csv(datasetLink).then((res) => {
          setDisasterData(res);
          const temp_map = new Map();
          if (type == "All") {
            for (var i = 0; i < res.length; i++) {
              const tmp = res[i]["Country"];
              if (temp_map.get(tmp) == null) {
                temp_map.set(tmp, 1);
                setCountriesList((country) => [...country, { country: tmp }]);
                continue;
              }
              temp_map.set(tmp, temp_map.get(tmp) + 1);
            }
          } else {
            for (var i = 0; i < res.length; i++) {
              if (res[i]["Disaster Type"] !== type) {
                continue;
              }
              const tmp = res[i]["Country"];
              if (temp_map.get(tmp) == null) {
                temp_map.set(tmp, 1);
                setCountriesList((country) => [...country, { country: tmp }]);
                continue;
              }
              temp_map.set(tmp, temp_map.get(tmp) + 1);
            }
          }
          setDisasterDataMap(temp_map);
          setLoading(true);
        });
      });
    }, 2000);
  }, [type]);

  const createMap = () => {
    d3.select("svg").remove();
    d3.selectAll("path").remove();

    fuse = new Fuse(countriesList, { keys: ["country"], includeScore: true });

    const width = 1200;
    const height = 1000;

    const projection = d3
      .geoMercator()
      .translate([width / 2, height / 1.4])
      .scale([180]);

    const path = d3.geoPath().projection(projection);

    const container = d3.select(".geodistro-div");
    const svg = container.append("svg");

    svg.attr("width", width).attr("height", height).append("g");

    const countries = topojson.feature(worldMap, worldMap.objects.countries);

    const colors = ["green", "yellow", "orange", "red"];
    const eventsArray = [
      "Not Disaster Prone",
      "Less Prone to Disasters",
      "Moderately Disaster Prone",
      "Highly Disaster Prone",
    ];

    for (var i = 0; i < colors.length; i++) {
      svg
        .append("rect")
        .attr("x", "900")
        .attr("y", (2 + 50 * i).toString())
        .attr("width", "20")
        .attr("height", "20")
        .attr("fill", colors[i]);

      svg
        .append("text")
        .attr("x", "930")
        .attr("y", (2 + 50 * i + 16).toString())
        .text(eventsArray[i]);
    }

    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "country")
      .style("fill", function (d) {
        const cName = fuse.search(d.properties.name)[0];

        if (cName == null) {
          return "green";
        }

        const countryName = cName.item.country;

        if (countryName == null) {
          return "green";
        }

        if (disasterDataMap.get(countryName) == null) {
          return "green";
        } else if (
          disasterDataMap.get(countryName) / (value1[1] - value1[0] + 1) <
          2
        ) {
          return "green";
        } else if (
          disasterDataMap.get(countryName) / (value1[1] - value1[0] + 1) <
          4
        ) {
          return "yellow";
        } else if (
          disasterDataMap.get(countryName) / (value1[1] - value1[0] + 1) <
          6
        ) {
          return "orange";
        } else {
          return "red";
        }
      })
      .on("mouseover", function (e, d) {
        const cName = fuse.search(d.properties.name)[0];

        if (cName == null) {
          return;
        }

        const countryName = cName.item.country;

        if (countryName == null) {
          return;
        }

        tooltip.style("opacity", 1);
      })
      .on("mousemove", function (e, d) {
        const cName = fuse.search(d.properties.name)[0];

        if (cName == null) {
          return;
        }

        const countryName = cName.item.country;

        if (countryName == null) {
          return;
        }

        var vval = disasterDataMap.get(
          fuse.search(d.properties.name)[0].item.country
        );

        if (vval === undefined) {
          vval = 0;
        }

        tooltip
          .html(
            `Country: ${d.properties.name}
             <br>
             No of occurrences of this disaster : ${vval}`
          )
          .style("left", e.pageX + 20 + "px")
          .style("top", e.pageY + "px");
      })
      .on("mouseout", function (e, d) {
        tooltip.style("opacity", 0);
      });
  };

  const handleOptionChange = (event) => {
    SetType(event.target.value);
  };

  var years = [];

  for (var i = 1900; i <= 2023; i++) {
    years.push(i);
  }

  const minDistance = 0;
  const [value1, setValue1] = React.useState([1900, 2023]);

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const temp_map = new Map();

    if (activeThumb === 0) {
      const v0 = Math.min(newValue[0], value1[1] - minDistance),
        v1 = value1[1];
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      for (var i = 0; i < disasterData.length; i++) {
        if (disasterData[i]["Year"] >= v0 && disasterData[i]["Year"] <= v1) {
          if (type == "All") {
            const tmp = disasterData[i]["Country"];
            if (temp_map.get(tmp) == null) {
              temp_map.set(tmp, 1);
              setCountriesList((country) => [...country, { country: tmp }]);
              continue;
            }
            temp_map.set(tmp, temp_map.get(tmp) + 1);
          } else {
            if (disasterData[i]["Disaster Type"] !== type) {
              continue;
            }
            const tmp = disasterData[i]["Country"];
            if (temp_map.get(tmp) == null) {
              temp_map.set(tmp, 1);
              setCountriesList((country) => [...country, { country: tmp }]);
              continue;
            }
            temp_map.set(tmp, temp_map.get(tmp) + 1);
          }
        }
      }
    } else {
      const v0 = value1[0],
        v1 = Math.max(newValue[1], value1[0] + minDistance);
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      for (var i = 0; i < disasterData.length; i++) {
        if (disasterData[i]["Year"] >= v0 && disasterData[i]["Year"] <= v1) {
          if (!temp_map.get(disasterData[i]["Country"])) {
            temp_map.set(disasterData[i]["Country"], 1);
            continue;
          }
          temp_map.set(
            disasterData[i]["Country"],
            temp_map.get(disasterData[i]["Country"]) + 1
          );
        }
      }
    }

    setDisasterDataMap(temp_map);
  };

  const valueYear = (year) => {
    return `${year}`;
  };

  React.useEffect(() => {
    if (disasterDataMap.size != 0) {
      createMap();
    }
  }, [disasterDataMap]);

  return (
    <>
      <main
        className="geodistro-div"
        style={{
          height: "20vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >

        <div className="custom-select">
          {typearray && (
            <div>
              <select
                value={type}
                onChange={handleOptionChange}
                className="select"
              >
                <option value="">Select an option</option>
                {typearray.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <p>
          <Box sx={{ width: 300 }}>
            <Slider
              getAriaLabel={() => "Year Range"}
              value={value1}
              onChange={handleChange1}
              valueLabelDisplay="auto"
              getAriaValueText={valueYear}
              disableSwap
              min={1900}
              max={2023}
            />
          </Box>
        </p>
      </main>
    </>
  );
}
