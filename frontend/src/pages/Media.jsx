import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import './Media.css';

export default function Media() {
  const [posts, setPosts] = useState([]);
  const [selectedPage, setSelectedPage] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedPage === 'all' 
    ? posts 
    : posts.filter(p => p.page === selectedPage);

  return (
    <div className="media-page">
      <div className="media-hero">
        <h1>Media Gallery</h1>
        <p>Our Work in Action</p>
      </div>

      <div className="container">
        <div className="media-filter">
          <button 
            className={selectedPage === 'all' ? 'active' : ''} 
            onClick={() => setSelectedPage('all')}
          >
            All
          </button>
          <button 
            className={selectedPage === 'home' ? 'active' : ''} 
            onClick={() => setSelectedPage('home')}
          >
            General
          </button>
          <button 
            className={selectedPage === 'comedy' ? 'active' : ''} 
            onClick={() => setSelectedPage('comedy')}
          >
            Comedy
          </button>
          <button 
            className={selectedPage === 'car-wraps' ? 'active' : ''} 
            onClick={() => setSelectedPage('car-wraps')}
          >
            Car Wraps
          </button>
          <button 
            className={selectedPage === 'modeling' ? 'active' : ''} 
            onClick={() => setSelectedPage('modeling')}
          >
            Modeling
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#aaa9ad', fontSize: '1.2rem', padding: '2rem' }}>
            Loading posts...
          </p>
        ) : filteredPosts.length > 0 ? (
          <div className="posts-container">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={loadPosts} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#9300c5' }}>No Posts Yet</h2>
            <p style={{ color: '#aaa9ad' }}>Check back later for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
}
