import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = 6,
  onPageChange,
  label = 'featured creators',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center justify-center mt-8 gap-4 w-full">
      <div className="text-[13px] text-[var(--text-muted)]">
        Showing {startItem}–{endItem} of {totalItems} {label}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => {
                  onPageChange(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-white border border-white/20'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="featured-page-indicator"
                    className="absolute inset-0 bg-[#7c3aed] rounded-lg"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{page}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
