import React, { useState, useEffect } from 'react';
import './Media.css';

export default function Media() {
  const [posts, setPosts] = useState([]);
  const [selectedPage, setSelectedPage] = useState('all');

  useEffect(() => {
    const sitePosts = JSON.parse(localStorage.getItem('sitePosts') || '[]');
    setPosts(sitePosts);
  }, []);

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

        {filteredPosts.length === 0 ? (
          <div className="no-media">
            <h2>No media yet!</h2>
            <p>Check back soon as we add photos and videos from our work.</p>
            <p className="admin-note">Admins can add media posts from the Admin panel.</p>
          </div>
        ) : (
          <div className="media-grid">
            {filteredPosts.map((post) => (
              <div key={post.id} className="media-card">
                {post.image && (
                  <div className="media-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                {post.video && (
                  <div className="media-video">
                    <iframe
                      src={post.video}
                      title={post.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="media-content">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <div className="media-meta">
                    <span className="media-category">{post.page.replace('-', ' ')}</span>
                    <span className="media-date">{new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                  {post.comments && post.comments.length > 0 && (
                    <div className="media-comments">
                      <p className="comment-count">💬 {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
