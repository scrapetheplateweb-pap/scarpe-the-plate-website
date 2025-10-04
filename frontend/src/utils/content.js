// Helper function to get site content from localStorage
export const getSiteContent = () => {
  const saved = localStorage.getItem('siteContentFull');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default content if nothing is saved
  return {
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
    media: {
      heroTitle: 'Media Gallery',
      heroDesc: 'Our Work in Action',
      noMediaHeading: 'No media yet!',
      noMediaP1: 'Check back soon as we add photos and videos from our work.',
      noMediaP2: 'Admins can add media posts from the Admin panel.'
    },
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
    services: {
      comedyContent: 'Book comedy shows and performances.',
      carWrapsContent: 'Professional car wrap services and designs.',
      modelingContent: 'Book modeling sessions and view our portfolio.'
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  };
};
