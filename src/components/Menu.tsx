import { useEffect, useRef, useState } from 'react';
import { Plus, Minus, Trash2, Loader2, AlertCircle, RefreshCw, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem, MenuCategoryGroup } from '../types';
import { formatPKR } from '../lib/currency';
import { FALLBACK_IMAGE } from '../lib/mappers';

interface MenuProps {
  groups: MenuCategoryGroup[];
  loading: boolean;
  loadingHint: string | null;
  error: string | null;
  onReload: () => void;
  onAddToOrder: (item: MenuItem) => void;
  onIncrementItem: (itemId: string) => void;
  onDecrementItem: (itemId: string) => void;
  onRemoveAllByItemId: (itemId: string) => void;
  onOpenCustomizer: (item: MenuItem) => void;
  itemQuantities: Record<string, number>;
  branchName: string | null;
  onChangeBranch: () => void;
}

// Vertical offset (px) the fixed header + sticky tab bar occupy. Used for
// scroll-spy detection and to land headings just below the bar.
const SCROLL_OFFSET = 150;

export default function Menu({
  groups,
  loading,
  loadingHint,
  error,
  onReload,
  onAddToOrder,
  onIncrementItem,
  onDecrementItem,
  onRemoveAllByItemId,
  onOpenCustomizer,
  itemQuantities,
  branchName,
  onChangeBranch,
}: MenuProps) {
  const [activeGroup, setActiveGroup] = useState<string>('');
  // Which directions the category tab bar can still scroll (drives the arrows).
  const [tabOverflow, setTabOverflow] = useState({ left: false, right: false });

  const groupRefs = useRef<Record<string, HTMLElement | null>>({});
  const subcatRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  // Set while a click-to-scroll is animating, so the scroll-spy doesn't fight it.
  const isClickScrolling = useRef(false);
  const scrollRaf = useRef<number>(0);

  // Track whether the tab bar overflows left/right, to show scroll arrows.
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const update = () => {
      const max = bar.scrollWidth - bar.clientWidth;
      setTabOverflow({ left: bar.scrollLeft > 2, right: bar.scrollLeft < max - 2 });
    };
    update();
    bar.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      bar.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [groups]);

  const scrollTabs = (dir: -1 | 1) => {
    const bar = tabBarRef.current;
    if (!bar) return;
    bar.scrollBy({ left: dir * bar.clientWidth * 0.7, behavior: 'smooth' });
  };

  // Default to (or keep a valid) active group as data loads.
  useEffect(() => {
    if (groups.length === 0) return;
    setActiveGroup((current) =>
      groups.some((g) => g.id === current) ? current : groups[0].id,
    );
  }, [groups]);

  // Scroll-spy: highlight the group whose section is currently in view.
  useEffect(() => {
    if (groups.length === 0) return;

    let frame = 0;
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const atBottom =
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
        if (atBottom) {
          setActiveGroup(groups[groups.length - 1].id);
          return;
        }

        let current = groups[0].id;
        for (const group of groups) {
          const el = groupRefs.current[group.id];
          if (!el) continue;
          if (el.getBoundingClientRect().top - SCROLL_OFFSET <= 1) {
            current = group.id;
          }
        }
        setActiveGroup(current);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [groups]);

  useEffect(() => () => cancelAnimationFrame(scrollRaf.current), []);

  // Keep the active tab centered within the horizontal strip.
  useEffect(() => {
    const bar = tabBarRef.current;
    const tab = activeGroup ? tabRefs.current[activeGroup] : null;
    if (!bar || !tab) return;
    bar.scrollTo({
      left: Math.max(0, tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2),
      behavior: 'smooth',
    });
  }, [activeGroup]);

  // Custom rAF smooth scroll — reliable across browsers.
  const animateScrollTo = (targetY: number, duration = 650) => {
    cancelAnimationFrame(scrollRaf.current);
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let startTime: number | null = null;
    isClickScrolling.current = true;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (progress < 1) scrollRaf.current = requestAnimationFrame(step);
      else isClickScrolling.current = false;
    };
    scrollRaf.current = requestAnimationFrame(step);
  };

  const scrollToEl = (el: HTMLElement | null) => {
    if (!el) return;
    animateScrollTo(el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET);
  };

  const handleTabClick = (groupId: string) => {
    setActiveGroup(groupId);
    scrollToEl(groupRefs.current[groupId]);
  };

  const handleSubcatClick = (groupId: string, subId: string) => {
    setActiveGroup(groupId);
    scrollToEl(subcatRefs.current[subId]);
  };

  const renderItemCard = (item: MenuItem) => {
    const quantity = itemQuantities[item.id] || 0;
    const isAdded = quantity > 0;

    return (
      <div
        key={item.id}
        className="bg-[#242424] border border-white/5 hover:border-primary-peach/15 rounded-3xl flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl relative overflow-hidden"
      >
        <div>
          <div className="w-full h-36 sm:h-44 lg:h-52 bg-zinc-950 relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/50 via-transparent to-transparent opacity-40" />
            {/* Tag pills — same style/position as the homepage signature cards. */}
            {item.tags && item.tags.length > 0 && (
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 items-start">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-peach text-black text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4 lg:p-5 pb-0 sm:pb-0 lg:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-primary-peach transition-colors duration-300 leading-tight">
                  {item.name}
                </h3>
                {item.badge && (
                  <span className="bg-primary-peach/10 text-primary-peach text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded border border-primary-peach/10">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="font-sans text-xs sm:text-sm font-bold text-primary-peach shrink-0 sm:mt-0.5 whitespace-nowrap">
                {formatPKR(item.price)}
              </span>
            </div>

            <p className="text-zinc-400 text-[11px] sm:text-xs font-light leading-relaxed line-clamp-2 lg:line-clamp-3">
              {item.description}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-5 pt-3 sm:pt-4">
          {isAdded ? (
            <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-3.5 bg-zinc-950 border border-white/5 rounded-full p-1 sm:p-1.5 w-full sm:w-fit">
              <button
                onClick={() => onDecrementItem(item.id)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold font-mono text-white px-0.5 sm:px-1">{quantity}</span>
              <button
                onClick={() => {
                  if (item.customizable) onOpenCustomizer(item);
                  else onIncrementItem(item.id);
                }}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Add more"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <div className="hidden sm:block w-px h-5 bg-white/5" />
              <button
                onClick={() => onRemoveAllByItemId(item.id)}
                className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 hover:border-rose-400 text-rose-400 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Remove from order"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (item.customizable) onOpenCustomizer(item);
                else onAddToOrder(item);
              }}
              className={`w-full sm:w-auto px-3 sm:px-5 py-2.5 rounded-full flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer border ${
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
  };

  const itemsGrid = (list: MenuItem[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {list.map(renderItemCard)}
    </div>
  );

  const groupItemCount = (group: MenuCategoryGroup) =>
    group.subcategories.reduce((sum, sub) => sum + sub.items.length, 0);

  // overflow-x-clip: the decorative blur blob extends past the viewport on
  // small screens, which widens the mobile layout viewport (page pans
  // sideways, fixed header outgrows the screen). `clip` doesn't create a
  // scroll container, so the sticky tab strip keeps working.
  return (
    <section
      id="menu-section"
      className="pb-24 bg-[#1c1c1c] min-h-screen relative border-t border-white/5 overflow-x-clip"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-peach/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header copy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-12 sm:pt-24">
        <div id="menu-header" className="text-left max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-none font-sans">
            Our Menu
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed font-light">
            A curated selection of premium culinary delights, crafted with passion and precision.
          </p>

          {/* Current branch indicator */}
          <button
            onClick={onChangeBranch}
            className="mt-6 inline-flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-zinc-950 border border-white/5 hover:border-primary-peach/30 transition-all cursor-pointer group"
          >
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-peach shrink-0" />
            <span className="text-sm sm:text-base text-zinc-300">
              {branchName ? (
                <>
                  Ordering from{' '}
                  <span className="text-white font-bold">{branchName}</span>
                </>
              ) : (
                'Select a branch'
              )}
            </span>
            <span className="text-primary-peach text-xs font-bold uppercase tracking-wider ml-2 group-hover:text-primary-peach-light">
              Change
            </span>
          </button>
        </div>
      </div>

      {/* Sticky underline tab strip — top-level category groups */}
      {groups.length > 0 && (
        <div className="sticky top-[64px] md:top-[78px] z-30 bg-[#1c1c1c]/95 backdrop-blur-md border-b border-white/10 mt-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative">
              <div
                ref={tabBarRef}
                id="category-tabs"
                className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {groups.map((group) => {
                  const active = activeGroup === group.id;
                  return (
                    <button
                      key={group.id}
                      ref={(el) => {
                        tabRefs.current[group.id] = el;
                      }}
                      onClick={() => handleTabClick(group.id)}
                      className={`shrink-0 my-2.5 px-4 sm:px-6 py-3 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase whitespace-nowrap transition-all focus:outline-none cursor-pointer ${
                        active
                          ? 'bg-primary-peach text-black shadow-lg shadow-primary-peach/10'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {group.name}
                    </button>
                  );
                })}
              </div>
              {tabOverflow.left && (
                <>
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#1c1c1c] to-transparent" />
                  <button
                    onClick={() => scrollTabs(-1)}
                    aria-label="Scroll categories left"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#1c1c1c]/90 border border-white/10 text-zinc-300 hover:text-white hover:border-primary-peach/40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              )}
              {tabOverflow.right && (
                <>
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#1c1c1c] to-transparent" />
                  <button
                    onClick={() => scrollTabs(1)}
                    aria-label="Scroll categories right"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#1c1c1c]/90 border border-white/10 text-zinc-300 hover:text-white hover:border-primary-peach/40 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 text-center gap-4">
            <Loader2 className="w-8 h-8 text-primary-peach animate-spin" />
            <div>
              <p className="text-zinc-400 text-sm font-light">
                {loadingHint ?? 'Loading our menu…'}
              </p>
              {loadingHint && (
                <p className="text-zinc-600 text-xs mt-2 font-mono">
                  If this persists, make sure the API is running and reachable.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-300 text-sm font-semibold">Couldn’t load the menu</p>
              <p className="text-zinc-500 text-xs mt-1 max-w-sm">{error}</p>
            </div>
            <button
              onClick={onReload}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 border border-white/10 hover:border-primary-peach/40 text-zinc-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-zinc-400 text-sm font-semibold">No items here yet</p>
            <p className="text-zinc-600 text-xs mt-1">
              The menu doesn’t have any dishes at the moment.
            </p>
          </div>
        )}

        {/* Category groups, each with subcategory pills + sections */}
        {!loading && !error && groups.length > 0 && (
          <div className="space-y-16 pt-12">
            {groups.map((group) => {
              const multiSub = group.subcategories.length > 1;
              return (
                <section
                  key={group.id}
                  ref={(el) => {
                    groupRefs.current[group.id] = el;
                  }}
                  className="scroll-mt-[150px]"
                >
                  {/* Group heading */}
                  <div className="flex items-baseline justify-between gap-4 mb-6 pb-3 border-b border-white/5">
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {group.name}
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                      {groupItemCount(group)} items
                    </span>
                  </div>

                  {/* Subcategory pills (only when there's more than one) */}
                  {multiSub && (
                    <div className="flex flex-wrap gap-2 mb-9">
                      {group.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcatClick(group.id, sub.id)}
                          className="px-5 py-2 rounded-full text-xs font-semibold tracking-[0.08em] uppercase bg-zinc-950 border border-white/5 text-zinc-300 hover:text-primary-peach hover:border-primary-peach/40 transition-all cursor-pointer"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {multiSub ? (
                    <div className="space-y-12">
                      {group.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          ref={(el) => {
                            subcatRefs.current[sub.id] = el;
                          }}
                          className="scroll-mt-[150px]"
                        >
                          <div className="flex items-baseline justify-between gap-4 mb-5">
                            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-peach" />
                              {sub.name}
                            </h4>
                            <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                              {sub.items.length} {sub.items.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                          {itemsGrid(sub.items)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single subcategory → render its items directly.
                    itemsGrid(group.subcategories[0]?.items ?? [])
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
