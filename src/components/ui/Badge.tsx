import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'instagram' | 'youtube' | 'tiktok' | 'success';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/20',
  instagram: 'bg-[var(--insta)]/15 text-[var(--insta)] border-[var(--insta)]/20',
  youtube: 'bg-[var(--youtube)]/15 text-[var(--youtube)] border-[var(--youtube)]/20',
  tiktok: 'bg-[var(--tiktok)]/15 text-[var(--tiktok)] border-[var(--tiktok)]/20',
  success: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
