import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const SubtitleHover = ({ text }) => {
    const words = text.split(" ");

    return (
        <>
            {words.map((word, wordIndex) => (
                <React.Fragment key={`${word}-${wordIndex}`}>
                    <span className="hover-word">
                        {word.split("").map((char, charIndex) => (
                            <span key={`${char}-${wordIndex}-${charIndex}`} className="hover-char">
                                {char}
                            </span>
                        ))}
                    </span>
                    {wordIndex < words.length - 1 ? " " : ""}
                </React.Fragment>
            ))}
        </>
    );
};

const DescriptionHover = ({ text }) => {
    return (
        <>
            {text.split(" ").map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`} className="description-word">
                    {word.split("").map((char, charIndex) => (
                        <span key={`${char}-${wordIndex}-${charIndex}`} className="description-hover-char">
                            {char}
                        </span>
                    ))}
                    {wordIndex < text.split(" ").length - 1 ? " " : ""}
                </span>
            ))}
        </>
    );
};

const QuoteHover = ({ text }) => {
    const words = text.split(" ");

    return (
        <>
            {words.map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`} className="quote-word">
                    {word.split("").map((char, charIndex) => (
                        <span key={`${char}-${wordIndex}-${charIndex}`} className="quote-hover-char">
                            {char}
                        </span>
                    ))}
                    {wordIndex < words.length - 1 ? " " : ""}
                </span>
            ))}
        </>
    );
};

const DubaiBadge = () => {
    return (
        <span className="dubai-badge">
            Dubai
        </span>
    );
};

