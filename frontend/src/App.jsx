import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Comedy from './pages/Comedy';
import CarWraps from './pages/CarWraps';
import Modeling from './pages/Modeling';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Careers from './pages/Careers';
import Admin from './pages/Admin';
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/comedy" element={<Comedy />} />
        <Route path="/car-wraps" element={<CarWraps />} />
        <Route path="/modeling" element={<Modeling />} />
        <Route path="/media" element={<Media />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/store" element={<Store />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
      <ChatBot />
    </div>
  );
}
