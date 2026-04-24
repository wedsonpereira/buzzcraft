import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaBehance } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching navbar data:", err));
  }, []);

  if (!data) return <nav className="navbar skeleton"></nav>;

  const getIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FaFacebookF />;
      case 'twitter': return <FaTwitter />;
      case 'instagram': return <FaInstagram />;
      case 'behance': return <FaBehance />;
      default: return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <img src="/logo.png" alt="Buzz Craft Logo" className="logo-img" />
        </div>
      </div>
      
      <div className="navbar-divider"></div>

      <div className="navbar-center">
        <div className="contact-info">
          <span className="contact-label">{data.contact.label}</span>
          <span className="contact-line"></span>
          <a href={`mailto:${data.contact.email}`} className="contact-email">{data.contact.email}</a>
        </div>
      </div>

      <div className="navbar-right">
        <div className="social-links">
          {data.social.map((social, idx) => (
            <a key={idx} href={social.url} className="social-icon" aria-label={social.platform}>
              {getIcon(social.platform)}
            </a>
          ))}
        </div>
        
        <button className="menu-btn">
          <span className="menu-label">{data.menu.label}</span>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </nav>
  );
}
