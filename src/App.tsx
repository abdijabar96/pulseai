import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PetAnalysis from './pages/PetAnalysis';
import Services from './pages/Services';
import Telehealth from './pages/Telehealth';
import FirstAid from './pages/FirstAid';
import Training from './pages/Training';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<PetAnalysis />} />
          <Route path="/services" element={<Services />} />
          <Route path="/telehealth" element={<Telehealth />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/training" element={<Training />} />
        </Routes>
      </Layout>
    </Router>
  );
}