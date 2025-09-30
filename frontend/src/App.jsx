import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Comedy from './pages/Comedy';
import CarWraps from './pages/CarWraps';
import Modeling from './pages/Modeling';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/comedy">Comedy</Link>
        <Link to="/car-wraps">Car Wraps</Link>
        <Link to="/modeling">Modeling</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comedy" element={<Comedy />} />
        <Route path="/car-wraps" element={<CarWraps />} />
        <Route path="/modeling" element={<Modeling />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}
