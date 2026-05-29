import { useState, useEffect } from 'react';
import { ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';

interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Header({ onCartClick, cartCount, activeSection, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'home', label: 'HOME' },
    { id: 'menu', label: 'MENU' },
    { id: 'story', label: 'OUR STORY' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0b0b]/90 backdrop-blur-md border-b border-white/5 py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          id="header-logo"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-3xl font-extrabold tracking-tight text-white select-none transition-colors duration-300 group-hover:text-primary-peach">
            guru
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary-peach inline-block mt-3"></span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-12">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className="relative py-2 text-xs font-semibold tracking-[0.2em] transition-colors focus:outline-none"
            >
              <span className={activeSection === item.id ? 'text-primary-peach' : 'text-zinc-400 hover:text-[#f3a082]'}>
                {item.label}
              </span>
              {activeSection === item.id && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary-peach rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div id="header-actions" className="flex items-center gap-4">
          <button
            id="cart-trigger-btn"
            onClick={onCartClick}
            className="p-2.5 rounded-full hover:bg-white/5 text-zinc-300 hover:text-white relative transition-all"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-peach text-black font-extrabold text-[10px] w-5.5 h-5.5 flex items-center justify-center rounded-full border-2 border-[#0b0b0b]">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="order-now-btn"
            onClick={() => handleLinkClick('menu')}
            className="hidden sm:inline-flex px-6 py-2.5 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-wider rounded-full transition-all uppercase duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            ORDER NOW
          </button>

          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden fixed inset-0 top-[60px] bg-[#0b0b0b] z-40 border-t border-white/5 flex flex-col px-8 py-12 gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`text-left py-2 text-lg font-medium tracking-widest border-b border-white/5 transition-colors ${
                activeSection === item.id ? 'text-primary-peach font-bold' : 'text-zinc-350 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            id="mobile-order-now-btn"
            onClick={() => handleLinkClick('menu')}
            className="mt-4 w-full py-4 bg-primary-peach text-black font-bold text-sm tracking-wider rounded-full transition-all uppercase text-center"
          >
            ORDER NOW
          </button>
        </div>
      )}
    </header>
  );
}
