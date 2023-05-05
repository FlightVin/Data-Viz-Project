import React from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import FeaturesBlocks from '../partials/FeaturesBlocks';
import Footer from '../partials/Footer';
import DisasterTypes from './disasterTypes';
import TeamMembers from '../partials/TeamMembers';
import AssociatedDisaster from './associatedDisaster';

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
        </pages>


        <TeamMembers/>
      </main>


      {/*  Site footer */}
      <Footer />

    </div>
  );
}

export default Home;