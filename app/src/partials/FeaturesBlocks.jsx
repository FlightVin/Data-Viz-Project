import React from 'react';

import TreeImage from '../images/tidy-chart.png';
import RadarImage from '../images/radar-chart.png';
import SankeyImage from '../images/sankey-chart.png';
import SunburstImage from '../images/sunburst-plot.png';
import worldImage from '../images/world-map.jpeg';
import barImage from '../images/bar-chart.png';
import impactImage from '../images/impact-chart.png';
import { Link } from 'react-router-dom';

function FeaturesBlocks() {
  return (
    <>
    <section className="relative" id="viz-list"
      data-aos="fade-up" data-aos-delay="300"
    >

      {/* Section background (needs .relative class on parent and next sibling elements) */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">7 Visualizations</h2>
            <p className="text-xl text-gray-600">Through our visualisations, we try to capture the underlying trends in data like which
              countries are likely to be more disaster prone, along with their economic impacts like
              their effect on a country's GDP, number of people rendered homeless etc. A user using
              our visualisation would get a detailed idea about the impact of Natural Disasters across
              the world and the damage inflicted by them.</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">

          <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
              <a href='#viz-disaster-types'>
              <img className="mx-auto h-52" src={SankeyImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Disaster Types Distribution</h4>
              </a>
              <p className="text-gray-600 text-center">
                Disasters can be grouped into disaster groups, then further into disaster subgroups and disaster types.
                The sankey chart will help us visualise the percentage of disasters
                that belong to a particular division.
              </p>
            </div>

            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
              <a href='#viz-associated-disasters'>
              <img className="mx-auto h-52" src={SunburstImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Associated disasters</h4>
              </a>
              <p className="text-gray-600 text-center">
              There are multiple instances of disasters leading to other disasters. The sunburst chart allows us to visualize 
              which disasters can stem from a calamity and be better prepared for them.
              </p>
            </div>

            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
              <a href='#viz-geo-distro'>
              <img className="mx-auto h-52" src={worldImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Geographical Distribution</h4>
              </a>
              <p className="text-gray-600 text-center">A Mercator map of the world has been presented to visualise the distribution of
              Natural Disasters across the globe for a time period which
              the user selects.The
              mercator map is zoomable and can also be translated from left to right or
              vice-versa.</p>
            </div>

            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
            <a href='#viz-decadal'>
                <img className="mx-auto h-52" src={barImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Decadal Fatalities</h4>
              </a>
              <p className="text-gray-600 text-center">

              Studying the average number of deaths caused by various natural disasters over the course of a decade can provide valuable insights into the impact of these disasters on human life and well-being across the world.              </p>
            </div>

            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
              <a href='#viz-international-aid'>
                <img className="mx-auto h-52" src={TreeImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">International Aid</h4>
              </a>
              <p className="text-gray-600 text-center">Geopolitics and dependance on the international community can be inferred by
              visualising whether a country asked for international aid and how much aid it
              received. This consists of a tree graph followed by circular packing on world map to denote aid received.</p>
            </div>

            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
              <a href='#viz-econ-human-distro'>
              <img className="mx-auto h-52" src={RadarImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Human and Economic factors</h4>
              </a>
              <p className="text-gray-600 text-center">By dividing the magnitude scale into four parts and assigning a specific colour to
              each, the spider chart visualisation allows viewers to quickly and easily understand the
              severity of the disaster and its impact on both the human and economic aspects
              of society.</p>
            </div>

            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="300">
              <a href='#viz-emergency'>
              <img className="mx-auto h-52" src={impactImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Emergency Declaration</h4>
              </a>
              <p className="text-gray-600 text-center">
              This visualisation depicts the relationship between the magnitude of a disaster and the number of times an emergency was declared in response to that disaster. It can be used to understand how the impact of a disaster changes with its magnitude.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
    </>
  );
}

export default FeaturesBlocks;
