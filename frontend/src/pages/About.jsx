import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Scape the Plate Entertainment</h1>
        <p className="hero-tagline">Est. 2000 – Present</p>
      </div>

      <div className="container">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            From Atlanta to the Carolinas, to Virginia, and now nationwide—we've been setting the standard in entertainment since day one.
          </p>
          <p>
            This isn't just a brand. This isn't just business.
          </p>
          <p className="highlight">
            This is Scape the Plate.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Bring to the Table</h2>
          <p>
            Right now, we're bringing you top-tier <span className="service-highlight">Comedy</span>, custom <span className="service-highlight">Car Wrapping</span>, and professional <span className="service-highlight">Modeling</span>—all available for booking today.
          </p>
          <p>
            We built this from the ground up. We know what works, what doesn't, and what it takes to deliver an experience that sticks with you long after the show's over, the wrap's applied, or the shoot wraps up.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Philosophy</h2>
          <p>
            You don't just consume entertainment with us—you become part of it. Whether you're laughing at one of our comedy shows, turning heads in a freshly wrapped ride, or stepping in front of the camera for a modeling gig, you're not a spectator. You're in the mix.
          </p>
          <p className="philosophy-quote">
            "Entertainment isn't passive. It's participatory. It's visceral. It's now."
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>🎤 25+ Years of Excellence</h3>
              <p>Since 2000, we've been perfecting our craft and delivering unforgettable experiences</p>
            </div>
            <div className="why-card">
              <h3>🌎 Nationwide Reach</h3>
              <p>From our roots in Atlanta to customers across the country</p>
            </div>
            <div className="why-card">
              <h3>⚡ Professional Quality</h3>
              <p>We don't cut corners. We deliver excellence every single time</p>
            </div>
            <div className="why-card">
              <h3>🔥 Authentic Experience</h3>
              <p>This isn't corporate. This is real, raw, and unforgettable</p>
            </div>
          </div>
        </section>

        <section className="about-section cta-section">
          <h2>Ready to Experience the Difference?</h2>
          <p>Whether you need comedy, car wrapping, or modeling services—we're ready to deliver.</p>
          <div className="cta-buttons">
            <a href="/comedy"><button>Book Comedy</button></a>
            <a href="/car-wraps"><button>Book Car Wrapping</button></a>
            <a href="/modeling"><button>Book Modeling</button></a>
          </div>
        </section>
      </div>
    </div>
  );
}
