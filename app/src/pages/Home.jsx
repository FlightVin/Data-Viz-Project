import React from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import FeaturesBlocks from '../partials/FeaturesBlocks';
import Footer from '../partials/Footer';
import DisasterTypes from './disasterTypes';
import TeamMembers from '../partials/TeamMembers';
import AssociatedDisaster from './associatedDisaster';
import GeoDistro from './geoDistro';
import AidPolitics from './aidPolitics';

function Home() {
  console.log('Home');
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">

        {/*  Page sections */}
        <HeroHome />

        <FeaturesBlocks />

        <pages>
          <div id="viz-disaster-types">
            <DisasterTypes/>
          </div>   
       
          <div id="viz-associated-disasters">
            <AssociatedDisaster />
          </div>

          <div id="viz-geo-distro">
            <div className="w-full flex items-center justify-center flex-col">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="mt-24 text-2xl"
                    >
                        Geograhical Dstribution of Disasters
                    </p>
            </div>
            <iframe src="/geo-distro" className='w-full h-screen'></iframe>
          </div> 

          <div id="viz-decadal">
            <div className="w-full flex items-center justify-center flex-col mb-10">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="mt-24 text-2xl"
                    >
                        Decadal Fatalities due to disasters
                    </p>
            </div>
            <iframe src="/decadal-deaths" className='w-full h-screen'></iframe>
          </div>

          <div id="viz-international-aid">
            <AidPolitics />
          </div>

          <div id="viz-econ-human-distro">
            <div className="w-full flex items-center justify-center flex-col mb-10">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="mt-24 text-2xl"
                    >
                        Economic and Human Impacts of Disasters
                    </p>
            </div>
            <iframe src="/impact-spider" className='w-full h-screen'></iframe>
          </div>

          <div id="viz-emergency">
            <div className="w-full flex items-center justify-center flex-col mb-10">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="mt-24 text-2xl"
                    >
                        Emergency Declarations
                    </p>
            </div>
            <iframe src="/impact-dot" className='w-full h-screen'></iframe>
          </div>

        </pages>


        <TeamMembers/>
      </main>


      {/*  Site footer */}
      <Footer />

    </div>
  );
}

export default Home;