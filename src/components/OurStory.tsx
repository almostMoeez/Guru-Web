import { motion } from 'motion/react';
import { Droplet, Thermometer } from 'lucide-react';

export default function OurStory() {
  return (
    <div className="bg-[#1c1c1c] min-h-screen text-zinc-100 font-sans selection:bg-primary-peach selection:text-black">
      
      {/* 1. HERO BANNER: BREWED TO PERFECTION */}
      <section className="relative min-h-[65vh] py-20 flex items-center justify-center overflow-hidden">
        {/* Extreme close-up crema/pour background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1600&auto=format&fit=crop"
            alt="Brewed to Perfection crema"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          {/* Symmetrical dark vignettes */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c] via-transparent to-[#1c1c1c] opacity-90" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-1"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans uppercase">
              Brewed to
            </h1>
            <h2 className="text-5xl sm:text-7xl md:text-8xl italic font-serif text-primary-peach font-light leading-none">
              Perfection
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-zinc-350 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed"
          >
            Experience the finest blend of culinary passion, premium coffee, and sensational flavors right in the heart of the city. A journey of taste, crafted for the discerning palate.
          </motion.p>
        </div>
      </section>

      {/* 2. HERITAGE COLUMN: A LEGACY OF ARTISANAL EXCELLENCE */}
      <section className="py-14 md:py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Single clean brand image constraint */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main high-quality roasted beans showcase image */}
            <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-950">
              <img
                src="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=800&auto=format&fit=crop"
                alt="Roasted Gourmet Coffee Beans"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-75 contrast-110"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          </div>

          {/* Copy columns matching screenshots exactly */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-white font-extrabold text-2xl tracking-tight uppercase">guru</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary-peach" />
            </div>

            <div className="space-y-2">
              <div className="w-10 h-px bg-primary-peach mb-2" />
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.25em] block">
                OUR HERITAGE
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans leading-none">
                A Legacy of<br />Artisanal Excellence.
              </h3>
            </div>

            <div className="space-y-4 max-w-2xl text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              <p>
                Guru was born from a simple yet profound belief: that dining should be an immersive sensory experience. We began our journey decades ago, traveling to remote coffee estates and hidden culinary gems to understand the true essence of flavor.
              </p>
              <p>
                Our founders, driven by an uncompromising pursuit of quality, established a sanctuary where traditional techniques meet contemporary innovation. Every cup poured and every plate served is a testament to this enduring philosophy.
              </p>
            </div>

            {/* Stat Counters block */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 max-w-md">
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">1998</span>
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block">Established</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">15+</span>
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block">Partner Estates</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BENTO PHILOSOPHY GRID: THE ART OF BREWING */}
      <section className="py-14 md:py-24 bg-[#141414] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-10 md:space-y-14">
          
          {/* Header centered */}
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-primary-peach text-[10px] font-semibold tracking-[0.2em] uppercase">
              PHILOSOPHY
            </span>
            <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-none">
              The Art of Brewing
            </h3>
          </div>

          {/* Bento boxes layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* CARD 1: PRECISION WATER */}
            <div className="md:col-span-4 bg-[#242424] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-primary-peach/15 transition-all duration-300 flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center text-primary-peach">
                  <Droplet className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white tracking-tight">Precision Water</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    We utilize advanced reverse osmosis filtration to achieve the perfect mineral balance, ensuring clean extraction and vibrant acidity in every brew.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: METICULOUS EXTRACTION */}
            <div className="md:col-span-8 relative aspect-[16/9] md:aspect-auto rounded-2xl overflow-hidden border border-white/5 group bg-black/60">
              <img
                src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop"
                alt="Meticulous Extraction drip coffee"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/10" />
              
              <div className="absolute bottom-0 inset-x-0 p-8 space-y-1 z-10">
                <h4 className="text-xl font-bold text-white tracking-tight">Meticulous Extraction</h4>
                <p className="text-zinc-350 text-xs font-light leading-relaxed max-w-lg">
                  Time, temperature, and technique align perfectly in our slow-bar process.
                </p>
              </div>
            </div>

            {/* CARD 3: PRESSURE PROFILING */}
            <div className="md:col-span-8 relative aspect-[16/9] md:aspect-auto rounded-2xl overflow-hidden border border-white/5 group bg-black/60 min-h-[220px]">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
                alt="Pressure Profiling rich cream"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/10" />

              <div className="absolute bottom-0 inset-x-0 p-8 space-y-1 z-10">
                <h4 className="text-xl font-bold text-white tracking-tight">Pressure Profiling</h4>
                <p className="text-zinc-350 text-xs font-light leading-relaxed max-w-lg">
                  Our bespoke espresso machines allow for nuanced pressure adjustments, drawing out hidden sweetness.
                </p>
              </div>
            </div>

            {/* CARD 4: THERMAL STABILITY */}
            <div className="md:col-span-4 bg-[#242424] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-primary-peach/15 transition-all duration-300 flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center text-primary-peach">
                  <Thermometer className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white tracking-tight">Thermal Stability</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    Maintaining a consistent temperature to the fraction of a degree is paramount to preserving the delicate flavor notes of our single-origin roasts.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
