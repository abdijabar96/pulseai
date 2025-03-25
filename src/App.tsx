import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PetAnalysis from './pages/PetAnalysis';
import Services from './pages/Services';
import TravelPlanner from './pages/TravelPlanner';
import AdoptionCenters from './pages/AdoptionCenters';
import Telehealth from './pages/Telehealth';
import FirstAid from './pages/FirstAid';
import Training from './pages/Training';
import PlantChecker from './pages/PlantChecker';
import TreatMaker from './pages/TreatMaker';
import FitnessTracker from './pages/FitnessTracker';
import GrowthTracker from './pages/GrowthTracker';
import Memorial from './pages/Memorial';
import PetDiary from './pages/PetDiary';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<PetAnalysis />} />
          <Route path="/services" element={<Services />} />
          <Route path="/travel" element={<TravelPlanner />} />
          <Route path="/adoption" element={<AdoptionCenters />} />
          <Route path="/telehealth" element={<Telehealth />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/training" element={<Training />} />
          <Route path="/diary" element={<PetDiary />} />
          <Route path="/plant-checker" element={<PlantChecker />} />
          <Route path="/treat-maker" element={<TreatMaker />} />
          <Route path="/fitness" element={<FitnessTracker />} />
          <Route path="/growth" element={<GrowthTracker />} />
          <Route path="/memorial" element={<Memorial />} />
        </Routes>
      </Layout>
    </Router>
  );
}