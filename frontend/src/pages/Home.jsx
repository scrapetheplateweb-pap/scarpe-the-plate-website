import React from 'react';
import ChatBot from '../components/ChatBot';

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to Scrape the Plate</h1>
      <p>Your one-stop platform for all your entertainment needs including comedy, car wraps, and modeling services, ect.</p>
      <ChatBot />
    </div>
  );
}
