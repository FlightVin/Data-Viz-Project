import * as React from "react";
import * as d3 from "d3";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const datasetLink =
  "https://raw.githubusercontent.com/Mitanshk01/DVLab3_Datasets/main/decadal-deaths-disasters-type.csv";

export default function DecadalDeaths(props) {
  const [loading, setLoading] = React.useState(true);
  const [valueYear, setValueYear] = React.useState([1900, 2020]);
  const [data, setData] = React.useState([]);
  const [changedYear, setChangedYear] = React.useState(false);
  const minDistance = 0;

  React.useEffect(() => {
    setTimeout(() => {
      d3.csv(datasetLink).then((res) => {
        setData(res);
        setLoading(false);
      });
    }, 1000);
  }, []);

  const handleYearChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      var newYearVal = newValue[0];
      while (!(newYearVal % 10) == 0) {
        newYearVal--;
      }
      setValueYear([
        Math.min(newYearVal, valueYear[1] - minDistance),
        valueYear[1],
      ]);
    } else {
      var newYearVal = newValue[1];
      while (!(newYearVal % 10) == 0) {
        newYearVal++;
      }
      setValueYear([
        valueYear[0],
        Math.max(newYearVal, valueYear[0] + minDistance),
      ]);
    }

    setChangedYear(!changedYear);
  };

  const plotGraph = () => {
    d3.select("svg").remove();
    var margin = 400;
    var width = 1000;
    var height = 1000;

    const countryList = [
      "Afghanistan",
      "Albania",
      "Algeria",
      "American Samoa",
      "Andorra",
      "Angola",
      "Anguilla",
      "Antarctica",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bermuda",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Bouvet Island",
      "Brazil",
      "Brunei Darussalam",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cayman Islands",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Christmas Island",
      "Colombia",
      "Comoros",
      "Democratic Republic of Congo",
      "Congo",
      "Cook Islands",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Curaçao",
      "Cyprus",
      "Czechia",
      "Côte d'Ivoire",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Falkland Islands (the) [Malvinas]",
      "Faroe Islands (the)",
      "Fiji",
      "Finland",
      "France",
      "French Guiana",
      "French Polynesia",
      "French Southern Territories (the)",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Gibraltar",
      "Greece",
      "Greenland",
      "Grenada",
      "Guadeloupe",
      "Guam",
      "Guatemala",
      "Guernsey",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hong Kong",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Isle of Man",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jersey",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "North Korea",
      "South Korea",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macao",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Martinique",
      "Mauritania",
      "Mauritius",
      "Mayotte",
      "Mexico",
      "Micronesia (country)",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Montserrat",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Caledonia",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Niue",
      "Norfolk Island",
      "Northern Mariana Islands",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Pitcairn",
      "Poland",
      "Portugal",
      "Puerto Rico",
      "Qatar",
      "Republic of North Macedonia",
      "Romania",
      "Russia",
      "Rwanda",
      "Réunion",
      "Saint Barthélemy",
      "Saint Helena",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Martin (French part)",
      "Saint Pierre and Miquelon",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Sint Maarten (Dutch part)",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Georgia and the South Sandwich Islands",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan (the)",
      "Suriname",
      "Svalbard and Jan Mayen",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tokelau",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Turks and Caicos Islands",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States Minor Outlying Islands",
      "United States of America",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela",
      "Vietnam",
      "British Virgin Islands",
      "United States Virgin Islands",
      "Wallis and Futuna",
      "Western Sahara",
      "Yemen",
      "Zambia",
      "Zimbabwe",
      "Åland Islands",
    ];

    const calamities = [
      "Drought",
      "Flood",
      "Earthquake",
      "Extreme weather",
      "Extreme temperature",
      "Volcanic activity",
      "Landslide",
      "Dry mass movement",
      "Wildfire",
      "Glacial lake outburst",
      "Fog",
    ];

    var data_viz = [];

    for (var k = valueYear[0]; k <= valueYear[1]; k += 10) {
      var data_yr = {
        Year: k,
        Drought: 0,
        Flood: 0,
        Earthquake: 0,
        "Extreme weather": 0,
        "Extreme temperature": 0,
        "Volcanic activity": 0,
        Landslide: 0,
        "Dry mass movement": 0,
        Wildfire: 0,
        "Glacial lake outburst": 0,
        Fog: 0,
      };

      var ans = [[], [], [], [], [], [], [], [], [], [], [], []];
      for (var i = 0; i < data.length; i++) {
        if (countryList.indexOf(data[i]["Entity"]) < 0) {
          continue;
        }
        var yr = parseInt(data[i]["Year"]);
        if (yr == k) {
          for (var j = 0; j < calamities.length; j++) {
            ans[j].push(parseFloat(data[i][calamities[j]]));
            data_yr[calamities[j]] =
              parseFloat(data_yr[calamities[j]]) +
              parseFloat(data[i][calamities[j]]);
          }
        }
      }

      data_viz.push(data_yr);
    }

    var years = [];

    for (var i = valueYear[0]; i <= valueYear[1]; i += 10) {
      years.push(i);
    }

    var colorScale = d3
      .scaleOrdinal()
      .domain(calamities)
      .range(d3.schemeTableau10);

    const svg = d3
      .select(".decadal-deaths-div")
      .append("svg")
      .attr("width", 1300)
      .attr("height", 1300);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + 100 + "," + 100 + ")");

    var xScale = d3.scaleBand().range([0, width]).padding(0.6);
    var yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(
      years.map(function (d) {
        return d;
      })
    );

    yScale.domain([0, 500000]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    g.append("g").call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d;
        })
        .ticks(6)
    );

    svg.append("text").attr("x", "550").attr("y", "1150").text("Years");

    svg
      .append("text")
      .attr("x", "40")
      .attr("y", "600")
      .text("Avg No Of Deaths")
      .attr("transform", "rotate(-90,40,600)");

    function onMouseOver2(e) {
      const targ = e.target.id;
      var idx = "";
      for (var j = 9; j < targ.length; j++) {
        idx += targ[j];
      }

      for (var j = 1900; j <= 2020; j += 10) {
        for (var k = 0; k < calamities.length; k++) {
          var el1 = j.toString();
          var el2 = k.toString();
          if (idx != k) {
            d3.select("#label" + el1 + el2).style("opacity", 0.2);
          }
        }
      }
    }

    for (var i = 0; i < calamities.length; i++) {
      svg
        .append("rect")
        .attr("x", "1100")
        .attr("id", `labelrect${i}`)
        .attr("y", (2 + 50 * i).toString())
        .attr("width", "20")
        .attr("height", "20")
        .attr("fill", colorScale(calamities[i]))
        .on("mouseover", onMouseOver2)
        .on("mouseout", function (e) {
          for (var j = 1900; j <= 2020; j += 10) {
            for (var k = 0; k < calamities.length; k++) {
              var el1 = j.toString();
              var el2 = k.toString();
              d3.select("#label" + el1 + el2).style("opacity", 1);
            }
          }
        });

      svg
        .append("text")
        .attr("x", "1130")
        .attr("y", (2 + 50 * i + 16).toString())
        .attr("id", `labelrect${i}`)
        .text(calamities[i])
        .on("mouseover", onMouseOver2)
        .on("mouseout", function (e) {
          for (var j = 1900; j <= 2020; j += 10) {
            for (var k = 0; k < calamities.length; k++) {
              var el1 = j.toString();
              var el2 = k.toString();
              d3.select("#label" + el1 + el2).style("opacity", 1);
            }
          }
        });
    }

    var tooltip = d3
      .select(".decadal-deaths-div")
      .append("div")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("z-index", "10")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    var stackGen = d3.stack().keys(calamities);

    const final_data = stackGen(data_viz);

    function onMouseOver(e, d) {
      const targ = e.target.id;

      tooltip.style("opacity", 1);

      for (var i = 1900; i <= 2020; i += 10) {
        for (var j = 0; j < calamities.length; j++) {
          var el1 = i.toString();
          var el2 = j.toString();
          d3.select("#label" + el1 + el2).style("opacity", 0.2);
        }
      }

      d3.select("#" + targ).style("opacity", 1);
    }

    var sel = d3
      .select("g")
      .selectAll("g.series")
      .data(final_data)
      .join("g")
      .classed("series", true)
      .style("fill", (d) => {
        return colorScale(d.key);
      });

    var vvv = -1;
    sel
      .selectAll("rect")
      .data((d) => {
        return d;
      })
      .join("rect")
      .attr("id", function (d, i) {
        if (i === 0) {
          vvv += 1;
        }
        var st = vvv.toString();
        var fstr = "label" + d.data.Year + st;
        return fstr;
      })
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => {
        return Math.min(yScale(d[1]), yScale(d[0]));
      })
      .attr("x", (d) => {
        return xScale(d.data.Year);
      })
      .attr("height", (d) => {
        return Math.abs(yScale(d[1]) - yScale(d[0]));
      })
      .on("mouseover", onMouseOver)
      .on("mousemove", function (e, d) {
        const targ = e.target.id;

        var idx = "";

        for (var i = 9; i < targ.length; i++) {
          idx += targ[i];
        }

        var str = "",
          sum = 0;
        str += `<b>${d.data.Year}</b>` + "</br>";
        for (var i = 0; i < calamities.length; i++) {
          sum += d.data[calamities[i]];
          if (i == idx) {
            str += `<svg width="250" height="30">
            <rect x="0%" y="18%" width="10" height="10" style="fill:${colorScale(
              calamities[i]
            )}" />
            <text x="5%" y="50%" font-weight="bold">${calamities[i]} : ${
              d.data[calamities[i]]
            }</text>
          </svg>`;

            continue;
          }
          str += `<svg width="250" height="30">
              <rect x="0%" y="18%" width="10" height="10" style="fill:${colorScale(
                calamities[i]
              )}" />
              <text x="5%" y="50%">${calamities[i]} : ${
            d.data[calamities[i]]
          }</text>
            </svg>`;
        }

        str += `Total : ${sum}`;

        tooltip
          .html(str)
          .style("left", e.pageX + 20 + "px")
          .style("top", e.pageY + "px");
      })
      .on("mouseout", function (e, d) {
        tooltip.html("");
        tooltip.style("opacity", 0);

        for (var i = 1900; i <= 2020; i += 10) {
          for (var j = 0; j < calamities.length; j++) {
            var el1 = i.toString();
            var el2 = j.toString();
            d3.select("#label" + el1 + el2).style("opacity", 1);
          }
        }
      });
  };

  React.useEffect(() => {
    plotGraph();
  }, [loading, changedYear]);

  return (
    <>
      <main
        className="decadal-deaths-div"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p>
          <Box sx={{ width: 500 }} className='mt-10'>
            <Slider
              getAriaLabel={() => "Year Range"}
              value={valueYear}
              onChange={handleYearChange}
              valueLabelDisplay="auto"
              disableSwap
              min={1900}
              max={2020}
            />
          </Box>
        </p>
      </main>
    </>
  );
}
