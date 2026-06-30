import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveText } from '@/components/ui/InteractiveText';
import { motion } from 'framer-motion';
import { Search, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { FeaturesPage } from './FeaturesPage';

gsap.registerPlugin(Draggable);

export function CoverPage() {
  const container = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.letter', {
        y: 80,
        opacity: 0,
        stagger: 0.04,
        duration: 0.8,
      })
      .from('.subhead', {
        y: 20,
        opacity: 0,
        duration: 0.6,
      }, '-=0.3')
      .from('.insta-tool', {
        scale: 0.8,
        opacity: 0,
        rotation: 5,
        duration: 0.8,
        ease: 'back.out(1.5)',
      }, '-=0.4');
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

  }, { scope: container });

  return (
    <div id="cover" className="flex flex-col w-full bg-[var(--bg-base)]">
      <div ref={container} className="relative min-h-screen w-full overflow-hidden bg-[var(--bg-base)] p-6 md:p-12 font-sans">
      
      {/* Top Left: Massive Searchify Text & Subhead */}
      <div className="absolute top-12 left-6 md:left-12 max-w-[90vw] md:max-w-[75vw] z-10 pointer-events-none">
        <h1 className="text-[12vh] sm:text-[18vh] md:text-[22vh] leading-[0.85] font-extrabold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 pointer-events-auto">
          <InteractiveText text="SEARCHIFY" />
        </h1>
        <p className="subhead text-xl md:text-3xl text-[var(--text-secondary)] max-w-2xl font-light pointer-events-auto">
          Find the right creator, fast. A powerful dashboard to filter, analyze, and build your perfect influencer shortlist.
        </p>
      </div>

      {/* Bottom Left: Framer Motion Explore Button */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] border border-white/10 text-lg flex items-center gap-3"
          onClick={() => navigate('/dashboard')}
        >
          Explore the product <Search className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Bottom Right: Draggable Insta UI Interaction Tool */}
      <div 
        ref={toolRef} 
        className="insta-tool absolute bottom-12 right-6 md:right-12 z-30 cursor-grab active:cursor-grabbing w-72 md:w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-80"
        style={{ touchAction: 'none' }} // Required for GSAP Draggable on touch devices
      >
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--bg-elevated)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
            <div className="w-full h-full bg-[var(--bg-surface)] rounded-full border border-[var(--border)] flex items-center justify-center text-xs font-bold text-white">S</div>
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">@searchify_app</div>
            <div className="text-xs text-[var(--text-muted)]">Sponsored</div>
          </div>
        </div>
        
        <div className="h-48 w-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex flex-col items-center justify-center relative overflow-hidden pointer-events-none">
           <Search className="w-12 h-12 text-[var(--accent)] mb-2 animate-pulse" />
           <div className="text-[var(--text-primary)] font-display font-bold">Try dragging me!</div>
        </div>

        <div className="p-4 bg-[var(--bg-base)]">
          <div className="flex gap-4 mb-3">
            <Heart className="w-6 h-6 text-[var(--text-primary)] hover:text-pink-500 transition-colors" />
            <MessageCircle className="w-6 h-6 text-[var(--text-primary)] hover:text-blue-500 transition-colors" />
            <div className="flex-1"></div>
            <Bookmark className="w-6 h-6 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors" />
          </div>
          <div className="text-sm font-bold text-[var(--text-primary)] mb-1">1,337 likes</div>
          <div className="text-sm text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--text-primary)] mr-2">searchify_app</span>
            Find your next big creator in seconds. 🚀
          </div>
        </div>
      </div>
      </div>
      
      {/* Connect Features Page directly below for continuous scrolling */}
      <div id="features">
        <FeaturesPage />
      </div>
    </div>
  );
}
