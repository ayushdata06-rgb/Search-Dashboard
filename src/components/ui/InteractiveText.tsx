import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface InteractiveTextProps {
  text: string;
  className?: string;
}

export function InteractiveText({ text, className = '' }: InteractiveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Split text into characters
  const letters = useMemo(() => text.split(''), [text]);

  useGSAP(() => {
    // 1. Accessibility & Device Checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !isHoverable) {
      // Do nothing extra for touch devices or reduced-motion.
      // The text renders statically and won't attach mousemove listeners.
      return; 
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Setup GSAP quickTo setters for performance
    // gsap.quickTo is significantly faster for rapidly updating values (like in a mousemove event)
    // because it bypasses the normal tween instantiation/parsing pipeline and directly updates 
    // the specific property of the target element.
    const letterSetters = lettersRef.current.map((el) => {
      if (!el) return null;
      return {
        y: gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' }),
        scale: gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power3.out' }),
        rotate: gsap.quickTo(el, 'rotation', { duration: 0.4, ease: 'power3.out' }),
      };
    });

    // 3. Animation Logic & Math
    // The maxDistance defines the radius of the "bubble" around the cursor.
    const maxDistance = 200; 

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      lettersRef.current.forEach((el, index) => {
        if (!el) return;
        const setters = letterSetters[index];
        if (!setters) return;

        // Get the absolute center of the letter on the screen
        const letterRect = el.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2;
        const letterCenterY = letterRect.top + letterRect.height / 2;

        // Calculate distance from mouse to letter center using Pythagorean theorem
        const dx = mouseX - letterCenterX;
        const dy = mouseY - letterCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate intensity based on distance (inverse linear falloff)
        // Math.max(0, ...) ensures intensity stays at 0 for elements outside maxDistance
        const intensity = Math.max(0, 1 - distance / maxDistance);

        // Apply transformations based on intensity
        // Multiply by base factors to determine how extreme the effect gets
        setters.y(-60 * intensity); // Move up to 60px up
        setters.scale(1 + 0.6 * intensity); // Scale up to 1.6x
        
        // Add a slight rotation depending on which side the mouse is on
        const rotateDir = dx > 0 ? -1 : 1;
        setters.rotate(25 * intensity * rotateDir);
      });
    };

    const handleMouseLeave = () => {
      // Smoothly return all letters to resting state
      letterSetters.forEach((setters) => {
        if (!setters) return;
        setters.y(0);
        setters.scale(1);
        setters.rotate(0);
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`inline-flex ${className}`}>
      {letters.map((char, i) => (
        <span
          key={i}
          ref={(el) => { lettersRef.current[i] = el; }}
          // We include the 'letter' class so the CoverPage entrance animation still works!
          className="letter inline-block whitespace-pre"
          style={{ willChange: 'transform' }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
