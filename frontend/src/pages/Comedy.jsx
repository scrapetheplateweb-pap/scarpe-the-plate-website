import React, { useState, useEffect } from 'react';

export default function Comedy() {
  const [content, setContent] = useState('Book comedy shows and performances.');
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
      setContent(data.comedyContent);
    }

    const savedPosts = localStorage.getItem('sitePosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      setPosts(allPosts.filter(post => post.page === 'comedy'));
    }

    const savedAvailability = localStorage.getItem('availabilityByService');
    if (savedAvailability) {
      const allAvailability = JSON.parse(savedAvailability);
      setAvailability((allAvailability.comedy || []).filter(slot => new Date(slot.date) >= new Date()));
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
      page: 'comedy',
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
    if (allAvailability.comedy) {
      const slotIndex = allAvailability.comedy.findIndex(s => s.id === selectedSlot.id);
      if (slotIndex !== -1) {
        allAvailability.comedy[slotIndex].status = 'booked';
        localStorage.setItem('availabilityByService', JSON.stringify(allAvailability));
        setAvailability(allAvailability.comedy.filter(slot => new Date(slot.date) >= new Date()));
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

  // Generate weekly grid view
  const generateWeeklyGrid = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const times = [
      '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
      'Noon', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
      '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
      'Midnight', '01:00 AM', '02:00 AM'
    ];
    
    // Get current week's dates
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const weekDates = days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
    
    // Create grid mapping
    const grid = {};
    times.forEach(time => {
      grid[time] = {};
      weekDates.forEach(({date}) => {
        grid[time][date] = null;
      });
    });
    
    // Fill grid with availability data
    availability.forEach(slot => {
      const slotDate = slot.date;
      const startTime = convertTo12Hour(slot.startTime);
      
      if (grid[startTime] && grid[startTime][slotDate] !== undefined) {
        grid[startTime][slotDate] = slot;
      }
    });
    
    return { grid, times, weekDates };
  };

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    if (hour === 0) return 'Midnight';
    if (hour === 12 && minutes === '00') return 'Noon';
    if (hour < 12) return `${hour.toString().padStart(2, '0')}:${minutes} AM`;
    if (hour === 12) return `${hour}:${minutes} PM`;
    return `${(hour - 12).toString().padStart(2, '0')}:${minutes} PM`;
  };

  const { grid, times, weekDates } = generateWeeklyGrid();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container">
      <div className="page-card">
        <h1>Comedy Services</h1>
        <p>{content}</p>
      </div>

      {/* Availability Schedule Grid */}
      <div style={{
        border: '2px solid #9300c5',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem',
        background: '#2a262b'
      }}>
        <h2 style={{ color: '#9300c5', marginBottom: '1rem' }}>Schedule Availability</h2>
        
        {availability.length === 0 ? (
          <p style={{ color: '#aaa9ad' }}>No time slots available at the moment. Please check back later.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '2px solid #000',
              background: 'white',
              color: '#000'
            }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ 
                    border: '1px solid #000', 
                    padding: '0.6rem', 
                    textAlign: 'center',
                    minWidth: '100px',
                    fontWeight: 'bold'
                  }}></th>
                  {weekDates.map(({day, displayDate}) => (
                    <th key={day} style={{ 
                      border: '1px solid #000', 
                      padding: '0.6rem', 
                      textAlign: 'center',
                      minWidth: '80px',
                      fontWeight: 'bold'
                    }}>
                      {day}
                      <div style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>{displayDate}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map(time => (
                  <tr key={time}>
                    <td style={{ 
                      border: '1px solid #000', 
                      padding: '0.6rem',
                      fontWeight: 'bold',
                      background: '#f0f0f0',
                      textAlign: 'center'
                    }}>
                      {time}
                    </td>
                    {weekDates.map(({date}) => {
                      const slot = grid[time][date];
                      return (
                        <td 
                          key={date} 
                          onClick={() => slot && slot.status === 'available' && setSelectedSlot(slot)}
                          style={{ 
                            border: '1px solid #000', 
                            padding: '0.4rem',
                            textAlign: 'center',
                            background: slot 
                              ? (slot.status === 'available' ? '#90EE90' : '#FFB6C1')
                              : 'white',
                            cursor: slot && slot.status === 'available' ? 'pointer' : 'default',
                            position: 'relative',
                            minHeight: '35px'
                          }}
                        >
                          {slot && (
                            <div style={{ fontSize: '0.75rem' }}>
                              {selectedSlot?.id === slot.id && (
                                <div style={{ 
                                  fontWeight: 'bold', 
                                  color: '#006400',
                                  marginBottom: '2px'
                                }}>
                                  ✓ SELECTED
                                </div>
                              )}
                              {slot.status === 'available' ? 'P' : 'O'}
                              {slot.notes && (
                                <div style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                                  {slot.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.8rem', 
              background: '#3a363b',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#aaa9ad'
            }}>
              <strong style={{ color: '#f50505' }}>Legend:</strong> 
              <span style={{ marginLeft: '1rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '15px', 
                  height: '15px', 
                  background: '#90EE90', 
                  border: '1px solid #000',
                  marginRight: '5px',
                  verticalAlign: 'middle'
                }}></span> 
                Available (P) - Click to select
              </span>
              <span style={{ marginLeft: '1rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '15px', 
                  height: '15px', 
                  background: '#FFB6C1', 
                  border: '1px solid #000',
                  marginRight: '5px',
                  verticalAlign: 'middle'
                }}></span> 
                Booked (O)
              </span>
            </div>
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
        <h2 style={{ color: '#f50505', marginBottom: '1rem' }}>Book Comedy Show</h2>
        
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
            placeholder="Tell us about your comedy show needs..."
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
