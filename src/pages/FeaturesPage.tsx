import { useEffect, useRef } from 'react';

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { Music, Check, Search, X } from 'lucide-react';
import { SiInstagram as Instagram, SiYoutube as Youtube } from 'react-icons/si';

import { ScrambleText } from '@/components/ui/ScrambleText';
import { HoverAreaScramble } from '@/components/ui/HoverAreaScramble';
gsap.registerPlugin(SplitText, ScrollTrigger, TextPlugin);

export function FeaturesPage() {
  const container = useRef<HTMLDivElement>(null);


  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const splits: SplitText[] = [];

    if (reduced) {
      gsap.set([
        ".features-eyebrow",
        ".features-hero-heading",
        ".features-hero-sub",
        ".platform-card",
        ".feature-row"
      ], { opacity: 1, y: 0, x: 0, rotationX: 0 });
      return;
    }

    // SECTION 1 — HERO
    const heroHeadingLines = gsap.utils.toArray(".features-hero-heading .line");
    if (heroHeadingLines.length > 0) {
      const heroSplit = new SplitText(heroHeadingLines as HTMLElement[], { type: "chars" });
      splits.push(heroSplit);

      const tl = gsap.timeline();
      tl.from(".features-eyebrow", {
        opacity: 0, x: -20, duration: 0.5, ease: "power2.out"
      })
        .from(heroSplit.chars, {
          opacity: 0,
          y: 60,
          rotationX: -80,
          transformOrigin: "0% 50% -40px",
          stagger: { amount: 0.5, from: "start" },
          duration: 0.8,
          ease: "power4.out",
        }, "-=0.2")
        .from(".features-hero-sub", {
          opacity: 0, y: 20, duration: 0.5, ease: "power2.out"
        }, "-=0.2");
    }

    // SECTION 3 — FEATURE ROWS
    const isMobile = window.innerWidth < 768;
    gsap.utils.toArray(".feature-row").forEach((row: any, i) => {
      const textSide = row.querySelector(".row-text");
      const mockupSide = row.querySelector(".row-mockup");
      const isEven = i % 2 === 0;

      gsap.from(textSide, {
        scrollTrigger: { trigger: row, start: "top 72%", once: true },
        x: isMobile ? 0 : (isEven ? -50 : 50),
        y: isMobile ? 30 : 0,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      const eyebrow = textSide.querySelector(".row-eyebrow");
      gsap.from(eyebrow, {
        scrollTrigger: { trigger: row, start: "top 75%", once: true },
        opacity: 0,
        x: isMobile ? 0 : (isEven ? -20 : 20),
        duration: 0.5,
        ease: "power2.out",
      });

      const rowHeading = textSide.querySelector(".row-heading");
      const split = new SplitText(rowHeading, { type: "words" });
      splits.push(split);
      gsap.from(split.words, {
        scrollTrigger: { trigger: row, start: "top 72%", once: true },
        y: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.1,
      });

      const bullets = textSide.querySelectorAll(".feature-bullet");
      gsap.from(bullets, {
        scrollTrigger: { trigger: row, start: "top 65%", once: true },
        x: isMobile ? 0 : (isEven ? -20 : 20),
        opacity: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: "power2.out",
        delay: 0.3,
      });

      gsap.from(mockupSide, {
        scrollTrigger: { trigger: row, start: "top 72%", once: true },
        x: isMobile ? 0 : (isEven ? 50 : -50),
        y: isMobile ? 20 : 0,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.15,
      });
    });

    // Mockup specific animations
    gsap.timeline({
      scrollTrigger: { trigger: ".row-1-mockup", start: "top 70%", once: true }
    })
      .to(".row1-typing", {
        duration: 0.6, text: "@cristia", ease: "none"
      })
      .from(".row1-result", {
        opacity: 0, y: 10, stagger: 0.1, duration: 0.4,
        ease: "power2.out"
      }, "+=0.2");

    gsap.from(".browse-box-mockup", {
      scrollTrigger: { trigger: ".row-2-mockup", start: "top 72%", once: true },
      scale: 0.9,
      opacity: 0,
      stagger: 0.12,
      duration: 0.55,
      ease: "back.out(1.4)",
    });

    gsap.from(".list-row-mockup", {
      scrollTrigger: { trigger: ".row-3-mockup", start: "top 72%", once: true },
      x: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power3.out",
    });

    const statValues = [641300000, 1.21, 3289, 568];
    const statEls = gsap.utils.toArray(".profile-stat-value");
    statEls.forEach((el: any, i) => {
      const endVal = statValues[i];
      gsap.from({ val: 0 }, {
        scrollTrigger: {
          trigger: ".row-4-mockup",
          start: "top 72%",
          once: true
        },
        val: endVal,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: function (this: any) {
          const v = Math.round(this.targets()[0].val);
          if (i === 0) el.textContent = v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v.toLocaleString();
          else if (i === 1) el.textContent = this.targets()[0].val.toFixed(2) + "%";
          else el.textContent = v.toLocaleString();
        }
      });
    });



    return () => {
      splits.forEach(s => s.revert());
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: container });

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={container} className="bg-[var(--bg-base)] w-full overflow-hidden">
      {/* CSS from spec */}
      <style>{`
          .section-eyebrow {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--accent);
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section-eyebrow::before {
            content: '';
            display: block;
            width: 28px;
            height: 1px;
            background-color: var(--accent);
          }
          .section-heading {
            font-family: 'Syne', sans-serif;
            font-weight: 800;
            font-size: clamp(40px, 6vw, 80px);
            line-height: 0.95;
            letter-spacing: -0.03em;
            color: var(--text-primary);
          }
          .section-subheading {
            font-family: 'Syne', sans-serif;
            font-weight: 700;
            font-size: clamp(22px, 3vw, 36px);
            line-height: 1.1;
            letter-spacing: -0.02em;
            color: var(--text-secondary);
          }
          .body-text {
            font-family: 'Inter', sans-serif;
            font-weight: 300;
            font-size: 16px;
            line-height: 1.75;
            color: var(--text-muted);
          }
          @media (max-width: 768px) {
            .body-text { font-size: 14px; }
          }
          .feature-card-heading {
            font-family: 'Syne', sans-serif;
            font-weight: 700;
            font-size: 22px;
            color: var(--text-primary);
          }
          .stroked-text {
            -webkit-text-stroke: 1.5px #f0f0ff;
            color: transparent;
          }
          .line-wrapper {
            overflow: hidden;
            padding-bottom: 5px; /* Prevent clipping during animation */
          }
          .platform-card {
            background: var(--bg-elevated);
            border-radius: 20px;
            padding: 32px 28px;
            position: relative;
            overflow: hidden;
            cursor: default;
            transition: all 0.25s ease;
          }
          .platform-card:hover {
            transform: translateY(-6px);
          }
          @media (max-width: 480px) {
            .platform-card { padding: 20px; }
            .section-heading { font-size: clamp(28px, 8vw, 40px); }
            .hero-heading { font-size: clamp(36px, 10vw, 56px); }
          }
          .glass-mockup {
            background: rgba(35, 35, 45, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 20px;
            box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.03), 0 0 40px rgba(124,58,237,0.1);
          }
          .gradient-heading-line, .gradient-heading-line > div {
            background-image: linear-gradient(to right, #c084fc, #3b82f6) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            color: transparent !important;
          }
       `}</style>

      {/* SECTION 1 — HERO INTRO */}
      <section className="pt-[100px] pb-[100px] md:pt-[120px] px-4 md:px-0 text-center flex flex-col items-center max-w-4xl mx-auto">
        <div className="section-eyebrow features-eyebrow justify-center mb-6" style={{ fontSize: '18px' }}>
          <span style={{ backgroundImage: 'linear-gradient(to right, #c084fc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }}>WHAT SEARCHIFY DOES</span>
        </div>
        <h2 className="section-heading hero-heading features-hero-heading mb-6 flex flex-col items-center" style={{ gap: '4px' }}>
          <div className="line-wrapper"><div className="line text-[#f0f0ff] uppercase" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 10vw, 130px)', lineHeight: 0.92, letterSpacing: '-0.04em' }}>FIND</div></div>
          <div className="line-wrapper">
            <div className="line uppercase gradient-heading-line" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 10vw, 130px)', lineHeight: 0.92, letterSpacing: '-0.04em' }}>CREATORS</div>
          </div>
          <div className="line-wrapper"><div className="line text-[#f0f0ff] uppercase" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 10vw, 130px)', lineHeight: 0.92, letterSpacing: '-0.04em' }}>THAT</div></div>
          <div className="line-wrapper">
            <div className="line uppercase gradient-heading-line" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 10vw, 130px)', lineHeight: 0.92, letterSpacing: '-0.04em' }}>DELIVER.</div>
          </div>
        </h2>
        <p className="features-hero-sub max-w-[760px] mx-auto text-[22px] md:text-[28px] font-['Plus_Jakarta_Sans'] font-light text-[#d4d4e4] leading-relaxed tracking-wide mt-6">
          <ScrambleText text="One platform. Three networks. Infinite possibilities." delay={0} /><br className="hidden sm:block" />
          <ScrambleText text="Stop switching between apps to find the right influencer." delay={0.4} />
        </p>
      </section>


      {/* SECTION 3 — FEATURE ROWS */}
      <section className="py-[60px] md:py-[100px] px-4 md:px-8 max-w-6xl mx-auto flex flex-col gap-[100px] md:gap-[160px]">


        {/* Row 1 — Unified Search */}
        <div className="feature-row flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full">
          <div className="row-text flex-1 flex flex-col items-start w-full">
            <div className="section-eyebrow row-eyebrow mb-6">
              <span style={{ backgroundImage: 'linear-gradient(to right, #c084fc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }}>01 — UNIFIED SEARCH</span>
            </div>
            <h3 className="section-subheading row-heading mb-6 whitespace-pre-line">{"One search.\nEvery platform."}</h3>
            <ul className="flex flex-col gap-6 mt-4">
              {["Search by username or full name", "Lightning-fast results appear as you type", "Find creators across all platforms in one place"].map((item, idx) => (
                <li key={idx} className="feature-bullet flex items-start gap-4">
                  <Check className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                  <span className="font-['Plus_Jakarta_Sans'] font-light text-[17px] md:text-[20px] text-[#d4d4e4] leading-snug">
                    <HoverAreaScramble text={item} scrambleColor="#f472b6" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="row-mockup row-1-mockup flex-1 w-full flex justify-center md:justify-end">
            {/* Cover-style Mockup */}
            <div className="glass-mockup w-full max-w-[420px] p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#7c3aed] rounded-full flex items-center justify-center text-xs font-bold text-white font-['Plus_Jakarta_Sans']">S</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-white font-['Plus_Jakarta_Sans']">@searchify</span>
                  <span className="text-[11px] text-[#4a4a6a] font-['Plus_Jakarta_Sans']">Influencer Search</span>
                </div>
                <div className="ml-auto text-[#4a4a6a] text-lg leading-none tracking-widest">&middot;&middot;&middot;</div>
              </div>

              <div className="mt-4 w-full h-[44px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] flex items-center gap-[10px] px-[14px]">
                <Search size={16} color="#4a4a6a" />
                <span className="row1-typing text-[14px] text-white font-['Plus_Jakarta_Sans']"></span>
                <span className="cursor" style={{ animation: 'blink 1s step-end infinite', color: '#7c3aed' }}>|</span>
              </div>

              <div className="mt-3 flex flex-col gap-[2px]">
                <div className="row1-result px-3 py-2.5 rounded-[10px] flex items-center gap-3">
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

                <div className="row1-result px-3 py-2.5 rounded-[10px] flex items-center gap-3">
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

                <div className="row1-result px-3 py-2.5 rounded-[10px] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: '#69c9d0' }}>
                    <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[13px] font-bold text-[#f0f0ff] font-['Plus_Jakarta_Sans']">@charli</div>
                    <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] flex items-center">
                      Charli D'Amelio
                      <span className="text-[10px] px-2 py-0.5 rounded-full ml-2" style={{ background: 'rgba(105,201,208,0.15)', color: '#69c9d0' }}>TikTok</span>
                    </div>
                  </div>
                  <div className="text-[12px] text-[#4a4a6a] font-['Plus_Jakarta_Sans'] ml-auto">151.0M</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — Platform Browse (Text RIGHT, Mockup LEFT -> md:flex-row-reverse) */}
        <div className="feature-row flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 w-full">
          <div className="row-text flex-1 flex flex-col items-start w-full">
            <div className="section-eyebrow row-eyebrow mb-6">
              <span style={{ backgroundImage: 'linear-gradient(to right, #c084fc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }}>02 — PLATFORM EXPLORER</span>
            </div>
            <h3 className="section-subheading row-heading mb-6 whitespace-pre-line">{"Go deep on\neach platform."}</h3>
            <ul className="flex flex-col gap-6 mt-4">
              {["Dedicated hubs for TikTok, YouTube & Instagram", "Seamlessly browse through creator profiles", "Instant updates without reloading the page"].map((item, idx) => (
                <li key={idx} className="feature-bullet flex items-start gap-4">
                  <Check className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                  <span className="font-['Plus_Jakarta_Sans'] font-light text-[17px] md:text-[20px] text-[#d4d4e4] leading-snug">
                    <HoverAreaScramble text={item} scrambleColor="#f472b6" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="row-mockup row-2-mockup flex-1 w-full flex flex-col gap-4 max-w-[420px] mx-auto md:mx-0">
            {/* Browse Boxes */}
            <div className="browse-box-mockup flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[rgba(225,48,108,0.3)] shadow-[0_4px_20px_rgba(225,48,108,0.1)] hover:shadow-[0_4px_20px_rgba(225,48,108,0.2)] transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(225,48,108,0.15)]">
                  <Instagram className="w-5 h-5 text-[#e1306c]" />
                </div>
                <span className="font-['Syne'] font-bold text-lg text-white">Instagram</span>
              </div>
              <span className="font-['Inter'] text-sm text-[var(--text-muted)] group-hover:text-white transition-colors">Explore &rarr;</span>
            </div>

            <div className="browse-box-mockup flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[rgba(255,0,0,0.3)] shadow-[0_4px_20px_rgba(255,0,0,0.1)] hover:shadow-[0_4px_20px_rgba(255,0,0,0.2)] transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(255,0,0,0.15)]">
                  <Youtube className="w-5 h-5 text-[#ff0000]" />
                </div>
                <span className="font-['Syne'] font-bold text-lg text-white">YouTube</span>
              </div>
              <span className="font-['Inter'] text-sm text-[var(--text-muted)] transition-colors">Explore &rarr;</span>
            </div>

            <div className="browse-box-mockup flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[rgba(105,201,208,0.3)] shadow-[0_4px_20px_rgba(105,201,208,0.1)] hover:shadow-[0_4px_20px_rgba(105,201,208,0.2)] transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(105,201,208,0.15)]">
                  <Music className="w-5 h-5 text-[#69c9d0]" />
                </div>
                <span className="font-['Syne'] font-bold text-lg text-white">TikTok</span>
              </div>
              <span className="font-['Inter'] text-sm text-[var(--text-muted)] transition-colors">Explore &rarr;</span>
            </div>
          </div>
        </div>

        {/* Row 3 — Saved List */}
        <div className="feature-row flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full">
          <div className="row-text flex-1 flex flex-col items-start w-full">
            <div className="section-eyebrow row-eyebrow mb-6">
              <span style={{ backgroundImage: 'linear-gradient(to right, #c084fc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }}>03 — YOUR SHORTLIST</span>
            </div>
            <h3 className="section-subheading row-heading mb-6 whitespace-pre-line">{"Save creators.\nBuild campaigns."}</h3>
            <ul className="flex flex-col gap-6 mt-4">
              {["Save your favorite creators in one click", "Your list stays saved even if you close the tab", "Organize and manage your campaign roster easily"].map((item, idx) => (
                <li key={idx} className="feature-bullet flex items-start gap-4">
                  <Check className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                  <span className="font-['Plus_Jakarta_Sans'] font-light text-[17px] md:text-[20px] text-[#d4d4e4] leading-snug">
                    <HoverAreaScramble text={item} scrambleColor="#f472b6" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="row-mockup row-3-mockup flex-1 w-full flex justify-center md:justify-end">
            <div className="w-full max-w-[360px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]">
                <h4 className="font-['Syne'] font-bold text-xl text-white">My List</h4>
                <div className="px-3 py-1 bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] text-xs font-bold rounded-full">3 saved</div>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="list-row-mockup flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[rgba(255,255,255,0.03)] group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
                      <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">@cristiano</span>
                      <span className="text-xs text-[var(--text-muted)] font-['Plus_Jakarta_Sans']">Cristiano Ronaldo</span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="list-row-mockup flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[rgba(255,255,255,0.03)] group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full p-[2px] bg-[#ff0000]">
                      <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">@mrbeast</span>
                      <span className="text-xs text-[var(--text-muted)] font-['Plus_Jakarta_Sans']">MrBeast</span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="list-row-mockup flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[rgba(255,255,255,0.03)] group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full p-[2px] bg-[#69c9d0]">
                      <div className="w-full h-full bg-[#1a1a24] rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">@selenagomez</span>
                      <span className="text-xs text-[var(--text-muted)] font-['Plus_Jakarta_Sans']">Selena Gomez</span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 pt-2 flex justify-end">
                <span className="text-xs font-['Inter'] text-red-400/70 hover:text-red-400 cursor-pointer transition-colors">Clear All</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4 — Creator Profiles (Text RIGHT, Mockup LEFT) */}
        <div className="feature-row flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 w-full">
          <div className="row-text flex-1 flex flex-col items-start w-full">
            <div className="section-eyebrow row-eyebrow mb-6">
              <span style={{ backgroundImage: 'linear-gradient(to right, #c084fc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }}>04 — DEEP PROFILES</span>
            </div>
            <h3 className="section-subheading row-heading mb-6 whitespace-pre-line">{"Every stat\nthat matters."}</h3>
            <ul className="flex flex-col gap-6 mt-4">
              {["Followers, engagement, post count", "Platform-specific analytics"].map((item, idx) => (
                <li key={idx} className="feature-bullet flex items-start gap-4">
                  <Check className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                  <span className="font-['Plus_Jakarta_Sans'] font-light text-[20px] md:text-[24px] text-[#d4d4e4] leading-snug">
                    <HoverAreaScramble text={item} scrambleColor="#f472b6" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="row-mockup row-4-mockup flex-1 w-full max-w-[420px] mx-auto md:mx-0">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Followers", id: "stat-followers" },
                { label: "Engagement", id: "stat-eng" },
                { label: "Posts", id: "stat-posts" },
                { label: "Following", id: "stat-following" }
              ].map((stat, i) => (
                <div key={i} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[14px] p-5 flex flex-col justify-center">
                  <div className="font-['Inter'] text-[11px] uppercase text-[var(--text-muted)] tracking-wider mb-2">{stat.label}</div>
                  <div className="profile-stat-value font-['Syne'] font-bold text-[28px] text-[var(--text-primary)] leading-none">0</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>



    </div>
  );
}
