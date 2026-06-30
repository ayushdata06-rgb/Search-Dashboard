import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Search, Filter, BarChart3, BookmarkPlus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    title: 'Search across every platform',
    description: 'Instagram, YouTube, and TikTok creators, all in one place. Stop jumping between tabs and unify your search workflow.',
    icon: Search,
    color: 'from-purple-600 to-blue-500',
    mockup: (
      <div className="w-full h-64 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] p-6 shadow-xl flex flex-col gap-4">
        <div className="flex gap-2 mb-2">
          <div className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium border border-purple-500/30">Instagram</div>
          <div className="px-4 py-2 bg-[var(--bg-base)] text-[var(--text-secondary)] rounded-lg text-sm font-medium border border-[var(--border)]">YouTube</div>
          <div className="px-4 py-2 bg-[var(--bg-base)] text-[var(--text-secondary)] rounded-lg text-sm font-medium border border-[var(--border)]">TikTok</div>
        </div>
        <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] flex items-center px-4">
          <Search className="w-5 h-5 text-[var(--text-secondary)] mr-3" />
          <div className="h-4 w-48 bg-[var(--bg-elevated)] rounded animate-pulse"></div>
        </div>
        <div className="h-20 rounded-lg bg-[var(--bg-base)] border border-[var(--border)]"></div>
      </div>
    )
  },
  {
    id: 2,
    title: 'Filter by what matters',
    description: 'Drill down by niche, follower range, engagement rate, and platform. Find the exact match for your campaign instantly.',
    icon: Filter,
    color: 'from-purple-600 to-blue-500',
    mockup: (
      <div className="w-full h-64 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] p-6 shadow-xl flex flex-col gap-4">
        <div className="text-sm font-medium text-[var(--text-secondary)]">Followers</div>
        <div className="h-2 w-full bg-[var(--bg-base)] rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-purple-500 rounded-full"></div>
        </div>
        <div className="text-sm font-medium text-[var(--text-secondary)] mt-2">Niche</div>
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs border border-pink-500/30">Tech</div>
          <div className="px-3 py-1 bg-[var(--bg-base)] text-[var(--text-secondary)] rounded-full text-xs border border-[var(--border)]">Gaming</div>
          <div className="px-3 py-1 bg-[var(--bg-base)] text-[var(--text-secondary)] rounded-full text-xs border border-[var(--border)]">Lifestyle</div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: 'Deep profile insights',
    description: 'Get comprehensive analytics, recent content performance, and audience demographics before you reach out.',
    icon: BarChart3,
    color: 'from-purple-600 to-blue-500',
    mockup: (
      <div className="w-full h-64 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] p-6 shadow-xl flex gap-6 items-center">
        <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-base)] bg-gradient-to-tr from-emerald-400 to-teal-500 shrink-0"></div>
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-5 w-32 bg-[var(--bg-base)] rounded"></div>
          <div className="h-3 w-20 bg-[var(--bg-base)] rounded mb-2"></div>
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex flex-col items-center justify-center gap-1">
              <div className="h-3 w-8 bg-emerald-400/50 rounded"></div>
              <div className="h-2 w-12 bg-[var(--bg-base)] rounded"></div>
            </div>
            <div className="flex-1 h-12 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: 'Build your shortlist',
    description: 'Save creators to your list, persist them across sessions, and manage your outreach pipeline effortlessly.',
    icon: BookmarkPlus,
    color: 'from-purple-600 to-blue-500',
    mockup: (
      <div className="w-full h-64 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] shadow-xl flex overflow-hidden">
        <div className="w-2/3 bg-[var(--bg-base)] p-4 flex flex-col gap-3">
          <div className="h-16 rounded-lg border border-[var(--border)] flex items-center px-4 justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)]"></div>
              <div className="h-3 w-24 bg-[var(--bg-elevated)] rounded"></div>
            </div>
            <div className="h-8 w-20 rounded bg-orange-500/20 border border-orange-500/30"></div>
          </div>
        </div>
        <div className="w-1/3 bg-[var(--bg-elevated)] border-l border-[var(--border)] p-4 flex flex-col gap-4">
          <div className="h-4 w-20 bg-[var(--bg-base)] rounded"></div>
          <div className="h-12 bg-[var(--bg-base)] rounded-lg border border-[var(--border)]"></div>
          <div className="h-12 bg-[var(--bg-base)] rounded-lg border border-[var(--border)]"></div>
        </div>
      </div>
    )
  }
];

export function FeaturesPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.utils.toArray('.feature-section').forEach((section: any, index) => {
      const text = section.querySelector('.feature-text');
      const visual = section.querySelector('.feature-visual');
      const isEven = index % 2 !== 0;

      gsap.from(text, {
        x: isEven ? 40 : -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });

      gsap.from(visual, {
        x: isEven ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-[var(--bg-base)] pb-32">
      <div className="max-w-6xl mx-auto px-6 pt-32">
        <div className="text-center mb-32">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            Everything you need. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Nothing you don't.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            A streamlined experience designed to help you find and manage influencers without the bloat.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {features.map((feature, index) => (
            <div key={feature.id} className={`feature-section flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              
              <div className="feature-text flex-1 flex flex-col gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="feature-visual flex-1 w-full">
                <div className="relative group perspective">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${feature.color} blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`}></div>
                  {feature.mockup}
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-40 text-center flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-8">Wondering how this was made?</h2>
          <button
            onClick={() => {}} // Redirects later
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-black transition-colors shadow-xl hover:scale-105 active:scale-95 duration-200"
          >
            ℹ️ Info
          </button>
        </div>
      </div>
    </div>
  );
}
