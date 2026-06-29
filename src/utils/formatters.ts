export function formatCompact(count: number): string {
  if (count >= 1_000_000_000) {
    return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return 'N/A';
  return (rate * 100).toFixed(2) + '%';
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function getPlatformLabel(platform: string): string {
  switch (platform) {
    case 'instagram': return 'Instagram';
    case 'youtube': return 'YouTube';
    case 'tiktok': return 'TikTok';
    default: return platform;
  }
}

export function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'instagram': return 'var(--insta)';
    case 'youtube': return 'var(--youtube)';
    case 'tiktok': return 'var(--tiktok)';
    default: return 'var(--accent)';
  }
}
