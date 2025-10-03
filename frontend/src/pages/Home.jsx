import React, { useState, useEffect } from 'react';
import ChatBot from '../components/ChatBot';

export default function Home() {
  const [title, setTitle] = useState('Welcome to Scrape the Plate');
  const [description, setDescription] = useState('Your one-stop platform for all your entertainment needs including comedy, car wraps, and modeling services, ect.');

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const content = JSON.parse(savedContent);
      setTitle(content.homeTitle);
      setDescription(content.homeDescription);
    }
  }, []);

  return (
    <div className="container">
      <h1>{title}</h1>
      <p>{description}</p>
      <ChatBot />
    </div>
  );
}
