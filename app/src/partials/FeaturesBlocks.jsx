import React from 'react';

import TreeImage from '../images/tidy-chart.png';
import RadarImage from '../images/radar-chart.png';
import SankeyImage from '../images/sankey-chart.png';
import SunburstImage from '../images/sunburst-plot.png';
import VineethImage from '../images/vineeth.jpg';
import worldImage from '../images/world-map.jpeg';
import barImage from '../images/bar-chart.png';
import AnushImage from '../images/anush.png';
import impactImage from '../images/impact-chart.png';
import MitanshImage from '../images/mitansh.png';
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
              their effect on a country’s GDP, number of people rendered homeless etc. A user using
              our visualisation would get a detailed idea about the impact of Natural Disasters across
              the world and the damage inflicted by them.</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">

            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/aid-politics">
                <img className="mx-auto h-52" src={TreeImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">International Aid</h4>
              </Link>
              <p className="text-gray-600 text-center">Geopolitics and dependance on the international community can be inferred by
              visualising whether a country asked for international aid and how much aid it
              received. This consists of a tree graph followed by circular packing on world map to denote aid received.</p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/disaster-types">
              <img className="mx-auto h-52" src={SankeyImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Disaster Types Distribution</h4>
              </Link>
              <p className="text-gray-600 text-center">
                Disasters can be grouped into disaster groups, then further into disaster subgroups and disaster types.
                The sankey chart will help us visualise the percentage of disasters
                that belong to a particular division.
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/associated-disaster">
              <img className="mx-auto h-52" src={SunburstImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Associated disasters</h4>
              </Link>
              <p className="text-gray-600 text-center">
              There are multiple instances of disasters leading to other disasters. The sunburst chart allows us to visualize 
              which disasters can stem from a calamity and be better prepared for them.
              </p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/impact-spider">
              <img className="mx-auto h-52" src={RadarImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Human and Economic factors</h4>
              </Link>
              <p className="text-gray-600 text-center">By dividing the magnitude scale into four parts and assigning a specific colour to
              each, the spider chart visualisation allows viewers to quickly and easily understand the
              severity of the disaster and its impact on both the human and economic aspects
              of society.</p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/geo-distro">
              <img className="mx-auto h-52" src={worldImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Geographical Distribution</h4>
              </Link>
              <p className="text-gray-600 text-center">A Mercator map of the world has been presented to visualise the distribution of
              Natural Disasters across the globe for a time period which
              the user selects.The
              mercator map is zoomable and can also be translated from left to right or
              vice-versa.</p>
            </div>

           {/* 6th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/decadal-deaths">
                <img className="mx-auto h-52" src={barImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Decadal Fatalities</h4>
              </Link>
              <p className="text-gray-600 text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum unde architecto error sed ad consequatur voluptas ea nisi atque, et quas quae culpa alias molestiae, fugit dolores tempora officia laborum?

              </p>
            </div>

            {/* 7th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/impact-dot">
              <img className="mx-auto h-52" src={impactImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Emergency Declaration</h4>
              </Link>
              <p className="text-gray-600 text-center">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima harum est dolore delectus incidunt, aliquam nulla eaque soluta. Atque harum nostrum earum id saepe in dicta voluptatibus deleniti assumenda eligendi.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>

    <section className="relative" id="viz-list"
      data-aos="fade-up" data-aos-delay="300"
    >

      {/* Section background (needs .relative class on parent and next sibling elements) */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">3 Team Members</h2>
            <p className="text-xl text-gray-600">Project done as a part of the course Data Visualization at IIIT Hyderabad</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">

            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-200 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/aid-politics">
                <img className="mx-auto h-52" src={AnushImage} alt="Hero" />
                <p className="text-xl leading-snug tracking-tight mb-1 mt-1">Anush Anand</p>
              </Link>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-200 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/aid-politics">
                <img className="mx-auto h-52" src={MitanshImage} alt="Hero" />
                <p className="text-xl leading-snug tracking-tight mb-1 mt-1">Mitansh Kayathwal</p>
              </Link>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-200 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/aid-politics">
                <img className="mx-auto h-52" src={VineethImage} alt="Hero" />
                <p className="text-xl leading-snug tracking-tight mb-1 mt-1">Vineeth Bhat</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}

export default FeaturesBlocks;
