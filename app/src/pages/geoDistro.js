import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import Box from '@mui/material/Box';
import "./geoDistro.css";
import Slider from '@mui/material/Slider';
import Fuse from "fuse.js"

const datasetLink = "https://raw.githubusercontent.com/FlightVin/Data-Viz-Labs/main/calamity-dataset.csv";
export default function GeoDistro(props) {
    const [worldMap,setWorldMap]=React.useState(null);
    const [loading,setLoading]=React.useState(false);
    const [disasterData,setDisasterData]=React.useState(null);
    const [countriesList,setCountriesList]=React.useState([]);
    const [disasterDataMap,setDisasterDataMap] = React.useState(new Map());
    let fuse;

    // https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
    React.useEffect(()=>{
      setTimeout(() => {
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
        .then(function(d){
          setWorldMap(d);
          d3.csv(datasetLink)
            .then(res => {
              setDisasterData(res);
              const temp_map = new Map();
              for(var i=0;i<res.length;i++){
                const tmp = res[i]["Country"];
                  if(temp_map.get(tmp)==null){
                    temp_map.set(tmp,1);
                    setCountriesList((country) => 
                      [...country,{country: tmp}]);
                    continue;
                  }
                  temp_map.set(tmp,temp_map.get(tmp)+1);
              }

              setDisasterDataMap(temp_map);
              setLoading(true);
            })
        })
      }, 2000);
    },[])

const createMap = () =>{
  console.log("CREATING NEW MAP!");
  d3.select("svg").remove();
  d3.selectAll("path").remove();

  console.log(disasterDataMap);

  fuse = new Fuse(countriesList,{keys:
    ["country"],includeScore:true
  })

const width = 1000;
const height = 700;

const projection = d3.geoMercator()
   .translate([width / 2, height / 1.4])    
   .scale([150]);

const path = d3.geoPath().projection(projection);

const container = d3.select("body");
const svg = container.append("svg");

svg.attr("width", width)
   .attr("height", height)
   .append('g');

const countries = topojson.feature(worldMap,worldMap.objects.countries);

svg.selectAll('path')
   .data(countries.features)
   .enter()
   .append('path')
   .attr('d', path)
   .attr('class', 'country')
   .style("fill", function(d){
    const cName = (fuse.search(d.properties.name)[0]);

    if(cName==null){
      return "white";
    }

    const countryName = cName.item.country;

    if(countryName==null){
      return "white";
    }

    if(disasterDataMap.get(countryName)==null){
      return "white";
    }else if(disasterDataMap.get(countryName)/(value1[1]-value1[0]+1)<2){
      return "green";
    }else if(disasterDataMap.get(countryName)/(value1[1]-value1[0]+1)<4){
      return "yellow"
    }else if(disasterDataMap.get(countryName)/(value1[1]-value1[0]+1)<6){
      return "orange";
    }else{
      return "red";
    }
   });
   ;

   let zoom = d3.zoom()
   .scaleExtent([1, 2])
   .translateExtent([[-500, -300], [1500, 1000]])
   .on('zoom', (ev) => {
       svg.attr('transform', ev.transform)
   });

  svg.call(zoom);
}

    // React.useEffect(()=>{
    //   if(loading){
    //     createMap();
    //   }
    // },[loading])

    var years = [];

   for(var i=1900;i<=2023;i++){
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
          const v0=Math.min(newValue[0], value1[1] - minDistance),v1=value1[1]
          setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
          for(var i=0;i<disasterData.length;i++){
            if(disasterData[i]["Year"]>=v0 && disasterData[i]["Year"]<=v1){
              if(!temp_map.get(disasterData[i]["Country"])){
                temp_map.set(disasterData[i]["Country"],1);
                continue;
              }
              temp_map.set(disasterData[i]["Country"],temp_map.get(disasterData[i]["Country"])+1);
            }
          }
        } else {
          const v0=value1[0],v1=Math.max(newValue[1], value1[0] + minDistance);
          setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
          for(var i=0;i<disasterData.length;i++){
            if(disasterData[i]["Year"]>=v0 && disasterData[i]["Year"]<=v1){
              if(!temp_map.get(disasterData[i]["Country"])){
                temp_map.set(disasterData[i]["Country"],1);
                continue;
              }
              temp_map.set(disasterData[i]["Country"],temp_map.get(disasterData[i]["Country"])+1);
            }
          }
        }

        setDisasterDataMap(temp_map);
      };

      const valueYear = (year) => {
        return `${year}`;
      }

      React.useEffect(()=>{
        if(disasterDataMap.size!=0){
          createMap();
        }
      },[disasterDataMap])


return (
    <>
        <main
            style={{
            height: "20vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            }}
        >
            <p
            id="mitansh_heading"
            >
                Geographical Distribution of Natural Disasters:
            </p>

            <p>
            <Box sx={{ width: 300 }}>
              <Slider
                getAriaLabel={() => 'Year Range'}
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
