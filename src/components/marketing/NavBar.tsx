import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NavBar() {
  const location = useLocation();
  const currentHash = location.hash || '#cover';

  const links = [
    { to: '/', hash: '#cover', label: 'Cover' },
    { to: '/#features', hash: '#features', label: 'Features' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-base)]/80 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-6">
        {links.map((link) => {
          const isActive = currentHash === link.hash;
          const transition1 = { type: 'spring' as const, bounce: 0.4, duration: 0.6 };

          return (
            <motion.div
              key={link.to}
              initial="default"
              whileHover="hover"
              className="relative w-24 h-10 overflow-visible cursor-pointer"
              style={{ transformPerspective: 1200 }}
            >
              <Link
                to={link.to}
                onClick={(e) => {
                  if (link.hash === '#cover') {
                    // Smooth scroll to top if cover
                    if (location.pathname === '/') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } else {
                    if (location.pathname === '/') {
                      const el = document.querySelector(link.hash);
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full outline-none block"
                style={{ transformOrigin: '100% 50%' }}
              >
                {/* ARM 1: Default State */}
                <motion.div
                  variants={{
                    hover: { rotate: 25 },
                    default: { rotate: 0 }
                  }}
                  transition={transition1}
                  className={`absolute inset-0 flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                  style={{ transformOrigin: '100% 50%', zIndex: 1 }}
                >
                  {link.label}
                </motion.div>

                {/* ARM 2: Background Pill */}
                <motion.div
                  variants={{
                    hover: { rotate: 0 },
                    default: { rotate: -18 }
                  }}
                  transition={transition1}
                  className="absolute inset-0"
                  style={{ transformOrigin: '100% 50%', zIndex: 2 }}
                >
                  <motion.div
                    variants={{
                      hover: { opacity: 1, filter: "blur(0px)" },
                      default: { opacity: 0, filter: "blur(4px)" }
                    }}
                    transition={transition1}
                    className="w-full h-full rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ willChange: "transform, opacity, filter" }}
                  />
                </motion.div>

                {/* ARM 3: Hover Text */}
                <motion.div
                  variants={{
                    hover: { rotate: 0 },
                    default: { rotate: -35 }
                  }}
                  transition={transition1}
                  className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white"
                  style={{ transformOrigin: '100% 50%', zIndex: 3 }}
                >
                  <motion.div
                    variants={{
                      hover: { opacity: 1, scale: 1 },
                      default: { opacity: 0, scale: 0.6 }
                    }}
                    transition={transition1}
                  >
                    {link.label}
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
