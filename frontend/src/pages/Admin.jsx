import React, { useState } from 'react';

export default function Admin() {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('patches');
  
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
    comments: []
  });
  const [newComment, setNewComment] = useState('');
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  React.useEffect(() => {
    const savedPosts = localStorage.getItem('sitePosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
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
          onClick={() => setActiveTab('patches')}
          style={{ opacity: activeTab === 'patches' ? 1 : 0.6 }}
        >
          Patch Management
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          style={{ opacity: activeTab === 'content' ? 1 : 0.6 }}
        >
          Content Editor
        </button>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ opacity: activeTab === 'posts' ? 1 : 0.6 }}
        >
          Post Manager
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

      {/* Patch Management Tab */}
      {activeTab === 'patches' && (
        <div className="admin-container">
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

      {/* Content Editor Tab */}
      {activeTab === 'content' && (
        <div className="admin-container">
          <h3>Edit Site Content</h3>
          
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Home Page Title:
            </label>
            <input
              type="text"
              value={homeTitle}
              onChange={(e) => setHomeTitle(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />

            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Home Page Description:
            </label>
            <textarea
              value={homeDescription}
              onChange={(e) => setHomeDescription(e.target.value)}
              rows={3}
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
              Comedy Page Content:
            </label>
            <textarea
              value={comedyContent}
              onChange={(e) => setComedyContent(e.target.value)}
              rows={2}
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
              Car Wraps Page Content:
            </label>
            <textarea
              value={carWrapsContent}
              onChange={(e) => setCarWrapsContent(e.target.value)}
              rows={2}
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
              Modeling Page Content:
            </label>
            <textarea
              value={modelingContent}
              onChange={(e) => setModelingContent(e.target.value)}
              rows={2}
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={saveContentChanges}>Save Changes</button>
              <button onClick={resetContent} style={{ background: 'linear-gradient(135deg, #3a363b 0%, #666 100%)' }}>
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Manager Tab */}
      {activeTab === 'posts' && (
        <div className="admin-container">
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
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '1rem'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
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
