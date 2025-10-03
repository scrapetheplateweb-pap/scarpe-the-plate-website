import React, { useState, useEffect } from 'react';

export default function Comedy() {
  const [content, setContent] = useState('Book comedy shows and performances.');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.comedyContent);
    }

    const savedPosts = localStorage.getItem('sitePosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      setPosts(allPosts.filter(post => post.page === 'comedy'));
    }
  }, []);

  return (
    <div className="container">
      <div className="page-card">
        <h1>Comedy Services</h1>
        <p>{content}</p>
      </div>

      {/* Display Posts */}
      {posts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          {posts.map(post => (
            <div key={post.id} style={{
              border: '2px solid #9300c5',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              background: '#2a262b'
            }}>
              <h2 style={{ color: '#9300c5', marginBottom: '1rem' }}>{post.title}</h2>
              <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>{post.content}</p>
              
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              {post.comments && post.comments.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #666', paddingTop: '1rem' }}>
                  <h4 style={{ color: '#f50505', marginBottom: '0.5rem' }}>
                    Comments ({post.comments.length})
                  </h4>
                  {post.comments.map((comment, index) => (
                    <div key={index} style={{
                      background: '#3a363b',
                      padding: '0.8rem',
                      borderRadius: '4px',
                      marginBottom: '0.5rem'
                    }}>
                      <p style={{ color: '#aaa9ad', margin: 0 }}>{comment.text}</p>
                      <small style={{ color: '#666' }}>
                        {new Date(comment.timestamp).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
