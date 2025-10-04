import React, { useState, useEffect } from 'react';
import ChatBot from '../components/ChatBot';
import { Link } from 'react-router-dom';

export default function Home() {
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
    const savedPosts = localStorage.getItem('sitePosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      setPosts(allPosts.filter(post => post.page === 'home'));
    }
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const booking = {
      ...bookingData,
      page: 'home',
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
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Welcome to Scape the Plate Entertainment</h1>
        <p style={{ fontSize: '1.5rem', color: '#f50505', fontWeight: 'bold' }}>Est. 2000 – Present</p>
        <p style={{ fontSize: '1.2rem', marginTop: '2rem', lineHeight: '1.8' }}>
          From Atlanta to the Carolinas, to Virginia, and now nationwide—we've been setting the standard in entertainment since day one.
        </p>
        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1.5rem' }}>
          This isn't just a brand. This isn't just business.<br />
          This is <span style={{ color: '#f50505' }}>Scape the Plate</span>.
        </p>
        <p style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
          💡 Right now, we're bringing you top-tier <Link to="/comedy" style={{ color: '#9300c5', textDecoration: 'underline' }}>Comedy</Link>, custom <Link to="/carwraps" style={{ color: '#9300c5', textDecoration: 'underline' }}>Car Wrapping</Link>, and professional <Link to="/modeling" style={{ color: '#9300c5', textDecoration: 'underline' }}>Modeling</Link>—all available for booking today.
        </p>
        
        {/* Service Quick Links */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link to="/comedy">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Book Comedy</button>
          </Link>
          <Link to="/carwraps">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Book Car Wrapping</button>
          </Link>
          <Link to="/modeling">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Book Modeling</button>
          </Link>
        </div>
      </div>

      {/* About Us */}
      <div className="page-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#f50505', marginBottom: '1rem' }}>About Us</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          🔥 Born in North Charleston, built on vision, hustle, and community roots—Scape the Plate Entertainment has been delivering unforgettable experiences for over two decades.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
          We don't just provide services—we create moments that stick. Whether it's a night full of laughter, a car that turns heads everywhere it rolls, or models bringing the spotlight to your brand, we've got you covered.
        </p>
      </div>

      {/* What We Offer */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>What We Offer</h2>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Comedy */}
          <div className="page-card">
            <h3 style={{ color: '#f50505', marginBottom: '1rem' }}>🎭 Comedy</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              From stand-up shows to private events, our comedians bring the kind of energy that keeps people laughing long after the lights go down.
            </p>
            <Link to="/comedy">
              <button>Learn More / Book</button>
            </Link>
          </div>

          {/* Car Wrapping */}
          <div className="page-card">
            <h3 style={{ color: '#f50505', marginBottom: '1rem' }}>🚘 Car Wrapping</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              Style. Custom. One-of-a-kind. Our car wrapping team transforms vehicles into moving works of art that demand attention.
            </p>
            <Link to="/carwraps">
              <button>See More / Book</button>
            </Link>
          </div>

          {/* Modeling */}
          <div className="page-card">
            <h3 style={{ color: '#f50505', marginBottom: '1rem' }}>💃 Modeling</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              Professional models available for photo shoots, branding campaigns, promotions, and events—ready to put your vision in the spotlight.
            </p>
            <Link to="/modeling">
              <button>Browse Talent / Book</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Our Philosophy */}
      <div className="page-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #2a262b 0%, #3a2a3f 100%)' }}>
        <h2 style={{ color: '#f50505', marginBottom: '1rem', textAlign: 'center' }}>Our Philosophy</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center', fontStyle: 'italic' }}>
          For us, scraping the plate ain't about being full.<br />
          It's about delivering value, creating unforgettable experiences, and making sure nobody leaves empty-handed.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'center', marginTop: '1rem' }}>
          We keep building.<br />
          We keep sharing.<br />
          We keep creating more—because there's always another plate to scrape.
        </p>
      </div>

      {/* The Movement */}
      <div className="page-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#f50505', marginBottom: '1rem', textAlign: 'center' }}>The Movement</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'center' }}>
          We've been here since 2000.<br />
          We've grown from the local grind to a nationwide platform for entertainment of all kinds.
        </p>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center', marginTop: '1.5rem', fontWeight: 'bold' }}>
          And now—we're booking:<br />
          ✅ Comedy<br />
          ✅ Car Wrapping<br />
          ✅ Modeling
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'center', marginTop: '1rem' }}>
          📌 Whatever your entertainment needs, Scape the Plate has you covered.
        </p>
      </div>

      {/* Join Us / Book Now CTA */}
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #9300c5 0%, #f50505 100%)',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Join Us / Book Now</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'white', marginBottom: '1rem' }}>
          📌 Ready to elevate your next event, project, or brand?<br />
          🎭 Laugh with us.<br />
          🚘 Ride with us.<br />
          💃 Shine with us.
        </p>
        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>
          Scape the Plate Entertainment – Where the culture eats, and the people feast.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/comedy">
            <button style={{ 
              background: 'white', 
              color: '#9300c5', 
              padding: '1rem 2rem', 
              fontSize: '1.1rem',
              border: 'none'
            }}>
              Book Comedy
            </button>
          </Link>
          <Link to="/carwraps">
            <button style={{ 
              background: 'white', 
              color: '#9300c5', 
              padding: '1rem 2rem', 
              fontSize: '1.1rem',
              border: 'none'
            }}>
              Book Car Wrapping
            </button>
          </Link>
          <Link to="/modeling">
            <button style={{ 
              background: 'white', 
              color: '#9300c5', 
              padding: '1rem 2rem', 
              fontSize: '1.1rem',
              border: 'none'
            }}>
              Book Modeling
            </button>
          </Link>
        </div>
      </div>

      {/* Display Posts */}
      {posts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Latest Updates</h2>
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

      <ChatBot />
    </div>
  );
}
