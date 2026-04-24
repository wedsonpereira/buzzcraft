import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SubtitleHover } from './About.jsx';
import { clearSplitChars, revealSectionSubtitle, revealSectionTitle } from './sectionHeaderAnimation';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const Icon = ({ name }) => {
  switch (name) {
    case 'bowl':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon-svg">
          <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8H4z" />
          <path d="M7 6v2M12 5v3M17 6v2" />
        </svg>
      );
    case 'box':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon-svg">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      );
    case 'command':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon-svg">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default function Services() {
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleDots, setVisibleDots] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const bgStarRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  useEffect(() => {
    fetch('/data.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(json => setData(json.services))
      .catch(err => console.error("Error fetching services data:", err));
  }, []);

  useEffect(() => {
    if (data?.cards) {
      const updateDots = () => {
        if (!carouselRef.current || !carouselRef.current.children.length) return;
        const itemWidth = carouselRef.current.children[0].offsetWidth + 24;
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const numDots = Math.max(1, Math.ceil(maxScroll / itemWidth) + 1);
        setVisibleDots(Array(numDots).fill(0));
      };

      // Delay slightly to ensure fonts/layout are loaded so measurements are correct
      setTimeout(updateDots, 300);
      window.addEventListener('resize', updateDots);
      return () => window.removeEventListener('resize', updateDots);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.cards || data.cards.length <= 3) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    let interval;
    if (!isHovered && carouselRef.current) {
      interval = setInterval(() => {
        const carousel = carouselRef.current;
        if (!carousel || !carousel.children.length) return;

        const itemWidth = carousel.children[0].offsetWidth + 24;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        if (carousel.scrollLeft >= maxScroll - 10) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }, 3500);
    }

    return () => clearInterval(interval);
  }, [data, isHovered]);

  useGSAP(() => {
    if (!data) return;

    // Refresh strictly after data rendering
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const subChars = Array.from(subheadingRef.current?.querySelectorAll(".sub-char") || []);
    const headingChars = Array.from(headingRef.current?.querySelectorAll(".hover-char") || []);

    // Subheading chars rotate-in
    const cleanupSubheadingReveal = revealSectionSubtitle(subChars, sectionRef.current, "top 90%");

    // Heading chars flip-in (using SubtitleHover's .hover-char elements)
    const cleanupHeadingReveal = revealSectionTitle(headingChars, headingRef.current, "top 88%");

    // Service cards staggered slide-up entrance
    gsap.fromTo(".service-card",
      { y: 80, opacity: 0, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: ".carousel-container",
          start: "top 88%",
        },
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out"
      }
    );

    // Carousel dots entrance
    gsap.fromTo(".carousel-dots",
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: ".carousel-dots",
          start: "top 95%",
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }
    );

    // Background star parallax
    if (bgStarRef.current) {
      gsap.to(bgStarRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -120,
        rotation: 180,
        ease: "none"
      });
    }



    return () => {
      clearTimeout(refreshTimer);
      cleanupSubheadingReveal();
      cleanupHeadingReveal();
      clearSplitChars([...subChars, ...headingChars]);
    };
  }, { scope: sectionRef, dependencies: [data] });

  if (!data) return <section className="services-section" ref={sectionRef}></section>;

  const handleScroll = (e) => {
    if (!e.target.children.length) return;
    const scrollLeft = e.target.scrollLeft;
    const itemWidth = e.target.children[0].offsetWidth + 24; // width + gap
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(index);
  };

  return (
    <section className="services-section" ref={sectionRef}>
      <svg className="services-bg-star" ref={bgStarRef} width="210" height="210" viewBox="0 0 1 1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 0.4375H0.814167L0.985833 0.366458L0.937917 0.250833L0.766458 0.322083L0.897708 0.190833L0.809375 0.102083L0.678125 0.233333L0.748958 0.0616667L0.633542 0.01375L0.5625 0.186042V0H0.4375V0.185833L0.366458 0.0141667L0.250833 0.0620833L0.322083 0.233542L0.190833 0.102292L0.102083 0.190625L0.233333 0.321875L0.061875 0.251042L0.0139583 0.366458L0.185833 0.4375H0V0.5625H0.185833L0.0141667 0.633542L0.0620833 0.749167L0.233542 0.677917L0.102292 0.809167L0.190625 0.897917L0.321875 0.766667L0.251042 0.938333L0.366458 0.98625L0.4375 0.814375V1H0.5625V0.814167L0.633542 0.985833L0.749167 0.937917L0.677917 0.766458L0.809167 0.897708L0.897708 0.809375L0.766458 0.678125L0.938125 0.748958L0.986042 0.633542L0.814167 0.5625H1V0.4375ZM0.5 0.625C0.466848 0.625 0.435054 0.61183 0.411612 0.588388C0.38817 0.564946 0.375 0.533152 0.375 0.5C0.375 0.466848 0.38817 0.435054 0.411612 0.411612C0.435054 0.38817 0.466848 0.375 0.5 0.375C0.533152 0.375 0.564946 0.38817 0.588388 0.411612C0.61183 0.435054 0.625 0.466848 0.625 0.5C0.625 0.533152 0.61183 0.564946 0.588388 0.588388C0.564946 0.61183 0.533152 0.625 0.5 0.625Z" fill="var(--theme-color)"/>
      </svg>
      <div className="services-container">
        <h4 className="about-subheading">
          <span className="title-arrow-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
          <span className="services-subheading-text" ref={subheadingRef}>
            {data.subheading.split("").map((char, i) => (
              <span key={i} className="sub-char" style={{ display: 'inline-block' }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h4>
        <h2 className="about-heading" ref={headingRef}>
          <SubtitleHover text={data.heading} />
        </h2>
      </div>

      {data.cards && (
        <>
          <div
            className="carousel-container"
            ref={carouselRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {data.cards.map((card, idx) => (
              <div className="service-card" key={idx}>
                <div className="card-top">
                  <span className="card-num">{card.id}</span>
                </div>
                <div className="card-icon">
                  <Icon name={card.icon} />
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>
                {/*<a href="#" className="card-link">Read More ↗</a>*/}
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {visibleDots.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === activeIndex ? 'active' : ''}`}
                aria-label={`Carousel indicator ${idx + 1}`}
                onClick={() => {
                  if (carouselRef.current) {
                    const itemWidth = carouselRef.current.children[0].offsetWidth + 24;
                    carouselRef.current.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
