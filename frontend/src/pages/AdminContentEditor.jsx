import React, { useState, useEffect } from 'react';

const defaultContent = {
  // Home Page
  home: {
    heroTitle: 'Scape the Plate Entertainment',
    heroSubtitle: 'Comedy. Car Wrapping. Modeling',
    heroTagline1: 'Available for Booking',
    heroTagline2: 'Est. 2000 – Present',
    servicesHeading: 'What We Do',
    comedyDesc: 'From stand-up shows to private events, our comedians bring the kind of energy that keeps people laughing long after the lights go down.',
    carWrappingDesc: 'Style. Custom. One-of-a-kind. Our car wrapping team transforms vehicles into moving works of art that demand attention.',
    modelingDesc: 'Professional models available for photo shoots, branding campaigns, promotions, and events—ready to put your vision in the spotlight.',
    philosophyHeading: 'Our Philosophy',
    philosophyP1: "From Atlanta to the Carolinas, to Virginia, and now nationwide—we've been setting the standard in entertainment since day one.",
    philosophyHighlight: "This isn't just a brand. This isn't just business.\n\nThis is Scape the Plate entertainment!",
    philosophyQuote: "For us, scraping the plate ain't about being full. It's about delivering value, creating unforgettable experiences, and making sure nobody leaves empty-handed.",
    philosophyP2: "You don't just consume entertainment with us—you become part of it. Whether you're laughing at one of our comedy shows, turning heads in a freshly wrapped ride, or stepping in front of the camera for a modeling gig, you're not a spectator. You're in the mix.",
    mediaHeading: 'Our Work',
    mediaNoPostsMsg: 'Check out our media gallery to see examples of our work!',
    ctaHeading: 'Ready to Book?',
    ctaLine1: '📌 Ready to elevate your next event, project, or brand?',
    ctaLine2: '🎭 Laugh with us.',
    ctaLine3: '🚘 Ride with us.',
    ctaLine4: '📸 Shine with us.',
    ctaTagline: 'Scape the Plate Entertainment – Where the culture eats, and the people feast.'
  },
  
  // About Page
  about: {
    heroTitle: 'About Scape the Plate Entertainment',
    heroTagline: 'Est. 2000 – Present',
    storyHeading: 'Our Story',
    storyP1: "From Atlanta to the Carolinas, to Virginia, and now nationwide—we've been setting the standard in entertainment since day one.",
    storyP2: "This isn't just a brand. This isn't just business.",
    storyHighlight: 'This is Scape the Plate.',
    bringHeading: 'What We Bring to the Table',
    bringP1: "Right now, we're bringing you top-tier Comedy, custom Car Wrapping, and professional Modeling—all available for booking today.",
    bringP2: "We built this from the ground up. We know what works, what doesn't, and what it takes to deliver an experience that sticks with you long after the show's over, the wrap's applied, or the shoot wraps up.",
    philosophyHeading: 'Our Philosophy',
    philosophyP1: "You don't just consume entertainment with us—you become part of it. Whether you're laughing at one of our comedy shows, turning heads in a freshly wrapped ride, or stepping in front of the camera for a modeling gig, you're not a spectator. You're in the mix.",
    philosophyQuote: "Entertainment isn't passive. It's participatory. It's visceral. It's now.",
    whyHeading: 'Why Choose Us?',
    why1Title: '🎤 25+ Years of Excellence',
    why1Desc: "Since 2000, we've been perfecting our craft and delivering unforgettable experiences",
    why2Title: '🌎 Nationwide Reach',
    why2Desc: 'From our roots in Atlanta to customers across the country',
    why3Title: '⚡ Professional Quality',
    why3Desc: "We don't cut corners. We deliver excellence every single time",
    why4Title: '🔥 Authentic Experience',
    why4Desc: "This isn't corporate. This is real, raw, and unforgettable",
    ctaHeading: 'Ready to Experience the Difference?',
    ctaP: "Whether you need comedy, car wrapping, or modeling services—we're ready to deliver."
  },
  
  // Media Page
  media: {
    heroTitle: 'Media Gallery',
    heroDesc: 'Our Work in Action',
    noMediaHeading: 'No media yet!',
    noMediaP1: 'Check back soon as we add photos and videos from our work.',
    noMediaP2: 'Admins can add media posts from the Admin panel.'
  },
  
  // Contact Page
  contact: {
    heroTitle: 'Get in Touch',
    heroSubtitle: "Ready to Book? Let's Make It Happen.",
    infoHeading: 'Contact Information',
    comedyTitle: '🎤 Comedy Bookings',
    comedyDesc: 'Book our comedians for your next event, club, or private party.',
    carTitle: '🚗 Car Wrapping',
    carDesc: 'Transform your ride with custom wraps, graphics, and designs.',
    modelingTitle: '📸 Modeling Services',
    modelingDesc: 'Professional modeling for photoshoots, events, and promotional work.',
    areaTitle: '📍 Service Area',
    areaDesc: 'Nationwide service with roots in Atlanta, the Carolinas, and Virginia.',
    hoursTitle: '⏰ Hours',
    hoursLine1: 'Available for bookings 7 days a week',
    hoursLine2: 'Response time: Within 24 hours',
    socialTitle: 'Follow Us',
    formHeading: 'Send Us a Message'
  },
  
  // Service Pages
  services: {
    comedyContent: 'Book comedy shows and performances.',
    carWrapsContent: 'Professional car wrap services and designs.',
    modelingContent: 'Book modeling sessions and view our portfolio.'
  }
};

