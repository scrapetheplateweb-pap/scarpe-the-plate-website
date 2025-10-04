import React, { useState, useEffect } from 'react';

export default function Modeling() {
  const [content, setContent] = useState('Book modeling sessions and view our portfolio.');
  const [posts, setPosts] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
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

    const savedAvailability = localStorage.getItem('availabilityByService');
    if (savedAvailability) {
      const allAvailability = JSON.parse(savedAvailability);
      setAvailability((allAvailability.modeling || []).filter(slot => new Date(slot.date) >= new Date()));
    }
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      alert('Please select a time slot!');
      return;
    }

    const booking = {
      ...bookingData,
      page: 'modeling',
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Save booking
    const existingBookings = JSON.parse(localStorage.getItem('siteBookings') || '[]');
    localStorage.setItem('siteBookings', JSON.stringify([...existingBookings, booking]));

    // Mark slot as booked
    const allAvailability = JSON.parse(localStorage.getItem('availabilityByService') || '{}');
    if (allAvailability.modeling) {
      const slotIndex = allAvailability.modeling.findIndex(s => s.id === selectedSlot.id);
      if (slotIndex !== -1) {
        allAvailability.modeling[slotIndex].status = 'booked';
        localStorage.setItem('availabilityByService', JSON.stringify(allAvailability));
        setAvailability(allAvailability.modeling.filter(slot => new Date(slot.date) >= new Date()));
      }
    }

    setBookingData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setSelectedSlot(null);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupSlotsByDate = () => {
    const grouped = {};
    availability.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate();

  return (
    <div className="container">
      <div className="page-card">
        <h1>Modeling</h1>
        <p>{content}</p>
      </div>

      {/* Availability Table */}
      <div style={{
        border: '2px solid #9300c5',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem',
        background: '#2a262b'
      }}>
        <h2 style={{ color: '#9300c5', marginBottom: '1rem' }}>Available Time Slots</h2>
        
        {availability.length === 0 ? (
          <p style={{ color: '#aaa9ad' }}>No time slots available at the moment. Please check back later.</p>
        ) : (
          <div>
            {Object.keys(groupedSlots).sort().map(date => (
              <div key={date} style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#f50505', marginBottom: '1rem' }}>{formatDate(date)}</h3>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: '1rem'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #9300c5' }}>
                      <th style={{ textAlign: 'left', padding: '0.8rem', color: '#f50505' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '0.8rem', color: '#f50505' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.8rem', color: '#f50505' }}>Notes</th>
                      <th style={{ textAlign: 'center', padding: '0.8rem', color: '#f50505' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSlots[date].map(slot => (
                      <tr key={slot.id} style={{ borderBottom: '1px solid #666' }}>
                        <td style={{ padding: '0.8rem', color: '#aaa9ad' }}>
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            background: slot.status === 'available' ? '#00aa00' : '#666',
                            color: 'white'
                          }}>
                            {slot.status === 'available' ? 'AVAILABLE' : 'BOOKED'}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem', color: '#aaa9ad' }}>
                          {slot.notes || '-'}
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedSlot(slot)}
                            disabled={slot.status === 'booked'}
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem',
                              opacity: slot.status === 'booked' ? 0.5 : 1,
                              cursor: slot.status === 'booked' ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {selectedSlot?.id === slot.id ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
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
        
        {selectedSlot && (
          <div style={{
            background: '#9300c5',
            color: 'white',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <strong>Selected Slot:</strong> {formatDate(selectedSlot.date)} at {selectedSlot.startTime} - {selectedSlot.endTime}
          </div>
        )}

        {bookingSuccess && (
          <div style={{
            background: '#00aa00',
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
          
          <button type="submit" disabled={!selectedSlot}>
            {selectedSlot ? 'Submit Booking' : 'Please Select a Time Slot'}
          </button>
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
