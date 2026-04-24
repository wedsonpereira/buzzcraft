import React, { useRef } from 'react';
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SubtitleHover } from "./About.jsx";
import { clearSplitChars, revealSectionSubtitle, revealSectionTitle } from "./sectionHeaderAnimation";
import understandingBusinessIcon from "./assets/Svg/understanding_business.svg";
import marketResearchIcon from "./assets/Svg/market-research.svg";
import creativeDevelopmentIcon from "./assets/Svg/creative-development.svg";
import campaignLaunchIcon from "./assets/Svg/Campaign-launch.svg";
import performanceMonitoringIcon from "./assets/Svg/Performance-monitoring.svg";
import optimizationIcon from "./assets/Svg/Optimization.svg";
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_PATH_D = "M 0 200 C 100 50, 200 50, 300 200 S 500 350, 600 200 S 800 50, 900 200 S 1100 350, 1200 200 S 1400 50, 1500 200 S 1700 350, 1800 200";
const PROCESS_VIEWBOX = { width: 1800, height: 400 };

const Process = () => {
    const sectionRef = useRef(null);
    const pathLineRef = useRef(null);
    const cursorRef = useRef(null);
    const subheadingTextRef = useRef(null);
    const headingRef = useRef(null);
    useGSAP(() => {
        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        let subChars = [];
        let hoverChars = [];
        let cleanupSubheadingReveal = () => {};
        let cleanupHeadingReveal = () => {};

        if (subheadingTextRef.current) {
            subChars = Array.from(subheadingTextRef.current.querySelectorAll(".sub-char"));
            cleanupSubheadingReveal = revealSectionSubtitle(subChars, sectionRef.current, "top 88%");
        }

        if (headingRef.current) {
            hoverChars = Array.from(headingRef.current.querySelectorAll(".hover-char"));
            if (hoverChars.length) {
                cleanupHeadingReveal = revealSectionTitle(hoverChars, headingRef.current, "top 88%");
            }
        }

        const pathEl = pathLineRef.current;
        const cursorEl = cursorRef.current;

        if (pathEl) {
            const pathLength = pathEl.getTotalLength();
            const tangentSample = 2;
            const setCursorOnPath = (progress = 0) => {
                const distance = pathLength * progress;
                const point = pathEl.getPointAtLength(distance);
                const ahead = pathEl.getPointAtLength(Math.min(pathLength, distance + tangentSample));
                const behind = pathEl.getPointAtLength(Math.max(0, distance - tangentSample));
                const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;

                pathEl.style.strokeDashoffset = String(pathLength * (1 - progress));

                if (cursorEl) {
                    cursorEl.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
                }
            };

            gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
            setCursorOnPath(0);

            const pathMedia = gsap.matchMedia();

            pathMedia.add("(min-width: 769px)", () => {
                const pathProgress = { value: 0 };

                const pathTween = gsap.to(pathProgress, {
                    value: 1,
                    ease: "none",
                    onUpdate: () => setCursorOnPath(pathProgress.value),
                    scrollTrigger: {
                        trigger: pathEl,
                        start: "top 80%",
                        end: "bottom 25%",
                        scrub: true,
                        invalidateOnRefresh: true,
                        onRefresh: self => setCursorOnPath(self.progress),
                    },
                });

                return () => pathTween.kill();
            });

            pathMedia.add("(max-width: 768px)", () => {
                setCursorOnPath(0);
            });

            return () => {
                pathMedia.revert();
                clearTimeout(refreshTimer);
                cleanupSubheadingReveal();
                cleanupHeadingReveal();
                clearSplitChars([...subChars, ...hoverChars]);
            };
        }

        return () => {
            clearTimeout(refreshTimer);
            cleanupSubheadingReveal();
            cleanupHeadingReveal();
            clearSplitChars([...subChars, ...hoverChars]);
        };
    }, { scope: sectionRef });

    return (
        <section className="process-section" ref={sectionRef}>
            <div className="process-header">
                <h4 className="about-subheading">
                    <span className="title-arrow-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                    <span className="about-subheading-text" ref={subheadingTextRef}>
                        {"Our Process".split("").map((char, i) => (
                            <span key={i} className="sub-char" style={{ display: 'inline-block' }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </span>
                </h4>
                <h2 className="about-heading" ref={headingRef}>
                    <SubtitleHover text="How We Bring Ideas To Life" />
                </h2>
            </div>
            <div className={"m-auto flex items-center flex-col -rotate-2 translate-y-10"}>
                <h1 className={"text-2xl brightness-75"}>A clear path from idea to impact towards the success</h1>
                <p className={"m-0 brightness-50 underline  underline-offset-5"}>End-to-end digital marketing process from research and strategy to campaign execution, performance tracking, and scalable growth</p>
            </div>
            <div className="process-path-container relative ">

                <div className={"process-path-flex"}>
                    <div className={"svg-holder -translate-x-8 "}>
                        <img src={understandingBusinessIcon} alt="" />
                        <span>Understanding your business</span>
                    </div>

                    <div className={"svg-holder -translate-x-11 -translate-y-23"}>
                        <span>Market research & strategy</span>
                        <img src={marketResearchIcon} alt=""/>

                    </div>

                    <div className={"svg-holder -translate-x-11 "}>
                        <img src={creativeDevelopmentIcon} alt=""/>
                        <span>Creative development</span>
                    </div>

                    <div className={"svg-holder -translate-x-17  -translate-y-28"}>
                        <span>Campaign launch</span>
                        <img src={campaignLaunchIcon} alt=""/>

                    </div>

                    <div className={"svg-holder -translate-x-17  translate-y-2"}>
                        <img src={performanceMonitoringIcon} alt=""/>
                        <span>Performance monitoring</span>
                    </div>

                    <div className={"svg-holder -translate-x-23 -translate-y-27"}>
                        <span>Optimization & scaling</span>
                        <img src={optimizationIcon} alt=""/>
                    </div>
                </div>


                <div className="process-path-stage top-0">
                    <svg width="100%" xmlns="http://www.w3.org/2000/svg" className="process-svg" viewBox={`0 0 ${PROCESS_VIEWBOX.width} ${PROCESS_VIEWBOX.height}`} preserveAspectRatio="none">
                        <path d={PROCESS_PATH_D} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
                        <path ref={pathLineRef} id="process-path" d={PROCESS_PATH_D} stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="transparent" />
                        <g ref={cursorRef} id="process-element" className="process-cursor">
                            <path d="M0 0 L-36 -18 L-24 0 L-36 18 Z" />
                        </g>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Process;
