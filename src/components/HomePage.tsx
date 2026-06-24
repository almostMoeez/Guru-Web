import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Flame,
  Leaf,
  ChefHat,
  Bike,
  Coffee,
  Clock,
  ArrowRight,
  Building2,
  Quote,
} from 'lucide-react';
import heroDishImage from '../assets/images/guru_hero_dish_1780074619455.png';
import { formatPKR } from '../lib/currency';
import { BRANCHES } from '../lib/config';

// Images cycled in the hero showcase slider.
const HERO_IMAGES = [
  heroDishImage,
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=900&auto=format&fit=crop',
];

interface HomePageProps {
  onExploreMenu: () => void;
  onFindUs: () => void;
  onViewStory: () => void;
  onChooseBranch: () => void;
  branchName: string | null;
}

// Shared scroll-reveal animation.
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const SIGNATURE_DISHES = [
  {
    name: 'Truffle Tenderloin',
    desc: 'Flame-kissed prime cut, bone-marrow butter, flaked sea salt.',
    price: 2250,
    tag: "Chef's Pick",
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Wild Mushroom Risotto',
    desc: 'Carnaroli rice, porcini broth, shaved pecorino, truffle oil.',
    price: 1450,
    img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Saffron Atlantic Salmon',
    desc: 'Crisp-skin filet, charred asparagus, saffron velouté.',
    price: 1950,
    img: 'https://images.unsplash.com/photo-1485921325814-1541884f14e2?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Gold Brew Mocha',
    desc: 'Double-shot espresso, micro-foam, real gold-leaf garnish.',
    price: 650,
    tag: 'Signature',
    img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
  },
];

const STATS = [
  { value: '4.9★', label: 'Avg Rating' },
  { value: '120+', label: 'Signature Dishes' },
  { value: '2', label: 'Lahore Branches' },
  { value: '25k+', label: 'Happy Guests' },
];

const EXPERIENCE = [
  { icon: Flame, title: 'Flame-Grilled to Order', desc: 'Every dish fired the moment you order — never before.' },
  { icon: Leaf, title: 'Farm-Fresh Daily', desc: 'Produce hand-picked each morning from local growers.' },
  { icon: ChefHat, title: 'Master Chefs', desc: 'Plates composed by award-winning culinary artists.' },
  { icon: Coffee, title: 'Artisan Coffee', desc: 'Single-origin beans, pulled to liquid-gold perfection.' },
  { icon: Bike, title: 'Swift Delivery', desc: 'Piping hot to your door, right across Lahore.' },
  { icon: Clock, title: 'Open Late', desc: 'Serving the city until midnight, every single night.' },
];

