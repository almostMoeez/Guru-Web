import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import OurStory from './components/OurStory';
import FindUs from './components/FindUs';
import CartOverlay from './components/CartOverlay';
import CustomizationOverlay from './components/CustomizationOverlay';
import { MenuItem, CartItem, SelectedConfig } from './types';

// Stable custom cartId generator for personalized options identification
const generateCartId = (itemId: string, config?: SelectedConfig) => {
  if (!config || Object.keys(config).length === 0) {
    return itemId;
  }
  const sortedKeys = Object.keys(config).sort();
  const serializeString = sortedKeys
    .map((k) => `${k}:${config[k].name}`)
    .join('|');
  return `${itemId}-${serializeString}`;
};

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Map of item ID to aggregate count (sum of all configurations for menu state rendering)
  const itemQuantities = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.menuItem.id] = (acc[item.menuItem.id] || 0) + item.quantity;
    return acc;
  }, {});

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item (for both standard and customizable)
  const handleAddToOrder = (item: MenuItem, selectedConfig?: SelectedConfig) => {
    const cartId = generateCartId(item.id, selectedConfig);
    setCartItems((prevItems) => {
      const existing = prevItems.find((p) => p.cartId === cartId);
      if (existing) {
        return prevItems.map((p) =>
          p.cartId === cartId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prevItems,
        {
          cartId,
          menuItem: item,
          quantity: 1,
          selectedConfig,
        },
      ];
    });
    // Note: Do NOT auto open the cart here to satisfy user requirements.
  };

  // Confirm custom configurations handler from the customize screen
  const handleConfirmCustomization = (item: MenuItem, selectedConfig: SelectedConfig) => {
    handleAddToOrder(item, selectedConfig);
    setCustomizingItem(null);
  };

  // Quantity controllers used by card sliders
  const handleIncrementItem = (itemId: string) => {
    setCartItems((prevItems) => {
      // Find the first occurrence matching the menu item ID to increment
      const match = prevItems.find((p) => p.menuItem.id === itemId);
      if (match) {
        return prevItems.map((p) =>
          p.cartId === match.cartId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return prevItems;
    });
  };

  const handleDecrementItem = (itemId: string) => {
    setCartItems((prevItems) => {
      const match = prevItems.find((p) => p.menuItem.id === itemId);
      if (match) {
        return prevItems
          .map((p) =>
            p.cartId === match.cartId ? { ...p, quantity: p.quantity - 1 } : p
          )
          .filter((p) => p.quantity > 0);
      }
      return prevItems;
    });
  };

  const handleRemoveAllByItemId = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((p) => p.menuItem.id !== itemId));
  };

  // Cart overlay specific unique controllers by cartId
  const handleUpdateQuantity = (cartId: string, change: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((p) => {
          if (p.cartId === cartId) {
            const newQty = p.quantity + change;
            return { ...p, quantity: newQty };
          }
          return p;
        })
        .filter((p) => p.quantity > 0);
    });
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prevItems) => prevItems.filter((p) => p.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="guru-app" className="relative bg-[#0b0b0b] min-h-screen text-zinc-100 selection:bg-primary-peach selection:text-black flex flex-col justify-between">
      <div>
        {/* Sticky Top Header Navigation */}
        <Header
          onCartClick={() => setIsCartOpen(true)}
          cartCount={cartCount}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Pages depending on active selection */}
        <main className="pt-20">
          {activeSection === 'home' && (
            <Hero
              onExploreMenu={() => handleNavigate('menu')}
              onFindUs={() => handleNavigate('story')}
            />
          )}

          {activeSection === 'menu' && (
            <Menu
              onAddToOrder={handleAddToOrder}
              onIncrementItem={handleIncrementItem}
              onDecrementItem={handleDecrementItem}
              onRemoveAllByItemId={handleRemoveAllByItemId}
              onOpenCustomizer={(item) => setCustomizingItem(item)}
              itemQuantities={itemQuantities}
            />
          )}

          {activeSection === 'story' && (
            <>
              <OurStory />
              <FindUs />
            </>
          )}
        </main>
      </div>

      {/* Slideover Cart Overlay Drawer */}
      <CartOverlay
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Shared Customization Modal Dialog */}
      <CustomizationOverlay
        isOpen={customizingItem !== null}
        onClose={() => setCustomizingItem(null)}
        menuItem={customizingItem}
        onConfirm={handleConfirmCustomization}
      />

      {/* Footer conforming to mock layout */}
      <footer id="app-footer" className="bg-[#090909] py-12 border-t border-white/5 relative z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-1 cursor-pointer group"
          >
            <span className="text-3xl font-extrabold tracking-tight text-white select-none transition-colors group-hover:text-primary-peach">
              guru
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary-peach inline-block mt-3" />
          </div>

          {/* Center Copy */}
          <div className="text-zinc-500 font-mono text-[10px] md:text-xs tracking-wider text-center md:text-left select-none uppercase">
            © 2024 GURU. ALL RIGHTS RESERVED.
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-6 text-[11px] font-semibold text-zinc-400 select-none tracking-widest uppercase">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('home')}>Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('home')}>Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('story')}>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
