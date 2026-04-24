import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const clearSplitChars = (chars) => {
  const splitChars = Array.from(chars || []);
  if (!splitChars.length) return;

  gsap.killTweensOf(splitChars);
  gsap.set(splitChars, { clearProps: "opacity,transform,transformOrigin" });
};

export const revealSplitChars = ({ chars, trigger, from, to, start }) => {
  const splitChars = Array.from(chars || []);
  if (!splitChars.length || !trigger) return () => {};

  let tween;
  let hasPlayed = false;

  const restoreText = () => {
    gsap.set(splitChars, { clearProps: "opacity,transform,transformOrigin" });
  };

  const stop = () => {
    if (tween) {
      tween.kill();
      tween = null;
    }
    clearSplitChars(splitChars);
  };

  const play = () => {
    if (hasPlayed) return;

    hasPlayed = true;
    gsap.killTweensOf(splitChars);
    tween = gsap.fromTo(splitChars, from, {
      ...to,
      overwrite: true,
      immediateRender: true,
      onComplete: () => {
        tween = null;
        restoreText();
      },
      onInterrupt: () => {
        tween = null;
        restoreText();
      },
    });
  };

  stop();

  const scrollTrigger = ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: play,
    onRefresh: self => {
      if (self.isActive || self.progress > 0) play();
    },
  });

  return () => {
    scrollTrigger.kill();
    stop();
  };
};

export const revealSectionSubtitle = (chars, trigger, start = "top 90%") =>
  revealSplitChars({
    chars,
    trigger,
    start,
    from: { rotateX: 90, y: 20, opacity: 0, transformOrigin: "bottom center" },
    to: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.03,
      ease: "back.out(1.7)",
    },
  });

export const revealSectionTitle = (chars, trigger, start = "top 88%") =>
  revealSplitChars({
    chars,
    trigger,
    start,
    from: { rotateY: 90, opacity: 0, transformOrigin: "left center" },
    to: {
      rotateY: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.02,
      ease: "back.out(1.7)",
    },
  });
