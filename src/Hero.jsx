import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [data, setData] = useState(null);
  const container = useRef(null);
  const leftContent = useRef(null);
  const title1 = useRef(null);
  const titleMid = useRef(null);
  const title2 = useRef(null);
  const asterisk = useRef(null);
  const heroDescRef = useRef(null);
  const bottomInfoRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => setData(json.hero))
      .catch(err => console.error(err));
  }, []);

  useGSAP(() => {
    if (!data) return;

    const split1 = new SplitType(title1.current, { types: 'words,chars' });
    const splitMid = new SplitType(titleMid.current, { types: 'words,chars' });
    const split2 = new SplitType(title2.current, { types: 'words,chars' });

    const tl = gsap.timeline();

    tl.fromTo(leftContent.current, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0);

    tl.from(split1.chars, {
      opacity: 0, y: 50, duration: 0.8, stagger: 0.02, ease: 'back.out(1.7)'
    }, 0.2);

    tl.from(splitMid.chars, {
      opacity: 0, scale: 0.5, duration: 0.5, stagger: 0.02, ease: 'back.out(1.7)'
    }, 0.3);

    tl.from(split2.chars, {
      opacity: 0, y: 50, duration: 0.8, stagger: 0.02, ease: 'back.out(1.7)'
    }, 0.4);

    // Hero description entrance
    if (heroDescRef.current) {
      tl.fromTo(heroDescRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.6
      );
    }

    // Bottom info (arrow + customers) staggered reveal
    if (bottomInfoRef.current) {
      const bottomChildren = bottomInfoRef.current.children;
      tl.fromTo(bottomChildren,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
        0.8
      );
    }

    gsap.to(asterisk.current, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "linear",
      transformOrigin: "center center"
    });

    // Background parallax on scroll
    gsap.fromTo(".hero-bg-img",
      { y: 0, scale: 1 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 150,
        scale: 1.1,
        ease: "none"
      }
    );

    // Marquee entrance
    if (marqueeRef.current) {
      gsap.fromTo(marqueeRef.current,
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top 95%",
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    // Parallax fade out hero content on scroll
    gsap.fromTo(leftContent.current,
      { opacity: 1, y: 0 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "60% top",
          end: "bottom top",
          scrub: 1,
        },
        opacity: 0,
        y: -60,
        ease: "none"
      }
    );

    return () => {
      split1.revert();
      splitMid.revert();
      split2.revert();
      ScrollTrigger.getAll().forEach(st => {
        if (container.current && container.current.contains(st.trigger)) {
          st.kill();
        }
      });
    };

  }, { scope: container, dependencies: [data] });

  if (!data) return <section className="hero-section" ref={container}></section>;

  return (
      <section className="hero-section" ref={container}>
        <div className="hero-bg">
          <img src="/bg.png" alt="Hero background" className="hero-bg-img" />
        </div>

        <div className="hero-content">
          <div className="hero-left" ref={leftContent}>
            <div className="hero-top-link-wrapper">
              <div className="hero-top-link">
                <div className="top-link-main">{data.topLinkMain}</div>
                <div className="top-link-sub">{data.topLinkSub}</div>
              </div>
            </div>

            <h1 className="hero-title">
              <div className="h1-line-wrapper">
                <div className="h1-line" ref={title1}>{data.titleLine1}</div>
                <img src="/bee.png" alt="Decorative bee" className="title-decor-img" />
              </div>

              <div className="h1-middle-wrapper">
                <div className="h1-middle" ref={titleMid}>{data.titleMiddle}</div>
              </div>

              <div className="h1-line design-agency-line">
                <svg ref={asterisk} className="asterisk" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22"
                    style={{ stroke: 'var(--theme-color)' }} strokeWidth="8" strokeLinecap="round" />
                </svg>
                <div ref={title2} className="split-text">{data.titleLine2}</div>
              </div>
            </h1>

            <p className="hero-desc" ref={heroDescRef}>{data.description}</p>

            <div className="hero-bottom-info" ref={bottomInfoRef}>
              <div className="hero-arrow-wrapper">
                <img src="/arrow.png" alt="Direction arrow" className="hero-arrow" />
              </div>

              <div className="hero-customers">
                <div className="customers-avatars">
                  <img src="https://i.pravatar.cc/100?img=33" alt="customer" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=11" alt="customer" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=12" alt="customer" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=60" alt="customer" className="avatar" />
                  <div className="avatar plus-btn">+</div>
                </div>
                <div className="customers-text">
                  We have 35<span className="accent">k+</span><br />
                  customers word-wide
                </div>
              </div>
            </div>
          </div>
        </div>
      {data.marquee && (
        <div className="hero-marquee" ref={marqueeRef}>
          <div className="marquee-content">
            {data.marquee.map((item, index) => (
              <React.Fragment key={`m1-${index}`}>
                <span className="marquee-text">{item}</span>
                <span className="marquee-star">✦</span>
              </React.Fragment>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {data.marquee.map((item, index) => (
              <React.Fragment key={`m2-${index}`}>
                <span className="marquee-text">{item}</span>
                <span className="marquee-star">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
