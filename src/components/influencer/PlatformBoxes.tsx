import { Camera, Play, Music } from 'lucide-react';
import type { Platform } from '@/types';

interface PlatformBoxesProps {
  onSelect: (platform: Platform) => void;
}

export function PlatformBoxes({ onSelect }: PlatformBoxesProps) {
  const handleClick = (p: Platform) => {
    onSelect(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-16 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">Browse by Platform</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => handleClick('instagram')}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
        >
          <div className="p-4 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <span className="font-bold text-white text-lg">Instagram</span>
          <span className="text-[var(--text-muted)] text-sm mt-1">10 creators</span>
        </button>

        <button
          onClick={() => handleClick('youtube')}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
        >
          <div className="p-4 rounded-full bg-red-500 mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>
          <span className="font-bold text-white text-lg">YouTube</span>
          <span className="text-[var(--text-muted)] text-sm mt-1">10 creators</span>
        </button>

        <button
          onClick={() => handleClick('tiktok')}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
        >
          <div className="p-4 rounded-full bg-cyan-400 mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <span className="font-bold text-white text-lg">TikTok</span>
          <span className="text-[var(--text-muted)] text-sm mt-1">10 creators</span>
        </button>
      </div>
    </div>
  );
}
