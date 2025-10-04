import { useState, useEffect } from 'react';

export function useMobileSettings() {
  const [settings, setSettings] = useState({
    section_visibility: {
      hero: true,
      services: true,
      media: true,
      about: true,
      cta: true
    },
    navigation_items: ['home', 'about', 'comedy', 'car-wraps', 'modeling', 'media', 'store'],
    font_sizes: {
      heading: '1.8rem',
      subheading: '1.2rem',
      body: '1rem'
    },
    layout_mode: 'single-column',
    mobile_content: {}
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadSettings();
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/mobile-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load mobile settings:', error);
    }
  };

  return { settings, isMobile };
}
