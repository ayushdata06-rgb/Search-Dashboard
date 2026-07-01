import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { Search } from 'lucide-react';
import { FeaturesPage } from './FeaturesPage';
import { InteractiveText } from '@/components/ui/InteractiveText';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SiInstagram, SiYoutube, SiTiktok } from 'react-icons/si';

gsap.registerPlugin(Draggable);

function BlindsTextReveal({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <div className={`relative overflow-hidden inline-block ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0, delay: delay }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-[#7c3aed]"
        initial={{ x: 0 }}
        animate={{ x: '-101%' }}
        transition={{ duration: 0.6, ease: [0.28, 0.25, 0.18, 0.98], delay }}
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  );
}

export function CoverPage() {
  const container = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      gsap.fromTo('.letter', 
        {
          opacity: 0,
          y: 100,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          transformOrigin: '0% 50% -60px',
          stagger: {
            amount: 0.6,
            from: 'start',
          },
          duration: 0.9,
          ease: 'power4.out',
          delay: 0.1,
        }
      );

      gsap.fromTo('.search-mockup-card', 
        {
          opacity: 0,
          scale: 0.8,
          rotation: 5,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.5)',
          delay: 0.8,
          clearProps: 'transform' // clean up after to prevent interfering with draggable
        }
      );
    } else {
      gsap.set('.letter', { opacity: 1, y: 0 });
    }

    if (toolRef.current) {
      Draggable.create(toolRef.current, {
        type: 'x,y',
        bounds: container.current,
        onDragStart: function() {
          gsap.to(this.target, { scale: 1.05, cursor: 'grabbing', duration: 0.2 });
        },
        onDragEnd: function() {
          gsap.to(this.target, { scale: 1, cursor: 'grab', duration: 0.2 });
        }
      });
    }

    const queries = ['cristiano', 'mrbeast', 'sel', 'bey'];
    let queryIndex = 0;
    
    function runTypingLoop() {
      const loopTl = gsap.timeline({
        onComplete: () => {
          queryIndex = (queryIndex + 1) % queries.length;
          runTypingLoop();
        }
      });

      loopTl.to('.typing-text', {
        duration: 0.5,
        text: queries[queryIndex],
        ease: 'none',
      })
      .fromTo('.result-row', 
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.35, ease: 'power2.out' }, '+=0.1')
      .to({}, { duration: 2.2 })
      .to('.result-row', {
        opacity: 0,
        y: -6,
        stagger: 0.07,
        duration: 0.25,
      })
      .to('.typing-text', {
        duration: 0.25,
        text: '',
        ease: 'none',
      })
      .to({}, { duration: 0.4 });

      return loopTl;
    }

    setTimeout(() => runTypingLoop(), 1600);
  }, { scope: container });

  return (
    <div id="cover" className="flex flex-col w-full bg-[var(--bg-base)]">
      <div ref={container} className="relative w-full min-h-screen overflow-hidden flex flex-col items-center pt-[8vh] md:pt-[10vh] px-4">
        
        {/* TEXT CONTAINER */}
        <div className="flex flex-col w-full max-w-5xl z-10 pointer-events-none">
          {/* SEARCH centered */}
          <div className="flex justify-center w-full">
              <h1 className="text-[#f0f0ff] uppercase pointer-events-auto" style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(48px, 10vw, 130px)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
              }}>
              <InteractiveText text="SEARCH" />
            </h1>
          </div>

          {/* LOWER SECTION: IFY (Right) and UI Interaction Tool (Left) */}
          <div className="flex w-full mt-[-2%] flex-col md:flex-row-reverse">
            
            {/* Right side: IFY */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start pl-0 md:pl-10">
              <style>{`
                .ify-text .letter {
                  background-image: linear-gradient(to right, #c084fc, #3b82f6);
                  background-size: 300% 100%;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  color: transparent;
                }
                .ify-text .letter:nth-child(1) { background-position: 0% 0%; }
                .ify-text .letter:nth-child(2) { background-position: 50% 0%; }
                .ify-text .letter:nth-child(3) { background-position: 100% 0%; }
              `}</style>
              <h1 className="ify-text uppercase pointer-events-auto" style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(48px, 10vw, 130px)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
              }}>
                <InteractiveText text="IFY" />
              </h1>

              {/* Text & CTA button below IFY */}
              <div className="mt-4 md:mt-6 flex flex-col items-center md:items-start pointer-events-auto w-full max-w-lg">
                 <div className="text-[#a0a0b8] font-['Plus_Jakarta_Sans'] font-light text-lg md:text-[22px] text-center md:text-left leading-snug tracking-wide flex flex-col items-center md:items-start gap-1">
                   <BlindsTextReveal delay={1.4}>
                     Search across <span className="text-[#f0f0ff] font-medium">Instagram</span>, <span className="text-[#f0f0ff] font-medium">YouTube</span> and <span className="text-[#f0f0ff] font-medium">TikTok</span> in one place.
                   </BlindsTextReveal>
                   <BlindsTextReveal delay={1.5}>
                     Save creators and build campaigns.
                   </BlindsTextReveal>
                 </div>
                 
                 <div className="mt-6 md:mt-8 w-full flex flex-col sm:flex-row items-center md:justify-start gap-6">
                   <motion.button
                     onClick={() => navigate('/dashboard')}
                     className="relative group px-8 py-4 rounded-full font-medium text-[16px] text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_0_40px_rgba(124,58,237,0.4)] flex items-center justify-center gap-3 border border-[rgba(255,255,255,0.1)] cursor-pointer w-full sm:w-auto overflow-hidden"
                     whileHover={{ scale: 1.03 }}
                     whileTap={{ scale: 0.97 }}
                     transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                   >
                     <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                     <span className="relative z-10 font-display tracking-wide font-bold">Explore Dashboard</span>
                     <motion.div 
                       className="relative z-10 flex items-center justify-center"
                       initial={{ x: 0 }}
                       whileHover={{ x: 6 }}
                       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                     >
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                     </motion.div>
                   </motion.button>

                   {/* Secondary visual element */}
                   <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-[rgba(255,255,255,0.1)]">
                     <div className="flex -space-x-2">
                       <div className="w-9 h-9 rounded-full border-2 border-[var(--bg-base)] bg-[#e1306c] flex items-center justify-center shadow-md">
                         <SiInstagram className="w-4 h-4 text-white" />
                       </div>
                       <div className="w-9 h-9 rounded-full border-2 border-[var(--bg-base)] bg-[#ff0000] flex items-center justify-center shadow-md">
                         <SiYoutube className="w-4 h-4 text-white" />
                       </div>
                       <div className="w-9 h-9 rounded-full border-2 border-[var(--bg-base)] bg-[#69c9d0] flex items-center justify-center shadow-md">
                         <SiTiktok className="w-4 h-4 text-white" />
                       </div>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[11px] text-[#f0f0ff] font-bold tracking-wider uppercase">Multi-Platform</span>
                       <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Unified Search</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Left side: Mockup Tool positioned below SEARCH */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-10 pt-20 md:pt-16 pointer-events-auto relative z-30">
              {/* SEARCH MOCKUP CARD (DRAGGABLE) */}
              <div 
                ref={toolRef} 
                className="search-mockup-card cursor-grab active:cursor-grabbing w-[90%] md:w-full max-w-[420px]"
                style={{ 
                  touchAction: 'none',
                  background: 'rgba(35, 35, 45, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.03), 0 0 60px rgba(124,58,237,0.15)'
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#7c3aed] rounded-full flex items-center justify-center text-xs font-bold text-white font-['Plus_Jakarta_Sans']">S</div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-white font-['Plus_Jakarta_Sans']">@searchify</span>
                    <span className="text-[11px] text-[#4a4a6a] font-['Plus_Jakarta_Sans']">Influencer Search</span>
                  </div>
                  <div className="ml-auto text-[#4a4a6a] text-lg leading-none tracking-widest">&middot;&middot;&middot;</div>
                </div>

                {/* Search bar */}
                <div className="mt-4 w-full h-[44px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] flex items-center gap-[10px] px-[14px]">
                  <Search size={16} color="#4a4a6a" />
                  <span className="typing-text text-[14px] text-white font-['Plus_Jakarta_Sans']"></span>
                  <span className="cursor" style={{ animation: 'blink 1s step-end infinite', color: '#7c3aed' }}>|</span>
                </div>

                {/* Results */}
                <div className="mt-3 flex flex-col gap-[2px]">
                  <div className="result-row px-3 py-2.5 rounded-[10px] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #bc1888)' }}>
                      <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[13px] font-bold text-[#f0f0ff] font-['Plus_Jakarta_Sans']">@cristiano</div>
                      <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] flex items-center">
                        Cristiano Ronaldo 
                        <span className="text-[10px] px-2 py-0.5 rounded-full ml-2" style={{ background: 'rgba(225,48,108,0.15)', color: '#e1306c' }}>Instagram</span>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] ml-auto">641.3M</div>
                  </div>

                  <div className="result-row px-3 py-2.5 rounded-[10px] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: '#ff0000' }}>
                      <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[13px] font-bold text-[#f0f0ff] font-['Plus_Jakarta_Sans']">@mrbeast</div>
                      <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] flex items-center">
                        MrBeast 
                        <span className="text-[10px] px-2 py-0.5 rounded-full ml-2" style={{ background: 'rgba(255,0,0,0.15)', color: '#ff0000' }}>YouTube</span>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] ml-auto">312.0M</div>
                  </div>

                  <div className="result-row px-3 py-2.5 rounded-[10px] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: '#69c9d0' }}>
                      <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[13px] font-bold text-[#f0f0ff] font-['Plus_Jakarta_Sans']">@selenagomez</div>
                      <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] flex items-center">
                        Selena Gomez 
                        <span className="text-[10px] px-2 py-0.5 rounded-full ml-2" style={{ background: 'rgba(105,201,208,0.15)', color: '#69c9d0' }}>TikTok</span>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] ml-auto">423.9M</div>
                  </div>
                </div>

                <div className="text-center font-['Plus_Jakarta_Sans'] text-[11px] text-[#4a4a6a] mt-3.5 pt-3.5 border-t border-[rgba(255,255,255,0.06)]">
                  30 creators across 3 platforms
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <div id="features">
        <FeaturesPage />
      </div>
    </div>
  );
}
