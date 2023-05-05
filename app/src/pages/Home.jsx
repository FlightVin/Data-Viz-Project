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
       
          <div id="viz-associated-disasters" className='mt-20'>
            <AssociatedDisaster />
          </div>

          <div id="viz-geo-distro" className='mt-20'>
            <div className="w-full flex items-center justify-center flex-col">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="h3 mb-4"
                    >
                        Geograhical Distribution of Disasters
                    </p>

                    <div className='mr-48 ml-48'>
                      <p className="text-xl text-slate-700 hover:text-gray-500 mb-10 text-justify mr-24"
                      data-aos="zoom-out" data-aos-delay="350">
The Mercator map visualisation presents the distribution of natural disasters across the globe for a selected time period. It allows users to identify disaster-prone areas and make informed decisions about moving to a particular region. The use of colours to represent the frequency of natural disasters provides an informative and interactive user experience.
                      </p>

                      <p className="text-xl text-slate-700 hover:text-gray-500  text-justify ml-24"
                      data-aos="zoom-out" data-aos-delay="350">
You can interact with the Mercator map by selecting a time period using a 2-thumb slider. The gap between the thumbs represents the period being visualised. You can also hover over a country to view its name and the number of disasters that have occurred during the selected time period. The drop-down menu allows you to select the type of natural disasters you want to be visualised, providing a closer look at the specific split for each disaster. 
                      </p>
                    </div>
            </div>
            <iframe src="/geo-distro" className='w-full h-screen'
              data-aos="zoom-in" data-aos-delay="200"
            ></iframe>
          </div> 

          <div id="viz-decadal" className='mt-20'>
            <div className="w-full flex items-center justify-center flex-col mb-10">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="h3 mb-4"
                    >
                        Decadal Fatalities due to disasters
                    </p>
            </div>
            <iframe src="/decadal-deaths" className='w-full h-screen'
              data-aos="zoom-in" data-aos-delay="200"></iframe>
            <div className="w-full flex items-center justify-center flex-col mt-10">
            <div className='mr-48 ml-48'>
                      <p className="text-xl text-slate-700 hover:text-gray-500 mb-10 text-justify"
                      data-aos="zoom-out" data-aos-delay="350">
Users can interact with the chart through a slider and hover-over capabilities, the chart enables users to focus on specific ranges of years and individual disasters to gain deeper insights. Additionally, the use of a tooltip with detailed information about each data point further enhances the user's understanding of the chart.                      </p>
                    </div>
            </div>
          </div>

          <div id="viz-international-aid">
            <AidPolitics />
          </div>

          <div id="viz-econ-human-distro" className='mt-48'>
          <div className="w-full flex items-center justify-center flex-col">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="h3 mb-4"
                    >
                        Economic and Human Impacts of Disasters
                    </p>

                    <div className='mr-48 ml-48'>
                      <p className="text-xl text-slate-700 hover:text-gray-500 mb-10 text-justify ml-24"
                      data-aos="zoom-out" data-aos-delay="350">
You can interact with the visualisation by selecting the type of natural disasters you wish to visualise using the dropdown menu. The chart then displays a spider chart with axes emanating from a central point, with each axis representing a specific aspect of the disaster, such as the magnitude of damage or the number of people affected.                      </p>

                      <p className="text-xl text-slate-700 hover:text-gray-500  text-justify mr-24"
                      data-aos="zoom-out" data-aos-delay="350">
To provide more detail on how each axis varies with magnitude, the visualisation also includes clickable bar charts that pop up on the left-hand side of the screen for ease of viewing. These bar charts display the axis against magnitude and provide users with a more detailed view of the data. The bar chart is a log-scaled on the y axis
                      </p>
                    </div>
            </div>
            
            <iframe src="/impact-spider" className='w-full h-screen mt-10'
              data-aos="zoom-in" data-aos-delay="200"></iframe>
          </div>

          <div id="viz-emergency">
            <div className="w-full flex items-center justify-center flex-col mb-10">
                    <p
                        id="mitansh_heading_geo-dustro"
                        data-aos="zoom-in" data-aos-delay="100"
                        className="h3 mb-4"
                    >
                        Emergency Declarations
                    </p>
            </div>
            <iframe src="/impact-dot" className='w-full h-screen'
              data-aos="zoom-in" data-aos-delay="200"></iframe>

            <div className="w-full flex items-center justify-center flex-col mt-10">
            <div className='mr-48 ml-48'>
                      <p className="text-xl text-slate-700 hover:text-gray-500 mb-10 text-justify"
                      data-aos="zoom-out" data-aos-delay="350">
The length of each stacked bar can represent the total count of disasters of a particular magnitude, and the green and red parts can represent the count of disasters with and without emergency declaration respectively. The use of different colours makes it easy for users to differentiate between the two categories.
                    </p></div>
            </div>
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