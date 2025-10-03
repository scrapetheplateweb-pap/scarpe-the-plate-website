import React, { useState, useEffect } from 'react';

export default function Modeling() {
  const [content, setContent] = useState('Book modeling sessions and view our portfolio.');

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.modelingContent);
    }
  }, []);

  return (
    <div className="container">
      <div className="page-card">
        <h1>Modeling</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}
