import { useEffect, useRef } from "react";

const DEFAULT_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export interface HoverAreaScrambleProps {
  text: string;
  radius?: number;
  scrambleColor?: string;
  scrambleChars?: string;
  className?: string;
}

export function HoverAreaScramble({ 
  text, 
  radius = 60, 
  scrambleColor = "#f472b6", 
  scrambleChars = DEFAULT_SCRAMBLE_CHARS, 
  className = ""
}: HoverAreaScrambleProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const charCentersRef = useRef<{ el: HTMLSpanElement; cx: number; cy: number }[]>([]);
  
  const words = text.split(" ");

  useEffect(() => {
    if (!rootRef.current) return;
    
    charsRef.current = Array.from(rootRef.current.querySelectorAll('.scramble-char'));
    
    let widthsLocked = false;
    let scrambleInterval: number | null = null;
    const currentScrambledStates = new Map<HTMLSpanElement, string>();
    let mousePos = { x: -1000, y: -1000 };

    const lockWidths = () => {
      // 1. Revert to original
      charsRef.current.forEach(char => {
        const originalText = char.getAttribute("data-original") || "";
        char.textContent = originalText;
        char.style.width = '';
      });

      // 2. Measure and lock
      charsRef.current.forEach(char => {
        const originalText = char.getAttribute("data-original") || "";
        if (originalText.trim() !== "") {
          const rect = char.getBoundingClientRect();
          char.style.width = `${rect.width}px`;
          char.style.textAlign = "center";
        }
      });

      // 3. Restore scramble if active
      charsRef.current.forEach(char => {
        const scrambledChar = currentScrambledStates.get(char);
        if (scrambledChar && char.getAttribute("data-original")?.trim() !== "") {
          char.textContent = scrambledChar;
        }
      });
      widthsLocked = true;
    };

    const updatePositions = () => {
      charCentersRef.current = charsRef.current.map(char => {
        const rect = char.getBoundingClientRect();
        return {
          el: char,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2
        };
      });
    };
    
    const handleResize = () => {
      widthsLocked = false;
    };

    const handleScroll = () => {
      if (widthsLocked) {
        updatePositions();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    
    const getRandomChar = (original: string) => {
      let char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      return char === original && scrambleChars.length > 1 
        ? scrambleChars[(Math.max(0, scrambleChars.indexOf(char)) + 1) % scrambleChars.length] 
        : char;
    };
    
    const updateScrambleStates = () => {
      let anyNear = false;
      const r2 = radius * radius;
      
      charCentersRef.current.forEach(({ el, cx, cy }) => {
        const dx = mousePos.x - cx;
        const dy = mousePos.y - cy;
        if (dx * dx + dy * dy < r2) {
          anyNear = true;
          const originalChar = el.getAttribute("data-original") || "";
          if (originalChar.trim() !== "") {
            currentScrambledStates.set(el, getRandomChar(originalChar));
          }
        }
      });
      
      charCentersRef.current.forEach(({ el, cx, cy }) => {
        const dx = mousePos.x - cx;
        const dy = mousePos.y - cy;
        const within = dx * dx + dy * dy < r2;
        const originalChar = el.getAttribute("data-original") || "";
        
        if (within && originalChar.trim() !== "") {
           const scrambledChar = currentScrambledStates.get(el) || originalChar;
           if (el.textContent !== scrambledChar) el.textContent = scrambledChar;
           el.style.color = scrambleColor;
        } else {
           if (el.textContent !== originalChar) el.textContent = originalChar;
           el.style.color = "";
        }
      });
      
      if (!anyNear && scrambleInterval) {
        clearInterval(scrambleInterval);
        scrambleInterval = null;
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      mousePos = { x: e.clientX, y: e.clientY };
      
      // Lazily lock widths on very first hover to ensure all entry animations are finished
      if (!widthsLocked) {
        lockWidths();
        updatePositions();
      }
      
      let anyNear = false;
      const r2 = radius * radius;
      charCentersRef.current.forEach(({ cx, cy }) => {
        const dx = mousePos.x - cx;
        const dy = mousePos.y - cy;
        if (dx * dx + dy * dy < r2) anyNear = true;
      });
      
      if (anyNear && !scrambleInterval) {
        updateScrambleStates();
        scrambleInterval = window.setInterval(updateScrambleStates, 50);
      } else if (!anyNear && scrambleInterval) {
        window.clearInterval(scrambleInterval);
        scrambleInterval = null;
        updateScrambleStates();
      } else if (anyNear && scrambleInterval) {
        updateScrambleStates();
      }
    };
    
    document.addEventListener("pointermove", handlePointerMove);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("pointermove", handlePointerMove);
      if (scrambleInterval) clearInterval(scrambleInterval);
    };
  }, [radius, scrambleColor, scrambleChars]);

  return (
    <span ref={rootRef} className={className}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIdx) => (
            <span 
              key={charIdx} 
              className="scramble-char inline-block transition-colors duration-75"
              data-original={char}
            >
              {char}
            </span>
          ))}
          {wordIdx < words.length - 1 && <span className="scramble-char inline-block" data-original=" ">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
