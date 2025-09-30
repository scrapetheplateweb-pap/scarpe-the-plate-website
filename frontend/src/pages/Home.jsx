import React from 'react';
import ChatBot from '../components/ChatBot';

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to Scrape the Plate</h1>
      <p>Your one-stop platform for comedy, car wraps, and modeling services.</p>
      <ChatBot />
    </div>
  );
}
