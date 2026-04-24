import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import SplitType from 'split-type';
import { clearSplitChars, revealSectionSubtitle, revealSectionTitle } from './sectionHeaderAnimation';
import './About.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export const SubtitleHover = ({ text }) => {
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
    const goalsContentRef = useRef(null);
    const goalsImageRef = useRef(null);
    const goalsGraphRef = useRef(null);
    const goalsParagraphRef = useRef(null);
    const goalsPinRef = useRef(null);
    const goalsBadgeRef = useRef(null);
    const goalsPlaneRef = useRef(null);
    const goalsLineContainerRef = useRef(null);

    useEffect(() => {
        fetch('/data.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(json => setData(json.about))
            .catch(err => console.error("Error fetching about data:", err));
    }, []);

    useGSAP(() => {
        if (!data) return;

        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        const aboutSubChars = Array.from(aboutSubheadingRef.current?.querySelectorAll(".sub-char") || []);
        const aboutHeadingChars = Array.from(aboutHeadingRef.current?.querySelectorAll(".hover-char") || []);
        const goalsSubChars = Array.from(goalsSubheadingRef.current?.querySelectorAll(".sub-char") || []);
        const goalsHeadingChars = Array.from(goalsHeadingRef.current?.querySelectorAll(".hover-char") || []);
        const cleanupAboutSubheadingReveal = revealSectionSubtitle(aboutSubChars, aboutSubheadingRef.current, "top 92%");
        const cleanupAboutHeadingReveal = revealSectionTitle(aboutHeadingChars, aboutHeadingRef.current, "top 88%");

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
                borderRadius: "0",
                ease: "power2.out"
            }
        );

        // Parallax: background image drifts slower than scroll
        gsap.fromTo(".about-image-container",
            { backgroundPosition: "center 30%" },
            {
                scrollTrigger: {
                    trigger: ".about-image-container",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
                backgroundPosition: "center 70%",
                ease: "none"
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

        // Pill marquee entrance
        gsap.fromTo(".pill-marquee-container",
            { opacity: 0, x: -40 },
            {
                scrollTrigger: {
                    trigger: ".pill-marquee-container",
                    start: "top 90%",
                },
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out"
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

        const cleanupGoalsSubheadingReveal = revealSectionSubtitle(goalsSubChars, goalsSubheadingRef.current, "top 92%");
        const cleanupGoalsHeadingReveal = revealSectionTitle(goalsHeadingChars, goalsHeadingRef.current, "top 88%");

        // ── Goals badge: scrub-based entrance ──
        if (goalsBadgeRef.current) {
            const badgeUnderline = goalsBadgeRef.current.querySelector(".goals-badge-underline path");

            if (badgeUnderline) {
                const len = badgeUnderline.getTotalLength?.() || 200;
                gsap.set(badgeUnderline, { strokeDasharray: len, strokeDashoffset: len });
            }

            const badgeTl = gsap.timeline({
                scrollTrigger: {
                    trigger: goalsContentRef.current,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 1,
                    onUpdate: (self) => {
                        // Trigger highlight wipe at 40% progress
                        if (self.progress > 0.4) {
                            goalsBadgeRef.current?.classList.add("is-wiped");
                        } else {
                            goalsBadgeRef.current?.classList.remove("is-wiped");
                        }
                    }
                }
            });

            // Badge scales in (first 40%)
            badgeTl.fromTo(goalsBadgeRef.current,
                { opacity: 0, scale: 0.5, rotate: -6 },
                { opacity: 1, scale: 1, rotate: 0, ease: "power2.out" }
            );

            // SVG underline draws in (after badge settles)
            if (badgeUnderline) {
                badgeTl.to(badgeUnderline,
                    { strokeDashoffset: 0, ease: "none" },
                    0.5 // starts at 50% of timeline
                );
            }
        }

        // Parallax stagger text — each word at a slightly different speed
        if (goalsParagraphRef.current) {
            const splitGoalsPara = new SplitType(goalsParagraphRef.current, { types: 'words' });
            splitGoalsPara.words.forEach((word, i) => {
                const yOffset = 12 + (i % 4) * 4;
                gsap.fromTo(word,
                    { opacity: 0, y: yOffset },
                    {
                        scrollTrigger: {
                            trigger: goalsParagraphRef.current,
                            start: "top 88%",
                            end: "top 55%",
                            scrub: 1,
                        },
                        opacity: 1,
                        y: 0,
                        ease: "none"
                    }
                );
            });
        }

        // Parallax float — image drifts slower than scroll for depth
        if (goalsImageRef.current) {
            gsap.fromTo(goalsImageRef.current,
                { opacity: 0, scale: 0.92 },
                {
                    scrollTrigger: {
                        trigger: goalsImageRef.current,
                        start: "top 90%",
                    },
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            );
            gsap.fromTo(goalsImageRef.current,
                { y: 60 },
                {
                    scrollTrigger: {
                        trigger: goalsImageRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                    y: -60,
                    ease: "none"
                }
            );
        }

        // Pin-drop — pin flies in from above and stabs into the corner
        if (goalsPinRef.current) {
            gsap.fromTo(goalsPinRef.current,
                { opacity: 0, y: -120, x: 40, rotate: -45, scale: 0.5 },
                {
                    scrollTrigger: {
                        trigger: goalsImageRef.current,
                        start: "top 75%",
                    },
                    opacity: 1,
                    y: 0,
                    x: 0,
                    rotate: 20,
                    scale: 1,
                    duration: 0.6,
                    ease: "power4.in",
                    onComplete: () => {
                        gsap.to(goalsPinRef.current, {
                            y: -4,
                            rotate: 16,
                            duration: 0.15,
                            ease: "power2.out",
                            onComplete: () => {
                                gsap.to(goalsPinRef.current, {
                                    y: 0,
                                    rotate: 20,
                                    duration: 0.2,
                                    ease: "bounce.out"
                                });
                            }
                        });
                    }
                }
            );
        }

        // Goals graph element float-in
        if (goalsGraphRef.current) {
            gsap.fromTo(goalsGraphRef.current,
                { opacity: 0, y: 40, rotate: 0 },
                {
                    scrollTrigger: {
                        trigger: goalsGraphRef.current,
                        start: "top 90%",
                    },
                    opacity: 1,
                    y: 0,
                    rotate: -7,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                    delay: 0.4
                }
            );
        }

        // ── Paper plane flies across, drawing the wavy dashed line as its trail ──
        const planeEl = goalsPlaneRef.current;
        const wavySvgEl = sectionRef.current?.querySelector(".goals-wavy-divider");
        const lineContainerEl = goalsLineContainerRef.current;

        if (planeEl && wavySvgEl && lineContainerEl) {
            const cw = lineContainerEl.offsetWidth;

            // Line fully hidden (clipped from left = nothing visible)
            gsap.set(wavySvgEl, { clipPath: "inset(0 0 0 100%)" });
            // Plane starts at the right end, facing left
            gsap.set(planeEl, { x: cw + 10, yPercent: -50, scaleX: -1, opacity: 0 });

            const planeTl = gsap.timeline({
                scrollTrigger: {
                    trigger: lineContainerEl,
                    start: "top 88%",
                }
            });

            // Quick fade-in
            planeTl.to(planeEl, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

            // Plane flies right → left  (ends just past the left edge)
            planeTl.to(planeEl, {
                x: -25,
                duration: 2,
                ease: "power2.inOut"
            }, 0);

            // Line reveals right → left in sync, tiny delay so it trails behind
            planeTl.to(wavySvgEl, {
                clipPath: "inset(0 0 0 0%)",
                duration: 2,
                ease: "power2.inOut"
            }, 0.1);

            // Subtle rotation wiggle while flying
            planeTl.fromTo(planeEl,
                { rotation: -5 },
                { rotation: 5, duration: 0.4, repeat: 4, yoyo: true, ease: "sine.inOut" },
                0.1
            );
        }

        // Stats row staggered entrance
        gsap.fromTo(".goals-stat",
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: ".goals-stats-row",
                    start: "top 92%",
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "back.out(1.4)"
            }
        );

        // Curvy arrow — flies in from the right along a curved MotionPath
        const curvyArrowEl = sectionRef.current?.querySelector(".goals-curvy-arrow");
        if (curvyArrowEl) {
            // Start hidden, offset to the right
            gsap.set(curvyArrowEl, { x: 300, y: 100, opacity: 0, scale: 0.5 });

            gsap.to(curvyArrowEl, {
                scrollTrigger: {
                    trigger: goalsContentRef.current,
                    start: "top 80%",
                },
                opacity: 1,
                scale: 1,
                duration: 1.6,
                ease: "power3.out",
                motionPath: {
                    path: [
                        { x: 300, y: 100 },
                        { x: 180, y: -30 },
                        { x: 60, y: -50 },
                        { x: 0, y: 0 }
                    ],
                    curviness: 1.5,
                }
            });
        }

        return () => {
            clearTimeout(refreshTimer);
            cleanupAboutSubheadingReveal();
            cleanupAboutHeadingReveal();
            cleanupGoalsSubheadingReveal();
            cleanupGoalsHeadingReveal();
            clearSplitChars([aboutSubChars, aboutHeadingChars, goalsSubChars, goalsHeadingChars].flat());
            quoteElement?.removeEventListener("pointermove", handleQuotePointerMove);
            quoteElement?.removeEventListener("pointerleave", handleQuotePointerLeave);
            splitFirstFooter.revert();
            splitSecondFooter.revert();
        };

    }, { scope: sectionRef, dependencies: [data] });



    if (!data) return <section className="about-section" ref={sectionRef}></section>;

    const companiesString = data.subsection?.[0]?.companies || "";
    const companiesList = companiesString.split(",").map(c => c.trim()).filter(Boolean);
    const marqueeItems = [...companiesList, ...companiesList, ...companiesList, ...companiesList];
    const quoteText = "\u201CWe have also successfully partnered with clients across India such as Northensky, Bhandary Builders, along with multiple restaurants and caf\u00E9s. This diverse portfolio allows us to adapt our strategies to different industries and business sizes.\u201D";

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
                    <span className="about-subheading-text" ref={aboutSubheadingRef}>
                        {"ABOUT US".split("").map((char, i) => (
                            <span key={i} className="sub-char" style={{ display: 'inline-block' }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </span>
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
                    <span className="sketch-highlight">Over the years</span>, we've had the opportunity to work with well-known brands in <DubaiBadge /> Including&nbsp;
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

                <p className="about-footer-text about-footer-text--second" ref={secondFooterRef}>
                    These collaborations helped us gain international experience and a strong 💪 understanding of competitive global markets.
                </p>
            </div>

            <div className="india-portfolio-container">
                <div className="india-portfolio-quote" ref={quoteRef}>
                    <div className="india-portfolio-quote-text">
                        <QuoteHover text={quoteText} />
                    </div>
                </div>
            </div>

            <div className="about-container goals-container">
                <h4 className="about-subheading">
                    <span className="title-arrow-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                    <span className="about-subheading-text" ref={goalsSubheadingRef}>
                        {"OUR GOALS".split("").map((char, i) => (
                            <span key={i} className="sub-char" style={{ display: 'inline-block' }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </span>
                </h4>
                <h2 className="about-heading" ref={goalsHeadingRef}>
                    <SubtitleHover text="Impactful Digital Experiences That Drive Consistent Growth" />
                </h2>
                <div className="goals-layout">
                    <div className="goals-text-col" ref={goalsContentRef}>

                        <span className="goals-badge" ref={goalsBadgeRef}>
                            At BuzzCraft
                            <svg className="goals-badge-underline" viewBox="0 0 120 8" preserveAspectRatio="none">
                                <path d="M2 5.5 C 30 2, 60 8, 118 3.5" stroke="var(--theme-color)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                        <p className="goals-paragraph" ref={goalsParagraphRef}>
                            We combine creative thinking with data-driven strategies. Whether it's
                            branding, social media marketing, or performance campaigns, our goal is to create
                            impactful digital experiences that help businesses stand out and grow consistently.
                        </p>
                        <div className="goals-line-container" ref={goalsLineContainerRef}>
                            <svg
                                ref={goalsPlaneRef}
                                className="goals-traveling-plane"
                                fill="#ff8c00"
                                viewBox="796 720.582 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" d="M996,730.447l-196.455,82.151c-2.07,0.865-3.451,2.852-3.541,5.093c-0.09,2.242,1.126,4.333,3.12,5.362l49.678,25.639l6.244,54.77c0.383,3.348,2.73,6.082,5.98,6.969c0.702,0.189,1.426,0.287,2.153,0.287c2.555,0,4.998-1.219,6.537-3.258l26.032-34.537l61.196,31.582c1.627,0.838,3.556,0.857,5.198,0.047c1.642-0.809,2.803-2.348,3.129-4.15L996,730.447z M853.815,837.557l-36.861-19.024l131.591-55.027L853.815,837.557z M866.023,892.102l-5.088-44.635l94.289-73.707L866.023,892.102z M903.194,863.043l74.251-98.507l-22.628,125.152L903.194,863.043z" />
                            </svg>
                            <svg
                                className="goals-wavy-divider"
                                viewBox="0 0 1000 80"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 40 Q 60 70, 120 40 T 240 40 T 360 40 T 480 40 T 600 40 T 720 40"
                                    stroke="rgba(255, 255, 255, 0.4)"
                                    strokeWidth="3"
                                    strokeLinecap="butt"
                                    fill="none"
                                    style={{ strokeDasharray: "20, 12" }}
                                />
                            </svg>
                        </div>

                    </div>

                    <div className="goals-image-col" ref={goalsImageRef}>
                        {/* Image frame */}
                        <div className="goals-image-frame">
                            <img className="goals-image"
                                src="https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Team collaboration" />
                        </div>

                        {/* Curvy arrow at bottom-right */}
                        <svg className={"goals-curvy-arrow"} version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 512 512">
                            <g transform="scale(-1, 1) translate(-512, 0)">
                                <path d="M0 0 C0.69738281 -0.02835938 1.39476562 -0.05671875 2.11328125 -0.0859375 C9.0304363 1.15264261 14.18824605 5.28629813 18.97998047 10.18164062 C19.55339676 10.75126022 20.12681305 11.32087982 20.71760559 11.90776062 C22.58985074 13.77266147 24.4474114 15.65145054 26.3046875 17.53125 C27.61052569 18.83947542 28.9171074 20.14695906 30.22439575 21.45373535 C32.95207435 24.18453101 35.67293562 26.92187932 38.38867188 29.66455078 C41.86872929 33.17868739 45.36190897 36.6794129 48.85980034 40.17578888 C51.55411461 42.87064687 54.24318626 45.57068445 56.93051529 48.27250671 C58.21712729 49.56547717 59.50494897 50.85724506 60.79400253 52.14778137 C62.59155627 53.94967238 64.38237161 55.7579956 66.17138672 57.56835938 C66.70332138 58.09938766 67.23525604 58.63041595 67.78330994 59.17753601 C71.9571229 63.42436129 73.97235931 66.3328973 74 72.3125 C73.89585282 76.47838723 73.58489007 79.18787092 70.6875 82.375 C66.75173352 85.02935414 63.43197891 85.72673503 58.8125 85.87109375 C52.00518915 84.28188699 46.9287556 77.87573131 42.2265625 73.109375 C41.43599457 72.31597717 40.64542664 71.52257935 39.8309021 70.70513916 C37.32001324 68.18310239 34.81618876 65.65418261 32.3125 63.125 C30.60593112 61.40839438 28.89890478 59.69224341 27.19140625 57.9765625 C23.01812523 53.7812926 18.85061432 49.58035756 14.6875 45.375 C14.61756836 46.49543701 14.54763672 47.61587402 14.47558594 48.77026367 C12.00727502 87.79998694 8.14763298 126.05344467 -4.3125 163.375 C-4.60350586 164.24930664 -4.89451172 165.12361328 -5.19433594 166.02441406 C-23.76464498 221.02790086 -59.90899872 269.11231629 -112.375 295.625 C-130.86972121 304.68450612 -130.86972121 304.68450612 -140.60546875 306.33984375 C-150.30319309 307.87877045 -150.30319309 307.87877045 -157.99560547 313.41992188 C-160.92553094 318.54963164 -162.70171732 324.07963397 -164.44580078 329.70214844 C-165.69428619 333.55240711 -167.31634631 337.16612024 -169.0625 340.8125 C-169.37896484 341.4837793 -169.69542969 342.15505859 -170.02148438 342.84667969 C-182.71980516 369.14329933 -200.07663357 393.38793162 -220.3125 414.375 C-220.92786621 415.01759766 -221.54323242 415.66019531 -222.17724609 416.32226562 C-259.80778489 455.4437727 -311.03809501 481.32643567 -365.9375 482.578125 C-382.58672583 482.75422367 -398.84117881 481.99640046 -415.3125 479.375 C-416.19405762 479.23578125 -417.07561523 479.0965625 -417.98388672 478.953125 C-431.91999322 476.61283423 -431.91999322 476.61283423 -436.375 472.25 C-439.19355061 467.9480017 -439.15177455 463.31832708 -438.3125 458.375 C-437.03116686 455.20538644 -435.7924767 453.79679771 -433.25 451.5625 C-425.97258122 448.62056475 -418.48463704 450.64891533 -411.04394531 452.15991211 C-363.67266146 461.42559545 -314.9299246 451.6627352 -274.68261719 425.17333984 C-266.7761947 419.78048633 -259.4364235 413.75463298 -252.3125 407.375 C-251.74869629 406.87291016 -251.18489258 406.37082031 -250.60400391 405.85351562 C-244.09840262 400.03588395 -237.81990029 394.1659046 -232.3125 387.375 C-231.4481413 386.3461654 -230.58353493 385.31753886 -229.71875 384.2890625 C-212.59027271 363.65997968 -199.3488736 340.72900879 -188.3125 316.375 C-189.11655273 316.36041748 -189.92060547 316.34583496 -190.74902344 316.33081055 C-206.76690583 316.00748239 -222.56282087 315.58962436 -238.3125 312.375 C-239.11236328 312.21547852 -239.91222656 312.05595703 -240.73632812 311.89160156 C-274.97281011 304.83015773 -307.649266 286.70184465 -328.25 257.875 C-344.74337687 232.46712377 -352.22250982 204.92631262 -346.3515625 174.83203125 C-342.64496467 157.87231971 -334.15821949 142.78596793 -323.3125 129.375 C-322.66410156 128.57191406 -322.01570313 127.76882812 -321.34765625 126.94140625 C-303.59620302 105.99541747 -277.11400958 93.14627845 -249.9375 90.6484375 C-225.11545172 88.91454442 -199.62417377 96.00641946 -180.56640625 112.35546875 C-179.82261719 113.02191406 -179.07882812 113.68835938 -178.3125 114.375 C-177.49652344 115.07238281 -176.68054688 115.76976562 -175.83984375 116.48828125 C-150.50718826 138.53199847 -139.59852334 166.46201494 -137.3125 199.375 C-136.97941779 226.55952297 -140.02985415 253.02812565 -146.3125 279.375 C-139.59802559 277.53177643 -133.33562026 275.26807517 -127.0625 272.25 C-126.24185059 271.85675537 -125.42120117 271.46351074 -124.57568359 271.05834961 C-77.67499321 248.10159968 -47.51899831 204.73004001 -30.5625 156.5 C-18.46716511 120.55018911 -14.40690856 83.08315828 -13.3125 45.375 C-20.79866125 52.25270693 -28.194078 59.20557649 -35.35546875 66.421875 C-35.86908463 66.93902573 -36.3827005 67.45617645 -36.91188049 67.98899841 C-39.47996217 70.57807484 -42.04015757 73.1745009 -44.59204102 75.77954102 C-45.54562233 76.74506638 -46.49931211 77.71048465 -47.453125 78.67578125 C-48.29391602 79.53341064 -49.13470703 80.39104004 -50.00097656 81.2746582 C-53.93958673 84.85343548 -56.87645918 85.84248717 -62.28515625 85.69140625 C-66.68965431 85.00399904 -69.42509365 82.43988762 -72.1875 79.125 C-73.66602884 75.51081839 -74.05624792 72.22498924 -73.3125 68.375 C-71.04733136 63.98496415 -67.91939524 60.69166664 -64.45166016 57.23950195 C-63.86428574 56.6470166 -63.27691132 56.05453125 -62.67173767 55.4440918 C-60.73680704 53.49530834 -58.79458411 51.55399543 -56.8515625 49.61328125 C-55.49997299 48.25780323 -54.14860703 46.90210228 -52.79745483 45.54618835 C-49.96797748 42.70925863 -47.13466764 39.87622372 -44.29882812 37.0456543 C-40.66653025 33.419158 -37.0457403 29.78140835 -33.42795753 26.14043903 C-30.64163989 23.33938845 -27.84842491 20.54529665 -25.05317307 17.75316429 C-23.71520266 16.41468073 -22.37959227 15.07383372 -21.04640579 13.7305851 C-19.18206783 11.85390534 -17.30843004 9.98702312 -15.43212891 8.12231445 C-14.88442337 7.56696518 -14.33671783 7.01161591 -13.77241516 6.43943787 C-9.58273935 2.3067369 -5.91898235 0.10820809 0 0 Z M-303.96484375 147.33984375 C-316.75454701 163.87495096 -324.00539935 183.53488853 -321.90234375 204.68359375 C-317.89567096 229.75846651 -303.73813437 250.5405997 -283.3125 265.375 C-254.2625026 285.72106971 -213.33417024 294.43644293 -178.3125 288.375 C-175.84533487 287.43002957 -175.84533487 287.43002957 -174.98046875 283.6328125 C-174.47446328 281.92553468 -173.98205853 280.2141933 -173.5 278.5 C-173.23936768 277.5812207 -172.97873535 276.66244141 -172.71020508 275.71582031 C-169.44883723 263.77959034 -167.24482937 251.59019358 -165.3125 239.375 C-165.1983374 238.65932861 -165.0841748 237.94365723 -164.96655273 237.20629883 C-162.23117485 216.88670057 -162.2939772 193.01989686 -168.3125 173.375 C-168.663125 172.18003906 -169.01375 170.98507813 -169.375 169.75390625 C-176.43106462 148.95321577 -193.36068716 133.90836225 -212.21875 123.8203125 C-244.68613069 108.05310751 -281.32372761 121.1645046 -303.96484375 147.33984375 Z " fill="#FF8000" transform="translate(438.3125,14.625)" />
                            </g>
                        </svg>


                    </div>
                </div>

                {/* Wavy divider */}


                {/*Stats row */}
                <div className="goals-stats-row">
                    <div className="goals-stat">
                        <div className="goals-stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="goals-stat-content">
                            <span className="goals-stat-number">120+</span>
                            <span className="goals-stat-label">Happy Clients</span>
                        </div>
                    </div>
                    <div className="goals-stat-divider"></div>
                    <div className="goals-stat">
                        <div className="goals-stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                        </div>
                        <div className="goals-stat-content">
                            <span className="goals-stat-number">5+</span>
                            <span className="goals-stat-label">Industries Served</span>
                        </div>
                    </div>
                    <div className="goals-stat-divider"></div>
                    <div className="goals-stat">
                        <div className="goals-stat-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3v18h18" />
                                <path d="M18 17V9" />
                                <path d="M13 17V5" />
                                <path d="M8 17v-3" />
                            </svg>
                        </div>
                        <div className="goals-stat-content">
                            <span className="goals-stat-number">3X</span>
                            <span className="goals-stat-label">Average Growth</span>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default About;