const About = () => {
    const [data, setData] = useState(null);
    const sectionRef = useRef(null);
    const aboutSubheadingRef = useRef(null);
    const aboutHeadingRef = useRef(null);
    const descriptionBoxRef = useRef(null);
    const descriptionTextRef = useRef(null);
    const firstFooterRef = useRef(null);
    const secondFooterRef = useRef(null);
    const footerArrowRef = useRef(null);
    const quoteRef = useRef(null);
    const quoteImageRef = useRef(null);
    const goalsSubheadingRef = useRef(null);
    const goalsHeadingRef = useRef(null);

    useEffect(() => {
        fetch('/data.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(json => setData(json.about))
            .catch(err => console.error("Error fetching about data:", err));
    }, []);

    useGSAP(() => {
        if (!data) return;

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        const splitAboutSub = new SplitType(aboutSubheadingRef.current, { types: 'words,chars' });
        const splitGoalsSub = new SplitType(goalsSubheadingRef.current, { types: 'words,chars' });

        gsap.fromTo(splitAboutSub.chars,
            { rotateX: 90, y: 20, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: aboutSubheadingRef.current,
                    start: "top 92%",
                },
                rotateX: 0,
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.03,
                ease: "back.out(1.7)",
                transformOrigin: "bottom center"
            }
        );

        gsap.fromTo(aboutHeadingRef.current?.querySelectorAll(".hover-char") || [],
            { rotateY: 90, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: aboutHeadingRef.current,
                    start: "top 88%",
                },
                rotateY: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "back.out(1.7)",
                transformOrigin: "left center"
            }
        );

        // Make the image container parallax/scale a bit
        gsap.fromTo(".about-image-container",
            { scale: 0.9, opacity: 0, borderRadius: "100px" },
            {
                scrollTrigger: {
                    trigger: ".about-image-container",
                    start: "top 95%",
                    end: "top 40%",
                    scrub: 1,
                },
                scale: 1,
                opacity: 1,
                borderRadius: "0 0 4rem 0",
                ease: "power2.out"
            }
        );

        // Scrubbing text reveal for description box
        const descriptionWords = descriptionTextRef.current?.querySelectorAll(".description-word") || [];
        gsap.fromTo(descriptionWords,
            { opacity: 0, y: 24 },
            {
                scrollTrigger: {
                    trigger: descriptionBoxRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true,
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.04,
                ease: "power3.out"
            }
        );

        // Scrubbing text reveal for footer texts
        const splitFirstFooter = new SplitType(firstFooterRef.current, { types: 'words' });
        const splitSecondFooter = new SplitType(secondFooterRef.current, { types: 'words' });

        [splitFirstFooter, splitSecondFooter].forEach((split, index) => {
            const trigger = index === 0 ? firstFooterRef.current : secondFooterRef.current;
            gsap.fromTo(split.words,
                { opacity: 0.1, filter: "blur(4px)" },
                {
                    scrollTrigger: {
                        trigger,
                        start: "top 88%",
                        end: "bottom 62%",
                        scrub: 1,
                    },
                    opacity: 1,
                    filter: "blur(0px)",
                    stagger: 0.1,
                    ease: "none"
                }
            );
        });

        gsap.fromTo(
            [firstFooterRef.current?.querySelector(".dubai-badge"), footerArrowRef.current].filter(Boolean),
            { opacity: 0, y: 18, scale: 0.9 },
            {
                scrollTrigger: {
                    trigger: firstFooterRef.current,
                    start: "top 88%",
                    end: "bottom 62%",
                    scrub: 1,
                },
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.08,
                ease: "power2.out",
            }
        );

        const quoteElement = quoteRef.current;
        const quoteWords = quoteElement ? Array.from(quoteElement.querySelectorAll(".quote-word")) : [];

        const quoteChars = quoteElement ? Array.from(quoteElement.querySelectorAll(".quote-hover-char")) : [];
        const influenceRadius = 90;

        const handleQuotePointerMove = (event) => {
            quoteChars.forEach((char) => {
                const bounds = char.getBoundingClientRect();
                const centerX = bounds.left + bounds.width / 2;
                const centerY = bounds.top + bounds.height / 2;
                const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
                const influence = Math.max(0, 1 - distance / influenceRadius);

                gsap.to(char, {
                    scale: 1 + influence * 0.38,
                    y: influence * -10,
                    color: "#170808",
                    duration: 0.22,
                    ease: "power3.out",
                    overwrite: true,
                });
            });
        };

        const handleQuotePointerLeave = () => {
            gsap.to(quoteChars, {
                scale: 1,
                y: 0,
                color: "#170808",
                duration: 0.4,
                stagger: 0.003,
                ease: "power3.out",
                overwrite: true,
            });
        };

        quoteElement?.addEventListener("pointermove", handleQuotePointerMove);
        quoteElement?.addEventListener("pointerleave", handleQuotePointerLeave);

        if (quoteImageRef.current) {
            gsap.fromTo(
                quoteImageRef.current,
                { opacity: 0, rotateY: -88, scale: 0.92 },
                {
                    scrollTrigger: {
                        trigger: ".india-portfolio-container",
                        start: "top 80%",
                        once: true,
                    },
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    onComplete: () => quoteImageRef.current?.classList.add("is-hovering"),
                }
            );
        }

        gsap.fromTo(quoteWords,
            { opacity: 0, y: 32 },
            {
                scrollTrigger: {
                    trigger: ".india-portfolio-container",
                    start: "top 78%",
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.035,
                ease: "power3.out",
            }
        );

        gsap.fromTo(splitGoalsSub.chars,
            { rotateX: 90, y: 20, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: goalsSubheadingRef.current,
                    start: "top 92%",
                },
                rotateX: 0,
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.03,
                ease: "back.out(1.7)",
                transformOrigin: "bottom center"
            }
        );

        gsap.fromTo(goalsHeadingRef.current?.querySelectorAll(".hover-char") || [],
            { rotateY: 90, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: goalsHeadingRef.current,
                    start: "top 88%",
                },
                rotateY: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "back.out(1.7)",
                transformOrigin: "left center"
            }
        );

        return () => {
            quoteElement?.removeEventListener("pointermove", handleQuotePointerMove);
            quoteElement?.removeEventListener("pointerleave", handleQuotePointerLeave);
            splitAboutSub.revert();
            splitGoalsSub.revert();
            splitFirstFooter.revert();
            splitSecondFooter.revert();
        };

    }, { scope: sectionRef, dependencies: [data] });

    

    if (!data) return <section className="about-section" ref={sectionRef}></section>;

    const companiesString = data.subsection?.[0]?.companies || "";
    const companiesList = companiesString.split(",").map(c => c.trim()).filter(Boolean);
    const marqueeItems = [...companiesList, ...companiesList, ...companiesList, ...companiesList];
    const quoteText = "“We have also successfully partnered with clients across India such as Northensky, Bhandary Builders, along with multiple restaurants and cafés. This diverse portfolio allows us to adapt our strategies to different industries and business sizes.”";

    return (
        <section className="about-section" ref={sectionRef}>
            <div className="about-container">
                <h4 className="about-subheading">
                    <span className="title-arrow-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                    <span className="about-subheading-text" ref={aboutSubheadingRef}>ABOUT US</span>
                </h4>
                <h2 className="about-heading" ref={aboutHeadingRef}>
                    <SubtitleHover text={data.heading} />
                </h2>
                {data.paragraphs && (
                    <div className="about-image-container">
                        <div className="about-description-box" ref={descriptionBoxRef}>
                            <p className="about-description-text" ref={descriptionTextRef}>
                                <DescriptionHover text={data.paragraphs.description} />
                            </p>
                        </div>
                    </div>
                )}

                <p className="about-footer-text" ref={firstFooterRef}>
                    <span className="sketch-highlight">Over the years</span>, we’ve had the opportunity to work with well-known brands in <DubaiBadge /> Including&nbsp;
                    <span className="arrow-down-btn" ref={footerArrowRef}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-svg">
                            <path d="M12 6v10"></path>
                            <path d="M8 13.5 12 17.5 16 13.5"></path>
                        </svg>
                    </span>
                </p>

                <div className="pill-marquee-container">
                    {marqueeItems.length > 0 && (
                        <div className="pill-marquee-inner">
                            {marqueeItems.map((company, index) => (
                                <div key={index} className="organization-pill">
                                    {company}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <p className="about-footer-text" style={{ marginTop: '20px' }} ref={secondFooterRef}>
                    These collaborations helped us gain international experience and a strong 💪 understanding of competitive global markets.
                </p>
            </div>

            <div className="india-portfolio-container">
                <div className="india-portfolio-quote" ref={quoteRef}>
                    {/* <img
                        src="/sweetbee.png"
                        alt="Sweet Bee"
                        className="india-portfolio-image"
                        ref={quoteImageRef}
                    /> */}
                    <div className="india-portfolio-quote-text">
                        <QuoteHover text={quoteText} />
                    </div>
                    “We have also successfully partnered with clients across India such as Northensky, Bhandary Builders, along with multiple restaurants and cafés. This diverse portfolio allows us to adapt our strategies to different industries and business sizes.”
                </div>
            </div>

            <div className="about-container" style={{ marginTop: '100px' }}>
                <h4 className="about-subheading">
                    <span className="title-arrow-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                    <span className="about-subheading-text" ref={goalsSubheadingRef}>OUR GOALS</span>
                </h4>
                <h2 className="about-heading" ref={goalsHeadingRef}>
                    <SubtitleHover text="Impactful Digital Experiences That Drive Consistent Growth" />
                </h2>
            </div>

        </section>
    );
};

export default About;
