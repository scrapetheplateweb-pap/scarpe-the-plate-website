import React, { useState } from 'react';
import AdminContentEditor from './AdminContentEditor';
import ProductManager from './ProductManager';
import ApplicationManager from './ApplicationManager';

export default function Admin() {
  const [patches, setPatches] = useState([]);
  const [patchInput, setPatchInput] = useState('');
  const [patchError, setPatchError] = useState('');
  const [patchSuccess, setPatchSuccess] = useState('');
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

  // User activity states
  const [activityStats, setActivityStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityFilter, setActivityFilter] = useState('all');
  const [activityLimit, setActivityLimit] = useState(50);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin-auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ accessCode })
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid access code!');
        setAccessCode('');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
      setAccessCode('');
    }
  };

  const loadPatches = async () => {
    try {
      const response = await fetch('/api/admin/patch/list');
      const data = await response.json();
      if (data.success) {
        setPatches(data.patches);
      }
    } catch (error) {
      console.error('Error loading patches:', error);
    }
  };

  const applyPatch = async () => {
    setPatchError('');
    setPatchSuccess('');
    setLoading(true);
    
    try {
      const patchData = JSON.parse(patchInput);
      
      const response = await fetch('/api/admin/patch/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPatchSuccess(`Patch applied successfully! ID: ${data.patchId}`);
        setPatchInput('');
        loadPatches();
      } else {
        setPatchError(data.error || 'Patch application failed');
      }
    } catch (error) {
      setPatchError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const rollbackPatch = async (patchId) => {
    if (!confirm('Are you sure you want to rollback this patch?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/patch/rollback/${patchId}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPatchSuccess('Patch rolled back successfully!');
        loadPatches();
      } else {
        setPatchError(data.error || 'Rollback failed');
      }
    } catch (error) {
      setPatchError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      loadPatches();
    }
  }, [isAuthenticated]);

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
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in title and content!');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          page: newPost.page,
          title: newPost.title,
          content: newPost.content,
          imageUrl: newPost.imageUrl,
          videoUrl: newPost.videoUrl
        })
      });

      if (response.ok) {
        await loadPosts();
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
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await loadPosts();
        setSuccessMessage('Post deleted!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
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
          onClick={() => setActiveTab('products')}
          style={{ opacity: activeTab === 'products' ? 1 : 0.6 }}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('applications')}
          style={{ opacity: activeTab === 'applications' ? 1 : 0.6 }}
        >
          Job Applications
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          style={{ opacity: activeTab === 'activity' ? 1 : 0.6 }}
        >
          User Activity
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
              <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>
                Apply code patches to modify files in the application. Patches are JSON-formatted with operations to create, update, or delete files.
              </p>

              <div style={{ 
                background: '#3a363b', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#aaa9ad'
              }}>
                <strong style={{ color: '#f50505' }}>Example Patch Format:</strong>
                <pre style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#fff',
                  overflowX: 'auto'
                }}>{`{
  "name": "Add test file",
  "description": "Creates a test file",
  "operations": [
    {
      "type": "create",
      "path": "test-file.txt",
      "content": "Hello World!"
    }
  ]
}`}</pre>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Operation types:</strong> create, update, delete<br/>
                  <strong>Note:</strong> Paths are relative to project root. Protected directories (node_modules, .git, backend/data) cannot be modified.
                </div>
              </div>

              <textarea
                value={patchInput}
                onChange={(e) => setPatchInput(e.target.value)}
                placeholder="Paste your JSON patch here..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  marginBottom: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  padding: '1rem',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '2px solid #9300c5',
                  borderRadius: '8px'
                }}
              />

              {patchError && (
                <div style={{
                  background: '#4d1a1a',
                  border: '2px solid #f50505',
                  color: '#ff6b6b',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <strong>Error:</strong> {patchError}
                </div>
              )}

              {patchSuccess && (
                <div style={{
                  background: '#1a4d1a',
                  border: '2px solid #00ff00',
                  color: '#90ff90',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <strong>Success:</strong> {patchSuccess}
                </div>
              )}

              <button 
                onClick={applyPatch} 
                disabled={loading || !patchInput.trim()}
                style={{
                  opacity: (loading || !patchInput.trim()) ? 0.5 : 1,
                  cursor: (loading || !patchInput.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Applying Patch...' : 'Apply Patch'}
              </button>

              <div style={{ marginTop: '2rem' }}>
                <h3>Patch History</h3>
                {patches.length === 0 ? (
                  <p style={{ color: '#aaa9ad' }}>No patches applied yet.</p>
                ) : (
                  patches.map((patch) => (
                    <div 
                      key={patch.id} 
                      style={{
                        border: '2px solid #9300c5',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: patch.rolledBack ? '#3a2a1a' : '#2a262b'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#f50505' }}>
                            {patch.name}
                          </h4>
                          <p style={{ color: '#aaa9ad', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                            {patch.description}
                          </p>
                        </div>
                        <div>
                          <span style={{
                            background: patch.status === 'success' ? '#00aa00' : patch.status === 'partial' ? '#aa6600' : '#aa0000',
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {patch.status.toUpperCase()}
                          </span>
                          {patch.rolledBack && (
                            <span style={{
                              background: '#666',
                              color: 'white',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              marginLeft: '0.5rem'
                            }}>
                              ROLLED BACK
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                        Applied: {new Date(patch.timestamp).toLocaleString()}<br/>
                        ID: {patch.id}<br/>
                        Operations: {patch.operations.length}
                      </div>

                      <details style={{ marginTop: '0.5rem' }}>
                        <summary style={{ cursor: 'pointer', color: '#9300c5', fontWeight: 'bold' }}>
                          View Operations
                        </summary>
                        <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                          {patch.operations.map((op, idx) => (
                            <div key={idx} style={{ 
                              marginBottom: '0.5rem',
                              fontSize: '0.85rem',
                              color: op.success ? '#90ff90' : '#ff6b6b'
                            }}>
                              • {op.type.toUpperCase()}: {op.path} {op.success ? '✓' : `✗ (${op.error})`}
                            </div>
                          ))}
                        </div>
                      </details>

                      {!patch.rolledBack && patch.backups.length > 0 && (
                        <button
                          onClick={() => rollbackPatch(patch.id)}
                          disabled={loading}
                          style={{
                            background: '#f50505',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            marginTop: '1rem'
                          }}
                        >
                          Rollback Patch
                        </button>
                      )}
                    </div>
                  ))
                )}
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

      {/* User Activity Tab */}
      {activeTab === 'activity' && (
        <div className="admin-container">
          <h3>User Activity & Traffic Analytics</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={async () => {
                try {
                  const statsRes = await fetch('/api/activity/stats', { credentials: 'include' });
                  const activityRes = await fetch(`/api/activity?limit=${activityLimit}`, { credentials: 'include' });
                  if (statsRes.ok && activityRes.ok) {
                    setActivityStats(await statsRes.json());
                    setActivityLogs(await activityRes.json());
                  } else {
                    console.error('Failed to load activity data');
                  }
                } catch (error) {
                  console.error('Error loading activity:', error);
                }
              }}
            >
              Refresh Data
            </button>
            <select 
              value={activityLimit} 
              onChange={(e) => setActivityLimit(e.target.value)}
              style={{ padding: '0.5rem' }}
            >
              <option value="25">Show 25</option>
              <option value="50">Show 50</option>
              <option value="100">Show 100</option>
              <option value="200">Show 200</option>
            </select>
          </div>

          {activityStats && (
            <div>
              <h4 style={{ color: '#9300c5', marginBottom: '1rem' }}>Last 30 Days Statistics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Total Actions</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#9300c5' }}>{activityStats.stats?.total_actions || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Unique Users</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f50505' }}>{activityStats.stats?.unique_users || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Page Views</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#9300c5' }}>{activityStats.stats?.total_page_views || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Registrations</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f50505' }}>{activityStats.stats?.total_registrations || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Logins</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#9300c5' }}>{activityStats.stats?.total_logins || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Posts Created</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f50505' }}>{activityStats.stats?.total_posts_created || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Comments</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#9300c5' }}>{activityStats.stats?.total_comments || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Likes</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f50505' }}>{activityStats.stats?.total_likes || 0}</div>
                </div>
                <div className="patch-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>Bookings</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#9300c5' }}>{activityStats.stats?.total_bookings || 0}</div>
                </div>
              </div>

              {activityStats.topPages && activityStats.topPages.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#f50505', marginBottom: '1rem' }}>Top Pages</h4>
                  <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                    {activityStats.topPages.map((page, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < activityStats.topPages.length - 1 ? '1px solid #2a262b' : 'none' }}>
                        <span style={{ textTransform: 'capitalize' }}>{page.page || 'Unknown'}</span>
                        <span style={{ color: '#9300c5', fontWeight: 'bold' }}>{page.visits} visits</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <h4 style={{ color: '#9300c5', marginBottom: '1rem' }}>Recent Activity Log</h4>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {activityLogs.length === 0 ? (
              <div className="patch-item">
                <p style={{ color: '#aaa9ad' }}>No activity recorded yet. Click "Refresh Data" to load activity logs.</p>
              </div>
            ) : (
              activityLogs.map((log, idx) => (
                <div key={idx} className="patch-item" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div>
                      <span style={{ 
                        background: log.action_type.includes('delete') ? '#f50505' : 
                                   log.action_type.includes('create') || log.action_type === 'register' ? '#00aa00' : 
                                   log.action_type === 'login' ? '#9300c5' : '#666',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginRight: '0.5rem'
                      }}>
                        {log.action_type.toUpperCase().replace('_', ' ')}
                      </span>
                      <strong>{log.username || 'anonymous'}</strong>
                      {log.display_name && <span style={{ color: '#aaa9ad' }}> ({log.display_name})</span>}
                    </div>
                    <span style={{ color: '#aaa9ad', fontSize: '0.8rem' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ color: '#aaa9ad', fontSize: '0.85rem' }}>
                    {log.action_details || 'No details'}
                    {log.page && <span style={{ marginLeft: '0.5rem', color: '#9300c5' }}>• Page: {log.page}</span>}
                  </div>
                  {log.ip_address && (
                    <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      IP: {log.ip_address}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="admin-container">
          <ProductManager 
            onSuccess={(msg) => {
              setSuccessMessage(msg);
              setTimeout(() => setSuccessMessage(''), 3000);
            }}
          />
        </div>
      )}

      {/* Job Applications Tab */}
      {activeTab === 'applications' && (
        <div className="admin-container">
          <ApplicationManager 
            onSuccess={(msg) => {
              setSuccessMessage(msg);
              setTimeout(() => setSuccessMessage(''), 3000);
            }}
          />
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