export default function AdminContentEditor({ onSave, successMessage }) {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const saved = localStorage.getItem('siteContentFull');
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  const handleChange = (page, field, value) => {
    setContent(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }));
  };

  const saveChanges = () => {
    localStorage.setItem('siteContentFull', JSON.stringify(content));
    if (onSave) onSave('Content saved successfully!');
  };

  const resetToDefaults = () => {
    setContent(defaultContent);
    localStorage.removeItem('siteContentFull');
    if (onSave) onSave('Content reset to defaults!');
  };

  const TextInput = ({ label, value, onChange, rows }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', color: '#9300c5', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        {label}:
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          style={{
            width: '100%',
            border: '2px solid #9300c5',
            borderRadius: '4px',
            padding: '0.8rem',
            background: '#3a363b',
            color: '#aaa9ad',
            fontFamily: 'Teko, sans-serif',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            border: '2px solid #9300c5',
            borderRadius: '4px',
            padding: '0.8rem',
            background: '#3a363b',
            color: '#aaa9ad',
            fontFamily: 'Teko, sans-serif',
            fontSize: '1rem'
          }}
        />
      )}
    </div>
  );

  return (
    <div>
      <h3 style={{ color: '#f50505', marginBottom: '1.5rem' }}>Edit All Site Content</h3>
      
      {/* Page Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'about', label: 'About' },
          { id: 'media', label: 'Media' },
          { id: 'contact', label: 'Contact' },
          { id: 'services', label: 'Services' }
        ].map(page => (
          <button
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            style={{
              opacity: selectedPage === page.id ? 1 : 0.6,
              padding: '0.6rem 1.5rem',
              fontSize: '0.95rem',
              background: selectedPage === page.id 
                ? 'linear-gradient(135deg, #9300c5 0%, #f50505 100%)'
                : 'linear-gradient(135deg, #3a363b 0%, #666 100%)'
            }}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Content Editor */}
      <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1rem', background: '#2a262b', borderRadius: '6px', border: '2px solid #9300c5' }}>
        
        {/* HOME PAGE */}
        {selectedPage === 'home' && (
          <div>
            <h4 style={{ color: '#f50505', marginBottom: '1rem', fontSize: '1.5rem' }}>Home Page Content</h4>
            
            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Hero Section</h5>
              <TextInput label="Hero Title" value={content.home.heroTitle} onChange={(v) => handleChange('home', 'heroTitle', v)} />
              <TextInput label="Hero Subtitle" value={content.home.heroSubtitle} onChange={(v) => handleChange('home', 'heroSubtitle', v)} />
              <TextInput label="Hero Tagline 1" value={content.home.heroTagline1} onChange={(v) => handleChange('home', 'heroTagline1', v)} />
              <TextInput label="Hero Tagline 2" value={content.home.heroTagline2} onChange={(v) => handleChange('home', 'heroTagline2', v)} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Services Section</h5>
              <TextInput label="Section Heading" value={content.home.servicesHeading} onChange={(v) => handleChange('home', 'servicesHeading', v)} />
              <TextInput label="Comedy Description" value={content.home.comedyDesc} onChange={(v) => handleChange('home', 'comedyDesc', v)} rows={3} />
              <TextInput label="Car Wrapping Description" value={content.home.carWrappingDesc} onChange={(v) => handleChange('home', 'carWrappingDesc', v)} rows={3} />
              <TextInput label="Modeling Description" value={content.home.modelingDesc} onChange={(v) => handleChange('home', 'modelingDesc', v)} rows={3} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Philosophy Section</h5>
              <TextInput label="Section Heading" value={content.home.philosophyHeading} onChange={(v) => handleChange('home', 'philosophyHeading', v)} />
              <TextInput label="Paragraph 1" value={content.home.philosophyP1} onChange={(v) => handleChange('home', 'philosophyP1', v)} rows={2} />
              <TextInput label="Highlight Text" value={content.home.philosophyHighlight} onChange={(v) => handleChange('home', 'philosophyHighlight', v)} rows={2} />
              <TextInput label="Philosophy Quote" value={content.home.philosophyQuote} onChange={(v) => handleChange('home', 'philosophyQuote', v)} rows={3} />
              <TextInput label="Paragraph 2" value={content.home.philosophyP2} onChange={(v) => handleChange('home', 'philosophyP2', v)} rows={3} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Media Preview Section</h5>
              <TextInput label="Section Heading" value={content.home.mediaHeading} onChange={(v) => handleChange('home', 'mediaHeading', v)} />
              <TextInput label="No Posts Message" value={content.home.mediaNoPostsMsg} onChange={(v) => handleChange('home', 'mediaNoPostsMsg', v)} rows={2} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>CTA Section</h5>
              <TextInput label="CTA Heading" value={content.home.ctaHeading} onChange={(v) => handleChange('home', 'ctaHeading', v)} />
              <TextInput label="Line 1" value={content.home.ctaLine1} onChange={(v) => handleChange('home', 'ctaLine1', v)} />
              <TextInput label="Line 2" value={content.home.ctaLine2} onChange={(v) => handleChange('home', 'ctaLine2', v)} />
              <TextInput label="Line 3" value={content.home.ctaLine3} onChange={(v) => handleChange('home', 'ctaLine3', v)} />
              <TextInput label="Line 4" value={content.home.ctaLine4} onChange={(v) => handleChange('home', 'ctaLine4', v)} />
              <TextInput label="CTA Tagline" value={content.home.ctaTagline} onChange={(v) => handleChange('home', 'ctaTagline', v)} rows={2} />
            </div>
          </div>
        )}

        {/* ABOUT PAGE */}
        {selectedPage === 'about' && (
          <div>
            <h4 style={{ color: '#f50505', marginBottom: '1rem', fontSize: '1.5rem' }}>About Page Content</h4>
            
            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Hero Section</h5>
              <TextInput label="Hero Title" value={content.about.heroTitle} onChange={(v) => handleChange('about', 'heroTitle', v)} />
              <TextInput label="Hero Tagline" value={content.about.heroTagline} onChange={(v) => handleChange('about', 'heroTagline', v)} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Our Story</h5>
              <TextInput label="Section Heading" value={content.about.storyHeading} onChange={(v) => handleChange('about', 'storyHeading', v)} />
              <TextInput label="Paragraph 1" value={content.about.storyP1} onChange={(v) => handleChange('about', 'storyP1', v)} rows={2} />
              <TextInput label="Paragraph 2" value={content.about.storyP2} onChange={(v) => handleChange('about', 'storyP2', v)} />
              <TextInput label="Highlight" value={content.about.storyHighlight} onChange={(v) => handleChange('about', 'storyHighlight', v)} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>What We Bring</h5>
              <TextInput label="Section Heading" value={content.about.bringHeading} onChange={(v) => handleChange('about', 'bringHeading', v)} />
              <TextInput label="Paragraph 1" value={content.about.bringP1} onChange={(v) => handleChange('about', 'bringP1', v)} rows={2} />
              <TextInput label="Paragraph 2" value={content.about.bringP2} onChange={(v) => handleChange('about', 'bringP2', v)} rows={3} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Philosophy</h5>
              <TextInput label="Section Heading" value={content.about.philosophyHeading} onChange={(v) => handleChange('about', 'philosophyHeading', v)} />
              <TextInput label="Paragraph" value={content.about.philosophyP1} onChange={(v) => handleChange('about', 'philosophyP1', v)} rows={3} />
              <TextInput label="Quote" value={content.about.philosophyQuote} onChange={(v) => handleChange('about', 'philosophyQuote', v)} rows={2} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Why Choose Us</h5>
              <TextInput label="Section Heading" value={content.about.whyHeading} onChange={(v) => handleChange('about', 'whyHeading', v)} />
              <TextInput label="Card 1 Title" value={content.about.why1Title} onChange={(v) => handleChange('about', 'why1Title', v)} />
              <TextInput label="Card 1 Description" value={content.about.why1Desc} onChange={(v) => handleChange('about', 'why1Desc', v)} rows={2} />
              <TextInput label="Card 2 Title" value={content.about.why2Title} onChange={(v) => handleChange('about', 'why2Title', v)} />
              <TextInput label="Card 2 Description" value={content.about.why2Desc} onChange={(v) => handleChange('about', 'why2Desc', v)} rows={2} />
              <TextInput label="Card 3 Title" value={content.about.why3Title} onChange={(v) => handleChange('about', 'why3Title', v)} />
              <TextInput label="Card 3 Description" value={content.about.why3Desc} onChange={(v) => handleChange('about', 'why3Desc', v)} rows={2} />
              <TextInput label="Card 4 Title" value={content.about.why4Title} onChange={(v) => handleChange('about', 'why4Title', v)} />
              <TextInput label="Card 4 Description" value={content.about.why4Desc} onChange={(v) => handleChange('about', 'why4Desc', v)} rows={2} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>CTA Section</h5>
              <TextInput label="Heading" value={content.about.ctaHeading} onChange={(v) => handleChange('about', 'ctaHeading', v)} />
              <TextInput label="Description" value={content.about.ctaP} onChange={(v) => handleChange('about', 'ctaP', v)} rows={2} />
            </div>
          </div>
        )}

        {/* MEDIA PAGE */}
        {selectedPage === 'media' && (
          <div>
            <h4 style={{ color: '#f50505', marginBottom: '1rem', fontSize: '1.5rem' }}>Media Page Content</h4>
            
            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Hero Section</h5>
              <TextInput label="Hero Title" value={content.media.heroTitle} onChange={(v) => handleChange('media', 'heroTitle', v)} />
              <TextInput label="Hero Description" value={content.media.heroDesc} onChange={(v) => handleChange('media', 'heroDesc', v)} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>No Media Message</h5>
              <TextInput label="Heading" value={content.media.noMediaHeading} onChange={(v) => handleChange('media', 'noMediaHeading', v)} />
              <TextInput label="Paragraph 1" value={content.media.noMediaP1} onChange={(v) => handleChange('media', 'noMediaP1', v)} rows={2} />
              <TextInput label="Paragraph 2 (Admin Note)" value={content.media.noMediaP2} onChange={(v) => handleChange('media', 'noMediaP2', v)} rows={2} />
            </div>
          </div>
        )}

        {/* CONTACT PAGE */}
        {selectedPage === 'contact' && (
          <div>
            <h4 style={{ color: '#f50505', marginBottom: '1rem', fontSize: '1.5rem' }}>Contact Page Content</h4>
            
            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Hero Section</h5>
              <TextInput label="Hero Title" value={content.contact.heroTitle} onChange={(v) => handleChange('contact', 'heroTitle', v)} />
              <TextInput label="Hero Subtitle" value={content.contact.heroSubtitle} onChange={(v) => handleChange('contact', 'heroSubtitle', v)} />
            </div>

            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9300c5', marginBottom: '1rem' }}>Contact Information</h5>
              <TextInput label="Section Heading" value={content.contact.infoHeading} onChange={(v) => handleChange('contact', 'infoHeading', v)} />
              <TextInput label="Comedy Title" value={content.contact.comedyTitle} onChange={(v) => handleChange('contact', 'comedyTitle', v)} />
              <TextInput label="Comedy Description" value={content.contact.comedyDesc} onChange={(v) => handleChange('contact', 'comedyDesc', v)} rows={2} />
              <TextInput label="Car Wrapping Title" value={content.contact.carTitle} onChange={(v) => handleChange('contact', 'carTitle', v)} />
              <TextInput label="Car Wrapping Description" value={content.contact.carDesc} onChange={(v) => handleChange('contact', 'carDesc', v)} rows={2} />
              <TextInput label="Modeling Title" value={content.contact.modelingTitle} onChange={(v) => handleChange('contact', 'modelingTitle', v)} />
              <TextInput label="Modeling Description" value={content.contact.modelingDesc} onChange={(v) => handleChange('contact', 'modelingDesc', v)} rows={2} />
              <TextInput label="Service Area Title" value={content.contact.areaTitle} onChange={(v) => handleChange('contact', 'areaTitle', v)} />
              <TextInput label="Service Area Description" value={content.contact.areaDesc} onChange={(v) => handleChange('contact', 'areaDesc', v)} rows={2} />
              <TextInput label="Hours Title" value={content.contact.hoursTitle} onChange={(v) => handleChange('contact', 'hoursTitle', v)} />
              <TextInput label="Hours Line 1" value={content.contact.hoursLine1} onChange={(v) => handleChange('contact', 'hoursLine1', v)} />
              <TextInput label="Hours Line 2" value={content.contact.hoursLine2} onChange={(v) => handleChange('contact', 'hoursLine2', v)} />
              <TextInput label="Social Title" value={content.contact.socialTitle} onChange={(v) => handleChange('contact', 'socialTitle', v)} />
              <TextInput label="Form Heading" value={content.contact.formHeading} onChange={(v) => handleChange('contact', 'formHeading', v)} />
            </div>
          </div>
        )}

        {/* SERVICES PAGES */}
        {selectedPage === 'services' && (
          <div>
            <h4 style={{ color: '#f50505', marginBottom: '1rem', fontSize: '1.5rem' }}>Service Pages Content</h4>
            
            <div style={{ background: '#3a363b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <TextInput label="Comedy Page Description" value={content.services.comedyContent} onChange={(v) => handleChange('services', 'comedyContent', v)} rows={2} />
              <TextInput label="Car Wraps Page Description" value={content.services.carWrapsContent} onChange={(v) => handleChange('services', 'carWrapsContent', v)} rows={2} />
              <TextInput label="Modeling Page Description" value={content.services.modelingContent} onChange={(v) => handleChange('services', 'modelingContent', v)} rows={2} />
            </div>
          </div>
        )}
      </div>

      {/* Save Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={saveChanges}>Save All Changes</button>
        <button onClick={resetToDefaults} style={{ background: 'linear-gradient(135deg, #666 0%, #3a363b 100%)' }}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
