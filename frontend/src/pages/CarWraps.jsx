import React, { useState, useEffect } from 'react';

export default function CarWraps() {
  const [content, setContent] = useState('Professional car wrap services and designs.');

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.carWrapsContent);
    }
  }, []);

  return (
    <div className="container">
      <div className="page-card">
        <h1>Car Wraps</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}
