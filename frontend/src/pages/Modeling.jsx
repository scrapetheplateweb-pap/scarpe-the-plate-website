import React, { useState, useEffect } from 'react';

export default function Modeling() {
  const [content, setContent] = useState('Book modeling sessions and view our portfolio.');
  const [posts, setPosts] = useState([]);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.modelingContent);
    }

    const savedPosts = localStorage.getItem('sitePosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      setPosts(allPosts.filter(post => post.page === 'modeling'));
    }
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const booking = {
      ...bookingData,
      page: 'modeling',
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const existingBookings = JSON.parse(localStorage.getItem('siteBookings') || '[]');
    localStorage.setItem('siteBookings', JSON.stringify([...existingBookings, booking]));

    setBookingData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: ''
    });

    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const getVideoEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="container">
      <div className="page-card">
        <h1>Modeling</h1>
        <p>{content}</p>
      </div>

      {/* Booking Form */}
      <div style={{
        border: '2px solid #f50505',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem',
        background: '#2a262b'
      }}>
        <h2 style={{ color: '#f50505', marginBottom: '1rem' }}>Book Modeling Session</h2>
        
        {bookingSuccess && (
          <div style={{
            background: '#9300c5',
            color: 'white',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Booking submitted successfully! We'll contact you soon.
          </div>
        )}

        <form onSubmit={handleBookingSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={bookingData.name}
            onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          
          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          
          <input
            type="tel"
            placeholder="Phone Number"
            value={bookingData.phone}
            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              required
              style={{ width: '100%' }}
            />
            
            <input
              type="time"
              value={bookingData.time}
              onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
              required
              style={{ width: '100%' }}
            />
          </div>
          
          <textarea
            placeholder="Tell us about your modeling session needs (portfolio, fashion, commercial, etc.)..."
            value={bookingData.message}
            onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
            required
            rows={4}
            style={{
              width: '100%',
              marginBottom: '1rem',
              border: '2px solid #9300c5',
              borderRadius: '4px',
              padding: '0.8rem',
              background: '#2a262b',
              color: '#aaa9ad',
              fontFamily: 'Teko, sans-serif',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          
          <button type="submit">Submit Booking</button>
        </form>
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

              {post.videoUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <iframe
                    src={getVideoEmbedUrl(post.videoUrl)}
                    style={{
                      width: '100%',
                      height: '400px',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                    allowFullScreen
                  />
                </div>
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
