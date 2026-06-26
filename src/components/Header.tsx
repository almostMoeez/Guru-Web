import { useState, useEffect } from 'react';
import { ShoppingCart, Menu as MenuIcon, X, User, LogOut, Building2, ClipboardList } from 'lucide-react';
import logoImg from '../assets/images/logo.png';
import { useAuth } from '../lib/auth/AuthContext';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
  activeSection: string;
  onNavigate: (section: string) => void;
  onAuthClick: () => void;
  branchName: string | null;
  onBranchClick: () => void;
}

export default function Header({ onCartClick, cartCount, activeSection, onNavigate, onAuthClick, branchName, onBranchClick }: HeaderProps) {
  const { isAuthenticated, logout } = useAuth();
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
    { id: 'contact', label: 'CONTACT US' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#1c1c1c]/90 backdrop-blur-md border-white/5 py-3 shadow-lg'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="w-full px-6 md:px-10 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Logo */}
        <div
          id="header-logo"
          onClick={() => handleLinkClick('home')}
          className="flex items-center cursor-pointer justify-self-start"
        >
          <img src={logoImg} alt="Guru Logo" className="h-12 w-auto object-contain" />
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-10 justify-self-center">
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
        <div id="header-actions" className="flex items-center gap-4 justify-self-end">
          {/* Branch selector */}
          <button
            id="branch-trigger-btn"
            onClick={onBranchClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/5 hover:border-primary-peach/30 text-zinc-300 hover:text-white text-xs font-medium transition-all max-w-[170px] cursor-pointer"
            title={branchName ? `Branch: ${branchName} — tap to change` : 'Select a branch'}
          >
            <Building2 className="w-3.5 h-3.5 text-primary-peach shrink-0" />
            <span className="truncate">{branchName ?? 'Select branch'}</span>
          </button>

          <button
            id="cart-trigger-btn"
            onClick={onCartClick}
            className="p-2.5 rounded-full hover:bg-white/5 text-zinc-300 hover:text-white relative transition-all"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-peach text-black font-extrabold text-[10px] w-5.5 h-5.5 flex items-center justify-center rounded-full border-2 border-[#1c1c1c]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account / Auth */}
          {isAuthenticated ? (
            <div className="hidden sm:block">
              <ProfileMenu onNavigate={onNavigate} />
            </div>
          ) : (
            <button
              id="sign-in-btn"
              onClick={onAuthClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:border-primary-peach/30 text-zinc-300 hover:text-white font-semibold text-xs tracking-wider transition-all uppercase duration-300 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

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
        <div id="mobile-menu" className="md:hidden fixed inset-0 top-[60px] bg-[#1c1c1c] z-40 border-t border-white/5 flex flex-col px-8 py-12 gap-8">
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

          {/* Branch selector */}
          <button
            onClick={() => {
              onBranchClick();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between gap-2 py-2 text-left border-b border-white/5"
          >
            <span className="flex items-center gap-2 text-zinc-350">
              <Building2 className="w-4 h-4 text-primary-peach" />
              <span className="text-sm font-medium tracking-wide">
                {branchName ? `Branch: ${branchName}` : 'Select branch'}
              </span>
            </span>
            <span className="text-primary-peach text-[10px] font-semibold uppercase tracking-wider">
              Change
            </span>
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleLinkClick('profile')}
                className="flex items-center gap-2 py-2 text-left text-zinc-350 hover:text-white border-b border-white/5"
              >
                <User className="w-4 h-4 text-primary-peach" />
                <span className="text-sm font-medium tracking-wide">My Profile</span>
              </button>
              <button
                onClick={() => handleLinkClick('orders')}
                className="flex items-center gap-2 py-2 text-left text-zinc-350 hover:text-white border-b border-white/5"
              >
                <ClipboardList className="w-4 h-4 text-primary-peach" />
                <span className="text-sm font-medium tracking-wide">Order History</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-4 bg-zinc-900 border border-white/10 text-rose-400 font-semibold text-sm tracking-wider rounded-full transition-all uppercase text-center flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onAuthClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-4 bg-zinc-900 border border-white/10 text-zinc-300 font-semibold text-sm tracking-wider rounded-full transition-all uppercase text-center flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}
