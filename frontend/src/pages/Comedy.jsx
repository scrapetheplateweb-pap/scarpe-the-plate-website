import React, { useState, useEffect } from 'react';

export default function Comedy() {
  const [content, setContent] = useState('Book comedy shows and performances.');

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.comedyContent);
    }
  }, []);

  return (
    <div className="container">
      <div className="page-card">
        <h1>Comedy Services</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}