export default function HomePage({
  onExploreMenu,
  onFindUs,
  onViewStory,
  onChooseBranch,
  branchName,
}: HomePageProps) {
  const [slide, setSlide] = useState(0);

  // Auto-advance the hero slider.
  useEffect(() => {
    const id = setInterval(
      () => setSlide((s) => (s + 1) % HERO_IMAGES.length),
      3800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div id="home-page" className="bg-[#1c1c1c] text-zinc-100 overflow-hidden">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-[#141414] overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-primary-peach/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-primary-peach/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(230,126,34,0.08),transparent_55%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center pt-28 pb-16 lg:py-24">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] uppercase text-primary-peach mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-peach animate-pulse" />
              Guru · Lahore
            </span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95]">
              Where every
              <span className="block mt-2 bg-gradient-to-r from-primary-peach via-primary-peach-light to-primary-peach text-transparent bg-clip-text">
                bite tells a story
              </span>
            </h1>

            <p className="mt-7 text-sm md:text-base text-zinc-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              A modern kitchen and coffee house in the heart of Lahore — where
              flame-grilled flavour, artisan brews, and warm hospitality come
              together on every plate.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onExploreMenu}
                className="group w-full sm:w-auto px-8 py-4 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-[0.16em] rounded-full transition-all duration-300 hover:shadow-[0_0_35px_rgba(230,126,34,0.4)] hover:scale-105 active:scale-95 cursor-pointer uppercase flex items-center justify-center gap-2"
              >
                Explore Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <motion.button
                onClick={onFindUs}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white font-semibold text-xs tracking-[0.16em] rounded-full cursor-pointer uppercase"
              >
                Reserve a Table
              </motion.button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-primary-peach/20"
              />
              <div className="absolute inset-6 rounded-full overflow-hidden border border-white/10 shadow-2xl">
                <AnimatePresence>
                  <motion.img
                    key={slide}
                    src={HERO_IMAGES[slide]}
                    alt="Guru signature dish"
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1.18 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Slider dots */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === slide ? 'w-5 bg-primary-peach' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Floating info tags */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-4 top-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2.5"
              >
                <span className="w-7 h-7 rounded-full bg-primary-peach/20 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 text-primary-peach fill-primary-peach" />
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className="text-white text-sm font-bold leading-none">4.9</span>
                  <span className="text-[10px] text-zinc-400 font-light">Loved by 25k</span>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
                className="absolute -right-2 bottom-16 bg-black/50 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2.5"
              >
                <span className="w-7 h-7 rounded-full bg-primary-peach/20 flex items-center justify-center shrink-0">
                  <Flame className="w-3.5 h-3.5 text-primary-peach" />
                </span>
                <span className="text-[11px] text-zinc-200 font-medium">Flame-grilled fresh</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary-peach/60 to-transparent" />
        </div>
      </section>

      {/* ──────────────────── SIGNATURE DISHES ──────────────────── */}
      <section className="py-24 md:py-28 relative">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-peach/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...reveal} className="max-w-2xl mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-peach tracking-tight leading-tight">
              Signature Selection
            </h2>
            <p className="text-white text-base md:text-lg font-semibold tracking-wide mt-3">
              Dishes worth the journey
            </p>
            <p className="text-zinc-400 text-sm font-light mt-4 leading-relaxed">
              A handful of the plates our guests keep coming back for — each one
              built from the best of the season.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SIGNATURE_DISHES.map((dish, i) => (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                className="group bg-[#242424] border border-white/5 hover:border-primary-peach/20 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-zinc-950">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
                  {dish.tag && (
                    <span className="absolute top-3 left-3 bg-primary-peach text-black text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full">
                      {dish.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-primary-peach transition-colors leading-tight">
                      {dish.name}
                    </h3>
                    <span className="text-sm font-semibold text-primary-peach font-mono whitespace-nowrap">
                      {formatPKR(dish.price)}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-light leading-relaxed">{dish.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...reveal} className="mt-12 text-center">
            <button
              onClick={onExploreMenu}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-primary-peach/40 hover:border-primary-peach text-primary-peach hover:bg-primary-peach/10 font-semibold text-xs tracking-[0.16em] rounded-full transition-all duration-300 cursor-pointer uppercase"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── EXPERIENCE BENTO ──────────────────── */}
      <section className="py-24 bg-[#161616] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-peach tracking-tight">
              The Guru Experience
            </h2>
            <p className="text-white text-base md:text-lg font-semibold tracking-wide mt-3">
              More than a meal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXPERIENCE.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group bg-[#1c1c1c] border border-white/5 hover:border-primary-peach/20 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-peach/10 border border-primary-peach/15 flex items-center justify-center mb-5 group-hover:bg-primary-peach/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary-peach" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── STORY TEASER ──────────────────── */}
      <section className="py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop"
                alt="The Guru dining room"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Quote chip */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-[#242424] border border-white/10 rounded-2xl p-5 max-w-xs shadow-2xl">
              <Quote className="w-5 h-5 text-primary-peach mb-2" />
              <p className="text-zinc-300 text-xs font-light leading-relaxed italic">
                “The kind of place you come for the coffee and stay for the whole evening.”
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary-peach tracking-tight leading-tight">
              Our Story
            </h2>
            <p className="text-white text-base md:text-lg font-semibold tracking-wide mt-3">
              Born in Lahore, brewed with heart
            </p>
            <p className="text-zinc-400 text-sm md:text-base font-light mt-5 leading-relaxed">
              Guru began with a simple belief — that great food and great coffee
              should feel like coming home. From a single counter to two buzzing
              branches, we’ve stayed true to slow craft, bold flavour, and the
              warmth of Lahori hospitality.
            </p>
            <button
              onClick={onViewStory}
              className="group mt-8 inline-flex items-center gap-2 text-primary-peach font-semibold text-xs tracking-[0.16em] uppercase cursor-pointer"
            >
              Read our story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── BRANCHES ──────────────────── */}
      <section className="py-24 bg-[#161616] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-peach tracking-tight">
              Visit Us
            </h2>
            <p className="text-white text-base md:text-lg font-semibold tracking-wide mt-3">
              Two homes in Lahore
            </p>
            <p className="text-zinc-400 text-sm font-light mt-4">
              {branchName ? (
                <>
                  You’re currently ordering from{' '}
                  <span className="text-primary-peach font-semibold">{branchName}</span>.
                </>
              ) : (
                'Pick the outlet closest to you and start your order.'
              )}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {BRANCHES.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-[#1c1c1c] border border-white/5 hover:border-primary-peach/25 rounded-3xl p-8 overflow-hidden transition-all duration-300"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-peach/5 rounded-full blur-2xl group-hover:bg-primary-peach/10 transition-colors" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-primary-peach/10 border border-primary-peach/15 flex items-center justify-center mb-5">
                    <Building2 className="w-5 h-5 text-primary-peach" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{branch.name}</h3>
                  <p className="text-zinc-500 text-sm font-light mt-1">{branch.area}</p>
                  <div className="flex items-center gap-2 mt-4 text-zinc-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-primary-peach" />
                    12:00 PM – 12:00 AM, daily
                  </div>
                  <button
                    onClick={onChooseBranch}
                    className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/10 group-hover:border-primary-peach group-hover:bg-primary-peach group-hover:text-black text-white font-semibold text-[11px] tracking-[0.16em] rounded-full transition-all duration-300 cursor-pointer uppercase"
                  >
                    Order from here
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ──────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,126,34,0.12),transparent_60%)]" />
        <motion.div {...reveal} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Flame className="w-10 h-10 text-primary-peach mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[0.95]">
            Hungry already?
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-light mt-5 max-w-md mx-auto leading-relaxed">
            Your table — or your doorstep — is moments away. Dive into the full
            Guru menu and let the feast begin.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={onExploreMenu}
              className="group w-full sm:w-auto px-9 py-4 bg-primary-peach hover:bg-primary-peach-dark text-black font-bold text-xs tracking-[0.16em] rounded-full transition-all duration-300 hover:shadow-[0_0_35px_rgba(230,126,34,0.45)] hover:scale-105 active:scale-95 cursor-pointer uppercase flex items-center justify-center gap-2"
            >
              Order Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onFindUs}
              className="w-full sm:w-auto px-9 py-4 bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white font-semibold text-xs tracking-[0.16em] rounded-full transition-all duration-300 cursor-pointer uppercase"
            >
              Find Us
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
