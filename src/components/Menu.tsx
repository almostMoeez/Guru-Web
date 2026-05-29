import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface MenuProps {
  onAddToOrder: (item: MenuItem) => void;
  onIncrementItem: (itemId: string) => void;
  onDecrementItem: (itemId: string) => void;
  onRemoveAllByItemId: (itemId: string) => void;
  onOpenCustomizer: (item: MenuItem) => void;
  itemQuantities: Record<string, number>;
}

export default function Menu({
  onAddToOrder,
  onIncrementItem,
  onDecrementItem,
  onRemoveAllByItemId,
  onOpenCustomizer,
  itemQuantities,
}: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<'appetizers' | 'mains' | 'desserts' | 'drinks'>('appetizers');

  const categories = [
    { id: 'appetizers', label: 'APPETIZERS' },
    { id: 'mains', label: 'MAINS' },
    { id: 'desserts', label: 'DESSERTS' },
    { id: 'drinks', label: 'DRINKS' },
  ] as const;

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="menu-section" className="py-24 bg-[#0b0b0b] min-h-screen relative border-t border-white/5">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-peach/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="space-y-12">
          {/* Header copy exactly like the image */}
          <div id="menu-header" className="text-left max-w-2xl">
            <h2 className="text-5xl font-bold tracking-tight text-white mb-4 leading-none font-sans">
              Our Menu
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              A curated selection of premium culinary delights, crafted with passion and precision.
            </p>
          </div>

          {/* Category Navigation - Oval/Capsule shape pills */}
          <div id="category-tabs" className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 focus:outline-none cursor-pointer ${
                    isActive
                      ? 'bg-primary-peach text-black font-semibold shadow-lg shadow-primary-peach/10'
                      : 'bg-zinc-950 border border-white/5 text-zinc-400 hover:text-[#f3a082] hover:border-primary-peach/20'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Menu Grid Container with buttery-smooth category transitions */}
          <div id="menu-grid-container" className="relative">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              id="menu-grid"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredItems.map((item) => {
                const quantity = itemQuantities[item.id] || 0;
                const isAdded = quantity > 0;
                
                // If item id is 'a3' (Wagyu Beef Tartare), it spans double columns
                const isFeatured = item.id === 'a3';

                if (isFeatured) {
                  return (
                    <div
                      key={item.id}
                      className="md:col-span-2 bg-[#0c0c0c] border border-white/5 hover:border-primary-peach/15 rounded-3xl flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl relative overflow-hidden"
                    >
                        <div>
                          {/* Featured Large Image: Edge to Edge (Top, Left, Right) */}
                          <div className="w-full h-80 bg-zinc-950 relative overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-40" />
                          </div>

                          {/* Title & Badge */}
                          <div className="p-6 md:p-8 pb-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap justify-between">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary-peach transition-colors duration-300">
                                  {item.name}
                                </h3>
                                {item.badge && (
                                  <span className="bg-primary-peach/10 text-primary-peach text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded border border-primary-peach/10">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <span className="font-sans text-lg md:text-xl font-bold text-white">
                                ${item.price.toFixed(0)}
                              </span>
                            </div>
                            
                            <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Control Actions */}
                        <div className="p-6 md:p-8 pt-6">
                          {isAdded ? (
                            /* Interactive Quantity Control Layout */
                            <div className="flex items-center gap-4 bg-zinc-950 border border-white/5 rounded-full p-1 w-fit">
                              <button
                                onClick={() => onDecrementItem(item.id)}
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              
                              <span className="text-sm font-semibold font-mono text-white px-2">
                                {quantity} in basket
                              </span>
                              
                              <button
                                onClick={() => {
                                  if (item.customizable) {
                                    onOpenCustomizer(item);
                                  } else {
                                    onIncrementItem(item.id);
                                  }
                                }}
                                className="w-9 h-9 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="Add more"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              <div className="w-px h-6 bg-white/5" />

                              <button
                                onClick={() => onRemoveAllByItemId(item.id)}
                                className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 hover:border-rose-400 text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                                title="Remove from order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            /* Initial Add Actions */
                            <button
                              onClick={() => {
                                if (item.customizable) {
                                  onOpenCustomizer(item);
                                } else {
                                  onAddToOrder(item);
                                }
                              }}
                              className={`px-6 py-3 rounded-full flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer border ${
                                item.customizable
                                  ? 'bg-transparent border-primary-peach text-primary-peach hover:bg-primary-peach/10'
                                  : 'bg-transparent border-primary-peach/30 hover:border-primary-peach text-primary-peach hover:bg-primary-peach/5'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {item.customizable ? 'CUSTOMIZE' : 'ADD TO ORDER'}
                            </button>
                          )}
                        </div>
                    </div>
                    );
                  }

                  {/* Standard card layout with image Edge to Edge at Top, Left, Right */}
                  return (
                    <div
                      key={item.id}
                      className="bg-[#0c0c0c] border border-white/5 hover:border-primary-peach/15 rounded-3xl flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl relative overflow-hidden"
                    >
                      <div>
                        {/* Standard Image: Edge to Edge (Top, Left, Right) */}
                        <div className="w-full h-60 bg-zinc-950 relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/50 via-transparent to-transparent opacity-40" />
                        </div>

                        {/* Text content area with perfect text/button spacing */}
                        <div className="p-6 pb-0">
                          {/* Heading & Price adjacent row */}
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary-peach transition-colors duration-300 leading-tight">
                              {item.name}
                            </h3>
                            <span className="font-sans text-sm font-semibold text-zinc-350 shrink-0 mt-0.5">
                              ${item.price.toFixed(0)}
                            </span>
                          </div>

                          <p className="text-zinc-400 text-xs font-light leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Control Actions aligning beautifully */}
                      <div className="p-6 pt-6">
                        {isAdded ? (
                          /* Standard Item Quantity Control */
                          <div className="flex items-center gap-3.5 bg-zinc-950 border border-white/5 rounded-full p-1.5 w-fit">
                            <button
                              onClick={() => onDecrementItem(item.id)}
                              className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            
                            <span className="text-xs font-semibold font-mono text-white px-1">
                              {quantity}
                            </span>
                            
                            <button
                              onClick={() => {
                                if (item.customizable) {
                                  onOpenCustomizer(item);
                                } else {
                                  onIncrementItem(item.id);
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Add more"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-px h-5 bg-white/5" />

                            <button
                              onClick={() => onRemoveAllByItemId(item.id)}
                              className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 hover:border-rose-400 text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                              title="Remove from order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          /* Normal add button */
                          <button
                            onClick={() => {
                              if (item.customizable) {
                                onOpenCustomizer(item);
                              } else {
                                onAddToOrder(item);
                              }
                            }}
                            className={`px-5 py-2.5 rounded-full flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer border ${
                              item.customizable
                                ? 'bg-transparent border-primary-peach text-primary-peach hover:bg-primary-peach/10'
                                : 'bg-transparent border-primary-peach/30 hover:border-primary-peach text-primary-peach hover:bg-primary-peach/5'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5 shrink-0" />
                            {item.customizable ? 'CUSTOMIZE' : 'ADD TO ORDER'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
