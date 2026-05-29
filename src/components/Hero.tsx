import { motion } from 'motion/react';
import heroDishImage from '../assets/images/guru_hero_dish_1780074619455.png';

interface HeroProps {
  onExploreMenu: () => void;
  onFindUs: () => void;
}

export default function Hero({ onExploreMenu, onFindUs }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#090909]"
    >
      {/* Darkened Visual Image Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDishImage}
          alt="GURU Gourmet Swirled Dessert Dish"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 scale-105 pointer-events-none"
        />
        {/* Dynamic Multi-layered overlay for high-end luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-black/80" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Main Display Typography */}
          <h1 id="hero-title" className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-2 select-none leading-none">
            Brewed to
            <span className="block mt-2 bg-gradient-to-r from-primary-peach via-primary-peach-light to-primary-peach text-transparent bg-clip-text filter drop-shadow-md">
              Perfection
            </span>
          </h1>

          {/* Elegant descriptive copy */}
          <p id="hero-subtitle" className="mt-8 text-sm md:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
            Experience the finest blend of culinary passion, premium coffee, and
            sensational flavors right in the heart of Lahore. An ambiance designed for the
            discerning palate.
          </p>

          {/* Action Callouts */}
          <div id="hero-actions" className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto px-8 py-4 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-[0.16em] rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(205,143,125,0.4)] hover:scale-105 active:scale-95 cursor-pointer uppercase"
            >
              EXPLORE MENU
            </button>
            <button
              onClick={onFindUs}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white font-semibold text-xs tracking-[0.16em] rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase"
            >
              FIND US
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
