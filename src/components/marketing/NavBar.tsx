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
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => {
                if (link.hash === '#cover') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const el = document.querySelector(link.hash);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeMarketingTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
