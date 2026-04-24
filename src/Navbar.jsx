import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaBehance } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', section: '.hero-section' },
  { id: 'services', label: 'Services', section: '.services-section' },
  { id: 'about', label: 'About', section: '.about-section' },
  { id: 'process', label: 'Process', section: '.process-section' },
  { id: 'contact', label: 'Contact', section: '.contact-section' },
];

export default function Navbar() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching navbar data:", err));
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    // Navbar background on scroll
    ScrollTrigger.create({
      trigger: document.body,
      start: "100px top",
      onEnter: () => navRef.current?.classList.add("navbar--scrolled"),
      onLeaveBack: () => navRef.current?.classList.remove("navbar--scrolled"),
    });

    // Initial entrance
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );

    // Sidebar entrance
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 }
      );
    }

    // Track active section via ScrollTrigger
    NAV_ITEMS.forEach((item) => {
      const el = document.querySelector(item.section);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveSection(item.id),
        onEnterBack: () => setActiveSection(item.id),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === document.body || NAV_ITEMS.some(n => document.querySelector(n.section) === t.trigger)) {
          t.kill();
        }
      });
    };
  }, [data]);

  const scrollToSection = (sectionSelector) => {
    const el = document.querySelector(sectionSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  if (!data) return <nav className="navbar skeleton" ref={navRef}></nav>;

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
    <>
      <nav className="navbar" ref={navRef}>
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

          {/* Hamburger — mobile only */}
          <button className="menu-btn mobile-only" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className={`hamburger ${mobileOpen ? 'is-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* ── Desktop sidebar — dots only ── */}
      <aside className="sidebar-nav" ref={sidebarRef}>
        <div className="sidebar-track">
          {NAV_ITEMS.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                className={`sidebar-item ${activeSection === item.id ? 'is-active' : ''}`}
                onClick={() => scrollToSection(item.section)}
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
              >
                <span className="sidebar-dot"></span>
              </button>
              {index < NAV_ITEMS.length - 1 && (
                <span
                  className={`sidebar-connector ${
                    NAV_ITEMS.findIndex(n => n.id === activeSection) > index ? 'is-filled' : ''
                  }`}
                ></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </aside>

      {/* ── Mobile slide-out menu ── */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'is-open' : ''}`} onClick={() => setMobileOpen(false)}></div>
      <div className={`mobile-nav-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="mobile-nav-header">
          <img src="/logo.png" alt="Buzz Craft" className="mobile-nav-logo" />
          <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="mobile-nav-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
              onClick={() => scrollToSection(item.section)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mobile-nav-footer">
          <div className="mobile-nav-socials">
            {data.social.map((social, idx) => (
              <a key={idx} href={social.url} className="social-icon" aria-label={social.platform}>
                {getIcon(social.platform)}
              </a>
            ))}
          </div>
          <a href={`mailto:${data.contact.email}`} className="mobile-nav-email">{data.contact.email}</a>
        </div>
      </div>
    </>
  );
}
