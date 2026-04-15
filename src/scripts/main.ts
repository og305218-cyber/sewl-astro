import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerBound = false;
let rafBound = false;

function ensureLenis() {
  if (lenis) {
    return lenis;
  }

  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  if (!tickerBound) {
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    tickerBound = true;
  }

  if (!rafBound) {
    const raf = (time: number) => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    rafBound = true;
  }

  return lenis;
}

function setupPageAnimations() {
  ensureLenis();

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
  gsap.killTweensOf('.hero-title');
  gsap.killTweensOf('.hero-word');

  document.querySelectorAll<HTMLElement>('[data-scroll-reveal].is-visible').forEach((el) => {
    el.classList.remove('is-visible');
  });

  const reveals = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  const heroTitle = document.querySelector<HTMLElement>('.hero-title');
  if (heroTitle) {
    const words = heroTitle.querySelectorAll<HTMLElement>('.hero-word');
    if (words.length > 0) {
      gsap.fromTo(
        words,
        { yPercent: 120, skewY: 8, opacity: 0 },
        {
          yPercent: 0,
          skewY: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.14,
          ease: 'power4.out',
          delay: 0.3,
        },
      );
    }

    gsap.to(heroTitle, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  ScrollTrigger.refresh();
}

window.addEventListener('sewl:page-ready', setupPageAnimations);
