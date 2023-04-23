import React from 'react';

import HeroImage from '../images/main_page_image.jpeg';
import { Link } from 'react-router-dom';

function FeaturesBlocks() {
  return (
    <section className="relative" id="viz-list">

      {/* Section background (needs .relative class on parent and next sibling elements) */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Visualizations</h2>
            <p className="text-xl text-gray-600">Through our visualisations, we try to capture the underlying trends in data like which
              countries are likely to be more disaster prone, along with their economic impacts like
              their effect on a country’s GDP, number of people rendered homeless etc. A user using
              our visualisation would get a detailed idea about the impact of Natural Disasters across
              the world and the damage inflicted by them.</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">

            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/aid-politics">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">International Aid</h4>
              </Link>
              <p className="text-gray-600 text-center">Geopolitics and dependance on the international community can be inferred by
              visualising whether a country asked for international aid and how much aid it
              received. This consists of a tree graph followed by circular packing on world map to denote aid received.</p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/impact-spider">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Human and Economic factors</h4>
              </Link>
              <p className="text-gray-600 text-center">By dividing the magnitude scale into four parts and assigning a specific colour to
              each, the spider chart visualisation allows viewers to quickly and easily understand the
              severity of the disaster and its impact on both the human and economic aspects
              of society.</p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/geo-distro">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Geographical Distribution</h4>
              </Link>
              <p className="text-gray-600 text-center">A Mercator map of the world has been presented to visualise the distribution of
              Natural Disasters across the globe for a time period which
              the user selects.The
              mercator map is zoomable and can also be translated from left to right or
              vice-versa.</p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Disaster Types Distribution</h4>
              </Link>
              <p className="text-gray-600 text-center">Sanky chart</p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Associated disasters</h4>
              </Link>
              <p className="text-gray-600 text-center">Sunburst chart</p>
            </div>

            {/* 6th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Emergency Declaration</h4>
              </Link>
              <p className="text-gray-600 text-center">Scatter Graph</p>
            </div>

            {/* 7th item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-100 rounded shadow-xl">
              <Link to="/">
                <img className="mx-auto" src={HeroImage} alt="Hero" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Emergency Declaration</h4>
              </Link>
              <p className="text-gray-600 text-center">Stacked Bar Chart</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default FeaturesBlocks;
