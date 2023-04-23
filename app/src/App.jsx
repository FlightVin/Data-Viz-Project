import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import 'aos/dist/aos.css';
import './css/style.css';

import AOS from 'aos';

import Home from './pages/Home';
import AidPolitics from './pages/aidPolitics';
import AssociatedDisaster from './pages/associatedDisaster';
import GeoDistro from './pages/geoDistro';
import ImpactSpider from './pages/impactSpider';
import AidPoliticsYes from './pages/aidPoliticsYes';
import DisasterTypes from './pages/disasterTypes';

function App() {

  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="/landing-page" element={<Home />} />
        <Route path="/aid-politics-yes/:start/:end" element={<AidPoliticsYes />} />
        <Route path="/geo-distro" element={<GeoDistro />} />
        <Route path="/impact-spider" element={<ImpactSpider />} />
        <Route path="/aid-politics" element={<AidPolitics />} />
        <Route path="/associated-disaster" element={<AssociatedDisaster />} />
        <Route path="/disaster-types" element={<DisasterTypes />} />
      </Routes>
    </>
  );
}

export default App;
