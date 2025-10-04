import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableSection from '../components/DraggableSection';
import PostCard from '../components/PostCard';
import './Home.css';

export default function HomeWithDragDrop() {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero Section' },
    { id: 'services', name: 'Services Section' },
    { id: 'media', name: 'Media Preview Section' },
    { id: 'about', name: 'About Section' },
    { id: 'cta', name: 'Call to Action Section' }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkAdminStatus();
    loadPosts();
    loadSectionOrder();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin-auth/status', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin === true);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts?page=home', {
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

  const loadSectionOrder = async () => {
    try {
      const response = await fetch('/api/sections/home', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const orderedSections = data
            .sort((a, b) => a.section_order - b.section_order)
            .map(s => ({ id: s.section_id, name: s.section_id }));
          setSections(orderedSections);
        }
      }
    } catch (error) {
      console.error('Failed to load section order:', error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveSectionOrder = async () => {
    try {
      const sectionsData = sections.map(s => ({
        section_id: s.id,
        visible: true
      }));

      const response = await fetch('/api/sections/home/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ sections: sectionsData })
      });

      if (response.ok) {
        alert('Section order saved successfully!');
        setIsDragMode(false);
      } else {
        alert('Failed to save section order');
      }
    } catch (error) {
      console.error('Failed to save section order:', error);
      alert('Failed to save section order');
    }
  };

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'hero':
        return (
          <section className="hero-section">
            <div className="hero-content">
              <h1>Scape the Plate Entertainment</h1>
              <p className="hero-subtitle">Comedy. Car Wrapping. Modeling</p>
              <p className="hero-tagline">Available for Booking</p>
              <p className="hero-tagline">Est. 2000 – Present</p>
              <div className="hero-cta">
                <Link to="/comedy"><button>Book Comedy</button></Link>
                <Link to="/car-wraps"><button>Book Car Wrapping</button></Link>
                <Link to="/modeling"><button>Book Modeling</button></Link>
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section className="services-section">
            <h2>What We Do</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🎤</div>
                <h3>Comedy</h3>
                <p>
                  From stand-up shows to private events, our comedians bring the kind of energy that keeps people laughing long after the lights go down.
                </p>
                <Link to="/comedy"><button>Book Comedy</button></Link>
              </div>

              <div className="service-card">
                <div className="service-icon">🚗</div>
                <h3>Car Wrapping</h3>
                <p>
                  Style. Custom. One-of-a-kind. Our car wrapping team transforms vehicles into moving works of art that demand attention.
                </p>
                <Link to="/car-wraps"><button>Book Car Wrapping</button></Link>
              </div>

              <div className="service-card">
                <div className="service-icon">📸</div>
                <h3>Modeling</h3>
                <p>
                  Professional models available for photo shoots, branding campaigns, promotions, and events—ready to put your vision in the spotlight.
                </p>
                <Link to="/modeling"><button>Book Modeling</button></Link>
              </div>
            </div>
          </section>
        );

      case 'media':
        return (
          <section className="media-preview-section">
            <h2>Our Work</h2>
            {posts.length > 0 ? (
              <>
                <div className="media-preview-grid">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="service-card">
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            marginBottom: '1rem'
                          }}
                        />
                      )}
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                    </div>
                  ))}
                </div>
                <div className="view-all-link">
                  <Link to="/media"><button>View All Media</button></Link>
                </div>
              </>
            ) : (
              <div className="no-media-message">
                <p>Check out our media gallery to see examples of our work!</p>
                <Link to="/media" style={{ marginTop: '1rem', display: 'inline-block' }}>
                  <button>Visit Gallery</button>
                </Link>
              </div>
            )}
          </section>
        );

      case 'about':
        return (
          <section className="about-section">
            <div className="about-content">
              <h2>Our Philosophy</h2>
              <p>
                From Atlanta to the Carolinas, to Virginia, and now nationwide—we've been setting the standard in entertainment since day one.
              </p>
              <p className="about-highlight">
                This isn't just a brand. This isn't just business.
              </p>
              <p className="about-highlight-large">
                This is Scape the Plate entertainment!
              </p>
              <p className="philosophy-quote">
                "For us, scraping the plate ain't about being full. It's about delivering value, creating unforgettable experiences, and making sure nobody leaves empty-handed."
              </p>
              <p>
                You don't just consume entertainment with us—you become part of it. Whether you're laughing at one of our comedy shows, turning heads in a freshly wrapped ride, or stepping in front of the camera for a modeling gig, you're not a spectator. You're in the mix.
              </p>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className="cta-section">
            <div className="cta-content">
              <h2>Ready to Book?</h2>
              <p>📌 Ready to elevate your next event, project, or brand?</p>
              <p>🎭 Laugh with us.</p>
              <p>🚘 Ride with us.</p>
              <p>📸 Shine with us.</p>
              <p className="cta-tagline">
                Scape the Plate Entertainment – Where the culture eats, and the people feast.
              </p>
              <div className="cta-buttons">
                <Link to="/comedy"><button>Book Comedy</button></Link>
                <Link to="/car-wraps"><button>Book Car Wrapping</button></Link>
                <Link to="/modeling"><button>Book Modeling</button></Link>
                <Link to="/contact"><button>Contact Us</button></Link>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="home-page">
      {isAdmin && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1000,
          background: isDragMode ? '#f50505' : '#9300c5',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          display: 'flex',
          gap: '10px',
          flexDirection: 'column'
        }}>
          <button
            onClick={() => setIsDragMode(!isDragMode)}
            style={{
              background: 'white',
              color: isDragMode ? '#f50505' : '#9300c5',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'Teko, sans-serif',
              fontSize: '1.1rem'
            }}
          >
            {isDragMode ? '✕ Cancel Drag Mode' : '⋮⋮ Enable Drag Mode'}
          </button>
          {isDragMode && (
            <button
              onClick={saveSectionOrder}
              style={{
                background: '#00ff00',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1.1rem'
              }}
            >
              💾 Save Order
            </button>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <DraggableSection key={section.id} id={section.id} isDragMode={isDragMode}>
              {renderSection(section.id)}
            </DraggableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
