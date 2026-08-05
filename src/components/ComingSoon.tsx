import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';
import logoImg from '../assets/images/logo.png';

// Standalone full-screen "under construction" landing page.
// Rendered in place of <App /> (see main.tsx) while UNDER_CONSTRUCTION is on,
// so it deliberately matches the site theme but stands on its own — no header,
// footer, or any app chrome.
export default function ComingSoon() {
  useEffect(() => {
    document.title = 'Coming Soon — Guru';
  }, []);

  return (
    <div className="relative min-h-screen bg-[#141414] text-zinc-100 flex flex-col items-center justify-center overflow-hidden px-6 selection:bg-primary-peach selection:text-black">
      {/* ───────────── Atmospheric background (mirrors the hero) ───────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-primary-peach/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-primary-peach/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(230,126,34,0.12),transparent_55%)]" />
      </div>

      {/* ───────────────────── Center content ───────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Logo inside a slowly rotating dashed ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 -m-5 rounded-full border border-dashed border-primary-peach/25"
          />
          <div className="relative w-24 h-24 rounded-full bg-[#1c1c1c] border border-white/10 shadow-2xl flex items-center justify-center">
            <img
              src={logoImg}
              alt="Guru Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="inline-flex items-center gap-3 text-xl sm:text-2xl font-bold text-primary-peach tracking-tight mb-6"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-primary-peach animate-pulse" />
          Guru · Lahore
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95]"
        >
          <span className="block bg-gradient-to-r from-primary-peach via-primary-peach-light to-primary-peach text-transparent bg-clip-text">
            Coming Soon
          </span>
        </motion.h1>

        {/* Accent underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="h-[3px] w-28 rounded-full bg-primary-peach/60 mt-6 origin-center"
        />

        {/* Subtitle + body */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-7 text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-md"
        >
          Our website is under construction. We're crafting something special —
          flame-grilled flavour, artisan brews, and a whole new experience,
          coming your way very soon.
        </motion.p>

        {/* Indeterminate progress shimmer — a quiet "we're working" signal */}
        <div className="relative mt-10 h-1 w-56 max-w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            animate={{ x: ['-100%', '220%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-primary-peach to-transparent"
          />
        </div>

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400"
        >
          <Coffee className="w-3.5 h-3.5 text-primary-peach" />
          Brewing…
        </motion.div>
      </div>

      {/* ───────────────────── Footer line ───────────────────── */}
      <div className="relative z-10 mt-16 text-zinc-600 font-mono text-[10px] md:text-xs tracking-wider uppercase select-none text-center">
        © 2024 GURU. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
