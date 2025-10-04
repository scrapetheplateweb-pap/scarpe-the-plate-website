import React, { useState } from 'react';
import AdminContentEditor from './AdminContentEditor';

export default function Admin() {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [contentSection, setContentSection] = useState('editor');
  
  // Content management states
  const [homeTitle, setHomeTitle] = useState('Welcome to Scrape the Plate');
  const [homeDescription, setHomeDescription] = useState('Your one-stop platform for all your entertainment needs including comedy, car wraps, and modeling services, ect.');
  const [comedyContent, setComedyContent] = useState('Book comedy shows and performances.');
  const [carWrapsContent, setCarWrapsContent] = useState('Professional car wrap services and designs.');
  const [modelingContent, setModelingContent] = useState('Book modeling sessions and view our portfolio.');
  const [successMessage, setSuccessMessage] = useState('');

  // Post management states
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    page: 'home',
    title: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    comments: []
  });
  const [newComment, setNewComment] = useState('');
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  // Booking management states
  const [bookings, setBookings] = useState([]);

  // Availability management states
  const [availability, setAvailability] = useState({});
  const [selectedService, setSelectedService] = useState('comedy');
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  React.useEffect(() => {
    const savedPosts = localStorage.getItem('sitePosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    const savedBookings = localStorage.getItem('siteBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }

    const savedAvailability = localStorage.getItem('availabilityByService');
    if (savedAvailability) {
      setAvailability(JSON.parse(savedAvailability));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (accessCode === '4922') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid access code!');
      setAccessCode('');
    }
  };

  const applyPatch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patch: 'sample patch' })
      });
      const data = await response.json();
      setPatches(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Error applying patch:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContentChanges = () => {
    localStorage.setItem('siteContent', JSON.stringify({
      homeTitle,
      homeDescription,
      comedyContent,
      carWrapsContent,
      modelingContent
    }));
    setSuccessMessage('Content saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const resetContent = () => {
    setHomeTitle('Welcome to Scrape the Plate');
    setHomeDescription('Your one-stop platform for all your entertainment needs including comedy, car wraps, and modeling services, ect.');
    setComedyContent('Book comedy shows and performances.');
    setCarWrapsContent('Professional car wrap services and designs.');
    setModelingContent('Book modeling sessions and view our portfolio.');
    localStorage.removeItem('siteContent');
    setSuccessMessage('Content reset to defaults!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const createPost = () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in title and content!');
      return;
    }

    const postToAdd = {
      ...newPost,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [...posts, postToAdd];
    setPosts(updatedPosts);
    localStorage.setItem('sitePosts', JSON.stringify(updatedPosts));

    setNewPost({
      page: 'home',
      title: '',
      content: '',
      imageUrl: '',
      videoUrl: '',
      comments: []
    });

    setSuccessMessage('Post created successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('sitePosts', JSON.stringify(updatedPosts));
    setSuccessMessage('Post deleted!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const addCommentToPost = (postIndex) => {
    if (!newComment.trim()) return;

    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments.push({
      text: newComment,
      timestamp: new Date().toISOString()
    });
    setPosts(updatedPosts);
    localStorage.setItem('sitePosts', JSON.stringify(updatedPosts));
    setNewComment('');
    setSelectedPostIndex(null);
    setSuccessMessage('Comment added!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const deleteBooking = (bookingId) => {
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('siteBookings', JSON.stringify(updatedBookings));
    setSuccessMessage('Booking deleted!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const markBookingComplete = (bookingId) => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'completed' } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('siteBookings', JSON.stringify(updatedBookings));
    setSuccessMessage('Booking marked as completed!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const addTimeSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      alert('Please fill in date, start time, and end time!');
      return;
    }

    const slot = {
      ...newSlot,
      id: Date.now(),
      status: 'available',
      createdAt: new Date().toISOString()
    };

    const updated = { ...availability };
    if (!updated[selectedService]) {
      updated[selectedService] = [];
    }
    updated[selectedService].push(slot);
    
    setAvailability(updated);
    localStorage.setItem('availabilityByService', JSON.stringify(updated));

    setNewSlot({
      date: '',
      startTime: '',
      endTime: '',
      notes: ''
    });

    setSuccessMessage('Time slot added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const deleteTimeSlot = (slotId) => {
    const updated = { ...availability };
    if (updated[selectedService]) {
      updated[selectedService] = updated[selectedService].filter(s => s.id !== slotId);
      setAvailability(updated);
      localStorage.setItem('availabilityByService', JSON.stringify(updated));
      setSuccessMessage('Time slot deleted!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const toggleSlotAvailability = (slotId) => {
    const updated = { ...availability };
    if (updated[selectedService]) {
      const slotIndex = updated[selectedService].findIndex(s => s.id === slotId);
      if (slotIndex !== -1) {
        const currentStatus = updated[selectedService][slotIndex].status;
        updated[selectedService][slotIndex].status = currentStatus === 'available' ? 'booked' : 'available';
        setAvailability(updated);
        localStorage.setItem('availabilityByService', JSON.stringify(updated));
        setSuccessMessage('Slot status updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>Admin Access</h1>
        <div className="admin-container">
          <form onSubmit={handleLogin}>
            <h3>Enter Access Code</h3>
            <div style={{ marginTop: '1rem' }}>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter code..."
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              {error && <div style={{ color: '#f50505', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
              <button type="submit">Access Admin</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Control Panel</h1>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('content')}
          style={{ opacity: activeTab === 'content' ? 1 : 0.6 }}
        >
          Content Management
        </button>
        <button 
          onClick={() => setActiveTab('availability')}
          style={{ opacity: activeTab === 'availability' ? 1 : 0.6 }}
        >
          Availability
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          style={{ opacity: activeTab === 'bookings' ? 1 : 0.6 }}
        >
          Bookings
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{ opacity: activeTab === 'settings' ? 1 : 0.6 }}
        >
          Site Settings
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{ 
          background: '#9300c5', 
          color: 'white', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          {successMessage}
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="admin-container">
          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setContentSection('editor')}
              style={{ 
                opacity: contentSection === 'editor' ? 1 : 0.6,
                padding: '0.6rem 1.2rem',
                fontSize: '0.95rem'
              }}
            >
              Content Editor
            </button>
            <button 
              onClick={() => setContentSection('posts')}
              style={{ 
                opacity: contentSection === 'posts' ? 1 : 0.6,
                padding: '0.6rem 1.2rem',
                fontSize: '0.95rem'
              }}
            >
              Post Manager
            </button>
            <button 
              onClick={() => setContentSection('patches')}
              style={{ 
                opacity: contentSection === 'patches' ? 1 : 0.6,
                padding: '0.6rem 1.2rem',
                fontSize: '0.95rem'
              }}
            >
              Patch Management
            </button>
          </div>

          {/* Content Editor Section */}
          {contentSection === 'editor' && (
            <AdminContentEditor 
              onSave={(msg) => {
                setSuccessMessage(msg);
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
            />
          )}

          {/* Post Manager Section */}
          {contentSection === 'posts' && (
            <div>
              <h3>Create New Post</h3>
              
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Select Page:
                </label>
                <select
                  value={newPost.page}
                  onChange={(e) => setNewPost({...newPost, page: e.target.value})}
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    border: '2px solid #9300c5',
                    borderRadius: '4px',
                    padding: '0.8rem',
                    background: '#2a262b',
                    color: '#aaa9ad',
                    fontFamily: 'Teko, sans-serif',
                    fontSize: '1rem'
                  }}
                >
                  <option value="home">Home</option>
                  <option value="comedy">Comedy</option>
                  <option value="carwraps">Car Wraps</option>
                  <option value="modeling">Modeling</option>
                </select>

                <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Post Title:
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title..."
                  style={{ width: '100%', marginBottom: '1rem' }}
                />

                <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Post Content:
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Enter post content..."
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

                <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Image URL:
                </label>
                <input
                  type="text"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                  placeholder="Enter image URL (optional)..."
                  style={{ width: '100%', marginBottom: '1rem' }}
                />

                <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Video URL:
                </label>
                <input
                  type="text"
                  value={newPost.videoUrl}
                  onChange={(e) => setNewPost({...newPost, videoUrl: e.target.value})}
                  placeholder="Enter video URL (YouTube, Vimeo, etc. - optional)..."
                  style={{ width: '100%', marginBottom: '1rem' }}
                />

                <button onClick={createPost}>Create Post</button>
              </div>

              {/* Existing Posts */}
              <div style={{ marginTop: '2rem' }}>
                <h3>Existing Posts</h3>
                {posts.length === 0 ? (
                  <p style={{ color: '#aaa9ad' }}>No posts yet. Create your first post above!</p>
                ) : (
                  posts.map((post, index) => (
                    <div key={post.id} style={{
                      border: '2px solid #9300c5',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      background: '#2a262b'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <span style={{
                            background: '#f50505',
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {post.page.toUpperCase()}
                          </span>
                          <h4 style={{ color: '#9300c5', marginTop: '0.5rem' }}>{post.title}</h4>
                        </div>
                        <button 
                          onClick={() => deletePost(post.id)}
                          style={{ 
                            background: '#f50505',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>{post.content}</p>

                      {post.imageUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ color: '#f50505' }}>Image:</strong> {post.imageUrl}
                        </div>
                      )}

                      {post.videoUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ color: '#f50505' }}>Video:</strong> {post.videoUrl}
                        </div>
                      )}

                      {/* Comments Section */}
                      <div style={{ marginTop: '1rem', borderTop: '1px solid #666', paddingTop: '1rem' }}>
                        <h5 style={{ color: '#f50505', marginBottom: '0.5rem' }}>
                          Comments ({post.comments.length})
                        </h5>
                        
                        {post.comments.map((comment, cIndex) => (
                          <div key={cIndex} style={{
                            background: '#3a363b',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem'
                          }}>
                            <p style={{ color: '#aaa9ad', margin: 0 }}>{comment.text}</p>
                            <small style={{ color: '#666' }}>
                              {new Date(comment.timestamp).toLocaleString()}
                            </small>
                          </div>
                        ))}

                        {selectedPostIndex === index ? (
                          <div style={{ marginTop: '0.5rem' }}>
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              style={{ width: '100%', marginBottom: '0.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => addCommentToPost(index)}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                              >
                                Post Comment
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedPostIndex(null);
                                  setNewComment('');
                                }}
                                style={{ 
                                  background: 'linear-gradient(135deg, #3a363b 0%, #666 100%)',
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.9rem'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSelectedPostIndex(index)}
                            style={{ 
                              marginTop: '0.5rem',
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem'
                            }}
                          >
                            Add Comment
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Patch Management Section */}
          {contentSection === 'patches' && (
            <div>
              <h3>Patch Management</h3>
              <button onClick={applyPatch} disabled={loading}>
                {loading ? 'Applying...' : 'Apply Patch'}
              </button>
              <div style={{ marginTop: '1.5rem' }}>
                <h3>Patch History:</h3>
                {patches.map((patch, i) => (
                  <div key={i} className="patch-item">{patch}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="admin-container">
          <h3>Service Bookings</h3>
          
          {bookings.length === 0 ? (
            <p style={{ color: '#aaa9ad', marginTop: '1.5rem' }}>No bookings yet.</p>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={{
                  border: '2px solid #9300c5',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: booking.status === 'completed' ? '#1a4d1a' : '#2a262b'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <span style={{
                        background: '#f50505',
                        color: 'white',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginRight: '0.5rem'
                      }}>
                        {booking.page.toUpperCase()}
                      </span>
                      {booking.status === 'completed' && (
                        <span style={{
                          background: '#00ff00',
                          color: '#000',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {booking.status !== 'completed' && (
                        <button 
                          onClick={() => markBookingComplete(booking.id)}
                          style={{ 
                            background: '#00aa00',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem'
                          }}
                        >
                          Mark Complete
                        </button>
                      )}
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        style={{ 
                          background: '#f50505',
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Name:</strong> {booking.name}
                  </div>
                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Email:</strong> {booking.email}
                  </div>
                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Phone:</strong> {booking.phone}
                  </div>
                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Date:</strong> {booking.date}
                  </div>
                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Time:</strong> {booking.time}
                  </div>
                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Message:</strong> {booking.message}
                  </div>
                  <div className="patch-item">
                    <strong style={{ color: '#f50505' }}>Submitted:</strong> {new Date(booking.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="admin-container">
          <h3>Manage Service Availability</h3>
          
          {/* Service Selector */}
          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Select Service:
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{
                width: '100%',
                border: '2px solid #9300c5',
                borderRadius: '4px',
                padding: '0.8rem',
                background: '#2a262b',
                color: '#aaa9ad',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1rem'
              }}
            >
              <option value="comedy">Comedy</option>
              <option value="carwraps">Car Wraps</option>
              <option value="modeling">Modeling</option>
            </select>
          </div>

          {/* Add New Time Slot */}
          <div style={{
            border: '2px solid #9300c5',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
            background: '#3a363b'
          }}>
            <h4 style={{ color: '#f50505', marginBottom: '1rem' }}>Add New Time Slot</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#aaa9ad', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Date:
                </label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#aaa9ad', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Start Time:
                </label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#aaa9ad', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  End Time:
                </label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#aaa9ad', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Notes (optional):
                </label>
                <input
                  type="text"
                  value={newSlot.notes}
                  onChange={(e) => setNewSlot({...newSlot, notes: e.target.value})}
                  placeholder="e.g., Special event..."
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button onClick={addTimeSlot}>Add Time Slot</button>
          </div>

          {/* Existing Time Slots */}
          <div>
            <h4 style={{ color: '#f50505', marginBottom: '1rem' }}>
              Existing Time Slots for {selectedService === 'comedy' ? 'Comedy' : selectedService === 'carwraps' ? 'Car Wraps' : 'Modeling'}
            </h4>
            
            {(!availability[selectedService] || availability[selectedService].length === 0) ? (
              <p style={{ color: '#aaa9ad' }}>No time slots created yet for this service.</p>
            ) : (
              <div>
                {availability[selectedService]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(slot => (
                    <div key={slot.id} style={{
                      border: '2px solid #9300c5',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      background: '#2a262b',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#f50505' }}>Date:</strong> {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#f50505' }}>Time:</strong> {slot.startTime} - {slot.endTime}
                        </div>
                        {slot.notes && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#f50505' }}>Notes:</strong> {slot.notes}
                          </div>
                        )}
                        <div>
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
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button
                          onClick={() => toggleSlotAvailability(slot.id)}
                          style={{
                            background: slot.status === 'available' ? '#666' : '#00aa00',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {slot.status === 'available' ? 'Mark as Booked' : 'Mark as Available'}
                        </button>
                        <button
                          onClick={() => deleteTimeSlot(slot.id)}
                          style={{
                            background: '#f50505',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="admin-container">
          <h3>Site Settings</h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="patch-item">
              <strong>Site Name:</strong> Scrape the Plate v4
            </div>
            <div className="patch-item">
              <strong>Theme:</strong> Saints Row (Purple & Red)
            </div>
            <div className="patch-item">
              <strong>Access Code:</strong> ••••
            </div>
            <div className="patch-item">
              <strong>Total Posts:</strong> {posts.length}
            </div>
            <div className="patch-item">
              <strong>Total Bookings:</strong> {bookings.length}
            </div>
            <div className="patch-item">
              <strong>Status:</strong> Active
            </div>
            <div style={{ marginTop: '1rem', color: '#aaa9ad' }}>
              <p>Additional settings coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
