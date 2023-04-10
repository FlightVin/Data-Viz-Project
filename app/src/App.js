import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import AidPolitics from './pages/aidPolitics';
import AssociatedDisaster from './pages/associatedDisaster';
import GeoDistro from './pages/geoDistro';
import ImpactSpider from './pages/impactSpider';
import LandingPage from './pages/landingPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/geo-distro" element={<GeoDistro />} />
        <Route path="/impact-spider" element={<ImpactSpider />} />
        <Route path="/aid-politics" element={<AidPolitics />} />
        <Route path="/associated-disaster" element={<AssociatedDisaster />} />
      </Routes>
    </>
  );
}

export default App;
