import React from 'react';

import VineethImage from '../images/vineeth.jpg';
import AnushImage from '../images/anush.jpg';
import MitanshImage from '../images/mitansh.png';
import { Link } from 'react-router-dom';

function TeamMembers() {
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
            <h2 className="h2 mb-4">3 Team Members</h2>
            <p className="text-xl text-gray-600">Project done as a part of the course Data Visualization at IIIT Hyderabad</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">

            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-200 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/">
                <img className="mx-auto h-52" src={AnushImage} alt="Hero" />
                <p className="text-xl leading-snug tracking-tight mb-1 mt-1">Anush Anand</p>
              </Link>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-200 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="/">
                <img className="mx-auto h-52" src={MitanshImage} alt="Hero" />
                <p className="text-xl leading-snug tracking-tight mb-1 mt-1">Mitansh Kayathwal</p>
              </Link>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-slate-200 rounded shadow-xl"
            data-aos="fade-up" data-aos-delay="450">
              <Link to="https://github.com/flightvin">
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

export default TeamMembers;