import { SiInstagram, SiYoutube, SiTiktok } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { PLATFORM_CONFIG, type Platform } from '@/types';
import { useListStore } from '@/store/useListStore';

interface PlatformBoxProps {
  platform: Platform;
  creatorCount?: number;
}

export function PlatformBox({ platform, creatorCount = 10 }: PlatformBoxProps) {
  const navigate = useNavigate();
  const config = PLATFORM_CONFIG[platform];
  const setPlatformPage = useListStore((s) => s.setPlatformPage);

  const getIcon = () => {
    switch (platform) {
      case 'instagram':
        return <SiInstagram size={32} color={config.color} />;
      case 'youtube':
        return <SiYoutube size={32} color={config.color} />;
      case 'tiktok':
        return <SiTiktok size={32} color={config.color} />;
    }
  };

  return (
    <div
      onClick={() => {
        setPlatformPage(platform, 1);
        navigate(`/dashboard/${platform}`);
      }}
      className="relative flex flex-col items-center justify-center p-7 rounded-[20px] bg-white/2 cursor-pointer group"
      style={{
        border: `1px solid ${config.borderColor}`,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        target.style.borderColor = config.color;
        target.style.boxShadow = `0 0 24px ${config.glow}`;
        target.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.borderColor = config.borderColor;
        target.style.boxShadow = 'none';
        target.style.transform = 'none';
      }}
    >
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="font-bold text-white text-[18px] mb-1">{config.label}</h3>
      <p className="text-[14px] text-[var(--text-muted)]">{creatorCount} creators</p>
      
      <span className="absolute bottom-4 right-5 text-xs text-[var(--text-muted)] group-hover:text-white transition-colors">
        Explore →
      </span>
    </div>
  );
}
